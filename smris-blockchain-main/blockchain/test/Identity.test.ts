import { expect } from "chai";
import { ethers } from "hardhat";

console.log("--- Test File Loaded! ---");

describe("Identity Contract", function () {
  it("Should run a basic test", async function () {
    console.log("--- Test Started! ---");
    
    // 1. Setup
    const [owner] = await ethers.getSigners();
    const IdentityFactory = await ethers.getContractFactory("Identity");
    const identityContract = await IdentityFactory.deploy();
    await identityContract.waitForDeployment();

    console.log("--- Contract Deployed! ---");

    // 2. Check Admin Role
    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const isAdmin = await identityContract.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
    
    expect(isAdmin).to.equal(true);
    console.log("--- Test Passed! ---");
  });
});