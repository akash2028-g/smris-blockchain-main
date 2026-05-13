const express = require('express');
const multer = require('multer');
const { uploadToPinata, saveMedicalRecord } = require('../services/storageService');
const { recordContract } = require('../blockchain');
const supabase = require('../supabaseClient');
const { encryptBuffer } = require('../utils/cryptoHelper');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-record', upload.single('medicalFile'), async (req, res) => {
    try {
        // 🔥 FIX 1: Add .trim() to clean up any invisible spaces from Postman
        const patient_uid = req.body.patient_uid?.trim();
        const doctor_uid = req.body.doctor_uid?.trim();
        const file = req.file;

        if (!file || !patient_uid || !doctor_uid) {
            return res.status(400).json({ error: "Missing required fields or file." });
        }

        console.log(`\n📤 Orchestrator: Processing file for ${patient_uid}...`);
        console.log("🔍 Translating UIDs to Web3 Addresses...");

        // 🔥 FIX 2: Removed .single() to prevent the PGRST116 crash
        const { data: patientData, error: patientErr } = await supabase
            .from('profiles')
            .select('id, wallet_address')
            .eq('id', patient_uid);

        const { data: doctorData, error: doctorErr } = await supabase
            .from('profiles')
            .select('id, wallet_address')
            .eq('id', doctor_uid);

        // Print exactly what Supabase gives back to the terminal
        console.log("--- DEBUG SUPABASE LOOKUP ---");
        console.log("Patient Search for", patient_uid, ":", patientData);
        console.log("Doctor Search for", doctor_uid, ":", doctorData);
        console.log("-----------------------------");

        if (patientErr) console.error("Patient DB Error:", patientErr);
        if (doctorErr) console.error("Doctor DB Error:", doctorErr);

        // 🔥 FIX 3: Safely check if the arrays are empty
        if (!patientData || patientData.length === 0) {
            return res.status(404).json({ error: `Could not find patient with ID: ${patient_uid}` });
        }
        if (!doctorData || doctorData.length === 0) {
            return res.status(404).json({ error: `Could not find doctor with ID: ${doctor_uid}` });
        }

        // Grab the wallet from the first item in the array
        const patientWallet = patientData[0].wallet_address;
        const doctorWallet = doctorData[0].wallet_address;

        if (!patientWallet || !doctorWallet) {
            return res.status(400).json({ error: "Profiles found, but wallet_address is empty. Did you save the 0x addresses in Supabase?" });
        }

        console.log(`✅ Translation complete! Patient: ${patientWallet}, Doctor: ${doctorWallet}`);

        // 🔒 NEW: ENCRYPT THE DATA BEFORE IT LEAVES THE SERVER
        console.log("🔒 Encrypting file with AES-256...");
        const encryptedBuffer = encryptBuffer(file.buffer);

        // 1. PIN TO IPFS (Cold Storage)
        // Pass the encryptedBuffer instead of the raw file.buffer
        const ipfsCID = await uploadToPinata(encryptedBuffer, file.originalname);
        console.log(`✅ Pinned to IPFS: ${ipfsCID}`);

        // 2. BLOCKCHAIN NOTARIZATION
        console.log("⛓️ Executing Relayer Transaction on Arbitrum...");
        const tx = await recordContract.addRecord(patientWallet, doctorWallet, ipfsCID);
        const receipt = await tx.wait();

        const realTxHash = receipt.hash;
        console.log(`✅ Blockchain Confirmed! TX Hash: ${realTxHash}`);

        // 3. SUPABASE HOT CACHE & DATABASE
        console.log("🔥 Saving to Supabase Hot Cache...");
        // Save the encryptedBuffer to the Hot Cache too, ensuring total privacy!
        const { hotCacheUrl } = await saveMedicalRecord(
            encryptedBuffer, file.originalname, file.mimetype, patient_uid, doctor_uid, ipfsCID, realTxHash
        );

        res.status(200).json({
            message: "Record secured invisibly via Backend Relayer.",
            cid: ipfsCID,
            hotUrl: hotCacheUrl,
            transactionHash: realTxHash
        });

    } catch (error) {
        console.error("Upload Route Error:", error);
        res.status(500).json({
            error: "Internal server error during upload process.",
            details: error.message
        });
    }
});

module.exports = router;