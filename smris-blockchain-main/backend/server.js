require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const { ethers } = require('ethers'); // 🆕 Required for creating Web3 Wallets

// 🔗 BLOCKCHAIN CONNECTION (Watchtower Mode)
// 🆕 Added identityContract so we can register new users on-chain
const { checkConnection, recordContract, identityContract } = require('./blockchain');

// =========================================================
// 1. SETUP THE SERVER & MIDDLEWARE
// =========================================================
const app = express();
app.use(cors({
    origin: 'http://localhost:5174', // Explicitly allow Akash's frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // Required if you are passing auth tokens
}));
app.use(express.json());

// =========================================================
// 2. CONNECT TO SUPABASE
// =========================================================
const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// =========================================================
// 3. MODULAR ROUTES (MVC Structure)
// =========================================================

const uploadRoute = require('./routes/uploadRoute');
const linkRoute = require('./routes/linkRoute');
const recordsRoute = require('./routes/recordsRoute');

app.use('/api', uploadRoute);
app.use('/api', linkRoute);
app.use('/api', recordsRoute);

// =========================================================
// 4. STANDARD API ROUTES
// =========================================================

// Test Route
app.get('/', (req, res) => {
    res.send('SMRIS Backend (Web 2.5 Watchtower) is Running! 🚀');
});

// Get All Profiles
app.get('/api/profiles', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ---------------------------------------------------------
// AUTH ROUTES (Web2 + Web3 Hybrid Flow) 
// ---------------------------------------------------------

// 🆕 MODULE 2: Automated User Registration & Wallet Generation
app.post('/api/register', async (req, res) => {
    const { email, password, full_name, role, medical_reg_no } = req.body;

    if (!role || (role !== 'patient' && role !== 'doctor')) {
        return res.status(400).json({ error: "Role must be 'patient' or 'doctor'." });
    }

    if (role === 'doctor' && (!medical_reg_no || medical_reg_no.trim() === '')) {
        return res.status(400).json({ error: "Medical Registration Number is required for Doctors." });
    }

    try {
        // 1. GENERATE THE WEB3 WALLET INSTANTLY
        const newWallet = ethers.Wallet.createRandom();
        const generatedAddress = newWallet.address;
        console.log(`\n🆕 Generating Web3 Wallet for ${full_name}: ${generatedAddress}`);

        // 2. SUPABASE AUTH SIGNUP (Pass the wallet so the database trigger saves it)
        const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: full_name,
                    role: role,
                    medical_reg_no: medical_reg_no || null,
                    wallet_address: generatedAddress // <-- Injected into Supabase!
                }
            }
        });

        if (authError) return res.status(400).json({ error: authError.message });

        // 3. REGISTER ON BLOCKCHAIN
        console.log(`⛓️ Whitelisting ${role} on Arbitrum...`);
        let tx;
        if (role === 'patient') {
            tx = await identityContract.addPatient(generatedAddress);
        } else if (role === 'doctor') {
            tx = await identityContract.addDoctor(generatedAddress);
        }

        // Wait for the blockchain bouncer to approve them
        await tx.wait();
        console.log(`✅ ${role} successfully registered on-chain!`);

        res.json({
            message: "User registered and Web3 wallet generated successfully!",
            user: authData.user,
            wallet: generatedAddress,
            transactionHash: tx.hash
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Failed to register user", details: err.message });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (authError) return res.status(401).json({ error: authError.message });

    const userId = authData.user.id;
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) return res.status(500).json({ error: "Profile not found" });

    if (profile.status !== 'ACTIVE') {
        return res.status(403).json({ error: `Login denied. Your status is: ${profile.status}` });
    }

    res.json({
        message: "Login successful!",
        profile: profile,
        token: authData.session.access_token
    });
});

// ---------------------------------------------------------
// ADMIN ROUTES
// ---------------------------------------------------------

app.get('/api/admin/pending-users', async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('status', 'PENDING');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/admin/verify', async (req, res) => {
    const { user_id, decision } = req.body;
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ status: decision })
        .eq('id', user_id)
        .select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: `User status updated to ${decision}`, data });
});

// =========================================================
// 5. SERVER & LISTENERS (The Watchtower)
// =========================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    const isConnected = await checkConnection();

    if (isConnected && recordContract) {
        console.log("🎧 Starting Blockchain Event Listener...");

        // 🆕 MODULE 4: Transaction History Logger
        recordContract.on("RecordAdded", async (patient, doctor, ipfsHash, timestamp, event) => {
            console.log(`\n🎉 [BLOCKCHAIN EVENT] New Medical Record Confirmed!`);
            console.log(`   Patient Wallet: ${patient}`);
            console.log(`   Doctor Wallet: ${doctor}`);
            console.log(`   IPFS Hash: ${ipfsHash}`);

            try {
                // Convert blockchain Unix timestamp to Postgres Date
                const dateObj = new Date(Number(timestamp) * 1000).toISOString();

                // Save it to your new Supabase 'transactions' table
                const { error } = await supabaseAdmin
                    .from('transactions')
                    .insert([{
                        patient_wallet: patient,
                        doctor_wallet: doctor,
                        ipfs_hash: ipfsHash,
                        transaction_hash: event.log.transactionHash,
                        timestamp: dateObj
                    }]);

                if (error) {
                    console.error("❌ Supabase Insert Error:", error);
                } else {
                    console.log("✅ Transaction permanently logged to Supabase Audit Trail!");
                }
            } catch (err) {
                console.error("❌ Error processing blockchain event:", err);
            }
        });
    }
});