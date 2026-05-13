const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function requireReceptionist(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

        // 1. Verify the user's Supabase Token
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) throw new Error("Invalid token");

        // 2. Fetch their role from your profiles table
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) throw new Error("Profile not found");

        // 3. Verify they are a Receptionist or Admin
        if (profile.role !== 'receptionist' && profile.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Only Receptionists can perform this action." });
        }

        // Pass the user info to the next function
        req.user = user;
        next();

    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
}

module.exports = requireReceptionist;