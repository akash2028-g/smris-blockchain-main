import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

console.log("--- DEBUG START ---");
console.log("Arbitrum RPC Loaded:", process.env.ARBITRUM_SEPOLIA_RPC_URL ? "YES" : "NO");
console.log("Mnemonic Loaded:", process.env.MNEMONIC ? "YES" : "NO");
console.log("--- DEBUG END ---");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // THIS SECTION TELLS HARDHAT WHERE TO DEPLOY
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
  },
  etherscan: {
    // THIS SECTION TELLS HARDHAT HOW TO VERIFY
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
    },
  },
};

export default config;