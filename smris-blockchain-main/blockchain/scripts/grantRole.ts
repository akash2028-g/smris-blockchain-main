import { ethers } from "hardhat";

async function main() {
  console.log("--- AUTHORIZING NEW ORCHESTRATOR ---");

  // The backend developer's Relayer Wallet
  const RELAYER_WALLET = "0x3bCbe7D5eC23119B14BA065C80b804A79c2daFC5";
  
  // TODO: Paste your deployed Identity contract address here
  const IDENTITY_ADDRESS = "0xYOUR_IDENTITY_CONTRACT_ADDRESS_HERE"; 

  // 1. Attach to the already deployed contract
  const Identity = await ethers.getContractFactory("Identity");
  const identity = Identity.attach("0x7e164377C384E39B5120D615791Eae21f52713aa");

  // 2. Execute the authorization
  console.log(`Granting RECEPTIONIST_ROLE to Watchtower: ${RELAYER_WALLET}...`);
  
  // Because you are running this with your mnemonic, you are acting as the DEFAULT_ADMIN
  const tx = await identity.addReceptionist(RELAYER_WALLET);
  
  console.log("Transaction sent! Waiting for block confirmation...");
  await tx.wait();

  console.log(`✅ Success! The backend wallet is now an authorized Orchestrator.`);
}

main().catch((error) => {
  console.error("❌ Error granting role:", error);
  process.exitCode = 1;
});