// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Identity is AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant RECEPTIONIST_ROLE = keccak256("RECEPTIONIST_ROLE"); // 1. The New Orchestrator Role

    // Mapping: patientAddress => doctorAddress => hasAccess
    mapping(address => mapping(address => bool)) public doctorAccess;

    constructor() {
        // The deployer (your main admin wallet) is the root admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // --- ROLE MANAGEMENT ---
    function addReceptionist(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(RECEPTIONIST_ROLE, account);
    }

    function addDoctor(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DOCTOR_ROLE, account);
    }

    function addPatient(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PATIENT_ROLE, account);
    }

    // --- 2. ORCHESTRATOR LINKING ---
    // The Watchtower (backend) calls this to establish the connection instantly
    function linkDoctorAndPatient(address patient, address doctor) public onlyRole(RECEPTIONIST_ROLE) {
        require(hasRole(PATIENT_ROLE, patient), "Address is not a registered patient");
        require(hasRole(DOCTOR_ROLE, doctor), "Address is not a registered doctor");
        
        doctorAccess[patient][doctor] = true;
    }

    function checkAccess(address patient, address doctor) public view returns (bool) {
        return doctorAccess[patient][doctor];
    }
}