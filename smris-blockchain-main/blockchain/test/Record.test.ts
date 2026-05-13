import { expect } from "chai";
import { ethers } from "hardhat";

console.log("--- Record Test Loaded! ---");

describe("Record Contract", function () {
  it("Should allow upload and doctor approval", async function () {
    // 1. Setup Accounts
    // owner = Admin/System
    // doctor = The Doctor (who approves)
    // patient = The Patient
    const [owner, doctor, patient] = await ethers.getSigners();

    // 2. Deploy Record Contract
    const RecordFactory = await ethers.getContractFactory("Record");
    const recordContract = await RecordFactory.deploy();
    await recordContract.waitForDeployment();

    console.log("--- Record Contract Deployed ---");

    // 3. Simulate Upload (Receptionist/Backend Action)
    // We are passing dummy data for the pointer and hash
    const dummyPointer = "https://database.com/file/123";
    const dummyHash = "0xabc123...";
    
    await recordContract.uploadPendingRecord(patient.address, doctor.address, dummyPointer, dummyHash);
    console.log("--- Record Uploaded (Pending) ---");

    // 4. Verify it is PENDING (Status 0)
    let record = await recordContract.getRecord(0);
    // 0n means "BigNumber 0" in Ethers syntax
    expect(record.status).to.equal(0n); 

    // 5. Simulate Doctor Approval (The "2nd Biometric")
    // We connect as the 'doctor' account to sign this transaction
    await recordContract.connect(doctor).approveRecord(0);
    console.log("--- Doctor Approved! ---");

    // 6. Verify it is APPROVED (Status 1)
    record = await recordContract.getRecord(0);
    expect(record.status).to.equal(1n);
    
    console.log("--- Test Passed! ---");
  });
});