require('dotenv').config();
const { ethers } = require("ethers");

// 1. Load BOTH ABIs (Make sure both JSON files are inside your 'abis' folder!)
const recordData = require("./abis/Record.json");
const recordAbi = recordData.abi || recordData;

const identityData = require("./abis/Identity.json");
const identityAbi = identityData.abi || identityData;

// 2. Validate Config for Arbitrum
const rpcUrl = process.env.ARBITRUM_RPC_URL;
const masterPrivateKey = process.env.MASTER_RELAYER_PRIVATE_KEY;
const recordAddress = process.env.RECORD_CONTRACT_ADDRESS;
const identityAddress = process.env.IDENTITY_CONTRACT_ADDRESS;

if (!rpcUrl || !masterPrivateKey || !recordAddress || !identityAddress) {
    console.error("❌ Missing .env variables!");
    console.error("Please ensure ARBITRUM_RPC_URL, MASTER_RELAYER_PRIVATE_KEY, RECORD_CONTRACT_ADDRESS, and IDENTITY_CONTRACT_ADDRESS are set.");
    process.exit(1);
}

// 3. Setup Provider & MASTER RELAYER WALLET
const provider = new ethers.JsonRpcProvider(rpcUrl);
const relayerWallet = new ethers.Wallet(masterPrivateKey, provider);

// 4. Instantiate BOTH Contracts
const recordContract = new ethers.Contract(recordAddress, recordAbi, relayerWallet);
const identityContract = new ethers.Contract(identityAddress, identityAbi, relayerWallet);

// 5. Connection Checker (Runs on server start)
async function checkConnection() {
    try {
        const network = await provider.getNetwork();
        console.log(`✅ Connected to Arbitrum (Chain ID: ${network.chainId})`);
        console.log(`💳 Relayer Wallet (Paying Gas): ${relayerWallet.address}`);
        console.log(`📜 Record Contract loaded at: ${recordAddress}`);
        console.log(`🪪 Identity Contract loaded at: ${identityAddress}`);
        return true;
    } catch (error) {
        console.error("❌ Connection failed:", error);
        return false;
    }
}

// 6. Export everything your routes will need
module.exports = { recordContract, identityContract, checkConnection, relayerWallet };