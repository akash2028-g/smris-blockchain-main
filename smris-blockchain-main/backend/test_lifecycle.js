// test_lifecycle.js
// 🚀 END-TO-END TEST: API + BLOCKCHAIN + LISTENER
require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const RECORD_CONTRACT_ADDRESS = process.env.RECORD_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Or derive from MNEMONIC if you prefer
const MNEMONIC = process.env.MNEMONIC;

// --- GENERATE UNIQUE DATA ---
const uniqueId = Date.now(); // Acts as a timestamp
const UNIQUE_HASH = `QmDemo_Record_${uniqueId}`; // 💎 UNIQUE HASH
const PATIENT_WALLET = "0x1111111111111111111111111111111111111111"; // Mock Patient
const DOCTOR_WALLET = "0x8c06730c2bd60c3ac2b762276a8bec90ab1c94e8";; // Your Wallet

async function runLifecycleTest() {
    console.log(`\n🧪 STARTING RECORD LIFECYCLE TEST`);
    console.log(`💎 Generated Unique Hash: ${UNIQUE_HASH}`);

    // --- STEP 1: FRONTEND CREATES PENDING RECORD (API) ---
    console.log("\n👉 1. Calling Backend API to create PENDING record...");

    try {
        const apiRes = await fetch(`${BASE_URL}/api/records/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patient_wallet: PATIENT_WALLET,
                doctor_wallet: DOCTOR_WALLET,
                ipfs_hash: UNIQUE_HASH
            })
        });
        const apiData = await apiRes.json();

        if (apiRes.status === 200) {
            console.log("✅ API Success! Record stored in DB as 'PENDING'.");
            console.log(`   DB ID: ${apiData.record.id}`);
        } else {
            console.error("❌ API Failed:", apiData);
            return;
        }
    } catch (err) {
        console.error("❌ API Error:", err);
        return;
    }

    // --- STEP 2: DOCTOR UPLOADS TO BLOCKCHAIN ---
    console.log("\n👉 2. Simulating Blockchain Upload (Ethers.js)...");

    // Connect to Blockchain
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    // Use Mnemonic to match your server setup
    const wallet = ethers.Wallet.fromPhrase(MNEMONIC).connect(provider);

    // Load Contract
    const recordAbi = JSON.parse(fs.readFileSync('./abis/Record.json', 'utf8')).abi;
    const recordContract = new ethers.Contract(RECORD_CONTRACT_ADDRESS, recordAbi, wallet);

    try {
        console.log(`   ⏳ Sending Transaction... (Hash: ${UNIQUE_HASH})`);

        // Ensure function name matches your ABI (uploadPendingRecord or uploadRecord)
        const tx = await recordContract.uploadPendingRecord(
            PATIENT_WALLET,
            DOCTOR_WALLET,
            UNIQUE_HASH,
            "General Report"
        );

        console.log(`   ✅ Transaction Sent! Hash: ${tx.hash}`);
        console.log("   ⏳ Waiting for block confirmation...");

        await tx.wait();
        console.log("   🎉 Transaction Confirmed on Chain!");

    } catch (error) {
        console.error("❌ Blockchain Error:", error);
        return;
    }

    console.log("\n👀 NOW WATCH YOUR SERVER TERMINAL!");
    console.log("   The Listener should detect this event and update the DB to 'APPROVED'.");
}

runLifecycleTest();