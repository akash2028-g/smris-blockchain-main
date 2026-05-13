# SMRIS Database (Supabase)

This folder contains the database schema and configurations for the SMRIS project.

## Setup Instructions
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy the contents of `schema.sql` and run it to generate all tables and triggers.
4. Go to **Storage** and create a bucket named `medical-records`.
5. Set Storage Policies to allow authenticated uploads.

## Key Tables
- **profiles:** Manages user identities and links them to MetaMask wallets.
- **medical_records:** Stores IPFS hashes and syncs status (`PENDING` -> `APPROVED`) with the Blockchain.

## Triggers
- **update_medical_records_time:** Automatically updates the timestamp when the Blockchain Listener approves a record.
