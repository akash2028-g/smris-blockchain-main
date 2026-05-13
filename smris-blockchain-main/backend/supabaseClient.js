const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// 🔥 CHANGE HERE: Use the SERVICE key instead of the standard key
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
    console.log("🚨 ALARM: Service key is missing! I cannot bypass security!");
} else {
    console.log("✅ Supabase Service Key loaded! Bypassing RLS...");
}

// Initialize with the Admin Service Key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;