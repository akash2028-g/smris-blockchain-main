import { ethers } from "hardhat";

async function main() {
  // 1. SETUP
  // The contract address from your logs
  const IDENTITY_ADDR = "0x1B7A23Cc9861Ef256cadbE12377A04BaA452a0aa"; 
  
  // Your Friend's Wallet (The one getting the errors)
  const BACKEND_WALLET = "0x8c06730C2BD60c3Ac2B762276A8BeC90ab1c94E8";

  console.log("--- DEBUGGING IDENTITY CONTRACT ---");

  const identity = await ethers.getContractAt("Identity", IDENTITY_ADDR);
  const DEFAULT_ADMIN_ROLE = await identity.DEFAULT_ADMIN_ROLE();

  // 2. CHECK PERMISSIONS
  console.log(`Checking Admin Status for: ${BACKEND_WALLET}`);
  const isAdmin = await identity.hasRole(DEFAULT_ADMIN_ROLE, BACKEND_WALLET);
  
  if (isAdmin) {
    console.log("✅ RESULT: Wallet IS an Admin.");
  } else {
    console.log("❌ RESULT: Wallet is NOT an Admin. (This is the problem!)");
    // If this prints, we need to re-run the grant script immediately.
    return; 
  }

  // 3. SIMULATE REGISTRATION (Using specific data)
  console.log("\nAttempting Test Registration...");
  
  // We use the "Fresh Data" that failed for him
  const testUUID = "99999999-8888-7777-6666-555555555555";
  const testWallet = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const role = ethers.encodeBytes32String("doctor"); // Convert string to bytes32

  try {
    // We check if it's already registered first to avoid revert
    // Note: This assumes your contract has a public mapping we can read. 
    // If not, we just try/catch the transaction.
    
    console.log("Sending Transaction...");
    const tx = await identity.registerIdentity(testWallet, testUUID, role);
    console.log("Waiting...");
    await tx.wait();
    console.log("✅ SUCCESS: Registration worked from YOUR computer.");
    console.log("Conclusion: The issue is inside his Backend Code/Config.");
  } catch (error: any) {
    console.log("❌ FAILURE: Transaction reverted.");
    if (error.reason) console.log("Reason:", error.reason);
    if (error.message) console.log("Message:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});