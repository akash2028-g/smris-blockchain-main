import { expect } from "chai";
import { ethers } from "hardhat";

describe("Security Checks", function () {
  it("Should prevent a random user from registering an Identity", async function () {
    // 1. Setup
    const [admin, hacker] = await ethers.getSigners();
    const IdentityFactory = await ethers.getContractFactory("Identity");
    const identityContract = await IdentityFactory.deploy();
    await identityContract.waitForDeployment();

    // 2. The Hacker tries to call registerIdentity
    // This SHOULD fail because 'hacker' does not have the DEFAULT_ADMIN_ROLE
    // We expect the transaction to be reverted (rejected)
    await expect(
      identityContract.connect(hacker).registerIdentity(hacker.address, "did:hacker:123", "DOCTOR")
    ).to.be.reverted; 
    
    console.log("✅ Hacker was blocked from registering themselves!");
  });

  it("Should prevent a random user from approving a Record", async function () {
    // 1. Setup Record Contract
    const [admin, doctor, patient, hacker] = await ethers.getSigners();
    const RecordFactory = await ethers.getContractFactory("Record");
    const recordContract = await RecordFactory.deploy();
    await recordContract.waitForDeployment();

    // 2. Upload a record (as Admin/Receptionist)
    await recordContract.uploadPendingRecord(patient.address, doctor.address, "pointer", "hash");

    // 3. Hacker tries to approve it (pretending to be the doctor)
    // This SHOULD fail with the specific error message we wrote in Record.sol
    await expect(
      recordContract.connect(hacker).approveRecord(0)
    ).to.be.revertedWith("Only the assigned doctor can approve this.");

    console.log("✅ Hacker was blocked from approving a record!");
  });
});