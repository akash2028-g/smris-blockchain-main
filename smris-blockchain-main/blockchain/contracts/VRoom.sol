// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VRoom {
    
    // 1. Delegation Storage (Doctor -> Receptionist)
    struct Proxy {
        address receptionist;
        uint256 expiryTime; // When does the shift end?
    }
    // Maps Doctor Address -> Their active Proxy
    mapping(address => Proxy) public doctorProxies;

    // 2. V-Room Links (Patient <-> Doctor)
    // Maps Patient -> Doctor -> IsLinked?
    mapping(address => mapping(address => bool)) public isLinked;

    // Events
    event ProxyDelegated(address indexed doctor, address indexed receptionist, uint256 expiry);
    event ConnectionRequested(address indexed patient, address indexed doctor);
    event ConnectionApproved(address indexed patient, address indexed doctor);

    // 3. Delegate Authority (The "1st Biometric")
    // Doctor calls this to authorize a receptionist for 'duration' seconds
    function delegateProxy(address _receptionist, uint256 _durationSeconds) public {
        uint256 expiry = block.timestamp + _durationSeconds;
        
        doctorProxies[msg.sender] = Proxy({
            receptionist: _receptionist,
            expiryTime: expiry
        });

        emit ProxyDelegated(msg.sender, _receptionist, expiry);
    }

    // 4. Request Connection (Patient calls this)
    // In a real app, this might just be an off-chain notification, 
    // but recording it on-chain creates a permanent audit trail.
    function requestConnection(address _doctor) public {
        emit ConnectionRequested(msg.sender, _doctor);
    }

    // 5. Approve Connection (Receptionist calls this)
    function approveConnection(address _patient, address _doctor) public {
        // Check 1: Is the caller the Doctor themselves?
        bool isDoctor = (msg.sender == _doctor);

        // Check 2: Is the caller a valid, active Proxy?
        Proxy memory activeProxy = doctorProxies[_doctor];
        bool isProxy = (msg.sender == activeProxy.receptionist && block.timestamp < activeProxy.expiryTime);

        require(isDoctor || isProxy, "Not authorized to approve this link.");

        // Create the V-Room Link
        isLinked[_patient][_doctor] = true;
        
        emit ConnectionApproved(_patient, _doctor);
    }

    // Helper: Check if a link exists
    function checkLink(address _patient, address _doctor) public view returns (bool) {
        return isLinked[_patient][_doctor];
    }
}