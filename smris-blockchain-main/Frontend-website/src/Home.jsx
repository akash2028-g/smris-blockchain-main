import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { Shield } from 'lucide-react'; // <-- Imported the Shield icon

// Make sure you have these 4 JSON files in your src/assets folder!
import splashAnimation from './assets/animation.json'; 
import vaultAnimation from './assets/vault.json'; 
import telehealthAnimation from './assets/telehealth.json';
import timelineAnimation from './assets/timeline.json';

import './App.css';

const Home = () => {
  const navigate = useNavigate();
  
  const [introState, setIntroState] = useState('playing'); 
  const [activeSlide, setActiveSlide] = useState(0);

  // --- THEME STATE WITH LOCAL STORAGE MEMORY ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('smris-theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smris-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smris-theme', 'light');
    }
  }, [isDarkMode]);

  const finishIntro = () => {
    setIntroState('fading');
    setTimeout(() => {
      setIntroState('hidden');
    }, 1000); 
  };

  // --- CAROUSEL LOGIC ---
  const carouselData = [
    {
      id: 0,
      animation: vaultAnimation,
      topBadge: "Encrypted Vault",
      topIcon: "lock",
      bottomBadge: "Ledger Synced",
      bottomIcon: "sync"
    },
    {
      id: 1,
      animation: telehealthAnimation,
      topBadge: "P2P Active",
      topIcon: "wifi_tethering",
      bottomBadge: "Zero-Knowledge",
      bottomIcon: "fingerprint"
    },
    {
      id: 2,
      animation: timelineAnimation,
      topBadge: "Data Unified",
      topIcon: "account_tree",
      bottomBadge: "Immutable Record",
      bottomIcon: "dataset_linked"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- BULLETPROOF LOTTIE SPLASH SCREEN OVERLAY --- */}
      {introState !== 'hidden' && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: isDarkMode ? '#0b1326' : '#ffffff',
            zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: introState === 'fading' ? 0 : 1, transition: 'opacity 1s ease-in-out'
          }}
        >
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <Lottie animationData={splashAnimation} loop={false} autoplay={true} onComplete={finishIntro} />
          </div>
        </div>
      )}

      {/* --- MAIN SMRIS WEBSITE CONTENT --- */}
      <div className="bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] min-h-screen flex flex-col font-body overflow-x-hidden relative transition-colors duration-300">
        
        {/* Background Animated SVG Mesh */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-20 transition-opacity duration-300">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="100" id="mesh-pattern" patternUnits="userSpaceOnUse" width="100">
                <circle cx="50" cy="50" fill="#00e5ff" r="1"></circle>
                <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#00e5ff" strokeDasharray="2 8" strokeWidth="0.2"></path>
                <path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="#00e5ff" strokeWidth="0.1"></path>
              </pattern>
              <radialGradient cx="50%" cy="50%" id="bg-glow" r="50%">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15"></stop>
                <stop offset="100%" stopColor="#0b1326" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
            <rect className="animate-pulse-slow" fill="url(#bg-glow)" height="100%" width="100%"></rect>
            <rect className="animate-float" fill="url(#mesh-pattern)" height="100%" width="100%"></rect>
          </svg>
        </div>

        {/* TopNavBar */}
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-12 h-20 bg-white/90 dark:bg-[#0b1326]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors duration-300">
          
          {/* ── UPDATED PREMIUM LOGO ── */}
          <div 
            onClick={() => navigate('/')} 
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: 'pointer' }}
            className="hover:opacity-80 transition-opacity"
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00e5ff, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} color="#0b1326" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[17px] tracking-[-0.02em] text-slate-900 dark:text-[#f1f5f9]">
              SMRIS
            </span>
          </div>
          
          {/* ── UPDATED ROUTING LINKS ── */}
          <div className="hidden md:flex gap-8 items-center font-body text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <span onClick={() => navigate('/')} className="cursor-pointer text-cyan-600 dark:text-[#00e5ff] border-b-2 border-cyan-600 dark:border-[#00e5ff] pb-1 transition-colors">Home</span>
            <span onClick={() => navigate('/security')} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors">Security</span>
            <span onClick={() => navigate('/protocol')} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors">Protocol</span>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-slate-500 bg-transparent border-none outline-none hover:bg-slate-200 dark:text-cyan-400 dark:hover:bg-cyan-400/10 transition-colors flex items-center justify-center"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Ghost/Outline Portal Login Button */}
            <button 
              onClick={() => navigate('/auth', { state: { defaultRole: 'patient' } })} 
              className="hidden md:block px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border border-cyan-600 text-cyan-600 bg-transparent hover:bg-cyan-50 dark:border-[#00e5ff] dark:text-[#00e5ff] dark:hover:bg-[#00e5ff]/10"
            >
              Portal Login
            </button>

            {/* Solid Join Network Button */}
            <button onClick={() => navigate('/auth', { state: { defaultRole: 'doctor' } })} className="bg-cyan-500 dark:bg-gradient-to-r dark:from-[#00e5ff] dark:to-[#00b3cc] text-white dark:text-[#0b1326] text-sm font-bold px-5 py-2.5 rounded hover:bg-cyan-600 dark:hover:opacity-90 transition-all uppercase shadow-md dark:shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              Join Network
            </button>
          </div>
        </nav>

        <main className="flex-grow pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-24 relative z-10">
          
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            <div className="flex flex-col gap-8 z-10 relative">
              <div className="hidden dark:block absolute -top-20 -left-20 w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-[#4edea3]/10 border border-emerald-200 dark:border-[#4edea3] text-emerald-700 dark:text-[#4edea3] px-4 py-1.5 rounded-full w-max">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Blockchain Verified</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold font-display text-slate-900 dark:text-[#00e5ff] leading-tight">
                Decentralized Security for Your Health Data
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-[#bac9cc] max-w-2xl leading-relaxed">
                Experience absolute clinical reliability fused with cutting-edge blockchain transparency. SMRIS ensures your sensitive medical data is immutable, protected, and entirely under your control.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={() => navigate('/auth', { state: { defaultRole: 'doctor' } })} className="bg-cyan-500 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] text-white font-bold text-base px-8 py-3.5 rounded hover:bg-cyan-600 dark:hover:opacity-90 transition-all flex items-center gap-2 shadow-md dark:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  Initialize Record
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button onClick={() => navigate('/auth', { state: { defaultRole: 'patient' } })} className="bg-white dark:bg-[#131b2e] border-2 border-cyan-500 dark:border-white/10 text-cyan-600 dark:text-white font-bold text-base px-8 py-3.5 rounded hover:bg-cyan-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 shadow-sm dark:shadow-none">
                  Access Portal
                </button>
              </div>
            </div>

            {/* Smart Auto-Rotating Carousel Box */}
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-white/10 dark:bg-[#131b2e]/60 dark:backdrop-blur-md flex flex-col items-center justify-center p-8 shadow-inner dark:shadow-none transition-all duration-500">
              <div className="hidden dark:block absolute inset-0 bg-gradient-to-tr from-[#060e20] to-[#131b2e] opacity-80 z-0"></div>
              
              <div className="z-10 w-full flex justify-center transition-opacity duration-500" style={{ width: '100%', maxWidth: '350px', margin: '0 auto' }}>
                <Lottie 
                  animationData={carouselData[activeSlide].animation} 
                  loop={true} 
                  autoplay={true} 
                  key={activeSlide} 
                />
              </div>

              <div className="absolute top-6 left-6 bg-white dark:bg-[#0b1326]/80 border border-slate-200 dark:border-[#4edea3]/50 px-4 py-2 rounded-lg flex items-center gap-2 z-20 shadow-sm dark:shadow-none transition-all duration-300">
                <span className="material-symbols-outlined text-emerald-600 dark:text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {carouselData[activeSlide].topIcon}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-[#4edea3] uppercase tracking-wide">
                  {carouselData[activeSlide].topBadge}
                </span>
              </div>

              <div className="absolute bottom-16 right-6 bg-white dark:bg-[#0b1326]/80 border border-slate-200 dark:border-[#00e5ff]/50 px-4 py-2 rounded-lg flex items-center gap-2 z-20 shadow-sm dark:shadow-none transition-all duration-300">
                <span className="material-symbols-outlined text-cyan-600 dark:text-[#00e5ff]">
                  {carouselData[activeSlide].bottomIcon}
                </span>
                <span className="font-mono text-[11px] font-bold text-cyan-600 dark:text-[#00e5ff] uppercase tracking-wide">
                  {carouselData[activeSlide].bottomBadge}
                </span>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {carouselData.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === index 
                        ? 'w-8 bg-cyan-600 dark:bg-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.8)]' 
                        : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-cyan-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Why SMRIS Section */}
          <section className="flex flex-col items-center pt-10">
            <div className="text-center mb-16 max-w-3xl">
              <span className="font-mono text-cyan-600 dark:text-[#00e5ff] font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">Why SMRIS</span>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-6 leading-tight">
                Built for clinics. Powered silently.
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                A medical-grade interface up front. A cryptographic backbone underneath.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              
              <div className="bg-white dark:bg-[#131b2e]/60 border border-slate-200 dark:border-white/10 dark:backdrop-blur-lg p-10 rounded-3xl shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-[#00e5ff]/50 transition-all flex flex-col items-start group">
                <div className="bg-cyan-50 dark:bg-[#00e5ff]/10 p-4 rounded-xl mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-cyan-600 dark:text-[#00e5ff]">concierge</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">
                  Receptionist Orchestration
                </h3>
                <p className="text-slate-600 dark:text-[#bac9cc] leading-relaxed">
                  Hospital staff manage scheduling and uploads. Doctors and patients experience a completely frictionless, zero-learning-curve interface.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131b2e]/60 border border-slate-200 dark:border-white/10 dark:backdrop-blur-lg p-10 rounded-3xl shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-[#4edea3]/50 transition-all flex flex-col items-start group">
                <div className="bg-emerald-50 dark:bg-[#4edea3]/10 p-4 rounded-xl mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-emerald-600 dark:text-[#4edea3]">verified</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">
                  The Invisible Ledger
                </h3>
                <p className="text-slate-600 dark:text-[#bac9cc] leading-relaxed">
                  Patients never pay network fees or manage crypto wallets. Transaction costs are subsidized at the hospital level for pennies via Arbitrum L2.
                </p>
              </div>

              <div className="bg-white dark:bg-[#131b2e]/60 border border-slate-200 dark:border-white/10 dark:backdrop-blur-lg p-10 rounded-3xl shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-[#c0c1ff]/50 transition-all flex flex-col items-start group">
                <div className="bg-indigo-50 dark:bg-[#c0c1ff]/10 p-4 rounded-xl mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-[#c0c1ff]">badge</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-4">
                  Human-Readable UIDs
                </h3>
                <p className="text-slate-600 dark:text-[#bac9cc] leading-relaxed">
                  Say goodbye to complex hexadecimal addresses. Securely search and connect using simple patient and doctor IDs.
                </p>
                <div className="font-mono mt-6 bg-emerald-100 dark:bg-[#4edea3]/10 text-emerald-800 dark:text-[#4edea3] text-[11px] font-bold px-4 py-1.5 rounded-full border border-emerald-200 dark:border-[#4edea3]/30 tracking-widest">
                  PT-8492
                </div>
              </div>

            </div>
          </section>

          {/* THE FLOW SECTION */}
          <section className="flex flex-col items-center pt-24 relative z-10 w-full">
            <div className="text-center mb-16 max-w-3xl">
              <span className="font-mono text-slate-500 dark:text-slate-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">The Flow</span>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                From arrival to access — in minutes.
              </h2>
            </div>

            <div className="relative w-full max-w-5xl mx-auto px-4">
              
              <div className="hidden md:block absolute top-[48px] left-0 w-full z-0 overflow-hidden">
                <svg width="100%" height="4" className="text-emerald-400 dark:text-[#6366f1] opacity-60">
                  <line 
                    x1="0" y1="2" x2="100%" y2="2" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="8, 12" 
                    strokeLinecap="round"
                    className="animate-dash-flow" 
                  />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
                
                <div className="flex flex-col items-center text-center group">
                  <div className="bg-white dark:bg-[#131b2e] border-2 border-slate-100 dark:border-white/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm dark:shadow-none transition-transform duration-300 group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-4xl text-slate-700 dark:text-[#00e5ff]">badge</span>
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">01 · Patient</div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Arrival</h3>
                  <p className="text-sm text-slate-500 dark:text-[#bac9cc] leading-relaxed px-2">
                    Patient is registered with a simple UID.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="bg-white dark:bg-[#131b2e] border-2 border-slate-100 dark:border-white/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm dark:shadow-none transition-transform duration-300 group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-4xl text-slate-700 dark:text-[#00e5ff]">link</span>
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">02 · Staff</div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Connection</h3>
                  <p className="text-sm text-slate-500 dark:text-[#bac9cc] leading-relaxed px-2">
                    Receptionist instantly links Doctor & Patient profiles.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="relative bg-white dark:bg-[#131b2e] border-2 border-slate-100 dark:border-white/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm dark:shadow-none transition-transform duration-300 group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-4xl text-slate-700 dark:text-[#00e5ff]">cloud_upload</span>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-400 dark:bg-[#6366f1] text-white dark:text-white rounded-full p-1 border-4 border-white dark:border-[#0b1326]">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">03 · System</div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Upload</h3>
                  <p className="text-sm text-slate-500 dark:text-[#bac9cc] leading-relaxed px-2">
                    Post-consultation, staff uploads files. The system silently hashes and notarizes on Arbitrum L2.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="relative bg-white dark:bg-[#131b2e] border-2 border-slate-100 dark:border-white/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm dark:shadow-none transition-transform duration-300 group-hover:-translate-y-2">
                    <span className="material-symbols-outlined text-4xl text-slate-700 dark:text-[#00e5ff]">smartphone</span>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-400 dark:bg-[#6366f1] text-white dark:text-white rounded-full p-1 border-4 border-white dark:border-[#0b1326]">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">04 · Patient</div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Access</h3>
                  <p className="text-sm text-slate-500 dark:text-[#bac9cc] leading-relaxed px-2">
                    Patient views immutable records instantly on their secure dashboard.
                  </p>
                </div>

              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-8 gap-6 w-full border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#060e20]/80 font-display text-xs uppercase tracking-widest mt-auto z-40 relative transition-colors duration-300">
          <div className="text-slate-500 dark:text-slate-400 font-semibold">
            © 2026 SMRIS. Secured by Immutable Ledger Technology.
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <a className="text-slate-500 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors" href="#">Privacy Protocol</a>
            <a className="text-slate-500 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors" href="#">Smart Contract Audit</a>
            <a className="text-slate-500 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors" href="#">Node Status</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;