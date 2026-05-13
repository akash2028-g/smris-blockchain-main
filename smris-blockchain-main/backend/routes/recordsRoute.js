const express = require('express');
const axios = require('axios');
const supabase = require('../supabaseClient');
const { recordContract } = require('../blockchain');
const { decryptBuffer } = require('../utils/cryptoHelper');

const router = express.Router();

// =========================================================
// 1. GET ALL RECORDS FOR A PATIENT (From Blockchain)
// =========================================================
router.get('/records/:patient_uid', async (req, res) => {
    try {
        const { patient_uid } = req.params;
        console.log(`\n🔍 Fetching records for Patient UID: ${patient_uid}`);

        // 1. Translate UID to Wallet Address
        const { data: patientData, error } = await supabase
            .from('profiles')
            .select('wallet_address')
            .eq('id', patient_uid)
            .single();

        if (error || !patientData) {
            return res.status(404).json({ error: "Patient not found in database." });
        }

        const patientWallet = patientData.wallet_address;
        console.log(`✅ Translated to Wallet: ${patientWallet}`);

        // 2. Ask the Smart Contract for the records
        const records = await recordContract.getRecords(patientWallet);

        // 3. Format the blockchain data for the frontend
        const formattedRecords = records.map(record => ({
            patientWallet: record.patient,
            doctorWallet: record.doctor,
            ipfsHash: record.ipfsHash,
            // Convert Unix timestamp to readable date
            timestamp: new Date(Number(record.timestamp) * 1000).toISOString()
        }));

        res.status(200).json({
            message: "Records retrieved successfully.",
            count: formattedRecords.length,
            records: formattedRecords
        });

    } catch (error) {
        console.error("Fetch Records Error:", error);
        res.status(500).json({ error: "Failed to fetch records from blockchain." });
    }
});

// =========================================================
// 2. DOWNLOAD & DECRYPT A SPECIFIC FILE
// =========================================================
router.get('/download/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        console.log(`\n🔓 Attempting to decrypt file: ${cid}`);

        // 1. Fetch the encrypted binary blob from IPFS
        // CRITICAL: responseType must be 'arraybuffer' so axios doesn't corrupt the raw bytes
        const ipfsResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
            responseType: 'arraybuffer'
        });

        // 2. Pass the encrypted bytes to our Crypto Helper to unlock it
        const encryptedBuffer = Buffer.from(ipfsResponse.data);
        const decryptedBuffer = decryptBuffer(encryptedBuffer);

        console.log("✅ File successfully decrypted!");

        // 3. Send it back to the browser as a clean PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="decrypted_record_${cid}.pdf"`);
        res.send(decryptedBuffer);

    } catch (error) {
        console.error("Decryption Error:", error);
        res.status(500).json({ error: "Failed to download or decrypt the file." });
    }
});

module.exports = router;