const express = require('express');
const { ethers } = require('ethers');
const { identityContract } = require('../blockchain');
const supabase = require('../supabaseClient');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        // 1. Grab user details from the frontend
        const { full_name, role, age } = req.body;

        if (!full_name || !role) {
            return res.status(400).json({ error: "Missing full_name or role (must be 'patient' or 'doctor')." });
        }

        console.log(`\n🆕 Onboarding new ${role}: ${full_name}`);

        // 2. MAGIC: Generate a brand new Web3 dummy wallet instantly
        const newWallet = ethers.Wallet.createRandom();
        const generatedAddress = newWallet.address;
        console.log(`✅ Generated Dummy Wallet: ${generatedAddress}`);

        // 3. Save the new user to Supabase
        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .insert([{
                full_name: full_name,
                role: role,
                age: age || null,
                wallet_address: generatedAddress
            }])
            .select()
            .single();

        if (dbError) throw dbError;

        // 4. Register them on the Blockchain
        console.log("⛓️ Whitelisting wallet on Arbitrum...");
        let tx;
        if (role.toLowerCase() === 'patient') {
            tx = await identityContract.addPatient(generatedAddress);
        } else if (role.toLowerCase() === 'doctor') {
            tx = await identityContract.addDoctor(generatedAddress);
        } else {
            return res.status(400).json({ error: "Invalid role specified." });
        }

        // Wait for blockchain confirmation
        await tx.wait();
        console.log(`✅ ${role} successfully registered on-chain!`);

        // 5. Send success response back to frontend
        res.status(200).json({
            message: "User registered and Web3 wallet generated successfully.",
            user: profile,
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error("Registration Route Error:", error);
        res.status(500).json({
            error: "Failed to register user.",
            details: error.message
        });
    }
});

module.exports = router;