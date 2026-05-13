import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

const VRoom = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const role = state?.role || 'patient';
  const patientName = state?.name || 'Unknown Patient';
  const walletAddress = state?.walletAddress || "0x7a59...B9f2";

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ docName: '', docType: 'Blood Report', file: null });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.file) { alert("Please select a file to upload!"); return; }
    alert(`Successfully ready to encrypt "${uploadData.docName}" for ${patientName}'s vault!`);
    setShowUploadModal(false);
    setUploadData({ docName: '', docType: 'Blood Report', file: null });
  };

  const patientVitals = { age: 34, bloodGroup: 'O+', allergies: 'Penicillin', primaryCondition: 'Hypertension' };
  const documentVault = [
    { id: "DOC-101", name: "Complete Blood Count", type: "Blood Report", date: "2026-02-28", hash: "0xabc123df89..." }
  ];

  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContentStyle = { backgroundColor: '#0d1117', border: '1px solid #30363d', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '450px', textAlign: 'center' };

  return (
    <div className="home-container" style={{ alignItems: 'center', paddingTop: '3rem' }}>
      <div className="fade-in-down" style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 className="project-title" style={{ fontSize: '2.5rem', margin: 0 }}>Secure Patient Vault</h2>
          <p style={{ color: '#61dafb', margin: '5px 0 0 0', fontWeight: 'bold' }}>
            {role === 'doctor' ? `🟢 Authorized Access: ${patientName}'s Records` : `🟢 Viewing Your Secure Records`}
          </p>
        </div>
        <button className="secondary-btn" onClick={() => navigate('/dashboard', { state: state })} style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}>Exit Vault</button>
      </div>

      <div className="fade-in-up" style={{ width: '100%', maxWidth: '1100px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '350px' }}>
          <div className="auth-card" style={{ padding: '20px', textAlign: 'left', margin: 0 }}>
            <h3 style={{ color: '#e6edf3', marginTop: 0, borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>Patient Identity</h3>
            <p style={{ margin: '10px 0 5px 0', color: '#888', fontSize: '0.9rem' }}>Blockchain Address</p>
            <p style={{ margin: 0, fontFamily: 'monospace', background: '#010409', padding: '8px', color: '#61dafb', wordBreak: 'break-all' }}>{walletAddress}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <div><p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>Age</p><p style={{ margin: 0, color: '#e6edf3', fontWeight: 'bold' }}>{patientVitals.age} Yrs</p></div>
              <div><p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>Condition</p><p style={{ margin: 0, color: '#e6edf3', fontWeight: 'bold' }}>{patientVitals.primaryCondition}</p></div>
            </div>
          </div>
        </div>

        <div className="auth-card" style={{ flex: 2, padding: '20px', textAlign: 'left', margin: 0, minWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>
             <h3 style={{ color: '#e6edf3', margin: 0 }}>Blockchain Record Vault</h3>
             {role === 'doctor' && (
               <button className="primary-btn" onClick={() => setShowUploadModal(true)} style={{ padding: '6px 15px', fontSize: '0.9rem' }}>+ Add Record</button>
             )}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {documentVault.map((doc) => (
              <div key={doc.id} style={{ background: '#010409', border: '1px solid #30363d', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><p style={{ margin: 0, color: '#e6edf3', fontWeight: 'bold' }}>{doc.name}</p><span className="status-badge" style={{ background: 'rgba(97, 218, 251, 0.1)', color: '#61dafb' }}>{doc.type}</span></div>
                  <p style={{ margin: '5px 0 0 0', color: '#4caf50', fontFamily: 'monospace', fontSize: '0.8rem' }}>🛡️ Hash: {doc.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div style={modalOverlayStyle} onClick={() => setShowUploadModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...modalContentStyle, textAlign: 'left' }}>
            <h2 style={{ color: '#61dafb', marginTop: 0, textAlign: 'center' }}>Add to Patient Vault</h2>
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group"><label>Document Name</label><input type="text" className="dark-input" value={uploadData.docName} onChange={(e) => setUploadData({...uploadData, docName: e.target.value})} required /></div>
              <div className="form-group"><label>Type</label><select className="dark-input" value={uploadData.docType} onChange={(e) => setUploadData({...uploadData, docType: e.target.value})}><option>Blood Report</option><option>Imaging</option></select></div>
              <div className="form-group"><label>File</label><input type="file" className="dark-input" onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})} required /></div>
              <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '10px' }}>Upload to Blockchain</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRoom;