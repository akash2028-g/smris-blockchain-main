// test_patient.js
// 🧪 PATIENT ENTRY TEST
// Checks if Patients are Auto-Approved OR if they need Admin Verification

const BASE_URL = 'http://localhost:3000';

const randomId = Date.now();
const testPatient = {
    email: `patient_${randomId}@test.com`,
    password: "password123",
    full_name: `Patient John ${randomId}`,
    role: "patient"
    // Notice: NO medical_reg_no required for patients
};

async function runPatientTest() {
    console.log("------------------------------------------------");
    console.log("🏥 STARTING PATIENT ENTRY TEST");
    console.log(`👤 Creating Patient: ${testPatient.email}`);
    console.log("------------------------------------------------");

    // --- STEP 1: REGISTER ---
    console.log("\n👉 1. Attempting Registration...");
    const regRes = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPatient)
    });
    const regData = await regRes.json();

    if (regRes.status === 200) {
        console.log("✅ Registration Successful!");
    } else {
        console.error("❌ Registration Failed:", regData);
        return;
    }

    const userId = regData.user.id;

    // --- STEP 2: IMMEDIATE LOGIN ATTEMPT ---
    console.log("\n👉 2. Attempting Immediate Login...");
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testPatient.email, password: testPatient.password })
    });
    const loginData = await loginRes.json();

    // --- SCENARIO A: AUTO-APPROVED ---
    if (loginRes.status === 200) {
        console.log("🎉 SUCCESS! Login worked immediately.");
        console.log("ℹ️  NOTE: Your system is set to AUTO-APPROVE patients.");
        console.log(`🎟️ Token: ${loginData.token.substring(0, 15)}...`);
        return;
    }

    // --- SCENARIO B: NEEDS APPROVAL ---
    else if (loginRes.status === 403) {
        console.log("🔒 Login Blocked (Status: PENDING).");
        console.log("ℹ️  NOTE: Your system requires Admin Approval for patients too.");

        // Perform Admin Approval
        console.log("\n👉 3. Performing Admin Approval...");
        const verifyRes = await fetch(`${BASE_URL}/api/admin/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, decision: "ACTIVE" })
        });

        if (verifyRes.status === 200) {
            console.log("✅ Admin Approval Successful!");
        } else {
            console.error("❌ Admin Failed:", await verifyRes.json());
            return;
        }

        // Try Login Again
        console.log("\n👉 4. Retrying Login...");
        const retryRes = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testPatient.email, password: testPatient.password })
        });
        const retryData = await retryRes.json();

        if (retryRes.status === 200) {
            console.log("✅ Login Successful after approval!");
            console.log(`🎟️ Token: ${retryData.token.substring(0, 15)}...`);
        } else {
            console.error("❌ Login Failed:", retryData);
        }
    }
}

runPatientTest();