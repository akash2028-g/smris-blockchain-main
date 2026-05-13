-- SMRIS Database Schema
-- Project: Decentralized Medical Records

-- 1. Create Profiles Table (Links Auth to Blockchain)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role TEXT CHECK (role IN ('doctor', 'patient')),
    full_name TEXT,
    medical_reg_no TEXT,
    wallet_address TEXT UNIQUE,
    status TEXT DEFAULT 'PENDING'
);

-- 2. Create Medical Records Table (Syncs with Blockchain)
CREATE TABLE public.medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status TEXT DEFAULT 'PENDING', -- 'PENDING' or 'APPROVED'
    patient_wallet TEXT NOT NULL,
    doctor_wallet TEXT NOT NULL,
    ipfs_hash TEXT NOT NULL,
    blockchain_record_id INT8, -- Initially NULL, filled by Backend Listener
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Debug View (For Admin Monitoring)
CREATE OR REPLACE VIEW debug_transactions AS
SELECT 
    id, 
    status, 
    created_at, 
    patient_wallet, 
    blockchain_record_id, 
    ipfs_hash 
FROM public.medical_records 
ORDER BY created_at DESC;

-- 4. Automation: Timestamp Trigger
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_medical_records_time
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 5. Row Level Security (RLS) Policies

-- Profiles: Allow read access so frontend can check roles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

-- Profiles: Allow users to link their own wallet
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Storage: Allow Doctors to Upload
-- (Note: Storage policies are applied in the Storage Dashboard, but documented here)
-- Bucket: 'medical-records'
-- Policy: INSERT enabled for authenticated users.
-- Policy: SELECT enabled for users where wallet_address matches.
