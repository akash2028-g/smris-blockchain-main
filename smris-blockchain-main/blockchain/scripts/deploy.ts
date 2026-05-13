import { ethers } from "hardhat";

async function main() {
  console.log("--- SMRIS DEPLOYMENT STARTED (Arbitrum Sepolia) ---");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the master account:", deployer.address);

  // 1. DEPLOY IDENTITY
  const IdentityFactory = await ethers.getContractFactory("Identity");
  const identity = await IdentityFactory.deploy(); 
  await identity.waitForDeployment();
  const identityAddress = await identity.getAddress();
  console.log(`✅ Identity Deployed at: ${identityAddress}`);

  // 2. DEPLOY VROOM
  const VRoomFactory = await ethers.getContractFactory("VRoom");
  const vRoom = await VRoomFactory.deploy(); 
  await vRoom.waitForDeployment();
  const vRoomAddress = await vRoom.getAddress();
  console.log(`✅ VRoom Deployed at:    ${vRoomAddress}`);

  // 3. DEPLOY RECORD (Updated for Orchestrator Architecture)
  // We now pass the identityAddress so Record.sol knows who to check for roles
  const RecordFactory = await ethers.getContractFactory("Record");
  const record = await RecordFactory.deploy(identityAddress);
  await record.waitForDeployment();
  const recordAddress = await record.getAddress();
  console.log(`✅ Record Deployed at:   ${recordAddress}`);

  // 4. CONFIGURE THE WATCHTOWER (Backend Wallet)
  console.log("\n--- CONFIGURING ORCHESTRATOR ROLES ---");
  
  // Make sure to add WATCHTOWER_WALLET_ADDRESS to your blockchain/.env file
  const watchtowerAddress = process.env.WATCHTOWER_WALLET_ADDRESS;
  
  if (watchtowerAddress) {
      console.log(`Assigning RECEPTIONIST_ROLE to Watchtower backend: ${watchtowerAddress}...`);
      
      // Execute the addReceptionist function we just added to Identity.sol
      const tx = await identity.addReceptionist(watchtowerAddress);
      await tx.wait();
      
      console.log("✅ Watchtower successfully authorized to orchestrate records.");
  } else {
      console.log("⚠️ WARNING: WATCHTOWER_WALLET_ADDRESS not found in .env.");
      console.log("⚠️ Add it to your .env and grant the role manually later, or re-run deployment.");
  }

  console.log("\n----------------------------------------------------");
  console.log("⚠️  NEXT STEP: Copy these addresses to your Frontend & Backend .env files:");
  console.log(`IDENTITY_CONTRACT=${identityAddress}`);
  console.log(`RECORD_CONTRACT=${recordAddress}`);
  console.log(`VROOM_CONTRACT=${vRoomAddress}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});