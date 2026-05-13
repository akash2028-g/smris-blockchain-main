import { expect } from "chai";
import { ethers } from "hardhat";

console.log("--- V-Room Test Loaded! ---");

describe("VRoom Contract", function () {
  it("Should allow Receptionist (Proxy) to link Patient A, but keep Patient B out", async function () {
    
    // 1. Setup Actors
    // doctor = The Doctor
    // receptionist = The Staff Member
    // patientA = The one getting access
    // patientB = The stranger (should not get access)
    const [owner, doctor, receptionist, patientA, patientB] = await ethers.getSigners();

    // 2. Deploy VRoom
    const VRoomFactory = await ethers.getContractFactory("VRoom");
    const vRoomContract = await VRoomFactory.deploy();
    await vRoomContract.waitForDeployment();

    console.log("--- VRoom Deployed ---");

    // 3. Doctor Delegates Authority (1st Biometric)
    // Authorize receptionist for 8 hours (28800 seconds)
    // We connect as 'doctor' to sign this
    await vRoomContract.connect(doctor).delegateProxy(receptionist.address, 28800);
    console.log("--- Doctor Delegated Authority to Receptionist ---");

    // 4. Patient A Requests Connection
    // (This emits an event, but doesn't change state yet)
    await vRoomContract.connect(patientA).requestConnection(doctor.address);

    // 5. Receptionist Approves Patient A (Using Proxy Power!)
    // Receptionist signs this transaction
    await vRoomContract.connect(receptionist).approveConnection(patientA.address, doctor.address);
    console.log("--- Receptionist Approved Patient A ---");

    // 6. CHECK PRIVACY / SEPARATION
    
    // Check Patient A: Should be TRUE (Linked)
    const isALinked = await vRoomContract.checkLink(patientA.address, doctor.address);
    expect(isALinked).to.equal(true);
    console.log("Check: Patient A is Linked? -> " + isALinked);

    // Check Patient B: Should be FALSE (Not Linked - Privacy Maintained)
    const isBLinked = await vRoomContract.checkLink(patientB.address, doctor.address);
    expect(isBLinked).to.equal(false);
    console.log("Check: Patient B is Linked? -> " + isBLinked);
  });
});