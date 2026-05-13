import { ethers } from "hardhat";

async function main() {
  console.log("--- PROMOTING CO-ADMIN ---");

  // The backend developer's Relayer Wallet (from your previous message)
  const BACKEND_WALLET = "0x3bCbe7D5eC23119B14BA065C80b804A79c2daFC5";
  
  // TODO: Paste your deployed Identity contract address here
  const IDENTITY_ADDRESS = "0x7e164377C384E39B5120D615791Eae21f52713aa"; 

  // 1. Attach to the deployed contract
  const Identity = await ethers.getContractFactory("Identity");
  const identity = Identity.attach(IDENTITY_ADDRESS);

  // 2. Fetch the root Admin Role identifier (which is 32 bytes of zeros)
  const adminRole = await identity.DEFAULT_ADMIN_ROLE();

  console.log(`Granting DEFAULT_ADMIN_ROLE to Backend Wallet: ${BACKEND_WALLET}...`);
  
  // 3. Execute the promotion (Only you can do this because you are the current admin)
  const tx = await identity.grantRole(adminRole, BACKEND_WALLET);
  
  console.log("Transaction sent! Waiting for block confirmation...");
  await tx.wait();

  console.log(`✅ Success! The backend wallet is now a Co-Admin.`);
}

main().catch((error) => {
  console.error("❌ Error granting admin role:", error);
  process.exitCode = 1;
});