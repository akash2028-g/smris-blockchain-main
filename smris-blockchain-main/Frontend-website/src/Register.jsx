import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from './supabaseClient'; 
import './App.css';

// ❌ I DELETED THE 'ethers' IMPORT. 
// It is now physically impossible for this code to generate a fake wallet.

function Register() {
  const navigate = useNavigate();

  // --- STATE ---
  const [walletAddress, setWalletAddress] = useState(''); 
  const [role, setRole] = useState('patient'); 
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: 'Male',
    govtId: '', 
  });

  // --- 🦊 CONNECT METAMASK (ONLY WAY) ---
  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        // This forces MetaMask to open
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // This sets YOUR real Sepolia address
        setWalletAddress(accounts[0]); 
        
      } catch (error) {
        alert("MetaMask Error: " + error.message);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // --- 🚀 SUBMIT TO SUPABASE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletAddress) return alert("Please connect MetaMask first.");

    try {
      // 1. Prepare the payload (Mapped EXACTLY to your screenshot)
      const payload = {
        id: crypto.randomUUID(),              
        full_name: formData.name,             
        wallet_address: walletAddress,        // 👈 Will be your Real Address
        role: role,                           
        status: 'ACTIVE',                     
        medical_reg_no: role === 'doctor' ? 'PENDING-REG' : null, 
        
        // Columns from your screenshot:
        age: formData.age,                    
        dob: formData.dob,                    
        gender: formData.gender,              
        govt_id: formData.govtId,
        
        // 🛡️ SAFETY FIX: Generating a dummy email just in case the DB requires it
        email: `${formData.name.replace(/\s/g, '').toLowerCase()}_${Date.now()}@example.com`
      };

      console.log("Sending this payload:", payload);

      // 2. Insert into 'profiles'
      const { data, error } = await supabase
        .from('profiles')  
        .insert([ payload ])
        .select(); 

      if (error) {
        // 🚨 THIS WILL TELL US THE REAL PROBLEM
        throw error;
      }

      // 3. Success!
      alert(`✅ Success!\n\nUser: ${formData.name}\nWallet: ${walletAddress}`);
      navigate('/'); 

    } catch (error) {
      console.error("FULL ERROR OBJECT:", error);
      // This alert will reveal the exact database rejection reason
      alert(`DATABASE ERROR:\n\nMessage: ${error.message}\nDetails: ${error.details || 'None'}\nHint: ${error.hint || 'None'}`);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="home-container">
      <div className="auth-card">
        <h2>🏥 Hospital Registration</h2>
        
        {/* STEP 1: CONNECT WALLET */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
            <label>Step 1: Digital Identity</label>
            
            {/* 🛑 I REMOVED THE GENERATE BUTTON. ONLY METAMASK IS LEFT. */}
            
            {!walletAddress ? (
                <button onClick={connectMetaMask} className="secondary-btn" style={{width: '100%', marginTop: '10px'}}>
                   {isConnecting ? "Connecting..." : "🦊 Connect MetaMask"}
                </button>
            ) : (
                <div className="fade-in-down" style={{ background: '#1a1a1a', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Connected Wallet:</p>
                    <code style={{ color: '#0f0', display: 'block' }}>{walletAddress}</code>
                </div>
            )}
        </div>

        {/* STEP 2: DETAILS */}
        <form onSubmit={handleSubmit} className="auth-form" style={{ opacity: walletAddress ? 1 : 0.5, pointerEvents: walletAddress ? 'all' : 'none' }}>
           <div className="form-group">
               <label>Role:</label>
               <select value={role} onChange={(e) => setRole(e.target.value)} className="dark-input">
                 <option value="patient">Patient</option>
                 <option value="doctor">Doctor</option>
               </select>
            </div>
            <div className="form-group">
                <label>Full Name:</label>
                <input type="text" name="name" onChange={handleChange} className="dark-input" required />
            </div>
            <div className="form-group">
                <label>Age:</label>
                <input type="number" name="age" onChange={handleChange} className="dark-input" required />
            </div>
            <div className="form-group">
                <label>Date of Birth:</label>
                <input type="date" name="dob" onChange={handleChange} className="dark-input" required />
            </div>
            <div className="form-group">
                <label>Govt ID:</label>
                <input type="text" name="govtId" onChange={handleChange} className="dark-input" required />
            </div>

            <button type="submit" className="primary-btn">Save to Database</button>
        </form>
      </div>
    </div>
  );
}

export default Register;