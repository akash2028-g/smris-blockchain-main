const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

// 1. FORCE Node to look in the exact backend folder for the .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// 2. 🛑 DEBUGGING LOGS: Print out what Node actually sees (You can delete this later)
console.log("\n--- DEBUGGING ENV VARIABLES ---");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "FOUND ✅" : "MISSING ❌");
console.log("SUPABASE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY ? "FOUND ✅" : "MISSING ❌");
console.log("-------------------------------\n");

// 3. Setup variables (with a fallback just in case of naming differences)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

// 4. Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Task 1: Upload Buffer to Pinata (Cold Ledger)
 * 🔑 UPDATED to use PINATA_JWT Auth
 */
const uploadToPinata = async (fileBuffer, originalName) => {
    try {
        const formData = new FormData();
        formData.append('file', fileBuffer, { filename: originalName });

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: "Infinity", // Prevents crashing on larger files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${process.env.PINATA_JWT}` // 🔑 Modern JWT Auth
            }
        });

        return response.data.IpfsHash; // The immutable CID
    } catch (error) {
        console.error("Pinata Upload Error:", error);
        throw new Error("Failed to pin file to IPFS");
    }
};

/**
 * Task 2: Upload to Supabase Storage & Insert Database Row
 * UPDATED FOR ORCHESTRATOR MODEL (Using UIDs)
 */
const saveMedicalRecord = async (fileBuffer, originalName, mimeType, patient_uid, doctor_uid, ipfsCID, txHash, receptionist_uid) => {
    // Sanitize filename and append timestamp
    const safeFileName = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;

    // 1. Upload to Supabase 'medical-files' bucket
    const { data: storageData, error: storageError } = await supabase
        .storage
        .from('medical-files')
        .upload(safeFileName, fileBuffer, { contentType: mimeType });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage.from('medical-files').getPublicUrl(safeFileName);
    const hotCacheUrl = publicUrlData.publicUrl;

    // 2. Insert metadata into the medical_records table using UIDs
    const { data: dbData, error: dbError } = await supabase
        .from('medical_records')
        .insert([{
            patient_id: patient_uid,        // Using UID instead of wallet
            doctor_id: doctor_uid,          // Using UID instead of wallet
            receptionist_id: receptionist_uid, // Track who uploaded it
            ipfs_hash: ipfsCID,
            hot_cache_url: hotCacheUrl,
            transaction_hash: txHash,       // The Arbitrum Gasless Tx Proof
            status: 'APPROVED'              // Relayer handles verification instantly now
        }]);

    if (dbError) throw dbError;

    return { ipfsCID, hotCacheUrl };
};

module.exports = { uploadToPinata, saveMedicalRecord };