import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  Lock,
  Globe,
  ChevronRight,
  Activity,
  Database,
  Key,
  Eye,
  Check,
  ArrowRight,
  Cpu,
  GitBranch,
  Layers,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Inline styles & keyframe animations
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    --cyan:    #0096c7;
    --indigo:  #4f46e5;
    --navy:    #f8fafc;
    --navy-2:  #f1f5f9;
    --navy-3:  #e2e8f0;
    --glass:   rgba(255, 255, 255, 0.85);
    --border:  rgba(0, 0, 0, 0.1);
    --border-i: rgba(0, 0, 0, 0.1);
    --text-main: #0f172a;
    --text-muted: #475569;
    --text-dim: #64748b;
    --glass-card: rgba(255, 255, 255, 0.8);
    --glass-hover: rgba(255, 255, 255, 0.95);
    --hero-g1: #0f172a;
    --hero-g2: #0284c7;
    --hero-g3: #0ea5e9;
    --hero-g4: #4f46e5;
  }

  html.dark {
    --cyan:    #00e5ff;
    --indigo:  #6366f1;
    --navy:    #0b1326;
    --navy-2:  #0d1630;
    --navy-3:  #111d3a;
    --glass:   rgba(13, 22, 48, 0.65);
    --border:  rgba(0, 229, 255, 0.12);
    --border-i: rgba(99, 102, 241, 0.18);
    --text-main: #f1f5f9;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --glass-card: var(--glass);
    --glass-hover: rgba(13, 22, 48, 0.85);
    --hero-g1: #ffffff;
    --hero-g2: #a5f3fc;
    --hero-g3: #00e5ff;
    --hero-g4: #6366f1;
  }

  .protocol-wrapper {
    background: var(--navy); 
    color: var(--text-main);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* ── Grid background ── */
  .grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
  }

  /* ── Orb animations ── */
  @keyframes floatA {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.08); }
    66%      { transform: translate(-20px,20px) scale(0.96); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(-40px,30px) scale(1.12); }
    70%      { transform: translate(25px,-15px) scale(0.94); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(15px,40px) scale(1.06); }
  }
  .orb-a { animation: floatA 18s ease-in-out infinite; }
  .orb-b { animation: floatB 22s ease-in-out infinite; }
  .orb-c { animation: floatC 14s ease-in-out infinite; }

  /* ── Border shimmer ── */
  @keyframes borderShimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .shimmer-border {
    background: linear-gradient(135deg, rgba(0,229,255,0.15), rgba(99,102,241,0.15), rgba(0,229,255,0.15));
    background-size: 200% 200%;
    animation: borderShimmer 5s ease infinite;
  }

  /* ── Scan line ── */
  @keyframes scanLine {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  .scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    animation: scanLine 4s linear infinite;
  }

  /* ── Fade-up on scroll ── */
  .fade-up {
    opacity: 0; transform: translateY(32px);
    transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1);
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  /* ── Neon text ── */
  .neon-cyan   { color: var(--cyan);   text-shadow: 0 0 24px rgba(0,229,255,0.55); }
  .neon-indigo { color: var(--indigo); text-shadow: 0 0 24px rgba(99,102,241,0.55); }

  /* ── Glass card ── */
  .glass-card {
    background: var(--glass-card);
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    border: 1px solid var(--border);
    border-radius: 16px;
  }
  .glass-card:hover { border-color: rgba(0,229,255,0.3); }

  /* ── Tag ── */
  .tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 999px;
    border: 1px solid rgba(0,229,255,0.3);
    background: rgba(0,229,255,0.07);
    color: var(--cyan);
  }

  /* ── CTA button ── */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    padding: 13px 28px; border-radius: 10px;
    background: linear-gradient(135deg, var(--cyan) 0%, #00b4d8 100%);
    color: #ffffff;
    border: none; cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 0 24px rgba(0,229,255,0.3);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(0,229,255,0.5);
  }
  .btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
    padding: 13px 28px; border-radius: 10px;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid rgba(148,163,184,0.4); cursor: pointer;
    transition: all 0.25s ease;
  }
  .btn-secondary:hover { color: var(--text-main); border-color: rgba(148,163,184,0.8); transform: translateY(-2px); }

  /* ── Gradient text ── */
  .gradient-text {
    background: linear-gradient(135deg, var(--cyan) 0%, #a5b4fc 50%, var(--indigo) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function AnimatedOrbs() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="orb-a absolute" style={{ top: "-10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="orb-b absolute" style={{ bottom: "5%", right: "10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="orb-c absolute" style={{ top: "40%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />
    </div>
  );
}

function StatCard({ value, label, accent = "cyan" }) {
  const color = accent === "cyan" ? "var(--cyan)" : "var(--indigo)";
  return (
    <div className="glass-card" style={{ padding: "24px 28px", textAlign: "center", flex: "1 1 0", minWidth: 0 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color, lineHeight: 1.1, marginBottom: 6, textShadow: `0 0 24px ${color}80` }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--text-dim)", fontWeight: 500, letterSpacing: "0.04em" }}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body, accent = "cyan" }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = accent === "cyan" ? "var(--cyan)" : "var(--indigo)";
  const glowColor = accent === "cyan" ? "rgba(0,229,255,0.15)" : "rgba(99,102,241,0.15)";

  return (
    <div
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px 28px",
        transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 60px ${glowColor}` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: hovered ? 1 : 0, transition: "opacity 0.35s", background: `radial-gradient(ellipse 60% 50% at 50% -10%, ${glowColor}, transparent)` }} />
      <div style={{ width: 48, height: 48, borderRadius: 12, border: `1px solid ${accentColor}40`, background: `${accentColor}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative" }}>
        <Icon size={22} color={accentColor} />
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text-main)", marginBottom: 10, letterSpacing: "-0.02em", position: "relative" }}>{title}</h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.65, position: "relative" }}>{body}</p>
    </div>
  );
}

const STEPS = [
  {
    num: "01", icon: Activity, label: "Ingestion",
    color: "var(--cyan)",
    desc: "Patient records enter the SMRIS pipeline through secure APIs. Data is normalized, de-identified where required, and validated against medical schemas before any downstream processing.",
    chips: ["FHIR R4", "HL7 v2.7", "REST / HL7"],
  },
  {
    num: "02", icon: Cpu, label: "Cryptographic Hashing",
    color: "#a5b4fc",
    desc: "Every record is deterministically hashed using SHA-256 with a salt derived from the patient's zero-knowledge identity commitment. The hash acts as a tamper-evident fingerprint.",
    chips: ["SHA-256", "ZK Identity", "Salted Digest"],
  },
  {
    num: "03", icon: GitBranch, label: "Ledger Anchoring",
    color: "var(--indigo)",
    desc: "The record hash is anchored to Arbitrum One in a single subsidized transaction. Gas fees are abstracted entirely through our paymaster contract — patients never touch crypto.",
    chips: ["Arbitrum L2", "EIP-4337", "Paymaster"],
  },
  {
    num: "04", icon: Key, label: "Secure Access",
    color: "#34d399",
    desc: "Providers retrieve records via role-based access control enforced on-chain. Every read is audited, consent-gated, and logged immutably — compliant with standard regulations.",
    chips: ["RBAC On-chain", "HIPAA", "Audit Log"],
  },
];

function Timeline() {
  const [active, setActive] = useState(null);
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.15 });
    refs.current.forEach(r => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Vertical connector line */}
      <div style={{ position: "absolute", left: 31, top: 48, bottom: 48, width: 2, background: "linear-gradient(180deg, var(--cyan), #a5b4fc, var(--indigo), #34d399)", opacity: 0.25, borderRadius: 1 }} />

      {STEPS.map((step, i) => (
        <div
          key={step.num}
          ref={el => refs.current[i] = el}
          className="fade-up"
          style={{ transitionDelay: `${i * 0.12}s`, display: "flex", gap: 28, padding: "20px 0", cursor: "pointer" }}
          onClick={() => setActive(active === i ? null : i)}
        >
          {/* Icon column */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: 16, border: `2px solid ${active === i ? step.color : "rgba(0,229,255,0.15)"}`,
                background: active === i ? `${step.color}15` : "rgba(13,22,48,0.8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: active === i ? `0 0 24px ${step.color}50` : "none",
                position: "relative", zIndex: 1,
              }}
            >
              <step.icon size={26} color={active === i ? step.color : "var(--text-muted)"} style={{ transition: "color 0.3s" }} />
            </div>
          </div>

          {/* Content */}
          <div className="glass-card" style={{ flex: 1, padding: "24px 28px", transition: "all 0.35s ease", borderColor: active === i ? `${step.color}40` : "var(--border)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: step.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>Step {step.num}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.02em" }}>{step.label}</h3>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" style={{ transform: active === i ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s", marginTop: 4 }} />
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7, maxHeight: active === i ? 120 : 0, overflow: "hidden", transition: "max-height 0.4s ease", marginBottom: active === i ? 16 : 0 }}>
              {step.desc}
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {step.chips.map(chip => (
                <span key={chip} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 999, border: `1px solid ${step.color}30`, background: `${step.color}08`, color: step.color }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComplianceBadge({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.06)" }}>
      <Check size={14} color="#34d399" />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function Protocol() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

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
    window.scrollTo(0, 0); // Scroll to top on mount

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="protocol-wrapper">
      <style>{STYLES}</style>
      <div className="grid-bg" />
      <AnimatedOrbs />

      {/* ── SMRIS ROUTED NAVBAR ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "all 0.3s ease",
          background: scrolled ? "var(--glass)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          padding: "0 32px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--cyan), var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={16} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            SMRIS
          </span>
          <span className="hidden md:inline-block" style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: "var(--cyan)", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 4, padding: "2px 7px", marginLeft: 4, letterSpacing: "0.06em" }}>
            PROTOCOL
          </span>
        </div>

        <div className="hidden md:flex gap-8 items-center font-body text-sm font-medium absolute left-1/2 -translate-x-1/2">
          <span onClick={() => navigate('/')} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors">Home</span>
          <span onClick={() => navigate('/security')} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors">Security</span>
          <span onClick={() => navigate('/protocol')} className="cursor-pointer text-cyan-600 dark:text-[#00e5ff] border-b-2 border-cyan-600 dark:border-[#00e5ff] pb-1 transition-colors">Protocol</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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

          <button onClick={() => navigate('/auth')} className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
            Request Access <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      <main style={{ position: "relative", zIndex: 10 }}>

        {/* ── HERO ── */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div className="scan-line" />
          </div>

          <div className="tag fade-up visible" style={{ marginBottom: 32 }}>
            <Zap size={12} />
            Web2.5 Healthcare Infrastructure
          </div>

          <h1 className="fade-up visible" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 700, lineHeight: 1.0,
            letterSpacing: "-0.04em",
            color: "var(--text-main)",
            maxWidth: 900,
            transitionDelay: "0.1s",
          }}>
            The <span className="gradient-text">SMRIS</span><br />Protocol
          </h1>

          <p className="fade-up visible" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(16px, 2.2vw, 20px)",
            color: "var(--text-dim)",
            maxWidth: 580,
            lineHeight: 1.65,
            marginTop: 28,
            transitionDelay: "0.2s",
          }}>
            Immutable, Subsidized, Frictionless <span style={{ color: "var(--text-muted)" }}>Web2.5 Healthcare.</span>
          </p>

          <div className="fade-up visible" style={{ display: "flex", gap: 14, marginTop: 44, transitionDelay: "0.3s", flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => {
               document.getElementById('architecture').scrollIntoView({ behavior: 'smooth' });
            }} className="btn-primary">
              Explore the Protocol <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/auth')} className="btn-secondary">
              Initialize Record
            </button>
          </div>

          <div className="fade-up visible" style={{ display: "flex", flexWrap: 'wrap', gap: 16, marginTop: 72, width: "100%", maxWidth: 700, transitionDelay: "0.4s" }}>
            <StatCard value="0¢" label="Gas Fees for Patients" accent="cyan" />
            <StatCard value="< 2s" label="On-chain Anchoring" accent="indigo" />
            <StatCard value="100%" label="HIPAA Compliant" accent="cyan" />
            <StatCard value="∞" label="Audit Trail Depth" accent="indigo" />
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(transparent, var(--navy))", pointerEvents: "none" }} />
        </section>

        {/* ── FEATURE HIGHLIGHT ── */}
        <section id="architecture" style={{ padding: "80px 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>

            <div>
              <div className="tag fade-up" style={{ marginBottom: 24 }}>
                <Globe size={12} />
                Zero-Friction Architecture
              </div>
              <h2 className="fade-up" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-main)", lineHeight: 1.1, marginBottom: 20, transitionDelay: "0.1s" }}>
                Seamless Health, <span className="neon-cyan">Zero Friction.</span>
              </h2>
              <p className="fade-up" style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75, marginBottom: 28, transitionDelay: "0.15s" }}>
                We abstract every blockchain interaction behind familiar healthcare workflows. Patients never pay gas fees or manage crypto wallets — ever. Our <span style={{ color: "var(--text-muted)" }}>Arbitrum L2 paymaster</span> covers all transaction costs, making on-chain record anchoring completely invisible to end-users.
              </p>
              <p className="fade-up" style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75, marginBottom: 36, transitionDelay: "0.2s" }}>
                Providers interact through their existing EHR systems. SMRIS acts as a trusted layer translating Web2 actions into cryptographically verified, immutable on-chain events.
              </p>

              <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12, transitionDelay: "0.25s" }}>
                {[
                  "EIP-4337 Account Abstraction — no seed phrases",
                  "Paymaster-subsidized gas on Arbitrum One",
                  "FHIR-native API — works with Epic, Cerner, Athena",
                  "Full Web2 UX with Web3 guarantees",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                      <Check size={10} color="var(--cyan)" />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-muted)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up" style={{ transitionDelay: "0.15s" }}>
              <div className="glass-card shimmer-border" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                  <div style={{ marginLeft: "auto", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em" }}>SMRIS Paymaster Node</div>
                </div>

                {[
                  { label: "Record Ingested", hash: "0x4f3a…1bc2", gas: "Subsidized", status: "cyan" },
                  { label: "Hash Committed", hash: "0x9e2d…ff01", gas: "Subsidized", status: "indigo" },
                  { label: "Arbitrum Anchored", hash: "0x1a7c…83e9", gas: "Subsidized", status: "green" },
                  { label: "Access Granted", hash: "0xc3b5…2210", gas: "Subsidized", status: "cyan" },
                ].map((tx, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: tx.status === "cyan" ? "var(--cyan)" : tx.status === "indigo" ? "var(--indigo)" : "#34d399", boxShadow: `0 0 8px currentColor` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 2 }}>{tx.label}</div>
                      <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 11, color: "var(--text-muted)" }}>{tx.hash}</div>
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)", whiteSpace: "nowrap" }}>
                      {tx.gas}
                    </div>
                  </div>
                ))}
                <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE CARDS ── */}
        <section style={{ padding: "60px 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag fade-up" style={{ margin: "0 auto 20px" }}>
              <Layers size={12} />
              Core Capabilities
            </div>
            <h2 className="fade-up" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-main)", transitionDelay: "0.1s" }}>
              Infrastructure Built for <span className="neon-indigo">Trust</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            <FeatureCard icon={Shield} accent="cyan" title="Immutable Audit Trail" body="Every record access, modification, and share is anchored on-chain. No record can be altered retroactively — providing court-admissible audit logs by default." />
            <FeatureCard icon={Database} accent="indigo" title="Subsidized Gas Model" body="SMRIS operates a paymaster node on Arbitrum One. Institutional subscriptions cover all gas costs, so patients and providers never interact with crypto." />
            <FeatureCard icon={Eye} accent="cyan" title="Consent-Gated Access" body="Granular, on-chain consent controls let patients decide precisely who can access which records, with revocation in real time." />
            <FeatureCard icon={Lock} accent="indigo" title="Zero-Knowledge Identity" body="Patient identities are represented as ZK commitments. Providers verify eligibility without ever seeing raw PII — privacy by cryptographic construction." />
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{ padding: "60px 24px 100px", maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag fade-up" style={{ margin: "0 auto 20px" }}>
              <Activity size={12} />
              Record Lifecycle
            </div>
            <h2 className="fade-up" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-main)", transitionDelay: "0.1s" }}>
              From Ingestion to <span className="neon-cyan">Immutable Access</span>
            </h2>
            <p className="fade-up" style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "var(--text-dim)", maxWidth: 500, margin: "16px auto 0", lineHeight: 1.7, transitionDelay: "0.2s" }}>
              Click any step to explore the technical details behind each phase of the SMRIS protocol.
            </p>
          </div>
          <Timeline />
        </section>

        {/* ── COMPLIANCE STRIP ── */}
        <section style={{ padding: "60px 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
          <div className="glass-card fade-up" style={{ padding: "48px 56px", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ maxWidth: 400 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.025em", marginBottom: 12 }}>
                Built for Regulated Environments
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.7 }}>
                SMRIS is designed from first principles to satisfy the most demanding regulatory requirements in healthcare — without compromising on developer or patient experience.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, width: "100%", maxWidth: 400 }}>
              {["HIPAA Compliant", "GDPR Ready", "SOC 2 Type II", "HL7 FHIR R4", "ISO 27001", "21 CFR Part 11"].map(b => (
                <ComplianceBadge key={b} label={b} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "60px 24px 140px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div className="tag fade-up" style={{ margin: "0 auto 28px" }}>
            <Zap size={12} />
            Early Access
          </div>
          <h2 className="fade-up" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, letterSpacing: "-0.035em", color: "var(--text-main)", maxWidth: 700, margin: "0 auto 20px", lineHeight: 1.1, transitionDelay: "0.1s" }}>
            Ready to anchor your records <span className="gradient-text">on-chain?</span>
          </h2>
          <p className="fade-up" style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "var(--text-dim)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7, transitionDelay: "0.2s" }}>
            Join healthcare organizations already using SMRIS to deliver immutable, privacy-preserving medical records infrastructure.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", transitionDelay: "0.3s" }}>
            <button onClick={() => navigate('/auth')} className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
              Request Early Access <ArrowRight size={16} />
            </button>
            <button onClick={() => window.location.href = "mailto:admin@smris.com"} className="btn-secondary" style={{ fontSize: 15 }}>
              Talk to an Engineer
            </button>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10, flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, var(--cyan), var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={13} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text-muted)" }}>SMRIS</span>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-dim)" }}>
          © 2026 SMRIS. Secured by Immutable Ledger Technology.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Security"].map(l => (
            <a key={l} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--text-dim)", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "var(--text-main)"}
              onMouseLeave={e => e.target.style.color = "var(--text-dim)"}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}