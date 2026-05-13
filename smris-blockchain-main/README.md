SMRIS - Full-Stack Web3 Workspace
This repository is a unified Monorepo containing all components of the SMRIS ecosystem, including the frontend interface, backend middleware, database schemas, and blockchain smart contracts.

📂 Project Structure
frontend-website/: The primary user application built with Vite + React. This handles user authentication, the main dashboard, and Web3 interactions.

backend/: Node.js middleware containing server.js and blockchain.js. This manages API logic and serves as the bridge between the UI and the smart contracts.

blockchain/: The smart contract development layer. Contains Solidity contracts, Hardhat configuration, and deployment scripts for the blockchain.

database/: Repository for the project's data architecture, including schema.sql for database initialization.

Frontend-admin/: Dedicated dashboard for administrative management and platform oversight.

🚀 Quick Start
1. Prerequisites
Ensure you have the following installed:

Node.js (v18+)

NPM or Yarn

MetaMask (configured for the relevant testnet)

2. Installation & Running
To run the project locally, navigate into the desired directory and install dependencies:

Frontend:

Bash
cd frontend-website
npm install
npm run dev
Backend:

Bash
cd backend
npm install
node server.js
🔐 Environment Variables
The project requires specific environment variables to function correctly. Ensure you create .env files in the following folders:

frontend-website/.env.local

backend/.env

blockchain/.env

Note: These files are ignored by .gitignore to protect sensitive keys and credentials.

🛠 Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Ethers.js

Backend: Node.js, Express.js

Blockchain: Solidity, Hardhat

Database: PostgreSQL / Supabase
