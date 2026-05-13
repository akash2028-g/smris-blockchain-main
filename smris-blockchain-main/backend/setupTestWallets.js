require('dotenv').config();
const { identityContract } = require('./blockchain'); // Reusing your perfectly working blockchain connection!

async function setupDummyWallets() {
    // The dummy wallets we saved in Supabase
    const patient = "0x1111111111111111111111111111111111111111";
    const doctor = "0x2222222222222222222222222222222222222222";

    try {
        console.log("🚀 Starting Blockchain Configuration...");

        console.log("1️⃣ Registering Patient...");
        let tx1 = await identityContract.addPatient(patient);
        await tx1.wait();
        console.log("✅ Patient registered!");

        console.log("2️⃣ Registering Doctor...");
        let tx2 = await identityContract.addDoctor(doctor);
        await tx2.wait();
        console.log("✅ Doctor registered!");

        console.log("3️⃣ Linking Doctor to Patient...");
        let tx3 = await identityContract.linkDoctorAndPatient(patient, doctor);
        await tx3.wait();
        console.log("✅ Access Linked!");

        console.log("\n🎉 ALL DONE! You can now use Postman to upload records between these two!");
        process.exit(0);

    } catch (error) {
        console.error("\n❌ SCRIPT FAILED:");
        // This will print the exact reason the blockchain rejected it
        console.error(error.shortMessage || error.message);

        console.log("\n🚨 READ THIS IF YOU GOT AN 'AccessControl' ERROR 🚨");
        console.log("If it failed with an AccessControl error, it means your Relayer wallet does not have the 'DEFAULT_ADMIN_ROLE'.");
        process.exit(1);
    }
}

setupDummyWallets();