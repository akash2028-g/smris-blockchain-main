// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Identity.sol";

contract Record {
    Identity public identityContract;

    struct MedicalRecord {
        address patient;
        address doctor;
        string ipfsHash;
        uint256 timestamp;
    }

    // --- THE EVENT FLARE ---
    // 'indexed' allows the backend to filter and listen for specific patients or doctors
    event RecordAdded(
        address indexed patient, 
        address indexed doctor, 
        string ipfsHash, 
        uint256 timestamp
    );

    // Storage for all records
    mapping(address => MedicalRecord[]) private patientRecords;

    // We pass the Identity contract address during deployment
    constructor(address _identityContractAddress) {
        identityContract = Identity(_identityContractAddress);
    }

    // --- ZERO-FRICTION UPLOAD ---
    // The Watchtower Backend (Receptionist) calls this. 
    function addRecord(
        address patient,
        address doctor,
        string memory ipfsHash
    ) public {
        // 1. Verify the caller is the Watchtower Backend (Receptionist)
        require(
            identityContract.hasRole(identityContract.RECEPTIONIST_ROLE(), msg.sender), 
            "Caller is not an authorized Orchestrator/Receptionist"
        );

        // 2. Verify the Receptionist actually linked these two earlier
        require(
            identityContract.checkAccess(patient, doctor), 
            "Unauthorized: Doctor does not have access to this patient"
        );

        // 3. Store the immutable IPFS hash
        patientRecords[patient].push(MedicalRecord({
            patient: patient,
            doctor: doctor,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp
        }));

        // 4. Emit the event so the Node.js backend can instantly update the UI
        emit RecordAdded(patient, doctor, ipfsHash, block.timestamp);
    }

    // Standard read function for the frontend/backend
    function getRecords(address patient) public view returns (MedicalRecord[] memory) {
        return patientRecords[patient];
    }
}