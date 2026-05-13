import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; 
import { Scanner } from '@yudiel/react-qr-scanner'; // <-- Import the new scanner
import './App.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const role = location.state?.role || 'patient';
  const rawName = location.state?.name || 'Test User';
  const walletAddress = location.state?.walletAddress || "0x0000...UnknownWallet";
  const doctorName = rawName.startsWith('Dr.') ? rawName : `Dr. ${rawName}`;

  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleLogout = () => {
    navigate('/login'); 
  };

  // --- NEW: Handle the live camera scan ---
  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const scannedAddress = detectedCodes[0].rawValue;
      alert(`Successfully scanned Doctor's ID: ${scannedAddress.substring(0, 10)}...`);
      setShowConnectModal(false);
      // Navigate to V-Room and pass the scanned doctor's address!
      navigate('/vroom', { state: { role: 'patient', name: rawName, walletAddress: scannedAddress } });
    }
  };

  // MOCK DATA
  const supervisedPatients = [
    { id: "P-001", name: "Alice Johnson", age: 34, condition: "Hypertension", lastVisit: "2026-03-10" },
    { id: "P-002", name: "Mark Peterson", age: 45, condition: "Type 2 Diabetes", lastVisit: "2026-03-12" },
  ];
  const upcomingAppointment = { doctorName: "Dr. Smith", date: "April 28, 2026", time: "10:30 AM", department: "Cardiology" };
  const patientDocuments = [
    { id: "DOC-101", name: "Complete Blood Count", type: "Blood Report", date: "2026-02-28", doctor: "Dr. Smith" },
  ];

  // MODAL STYLES
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContentStyle = { backgroundColor: '#0d1117', border: '1px solid #30363d', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };

  // ==========================================
  // PATIENT VIEW
  // ==========================================
  if (role === 'patient') {
    return (
      <div className="home-container" style={{ alignItems: 'flex-start', paddingTop: '4rem', maxWidth: '1000px' }}>
        <div className="fade-in-down" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 className="project-title" style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>Welcome, {rawName}</h1>
            <p className="subtitle" style={{ margin: 0 }}>Your Secure Health Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="primary-btn" style={{ padding: '15px 30px', fontSize: '1.1rem' }} onClick={() => setShowConnectModal(true)}>📱 Scan Doctor</button>
            <button className="secondary-btn" onClick={handleLogout} style={{ padding: '15px 25px', fontSize: '1.1rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}>Logout</button>
          </div>
        </div>

        <div className="feature-card fade-in-up" style={{ width: '100%', maxWidth: 'none', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #61dafb', padding: '1.5rem 2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#61dafb' }}>Upcoming Appointment</h3>
            <p style={{ margin: 0, color: '#e6edf3', fontSize: '1.2rem', fontWeight: 'bold' }}>{upcomingAppointment.doctorName} <span style={{color: '#888', fontWeight: 'normal'}}>• {upcomingAppointment.department}</span></p>
          </div>
          <button className="secondary-btn">Reschedule</button>
        </div>

        <div className="history-table-container fade-in-up" style={{ width: '100%' }}>
          <h3 style={{ textAlign: 'left', padding: '1.2rem 1.5rem', margin: 0, borderBottom: '1px solid #30363d', backgroundColor: '#0d1117', color: '#e6edf3' }}>My Medical Records</h3>
          <table className="dark-table">
            <thead><tr><th>Date</th><th>Document Name</th><th>Type</th><th>Issued By</th><th>Action</th></tr></thead>
            <tbody>
              {patientDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ color: '#888' }}>{doc.date}</td>
                  <td style={{ color: '#e6edf3', fontWeight: 'bold' }}>{doc.name}</td>
                  <td><span className="status-badge" style={{ background: 'rgba(97, 218, 251, 0.1)', color: '#61dafb' }}>{doc.type}</span></td>
                  <td>{doc.doctor}</td>
                  <td><button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View File</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PATIENT LIVE SCANNER MODAL */}
        {showConnectModal && (
          <div style={modalOverlayStyle} onClick={() => setShowConnectModal(false)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#61dafb', marginTop: 0 }}>Authorize Doctor</h2>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Scan your doctor's QR code to grant them temporary access to your medical vault.</p>
              
              {/* LIVE CAMERA FEED */}
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid #30363d', marginBottom: '1.5rem', backgroundColor: '#000' }}>
                 <Scanner onScan={handleScan} />
              </div>
              
              <button className="secondary-btn" onClick={() => setShowConnectModal(false)} style={{ width: '100%' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DOCTOR VIEW
  // ==========================================
  return (
    <div className="home-container" style={{ alignItems: 'flex-start', paddingTop: '4rem', maxWidth: '1000px' }}>
      <div className="fade-in-down" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 className="project-title" style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>Welcome, {doctorName}</h1>
          <p className="subtitle" style={{ margin: 0 }}>Your Supervised Patients</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="primary-btn" style={{ padding: '15px 25px', fontSize: '1.1rem' }} onClick={() => setShowConnectModal(true)}>+ Connect Patient</button>
          <button className="secondary-btn" onClick={handleLogout} style={{ padding: '15px 25px', fontSize: '1.1rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}>Logout</button>
        </div>
      </div>

      <div className="history-table-container fade-in-up" style={{ width: '100%' }}>
        <table className="dark-table">
          <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Condition</th><th>Last Visit</th><th>Action</th></tr></thead>
          <tbody>
            {supervisedPatients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ color: '#61dafb', fontWeight: 'bold' }}>{patient.id}</td>
                <td style={{ color: '#e6edf3' }}>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.condition}</td>
                <td>{patient.lastVisit}</td>
                <td><button className="secondary-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View Records</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DOCTOR QR PRESENTATION MODAL */}
      {showConnectModal && (
        <div style={modalOverlayStyle} onClick={() => setShowConnectModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#61dafb', marginTop: 0 }}>Patient Connect</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Ask the patient to scan your secure ID to grant access to their records.</p>
            
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', display: 'inline-block', marginBottom: '2rem' }}>
              <QRCodeCanvas value={walletAddress} size={220} />
            </div>
            
            <button className="secondary-btn" onClick={() => setShowConnectModal(false)} style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;