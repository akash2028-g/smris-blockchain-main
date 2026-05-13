// test_auth.js
const BASE_URL = 'http://localhost:3000';

// Generate a random email so we don't get "User already exists" errors
const randomId = Date.now();
const testUser = {
    email: `doctor_${randomId}@test.com`,
    password: "password123",
    full_name: `Dr. Test ${randomId}`,
    role: "doctor",
    medical_reg_no: "MED-TEST-999"
};

async function runTest() {
    console.log("🩺 STARTING AUTHENTICATION TEST...");
    console.log(`👤 Creating Test User: ${testUser.email}`);

    // --- STEP 1: REGISTER ---
    console.log("\n👉 1. Attempting Registration...");
    const regRes = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();

    if (regRes.status === 200) {
        console.log("✅ Registration Successful!");
    } else {
        console.error("❌ Registration Failed:", regData);
        return; // Stop test if this fails
    }

    const userId = regData.user.id; // Save ID for admin step

    // --- STEP 2: LOGIN (SHOULD FAIL) ---
    console.log("\n👉 2. Attempting Login (Expecting Failure - Status PENDING)...");
    const failLoginRes = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const failData = await failLoginRes.json();

    if (failLoginRes.status === 403) {
        console.log(`✅ Login correctly blocked! Reason: "${failData.error}"`);
    } else {
        console.error("❌ Test Failed: User was allowed to login too early!", failData);
    }

    // --- STEP 3: ADMIN APPROVAL ---
    console.log("\n👉 3. Admin Approving User...");
    const verifyRes = await fetch(`${BASE_URL}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, decision: "ACTIVE" })
    });
    const verifyData = await verifyRes.json();

    if (verifyRes.status === 200) {
        console.log("✅ Admin Approval Successful!");
    } else {
        console.error("❌ Admin Verification Failed:", verifyData);
    }

    // --- STEP 4: LOGIN (SHOULD SUCCEED) ---
    console.log("\n👉 4. Attempting Login Again (Expecting Success)...");
    const successLoginRes = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const successData = await successLoginRes.json();

    if (successLoginRes.status === 200) {
        console.log("✅ Login Successful!");
        console.log(`🎟️ Received Token: ${successData.token.substring(0, 20)}...`);
        console.log("🎉 AUTH FLOW TEST PASSED!");
    } else {
        console.error("❌ Login Failed even after approval:", successData);
    }
}

runTest();