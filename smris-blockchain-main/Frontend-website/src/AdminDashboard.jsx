import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Database, Shield, Check, X, Terminal, Server, Power } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Drift particles state (client-side generation to avoid hydration mismatch)
  const [particles, setParticles] = useState([]);

  // --- THEME STATE WITH LOCAL STORAGE MEMORY ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('smris-theme');
    // Default to dark if not set
    if (savedTheme === null) return true;
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

  useEffect(() => {
    const newParticles = [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 100 + 50}px`,
      height: `${Math.random() * 100 + 50}px`,
      animationDuration: `${Math.random() * 15 + 15}s`,
      animationDelay: `-${Math.random() * 15}s`
    }));
    setParticles(newParticles);
  }, []);

  const stats = [
    { label: 'Active Nodes', value: '24/24', icon: <Server />, color: 'text-blue-400', border: 'border-blue-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
    { label: 'Pending Staff Verifications', value: '3', icon: <Users />, color: 'text-rose-400', border: 'border-rose-500/30', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]' },
    { label: 'L2 Paymaster Gas', value: '1.45 ETH', icon: <Activity />, color: 'text-amber-400', border: 'border-amber-500/20', shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.15)]' },
    { label: 'Total Encrypted Records', value: '14,293', icon: <Database />, color: 'text-emerald-400', border: 'border-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.15)]' }
  ];

  const pendingStaff = [
    { id: 'DR-1104', name: 'Dr. Sarah Hastings', role: 'Cardiology', time: '10m ago' },
    { id: 'RC-9022', name: 'James Wilson', role: 'Front Desk', time: '1h ago' },
    { id: 'DR-8831', name: 'Dr. Marcus Chen', role: 'Neurology', time: '2h ago' }
  ];

  const logs = [
    { time: '10:42:01', status: 'SUCCESS', message: 'Node Hash Sync completed', color: 'text-emerald-400' },
    { time: '10:38:15', status: 'LINK', message: 'PT-8492 linked to DR-1104', color: 'text-blue-400' },
    { time: '10:35:59', status: 'ALERT', message: 'Failed access attempt: RC-9022 (Unauthorized resource)', color: 'text-rose-400' },
    { time: '10:30:22', status: 'WARN', message: 'L2 Gas below 1.5 ETH threshold', color: 'text-amber-400' },
    { time: '10:15:00', status: 'SUCCESS', message: 'Batch encryption verify (4,291 records)', color: 'text-emerald-400' },
    { time: '09:59:12', status: 'SUCCESS', message: 'System backup initialized to cold storage', color: 'text-emerald-400', opacity: 'opacity-50' }
  ];

  return (
    <div className="relative min-h-screen dark:bg-[#0b1326] bg-slate-50 dark:text-slate-200 text-slate-800 overflow-hidden font-['Inter'] selection:bg-rose-500/30">
      {/* Upward Drift Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-rose-500/5 blur-[50px]"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animation: `drift-up ${p.animationDuration} linear infinite`,
              animationDelay: p.animationDelay
            }}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes drift-up {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(244, 63, 94, 0.15);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(244, 63, 94, 0.05);
        }
        html.dark .glass-panel {
          background: rgba(11, 19, 38, 0.4);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(244, 63, 94, 0.05);
        }
        .glass-shard {
          background: rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
        }
        html.dark .glass-shard {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(11, 19, 38, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 63, 94, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 63, 94, 0.4);
        }
      `}} />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 h-screen overflow-y-auto custom-scrollbar">
        
        {/* The Floating Nexus (Header) */}
        <header 
          className="glass-panel rounded-full px-6 py-4 flex flex-col sm:flex-row justify-between items-center mx-auto mt-4 max-w-5xl sticky top-4 z-50 gap-4"
          style={{ animation: 'float-0 6s ease-in-out infinite' }}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-rose-500/20 rounded-full border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
              <Shield className="w-6 h-6 text-rose-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] dark:text-white text-slate-900 tracking-wide">
              SMRIS Master Control
            </h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 dark:bg-[#0b1326]/80 bg-slate-50/80 rounded-full border border-rose-500/20 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_#fb7185]" />
              <span className="text-sm dark:text-slate-300 text-slate-700 font-['JetBrains_Mono']">System: Online</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-rose-200 font-['JetBrains_Mono'] bg-rose-500/10 px-3 py-1.5 rounded-md border border-rose-500/30 text-sm font-medium shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                ADM-001
              </span>
              
              {/* Theme Toggle Button */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full dark:bg-white/5 bg-black/5 hover:bg-rose-500/20 dark:text-slate-400 text-slate-600 hover:text-rose-300 border border-transparent hover:border-rose-500/30 transition-all duration-300 flex items-center justify-center"
                title="Toggle Theme"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              <button 
                onClick={() => navigate('/')} 
                className="p-2.5 rounded-full dark:bg-white/5 bg-black/5 hover:bg-rose-500/20 dark:text-slate-400 text-slate-600 hover:text-rose-300 border border-transparent hover:border-rose-500/30 transition-all duration-300"
                title="Logout"
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Levitating Telemetry (Stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-2">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`glass-panel rounded-2xl p-6 flex flex-col gap-4 border ${stat.border}`}
              style={{ animation: `float-${idx % 4} ${5 + idx}s ease-in-out infinite` }}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl dark:bg-[#0b1326] bg-slate-50 ${stat.shadow} border dark:border-slate-700/50 border-slate-300`}>
                  {React.cloneElement(stat.icon, { className: `w-6 h-6 ${stat.color}` })}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold font-['Space_Grotesk'] dark:text-white text-slate-900 mb-1 tracking-tight drop-shadow-md">
                  {stat.value}
                </div>
                <div className="text-sm dark:text-slate-400 text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lower Dashboard Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-2 pb-12">
          
          {/* Identity Verification Orbit */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-xl font-['Space_Grotesk'] font-bold dark:text-white text-slate-900 flex items-center gap-3 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
              Identity Verification Orbit
            </h2>
            <div className="space-y-4">
              {pendingStaff.map((staff, idx) => (
                <div 
                  key={staff.id}
                  className="glass-shard rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-rose-500/5 hover:border-rose-500/30 transition-all duration-300 group"
                  style={{ animation: `float-${(idx + 1) % 4} ${6 + idx * 0.5}s ease-in-out infinite` }}
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-rose-500/20 to-rose-900/20 border border-rose-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)] group-hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                      <Users className="w-5 h-5 text-rose-300" />
                    </div>
                    <div>
                      <h3 className="dark:text-white text-slate-900 font-bold text-base sm:text-lg tracking-wide">{staff.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mt-1.5">
                        <span className="text-rose-200 font-['JetBrains_Mono'] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-xs">
                          {staff.id}
                        </span>
                        <span className="dark:text-slate-400 text-slate-600 text-xs sm:text-sm">{staff.role}</span>
                        <span className="dark:text-slate-500 text-slate-500 text-xs">• {staff.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 sm:ml-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-rose-50 bg-rose-600/20 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] flex items-center justify-center gap-2 text-sm font-medium">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button className="p-2 rounded-lg dark:text-slate-400 text-slate-600 border dark:border-slate-700/50 border-slate-300 hover:bg-slate-800 hover:text-white dark:hover:border-slate-500 transition-all flex items-center justify-center" title="Reject">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Holographic Audit Log */}
          <div className="glass-panel rounded-2xl flex flex-col overflow-hidden h-[450px]" style={{ animation: 'float-2 7s ease-in-out infinite' }}>
            <div className="px-6 py-4 border-b border-rose-500/20 dark:bg-[#0b1326]/60 bg-slate-50/60 flex items-center gap-3 backdrop-blur-md">
              <Terminal className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-['Space_Grotesk'] font-bold dark:text-white text-slate-900 tracking-wide">Holographic Audit Log</h2>
            </div>
            <div className="p-6 flex-1 bg-gradient-to-b dark:from-[#050a14]/80 dark:to-[#0b1326]/90 from-slate-100/80 to-slate-200/90 font-['JetBrains_Mono'] text-xs sm:text-sm space-y-4 overflow-y-auto custom-scrollbar relative">
               <div className="space-y-4 dark:text-slate-400 text-slate-700 pb-8">
                 {logs.map((log, idx) => (
                   <div key={idx} className={`flex gap-3 items-start ${log.opacity || ''} hover:bg-white/5 p-1 -mx-1 rounded transition-colors`}>
                     <span className="text-rose-400/70 shrink-0">[{log.time}]</span>
                     <span className={`${log.color} shrink-0 w-16`}>{log.status}</span>
                     <span className="dark:text-slate-300 text-slate-800 break-words">{log.message}</span>
                   </div>
                 ))}
                 {/* Decorative cursor */}
                 <div className="flex gap-3 items-start animate-pulse mt-2">
                    <span className="text-rose-400/50">_</span>
                 </div>
               </div>
               {/* Fading bottom edge overlay */}
               <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-t dark:from-[#0b1326] from-slate-200 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;