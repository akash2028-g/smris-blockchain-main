import { supabase } from './supabaseClient'; // Adjust path if necessary
import UserSearchDropdown from './components/layout/UserSearchDropdown'; 
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  // --- TRAFFIC COP STATE ---
  const [currentView, setCurrentView] = useState('new'); // 'new' | tunnelId
  const [activeSessions, setActiveSessions] = useState([]); // Array of live V-Rooms

  // --- PHASE 01 STATE ---
  const [patientUid, setPatientUid] = useState('');
  const [doctorUid, setDoctorUid] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  
  // --- UPLOAD STATE (UI ONLY) ---
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // --- MOCK DATABASE LINKING FUNCTION ---
  // --- DATABASE LINKING FUNCTION ---
  const handleLinkSession = async (e) => {
    e.preventDefault();
    setIsLinking(true);

    try {
      // 1. Fetch the real names from Supabase based on the UIDs provided
      const { data: patientData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('uid', patientUid.toUpperCase())
        .single();

      const { data: doctorData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('uid', doctorUid.toUpperCase())
        .single();

      // 2. Fallback to "Unknown" if they typed a UID that doesn't exist
      const realPatientName = patientData?.full_name || 'Unknown Patient';
      const realDoctorName = doctorData?.full_name || 'Unknown Doctor';

      // 3. Create the secure session
      const newTunnelId = 'TUN-' + Math.random().toString(16).substr(2, 8).toUpperCase();
      
      const newSession = {
        id: newTunnelId,
        patientName: realPatientName,          // <-- Now using real DB data
        patientUid: patientUid.toUpperCase(),
        doctorName: realDoctorName,            // <-- Now using real DB data
        doctorUid: doctorUid.toUpperCase(),
        sessionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        documents: [] 
      };

      // 4. Update the UI
      setActiveSessions([newSession, ...activeSessions]);
      setCurrentView(newTunnelId); 
      
      setIsLinking(false);
      setPatientUid('');
      setDoctorUid('');

    } catch (error) {
      console.error("Error verifying UIDs:", error);
      setIsLinking(false);
      alert("Verification Failed. Please ensure both UIDs exist in the database.");
    }
  };

  // --- FILE SELECTION HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) setSelectedFile(e.target.files[0]);
  };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
    }
  };

  // --- MOCK FILE UPLOAD FUNCTION ---
  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || currentView === 'new') return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      const newDoc = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: selectedFile.name,
        size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
        type: selectedFile.type.includes('image') ? 'image' : 'description',
        status: 'Verified on Ledger',
        hash: '0x' + Math.random().toString(16).substr(2, 12).toUpperCase(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      
      // Inject document into the correct session
      const updatedSessions = activeSessions.map(session => {
        if (session.id === currentView) {
          return { ...session, documents: [newDoc, ...session.documents] };
        }
        return session;
      });

      setActiveSessions(updatedSessions);
      setIsUploading(false);
      setSelectedFile(null); 
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const closeSession = (tunnelId) => {
    const updatedSessions = activeSessions.filter(s => s.id !== tunnelId);
    setActiveSessions(updatedSessions);
    if (currentView === tunnelId) {
      setCurrentView('new');
    }
    setSelectedFile(null);
  };

  // Derived state for rendering Phase 02
  const currentSession = activeSessions.find(s => s.id === currentView);

  return (
    <>
      <style>{`
        /* STANDARD FONTS TO MATCH AUTH.JSX */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --indigo: #6366f1;
          --indigo-dim: rgba(99,102,241,0.12);
          --violet: #8b5cf6;
          --cyan: #22d3ee;
          --emerald: #34d399;
          --navy: #070d1a;
          --panel: rgba(15,22,40,0.85);
          --border: rgba(99,102,241,0.18);
          --border-muted: rgba(99,102,241,0.08);
          --text: #dde4f8;
          --muted: #5a6a8a;
        }

        .rec-root {
          min-height: 100vh;
          background: var(--navy);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Typography Classes ── */
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono    { font-family: 'JetBrains Mono', monospace; }

        /* ── Noise grain overlay ── */
        .rec-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        /* ── Radial ambient glows ── */
        .bg-glow-1 { position: fixed; width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%); top: -200px; left: -150px; pointer-events: none; z-index: 0; }
        .bg-glow-2 { position: fixed; width: 500px; height: 500px; background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%); bottom: -100px; right: -100px; pointer-events: none; z-index: 0; }

        /* ── Grid lines ── */
        .grid-bg {
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none; z-index: 0;
        }

        /* ── Navbar ── */
        .rec-nav {
          position: sticky; top: 0; z-index: 50; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem;
          background: rgba(7,13,26,0.90); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border);
        }
        .nav-id-badge { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--indigo); background: var(--indigo-dim); border: 1px solid rgba(99,102,241,0.25); padding: 2px 10px; border-radius: 4px; }
        .logout-btn { display: flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: var(--muted); background: none; border: none; cursor: pointer; transition: color 0.2s; }
        .logout-btn:hover { color: #f87171; }

        /* ── Glass panel ── */
        .glass { background: var(--panel); backdrop-filter: blur(24px); border: 1px solid var(--border); border-radius: 16px; }

        /* ── Section title ── */
        .section-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.01em; }

        /* ── Terminal input ── */
        .terminal-input { width: 100%; background: rgba(4, 8, 18, 0.8); border: 1px solid rgba(99,102,241,0.2); color: var(--text); border-radius: 8px; padding: 14px 14px 14px 46px; font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
        .terminal-input::placeholder { color: rgba(90,106,138,0.7); }
        .terminal-input:focus { border-color: var(--indigo); box-shadow: 0 0 0 3px rgba(99,102,241,0.12), inset 0 0 20px rgba(99,102,241,0.04); }
        .input-label { font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.1em; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }

        /* ── Verify button ── */
        .verify-btn { width: 100%; padding: 15px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; box-shadow: 0 0 24px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1); position: relative; overflow: hidden; }
        .verify-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%); }
        .verify-btn:hover:not(:disabled) { box-shadow: 0 0 36px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15); transform: translateY(-1px); }
        .verify-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ── Connectors & Shimmers ── */
        .connector-line { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 2px; height: 60%; background: linear-gradient(to bottom, transparent, rgba(99,102,241,0.5), transparent); animation: pulse-line 2s ease-in-out infinite; }
        .connector-node { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(7,13,26,0.95); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--muted); z-index: 5; }
        .pulse-ring-wrap { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
        .pulse-ring { width: 54px; height: 54px; border-radius: 50%; border: 1px solid rgba(99,102,241,0.3); animation: pulse-ring 2s ease-out infinite; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .pulse-ring:nth-child(2) { animation-delay: 0.7s; }
        .shimmer-bar { height: 2px; background: linear-gradient(90deg, transparent 0%, var(--indigo) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; border-radius: 2px; }

        /* ── Badges ── */
        .tunnel-badge { display: flex; align-items: center; gap: 8px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.22); border-radius: 8px; padding: 8px 14px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #a5b4fc; }
        .live-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 6px #4ade80; animation: blink-dot 1.4s ease-in-out infinite; }
        .verified-badge { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--emerald); background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); padding: 2px 7px; border-radius: 4px; }

        /* ── Sidebar specific ── */
        .sidebar-item { padding: 16px; border-radius: 12px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; margin-bottom: 8px; background: rgba(4,8,18,0.4); }
        .sidebar-item:hover { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.05); }
        .sidebar-item.active { border-color: var(--indigo); background: rgba(99,102,241,0.1); box-shadow: inset 0 0 20px rgba(99,102,241,0.05); }
        .new-btn { width: 100%; padding: 14px; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; border: 1px solid var(--border); cursor: pointer; }
        .new-btn.active { background: var(--indigo); color: white; border-color: var(--indigo); }
        .new-btn:not(.active) { background: rgba(99,102,241,0.05); color: var(--text); }
        .new-btn:hover:not(.active) { background: rgba(99,102,241,0.1); }

        /* ── Upload & Ledger ── */
        .drop-zone { position: relative; border: 1.5px dashed rgba(99,102,241,0.25); border-radius: 12px; background: rgba(4,8,18,0.6); min-height: 200px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; overflow: hidden; cursor: pointer; }
        .drop-zone.has-file { border-style: solid; border-color: var(--cyan); background: rgba(34, 211, 238, 0.05); }
        .drop-zone::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; }
        .drop-zone:hover::before, .drop-zone.dragging::before { opacity: 1; }
        .drop-zone:hover, .drop-zone.dragging { border-color: var(--indigo); border-style: solid; box-shadow: 0 0 0 3px rgba(99,102,241,0.1), inset 0 0 30px rgba(99,102,241,0.06); }
        .drop-zone-corner { position: absolute; width: 14px; height: 14px; border-color: rgba(99,102,241,0.5); border-style: solid; }
        .drop-zone-corner.tl { top: 10px; left: 10px; border-width: 1.5px 0 0 1.5px; }
        .drop-zone-corner.tr { top: 10px; right: 10px; border-width: 1.5px 1.5px 0 0; }
        .drop-zone-corner.bl { bottom: 10px; left: 10px; border-width: 0 0 1.5px 1.5px; }
        .drop-zone-corner.br { bottom: 10px; right: 10px; border-width: 0 1.5px 1.5px 0; }
        .upload-btn { width: 100%; padding: 13px; border-radius: 9px; border: 1px solid rgba(99,102,241,0.25); cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(99,102,241,0.08); color: #a5b4fc; transition: all 0.2s; }
        .upload-btn.ready { background: var(--indigo); color: white; border-color: var(--indigo); box-shadow: 0 0 16px rgba(99,102,241,0.3); }
        .ledger-row { background: rgba(4,8,18,0.5); border: 1px solid rgba(99,102,241,0.1); border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; animation: fade-up 0.35s ease both; }
        .ledger-hash { font-size: 10px; letter-spacing: 0.05em; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

        .phase-tag { display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(99,102,241,0.7); margin-bottom: 6px; }
        .phase-tag-line { display: block; width: 24px; height: 1px; background: rgba(99,102,241,0.35); }
        .spin { animation: spin 1s linear infinite; display: inline-block; }

        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse-ring { 0% { transform: translate(-50%,-50%) scale(0.85); opacity: 0.6; } 100% { transform: translate(-50%,-50%) scale(1.6); opacity: 0; } }
        @keyframes pulse-line { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }
        @keyframes blink-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="rec-root">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
        <div className="grid-bg" />

        {/* ── Navbar ── */}
        <nav className="rec-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>support_agent</span>
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f8', letterSpacing: '0.02em' }}>Front Desk Operations</div>
              <span className="nav-id-badge">STAFF · REC-1049</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span> Secure Logout
          </button>
        </nav>

        {/* ── Dashboard Layout Container ── */}
        <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1, padding: '2rem', gap: '2rem', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          
          {/* ═══════════════════════════════════════════
                 SIDEBAR (THE LEDGER)
             ═══════════════════════════════════════════ */}
          <aside className="glass" style={{ width: 320, padding: 24, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 124px)', position: 'sticky', top: 82 }}>
            <button 
              className={`new-btn ${currentView === 'new' ? 'active' : ''}`}
              onClick={() => setCurrentView('new')}
              style={{ marginBottom: 24 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
              New Consultation
            </button>

            <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid var(--border-muted)', paddingBottom: 8 }}>
              Active Sessions ({activeSessions.length})
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              {activeSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--muted)', fontSize: 12 }}>
                  No active V-Rooms. <br/> Start a consultation to link patients.
                </div>
              ) : (
                activeSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`sidebar-item ${currentView === session.id ? 'active' : ''}`}
                    onClick={() => setCurrentView(session.id)}
                  >
                    <div className="font-display" style={{ fontWeight: 600, fontSize: 14, color: currentView === session.id ? 'var(--cyan)' : 'var(--text)', marginBottom: 2 }}>
                      {session.patientName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>with {session.doctorName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                      <div className="live-dot" style={{ width: 5, height: 5 }} />
                      <div className="font-mono" style={{ fontSize: 9, color: 'var(--emerald)', letterSpacing: '0.1em' }}>{session.id}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* ═══════════════════════════════════════════
                 MAIN WORKSPACE
             ═══════════════════════════════════════════ */}
          <main style={{ flex: 1 }}>
            {currentView === 'new' ? (
              
              /* --- PHASE 1: INITIATE --- */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32, animation: 'fade-up 0.45s ease both', maxWidth: 800, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', paddingTop: 32 }}>
                  <div className="phase-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <span className="phase-tag-line" /> Phase 01 · Identity Nexus <span className="phase-tag-line" />
                  </div>
                  <h2 className="section-title" style={{ fontSize: 42, color: '#f0f4ff', marginBottom: 12 }}>Initiate Consultation</h2>
                  <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
                    Provide Patient and Physician UIDs to cryptographically link them and unlock the secure session workspace.
                  </p>
                </div>

                <div className="glass" style={{ width: '100%', padding: 40, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle at top right, rgba(99,102,241,0.1), transparent 70%)', pointerEvents: 'none' }} />
                  <form onSubmit={handleLinkSession} style={{ display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, pointerEvents: 'none' }}>
                        <div className="connector-line" />
                        <div className="pulse-ring-wrap">
                          <div className="pulse-ring" /><div className="pulse-ring" />
                        </div>
                        <div className="connector-node"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>link</span></div>
                      </div>

                      <div>
                        <div className="input-label" style={{ color: 'var(--cyan)' }}><span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 5 }}>personal_injury</span> Patient UID</div>
                        <UserSearchDropdown 
                        role="patient"
                        value={patientUid}
                        onChange={setPatientUid}
                        placeholder="Type Name or P-001..."
                        icon="person_search"
                        colorHex="34, 211, 238"
                      />
                      </div>

                      <div>
                        <div className="input-label" style={{ color: 'var(--emerald)' }}><span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 5 }}>stethoscope</span> Doctor UID</div>
                        <UserSearchDropdown 
                          role="doctor"
                          value={doctorUid}
                          onChange={setDoctorUid}
                          placeholder="Type Name or DOC-001..."
                          icon="medical_services"
                          colorHex="52, 211, 153"
                        />
                      </div>
                    </div>

                    {isLinking && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="shimmer-bar" /><div className="shimmer-bar" style={{ animationDelay: '0.15s', opacity: 0.5 }} />
                      </div>
                    )}

                    <button type="submit" className="verify-btn" disabled={isLinking || !patientUid || !doctorUid}>
                      {isLinking ? <><span className="material-symbols-outlined spin" style={{ fontSize: 18 }}>autorenew</span> Verifying Cryptographic Ledger...</> : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>shield_lock</span> Verify &amp; Establish Secure Link <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></>}
                    </button>
                    <div className="font-mono" style={{ textAlign: 'center', fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 16 }}>ALL SESSIONS ARE END-TO-END ENCRYPTED · SMRIS PROTOCOL v2.5</div>
                  </form>
                </div>
              </div>

            ) : (

              /* --- PHASE 2: WORKSPACE --- */
              currentSession && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fade-up 0.4s ease both' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div className="phase-tag" style={{ marginBottom: 6 }}><span className="phase-tag-line" /> Phase 02 · Active Workspace</div>
                      <h2 className="section-title" style={{ fontSize: 28, color: '#f0f4ff' }}>Consultation Workspace</h2>
                    </div>
                    <button onClick={() => closeSession(currentSession.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.7)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; e.currentTarget.style.color = '#f87171'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; e.currentTarget.style.color = 'rgba(248,113,113,0.7)'; }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>power_settings_new</span> End Session
                    </button>
                  </div>

                  <div className="glass" style={{ padding: '20px 28px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 0%, var(--indigo) 30%, var(--violet) 70%, transparent 100%)', opacity: 0.7 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                        <div>
                          <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Patient</div>
                          <div className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--cyan)' }}>{currentSession.patientName}</div>
                          <div className="font-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em' }}>{currentSession.patientUid}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 36, height: 1, background: 'linear-gradient(90deg, rgba(34,211,238,0.5), var(--indigo))' }} />
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span></div>
                          <div style={{ width: 36, height: 1, background: 'linear-gradient(90deg, var(--indigo), rgba(52,211,153,0.5))' }} />
                        </div>
                        <div>
                          <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Attending Physician</div>
                          <div className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--emerald)' }}>{currentSession.doctorName}</div>
                          <div className="font-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em' }}>{currentSession.doctorUid}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <div className="tunnel-badge"><div className="live-dot" /> Session Live · {currentSession.sessionTime}</div>
                        <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)' }}>TUNNEL · {currentSession.id}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="font-mono" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Upload Medical Records</div>
                      <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                        <div className={`drop-zone${isDragging ? ' dragging' : ''}${selectedFile ? ' has-file' : ''}`} onDragEnter={handleDragOver} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 20 }} />
                          <div className="drop-zone-corner tl" /><div className="drop-zone-corner tr" /><div className="drop-zone-corner bl" /><div className="drop-zone-corner br" />
                          <div style={{ textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}>
                            {selectedFile ? (
                               <><span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 10, color: 'var(--cyan)' }}>task</span><div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 4 }}>{selectedFile.name}</div><div style={{ fontSize: 11, color: 'var(--emerald)' }}>Ready for Encryption</div></>
                            ) : (
                               <><span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 10, color: isDragging ? 'var(--indigo)' : 'var(--muted)', transition: 'color 0.3s' }}>{isDragging ? 'file_download' : 'note_add'}</span><div style={{ fontSize: 13, fontWeight: 700, color: isDragging ? '#a5b4fc' : 'var(--text)', marginBottom: 4, transition: 'color 0.3s' }}>{isDragging ? 'Drop to encrypt & select' : 'Click or drag file here'}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>Prescriptions · Lab Results · Scans</div><div className="font-mono" style={{ fontSize: 10, color: 'rgba(90,106,138,0.5)', marginTop: 4, letterSpacing: '0.08em' }}>PDF / JPG / PNG</div></>
                            )}
                          </div>
                        </div>
                        <button type="submit" className={`upload-btn ${selectedFile ? 'ready' : ''}`} disabled={isUploading || !selectedFile}>
                          {isUploading ? <><span className="material-symbols-outlined spin" style={{ fontSize: 16 }}>progress_activity</span> Encrypting &amp; Hashing...</> : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock</span> {selectedFile ? 'Upload to Secure Ledger' : 'Select a file to upload'}</>}
                        </button>
                      </form>
                    </div>

                    <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div className="font-mono" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Session Ledger</div>
                        <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.08em', background: 'rgba(4,8,18,0.8)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 10px', borderRadius: 20 }}>{currentSession.documents.length} records</span>
                      </div>
                      
                      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300 }}>
                        {currentSession.documents.length === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, gap: 10, color: 'var(--muted)', opacity: 0.6 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40 }}>dataset</span>
                            <div style={{ fontSize: 12, letterSpacing: '0.05em' }}>No records logged yet.</div>
                          </div>
                        ) : (
                          currentSession.documents.map((doc) => (
                            <div key={doc.id} className="ledger-row">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden', flex: 1 }}>
                                <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{doc.type}</span>
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{doc.name}</div>
                                  <div className="ledger-hash">{doc.hash} · {doc.size}</div>
                                </div>
                              </div>
                              <span className="verified-badge"><span className="material-symbols-outlined" style={{ fontSize: 11 }}>check_circle</span> Verified</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ReceptionistDashboard;