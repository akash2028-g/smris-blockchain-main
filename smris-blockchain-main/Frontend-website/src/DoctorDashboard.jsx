import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// ─── Inline styles for custom keyframe animations ───────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --emerald:    #34d399;
    --emerald-dim: #10b981;
    --emerald-glow: rgba(52, 211, 153, 0.18);
    --emerald-glow-strong: rgba(52, 211, 153, 0.35);
    --panel:      rgba(13, 22, 40, 0.82);
    --panel-border: rgba(52, 211, 153, 0.12);
    --panel-border-hover: rgba(52, 211, 153, 0.38);
    --bg-deep:    #070d1a;
    --bg-mid:     #0b1526;
    --text-primary: #e8f4f0;
    --text-secondary: #6b9e8a;
    --text-muted: #344d45;
    --red-status: #f87171;
    --amber-status: #fbbf24;
    --teal-status: #2dd4bf;
  }

  * { box-sizing: border-box; }

  body { background: var(--bg-deep); }

  .smris-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg-deep);
    color: var(--text-primary);
    min-height: 100vh;
  }

  .font-display { font-family: 'Syne', sans-serif; }
  .font-mono    { font-family: 'DM Mono', monospace; }

  /* ── Scrollbar ── */
  .vault-scroll::-webkit-scrollbar { width: 3px; }
  .vault-scroll::-webkit-scrollbar-track { background: transparent; }
  .vault-scroll::-webkit-scrollbar-thumb { background: var(--emerald-dim); border-radius: 99px; }

  /* ── Grid dot background ── */
  .dot-grid {
    background-image: radial-gradient(circle, rgba(52,211,153,0.08) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  /* ── Glassmorphism panel ── */
  .glass-panel {
    background: var(--panel);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid var(--panel-border);
  }

  .glass-panel-hover {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .glass-panel-hover:hover {
    border-color: var(--panel-border-hover);
    box-shadow: 0 0 24px var(--emerald-glow), inset 0 0 20px rgba(52,211,153,0.03);
  }

  /* ── Emerald glow ring ── */
  .glow-ring {
    box-shadow: 0 0 0 1px var(--panel-border), 0 0 20px var(--emerald-glow);
  }
  .glow-ring-strong {
    box-shadow: 0 0 0 1px rgba(52,211,153,0.4), 0 0 30px var(--emerald-glow-strong), 0 0 60px rgba(52,211,153,0.08);
  }

  /* ── Animations ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); opacity: 0.5; }
    100% { transform: translateY(400%); opacity: 0; }
  }
  @keyframes pulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.04); }
  }
  @keyframes gridFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes dash {
    to { stroke-dashoffset: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 15px) scale(0.97); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  .anim-fade-up       { animation: fadeSlideUp 0.5s ease both; }
  .anim-fade-in       { animation: fadeSlideIn 0.4s ease both; }
  .anim-pulse-ring    { animation: pulseRing 2.4s ease infinite; }
  .anim-breathe       { animation: breathe 4s ease-in-out infinite; }
  .anim-grid-float    { animation: gridFloat 6s ease-in-out infinite; }
  .anim-orb           { animation: orbFloat 12s ease-in-out infinite; }
  .anim-blink         { animation: blink 1.1s step-end infinite; }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }

  /* ── Patient card active state ── */
  .patient-card-active {
    background: linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.06));
    border-color: rgba(52,211,153,0.45) !important;
    box-shadow: 0 0 20px rgba(52,211,153,0.15), inset 0 0 12px rgba(52,211,153,0.04);
  }

  /* ── Sparkline ── */
  .sparkline-path {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: dash 1.4s ease forwards;
    animation-delay: 0.5s;
  }

  /* ── Shimmer skeleton ── */
  .shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.06) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }

  /* ── Doc row hover ── */
  .doc-row {
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .doc-row:hover {
    background: rgba(52,211,153,0.04);
    border-color: rgba(52,211,153,0.3);
    transform: translateX(3px);
  }

  /* ── Status badge colors ── */
  .status-active      { color: var(--emerald); border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.08); }
  .status-observation { color: var(--amber-status); border-color: rgba(251,191,36,0.3); background: rgba(251,191,36,0.08); }
  .status-complete    { color: var(--teal-status); border-color: rgba(45,212,191,0.3); background: rgba(45,212,191,0.08); }

  /* ── Corner cut decoration ── */
  .corner-cut {
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
  }
  .corner-cut-sm {
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
  }

  /* ── Scan overlay effect ── */
  .scan-overlay::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 40%;
    background: linear-gradient(to bottom, rgba(52,211,153,0.04), transparent);
    animation: scanline 3s linear infinite;
    pointer-events: none;
  }
`;

// ─── Mini Sparkline SVG Component ────────────────────────────────────────────
const Sparkline = ({ data, color = '#34d399', height = 40 }) => {
  const w = 120, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const areaPath = `M${pts[0]} L${pts.slice(1).join(' L')} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
      />
      <circle
        cx={parseFloat(pts[pts.length - 1].split(',')[0])}
        cy={parseFloat(pts[pts.length - 1].split(',')[1])}
        r="2.5"
        fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
};

// ─── Vitals Row ───────────────────────────────────────────────────────────────
const VitalCard = ({ label, value, unit, trend, data, color, delay }) => (
  <div
    className="glass-panel glass-panel-hover corner-cut-sm anim-fade-up relative overflow-hidden"
    style={{ animationDelay: delay, padding: '14px 16px' }}
  >
    <div style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', marginBottom: 6, textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: color || 'var(--text-primary)' }}>
          {value}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 3, fontFamily: 'DM Mono, monospace' }}>{unit}</span>
        <div style={{ fontSize: 10, color: trend > 0 ? 'var(--emerald)' : 'var(--red-status)', marginTop: 2, fontFamily: 'DM Mono, monospace' }}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last
        </div>
      </div>
      <Sparkline data={data} color={color || 'var(--emerald)'} />
    </div>
    <div className="shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
  </div>
);

const getStatusClass = (status) => {
  if (status.includes('Active')) return 'status-active';
  if (status.includes('Observation')) return 'status-observation';
  return 'status-complete';
};

const getStatusDot = (status) => {
  if (status.includes('Active')) return '#34d399';
  if (status.includes('Observation')) return '#fbbf24';
  return '#2dd4bf';
};

// ─── Treatment Timeline ───────────────────────────────────────────────────────
const TreatmentTimeline = ({ patient }) => {
  const events = [
    { label: 'Initial Consultation', date: 'Sep 01, 2026', done: true },
    { label: 'Lab Work Ordered', date: 'Sep 08, 2026', done: true },
    { label: 'Results Reviewed', date: 'Oct 18, 2026', done: true },
    { label: patient.status, date: patient.lastVisit, done: true, active: true },
    { label: 'Next Scheduled Review', date: 'Nov 10, 2026', done: false },
  ];
  return (
    <div style={{ position: 'relative', paddingLeft: 20 }}>
      <div style={{ position: 'absolute', left: 7, top: 4, bottom: 4, width: 1, background: 'linear-gradient(to bottom, var(--emerald), var(--panel-border))' }} />
      {events.map((ev, i) => (
        <div key={i} className="anim-fade-up" style={{ animationDelay: `${0.3 + i * 0.08}s`, display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < events.length - 1 ? 16 : 0 }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 1,
            background: ev.active ? 'var(--emerald)' : ev.done ? 'rgba(52,211,153,0.3)' : 'var(--bg-mid)',
            border: `1px solid ${ev.done ? 'var(--emerald)' : 'var(--panel-border)'}`,
            boxShadow: ev.active ? '0 0 10px rgba(52,211,153,0.6)' : 'none',
            position: 'relative', zIndex: 1,
          }} />
          <div>
            <div style={{ fontSize: 12, color: ev.active ? 'var(--emerald)' : ev.done ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: ev.active ? 600 : 400, fontFamily: 'DM Sans, sans-serif' }}>
              {ev.label}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{ev.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="anim-orb" style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="anim-orb" style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none', animationDelay: '-4s', top: '20%', left: '20%' }} />

      <div className="anim-breathe anim-pulse-ring" style={{
        width: 88, height: 88, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 28, position: 'relative',
      }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <div style={{ position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTop: '2px solid var(--emerald)', borderLeft: '2px solid var(--emerald)', borderRadius: '4px 0 0 0' }} />
        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid var(--emerald)', borderRight: '2px solid var(--emerald)', borderRadius: '0 0 4px 0' }} />
      </div>

      <div className="font-display anim-fade-up" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
        Workspace Initialized
      </div>

      <div className="font-mono anim-fade-up delay-100" style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
        <span style={{ color: 'var(--emerald)' }}>SMRIS</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>›</span>
        awaiting patient selection
        <span className="anim-blink" style={{ color: 'var(--emerald)', marginLeft: 2 }}>_</span>
      </div>

      <p className="anim-fade-up delay-200" style={{ color: 'var(--text-secondary)', maxWidth: 360, textAlign: 'center', lineHeight: 1.7, fontSize: 13 }}>
        Select a patient from your assigned roster to access their secure clinical profile and medical records vault.
      </p>

      <div className="anim-grid-float anim-fade-up delay-300" style={{ display: 'flex', gap: 6, marginTop: 40 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === 2 ? 'var(--emerald)' : 'var(--panel-border)',
            boxShadow: i === 2 ? '0 0 8px var(--emerald)' : 'none',
          }} />
        ))}
      </div>
    </div>
  );
};

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
    <div style={{ position: 'relative' }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(52,211,153,0.12)" strokeWidth="2" />
        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--emerald)" strokeWidth="2"
          strokeDasharray="40 110" strokeLinecap="round"
          style={{ transformOrigin: '28px 28px', animation: 'spin 0.9s linear infinite' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
    </div>
    <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
      AUTHENTICATING PROVIDER<span className="anim-blink" style={{ color: 'var(--emerald)' }}>...</span>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('Doctor');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // --- 1. FETCH LOGGED-IN DOCTOR'S DETAILS FROM SUPABASE ---
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/'); return; }
        
        const { data: profile, error } = await supabase
          .from('profiles').select('full_name, role').eq('id', user.id).single();
          
        if (error) throw error;
        
        if (profile && profile.role === 'doctor') {
          const name = profile.full_name.startsWith('Dr.') ? profile.full_name : `Dr. ${profile.full_name}`;
          setDoctorName(name);
        } else { 
          navigate('/'); 
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    fetchDoctorProfile();
  }, [navigate]);

  // --- 2. SECURE MOCK DATA (Until DB Handler sets up the linking tables) ---
  const [patients] = useState([
    {
      id: 'PT-8492', name: 'Eleanor Vance', age: 34, gender: 'Female',
      status: 'Active Treatment', lastVisit: 'Oct 24, 2026',
      vitals: { hr: 72, bp: '118/76', spo2: 98 },
      documents: [
        { docId: 'DOC-101', name: 'Complete Blood Count (CBC).pdf', type: 'Lab Report', date: 'Oct 24, 2026', uploadedBy: 'Receptionist (REC-1049)' },
        { docId: 'DOC-102', name: 'Cardiac MRI Scan.jpg', type: 'Imaging', date: 'Oct 18, 2026', uploadedBy: 'Receptionist (REC-1049)' }
      ]
    },
    {
      id: 'PT-1044', name: 'Marcus Brody', age: 52, gender: 'Male',
      status: 'Under Observation', lastVisit: 'Oct 20, 2026',
      vitals: { hr: 88, bp: '142/91', spo2: 95 },
      documents: [
        { docId: 'DOC-201', name: 'Prescription History.pdf', type: 'Prescription', date: 'Oct 20, 2026', uploadedBy: 'Receptionist (REC-1049)' }
      ]
    },
    {
      id: 'PT-9931', name: 'Sarah Connor', age: 28, gender: 'Female',
      status: 'Consultation Complete', lastVisit: 'Sep 15, 2026',
      vitals: { hr: 65, bp: '110/70', spo2: 99 },
      documents: []
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Data for the animated sparkline charts
  const mockVitalData = {
    'PT-8492': { hr: [68,70,74,72,75,71,72], spo2: [97,98,97,99,98,98,98], bp: [115,118,120,116,118,119,118] },
    'PT-1044': { hr: [82,85,90,88,92,86,88], spo2: [94,95,93,96,95,94,95], bp: [140,145,142,144,141,143,142] },
    'PT-9931': { hr: [63,65,64,66,65,64,65], spo2: [99,99,100,99,99,100,99], bp: [108,110,112,109,110,111,110] },
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoadingAuth) return (
    <div className="smris-root"><style>{GLOBAL_STYLES}</style><LoadingScreen /></div>
  );

  const vd = selectedPatient ? mockVitalData[selectedPatient.id] : null;

  return (
    <div className="smris-root" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ═══════════════════════════════════════════════
          SIDEBAR - PATIENT ROSTER
      ═══════════════════════════════════════════════ */}
      <aside style={{
        width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(10,18,32,0.98) 0%, rgba(7,13,26,0.98) 100%)',
        borderRight: '1px solid var(--panel-border)',
        position: 'relative', zIndex: 20,
      }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--emerald), transparent)' }} />

        {/* Doctor Identity Block */}
        <div className="anim-fade-in" style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.08))',
              border: '1px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(52,211,153,0.15)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--emerald)', lineHeight: 1.2 }}>
                {doctorName}
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginTop: 2 }}>
                AUTHORIZED PROVIDER
              </div>
            </div>
          </div>

          <div className="glass-panel corner-cut-sm" style={{ padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)', flexShrink: 0 }} className="anim-pulse-ring" />
            <span className="font-mono" style={{ fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
              SMRIS SECURE SESSION ACTIVE
            </span>
          </div>
        </div>

        {/* Assigned Patients List */}
        <div style={{ padding: '16px 14px 12px', flex: 1, overflowY: 'auto' }} className="vault-scroll">
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 12, paddingLeft: 4, textTransform: 'uppercase' }}>
            ── Assigned Roster ({patients.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {patients.map((patient, i) => {
              const isActive = selectedPatient?.id === patient.id;
              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`glass-panel anim-fade-in ${isActive ? 'patient-card-active' : 'glass-panel-hover'}`}
                  style={{
                    animationDelay: `${0.1 + i * 0.07}s`,
                    border: `1px solid ${isActive ? 'rgba(52,211,153,0.45)' : 'var(--panel-border)'}`,
                    padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                    cursor: 'pointer', transition: 'all 0.25s ease', width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
                    <span className="font-display" style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--emerald)' : 'var(--text-primary)' }}>
                      {patient.name}
                    </span>
                    <span className="font-mono" style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: isActive ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: isActive ? 'var(--emerald)' : 'var(--text-muted)',
                    }}>
                      {patient.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: getStatusDot(patient.status), boxShadow: `0 0 5px ${getStatusDot(patient.status)}` }} />
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                        {patient.status}
                      </span>
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                      {patient.documents.length} doc{patient.documents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secure Logout Action */}
        <div style={{ padding: '12px 14px 16px', borderTop: '1px solid var(--panel-border)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '9px 14px', borderRadius: 8,
              background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)',
              color: 'rgba(248,113,113,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 7, fontSize: 12, fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.06em', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.05)'; e.currentTarget.style.color = 'rgba(248,113,113,0.6)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            SECURE LOGOUT
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          MAIN WORKSPACE
      ═══════════════════════════════════════════════ */}
      <main
        className="dot-grid vault-scroll"
        style={{ flex: 1, overflowY: 'auto', position: 'relative', padding: '28px 32px' }}
      >
        <div style={{
          position: 'fixed', top: '40%', left: '55%', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 0,
        }} />

        {selectedPatient ? (
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 48, position: 'relative', zIndex: 1 }}>

            <div className="anim-fade-up font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>SMRIS</span>
              <span style={{ color: 'var(--panel-border)' }}>›</span>
              <span>PATIENT RECORDS</span>
              <span style={{ color: 'var(--panel-border)' }}>›</span>
              <span style={{ color: 'var(--emerald)' }}>{selectedPatient.id}</span>
            </div>

            {/* --- PATIENT PROFILE HEADER --- */}
            <div className="glass-panel scan-overlay anim-fade-up relative" style={{ borderRadius: 16, padding: '26px 28px', animationDelay: '0.05s' }}>
              <div style={{ position: 'absolute', top: -1, right: -1, width: 20, height: 20, borderTop: '2px solid var(--emerald)', borderRight: '2px solid var(--emerald)', borderRadius: '0 14px 0 0' }} />
              <div style={{ position: 'absolute', bottom: -1, left: -1, width: 20, height: 20, borderBottom: '2px solid rgba(52,211,153,0.3)', borderLeft: '2px solid rgba(52,211,153,0.3)', borderRadius: '0 0 0 14px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                      {selectedPatient.name}
                    </h1>
                    <span className="font-mono" style={{
                      fontSize: 9, padding: '4px 10px', borderRadius: 99, letterSpacing: '0.1em',
                      background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', color: 'var(--emerald)',
                    }}>
                      ✓ ACCESS GRANTED
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
                    {[
                      { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', label: selectedPatient.id },
                      { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: `${selectedPatient.age} yrs · ${selectedPatient.gender}` },
                      { icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', label: `Last visit: ${selectedPatient.lastVisit}` },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={item.icon} />
                        </svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`glass-panel corner-cut ${getStatusClass(selectedPatient.status)}`} style={{ padding: '12px 18px', borderRadius: 10 }}>
                  <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', marginBottom: 5, opacity: 0.7, textTransform: 'uppercase' }}>
                    Clinical Status
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: getStatusDot(selectedPatient.status), boxShadow: `0 0 7px ${getStatusDot(selectedPatient.status)}` }} className="anim-pulse-ring" />
                    <span className="font-display" style={{ fontSize: 13, fontWeight: 600 }}>{selectedPatient.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- VISUALIZED VITALS --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <VitalCard label="Heart Rate" value={selectedPatient.vitals.hr} unit="bpm"
                trend={-1.4} data={vd.hr} color="#34d399" delay="0.1s" />
              <VitalCard label="Blood Pressure" value={selectedPatient.vitals.bp} unit="mmHg"
                trend={0.8} data={vd.bp} color="#fbbf24" delay="0.2s" />
              <VitalCard label="SpO₂" value={selectedPatient.vitals.spo2} unit="%"
                trend={0.5} data={vd.spo2} color="#2dd4bf" delay="0.3s" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>

              <div className="glass-panel glass-panel-hover anim-fade-up" style={{ borderRadius: 14, padding: '20px 18px', animationDelay: '0.25s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <div style={{ width: 3, height: 16, background: 'var(--emerald)', borderRadius: 2 }} />
                  <span className="font-display" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    Treatment Timeline
                  </span>
                </div>
                <TreatmentTimeline patient={selectedPatient} />
              </div>

              {/* --- SECURE READ-ONLY VAULT --- */}
              <div className="glass-panel anim-fade-up" style={{ borderRadius: 14, padding: '20px 22px', animationDelay: '0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--panel-border)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 3, height: 16, background: 'rgba(52,211,153,0.5)', borderRadius: 2 }} />
                      <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Medical Records Vault
                      </h3>
                    </div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-secondary)', paddingLeft: 11, letterSpacing: '0.04em' }}>
                      Uploaded by front desk ·{' '}
                      <span style={{ color: 'var(--emerald)' }}>READ-ONLY</span>
                    </div>
                  </div>

                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(52,211,153,0.06)', border: '1px solid var(--panel-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>

                {selectedPatient.documents.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 10 }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                      NO DOCUMENTS UPLOADED
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedPatient.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="doc-row anim-fade-up"
                        style={{
                          animationDelay: `${0.35 + i * 0.07}s`,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 14px', borderRadius: 10,
                          border: '1px solid var(--panel-border)',
                          background: 'rgba(255,255,255,0.015)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                            background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                              stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              {doc.type === 'Imaging'
                                ? <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>
                                : <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>
                              }
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', marginBottom: 3 }}>
                              {doc.name}
                            </div>
                            <div className="font-mono" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em', display: 'flex', gap: 8 }}>
                              <span style={{ color: 'var(--emerald)', opacity: 0.7 }}>{doc.type}</span>
                              <span>·</span>
                              <span>{doc.date}</span>
                              <span>·</span>
                              <span>{doc.uploadedBy}</span>
                            </div>
                          </div>
                        </div>

                        {/* EXPLICIT READ-ONLY CLEARANCE ACTIONS */}
                        <button
                          style={{
                            padding: '6px 14px', borderRadius: 7, cursor: 'pointer',
                            background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
                            color: 'var(--emerald)', fontSize: 10, fontFamily: 'DM Mono, monospace',
                            letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.2s ease', flexShrink: 0,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.12)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(52,211,153,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          VIEW
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--panel-border)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  {selectedPatient.documents.length} FILE{selectedPatient.documents.length !== 1 ? 'S' : ''} · READ-ONLY CLEARANCE · SMRIS ENCRYPTED
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', position: 'relative', zIndex: 1 }}>
            <EmptyState />
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;