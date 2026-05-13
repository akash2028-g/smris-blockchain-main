const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ethers } = require('ethers');
const axios = require('axios');
const FormData = require('form-data');
const requireReceptionist = require('../middleware/roleAuth');
const { createClient } = require('@supabase/supabase-js');

// Setup
const upload = multer({ storage: multer.memoryStorage() });
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Blockchain Relayer Setup
const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL);
const relayerWallet = new ethers.Wallet(process.env.MASTER_RELAYER_PRIVATE_KEY, provider);

// Use your actual Contract Address and ABI here
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const SMRIS_ABI = [
    "function grantAccess(string memory patientUID, string memory doctorUID) public",
    "function addRecord(string memory patientUID, string memory ipfsHash) public"
];
const smrisContract = new ethers.Contract(CONTRACT_ADDRESS, SMRIS_ABI, relayerWallet);


// ==========================================
// ENDPOINT 1: THE LINK (/api/link)
// ==========================================
router.post('/link', requireReceptionist, async (req, res) => {
    try {
        const { patient_uid, doctor_uid } = req.body;
        if (!patient_uid || !doctor_uid) return res.status(400).json({ error: "Missing UIDs" });

        console.log(`🔗 Orchestrator: Linking ${patient_uid} to ${doctor_uid}...`);

        // 1. Relayer executes the smart contract function (Pays Gas)
        const tx = await smrisContract.grantAccess(patient_uid, doctor_uid);
        await tx.wait();

        // 2. Log this relationship in Supabase for fast Web2 querying
        await supabaseAdmin.from('patient_doctor_links').insert([{
            patient_uid: patient_uid,
            doctor_uid: doctor_uid,
            linked_by: req.user.id, // The receptionist who did this
            transaction_hash: tx.hash
        }]);

        res.json({ message: "Access granted successfully.", txHash: tx.hash });

    } catch (error) {
        console.error("Link Error:", error);
        res.status(500).json({ error: "Failed to link patient and doctor." });
    }
});


// ==========================================
// ENDPOINT 2: THE UPLOAD (/api/upload)
// ==========================================
router.post('/upload', requireReceptionist, upload.single('file'), async (req, res) => {
    try {
        const { patient_uid, record_type } = req.body;
        const file = req.file;
        if (!file || !patient_uid) return res.status(400).json({ error: "Missing file or Patient UID" });

        console.log(`📤 Orchestrator: Uploading record for ${patient_uid}...`);

        // 1. PIN TO IPFS (Pinata)
        const formData = new FormData();
        formData.append('file', file.buffer, { filename: file.originalname });
        const pinataRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${process.env.PINATA_JWT}`
            }
        });
        const ipfsHash = pinataRes.data.IpfsHash;

        // 2. NOTARIZE ON ARBITRUM (Relayer Wallet pays gas)
        const tx = await smrisContract.addRecord(patient_uid, ipfsHash);
        await tx.wait();

        // 3. SAVE METADATA TO SUPABASE
        const { data: dbData, error: dbError } = await supabaseAdmin
            .from('patient_records')
            .insert([{
                patient_uid: patient_uid,
                record_type: record_type || 'Prescription',
                ipfs_hash: ipfsHash,
                transaction_hash: tx.hash,
                uploaded_by: req.user.id // The receptionist's Supabase UUID
            }])
            .select();

        if (dbError) throw dbError;

        res.json({
            message: "Record secured invisibly via Arbitrum.",
            ipfsHash: ipfsHash,
            txHash: tx.hash,
            metadata: dbData[0]
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Failed to upload and notarize record." });
    }
});

module.exports = router;