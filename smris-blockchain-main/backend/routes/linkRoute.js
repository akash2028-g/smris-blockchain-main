const express = require('express');
const { identityContract } = require('../blockchain');
const router = express.Router();

router.post('/link', async (req, res) => {
    try {
        const { patient_wallet, doctor_wallet } = req.body;

        if (!patient_wallet || !doctor_wallet) {
            return res.status(400).json({ error: "Missing patient or doctor wallet address." });
        }

        console.log(`\n🔗 Linking Patient ${patient_wallet} to Doctor ${doctor_wallet}...`);

        // Call the smart contract to grant access
        const tx = await identityContract.linkDoctorAndPatient(patient_wallet, doctor_wallet);
        await tx.wait();

        console.log("✅ Access Linked Successfully!");

        res.status(200).json({
            message: "Doctor access granted successfully!",
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error("Link Route Error:", error);
        res.status(500).json({
            error: "Failed to link patient and doctor on-chain.",
            details: error.reason || error.message
        });
    }
});

module.exports = router;