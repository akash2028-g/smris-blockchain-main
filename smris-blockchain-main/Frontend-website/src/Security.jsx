import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  ShieldCheck,
  Database,
  KeyRound,
  FileCheck2,
  Globe,
  Award,
  CheckCircle2,
  Layers,
  Cpu,
  Activity,
  Shield,
  ChevronRight
} from "lucide-react";

/* ─────────────────────────────────────────────
   Inline styles / keyframe animations
───────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cyan:   #0096c7;
    --emerald:#059669;
    --indigo: #4f46e5;
    --navy:   #f8fafc;
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(0, 0, 0, 0.1);
    --text-main: #0f172a;
    --text-muted: #475569;
    --text-dim: #64748b;
    --text-sub: #475569;
    --text-label: rgba(100,116,139,0.8);
    --hero-g1: #0f172a;
    --hero-g2: #0284c7;
    --hero-g3: #0ea5e9;
    --hero-g4: #4f46e5;
    --comp-bg: linear-gradient(135deg, rgba(241,245,249,0.95) 0%, rgba(226,232,240,0.98) 100%);
    --comp-border: rgba(0,0,0,0.08);
    --comp-overlay: linear-gradient(90deg, rgba(0,150,199,0.04) 0%, rgba(79,70,229,0.04) 50%, rgba(5,150,105,0.04) 100%);
    --badge-bg: rgba(0,0,0,0.03);
    --badge-border: rgba(0,0,0,0.08);
    --btn-text: #ffffff;
    --footer-border: rgba(0,0,0,0.06);
    --card-hover-shadow: 0 0 40px rgba(0,150,199,0.1), 0 20px 60px rgba(0,0,0,0.08);
    --accent-highlight: #0096c7;
  }

  html.dark {
    --cyan:   #00e5ff;
    --emerald:#34d399;
    --indigo: #6366f1;
    --navy:   #0b1326;
    --glass-bg: rgba(13, 22, 40, 0.60);
    --glass-border: rgba(255,255,255,0.07);
    --text-main: #f0f6ff;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --text-sub: rgba(180,200,230,0.82);
    --text-label: rgba(180,200,230,0.55);
    --hero-g1: #ffffff;
    --hero-g2: #a5f3fc;
    --hero-g3: #00e5ff;
    --hero-g4: #6366f1;
    --comp-bg: linear-gradient(135deg, rgba(13,22,40,0.9) 0%, rgba(11,19,38,0.95) 100%);
    --comp-border: rgba(255,255,255,0.06);
    --comp-overlay: linear-gradient(90deg, rgba(0,229,255,0.04) 0%, rgba(99,102,241,0.06) 50%, rgba(52,211,153,0.04) 100%);
    --badge-bg: rgba(255,255,255,0.04);
    --badge-border: rgba(255,255,255,0.09);
    --btn-text: #0b1326;
    --footer-border: rgba(255,255,255,0.04);
    --card-hover-shadow: 0 0 40px rgba(0,229,255,0.1), 0 20px 60px rgba(0,0,0,0.4);
    --accent-highlight: #00e5ff;
  }

  body { background: var(--navy); }

  /* Orbs */
  @keyframes floatA {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(60px,-40px) scale(1.08); }
    66%      { transform: translate(-40px, 50px) scale(0.95); }
  }
  @keyframes floatB {
    0%,100% { transform: translate(0,0) scale(1); }
    40%      { transform: translate(-70px, 30px) scale(1.12); }
    70%      { transform: translate(50px,-60px) scale(0.92); }
  }
  @keyframes floatC {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(30px, 70px) scale(1.06); }
  }

  /* Grid fade */
  @keyframes gridDrift {
    0%,100% { opacity: 0.18; }
    50%      { opacity: 0.28; }
  }

  /* Scanline sweep */
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  /* Pulse glow ring */
  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.18); }
    50%      { box-shadow: 0 0 0 12px rgba(0,229,255,0); }
  }

  /* Glow border shimmer */
  @keyframes borderShimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Reveal from bottom */
  @keyframes revealUp {
    from { opacity:0; transform: translateY(32px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* Badge blink */
  @keyframes badgePulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.6; }
  }

  /* Number counter */
  @keyframes countIn {
    from { opacity:0; transform:scale(0.7); }
    to   { opacity:1; transform:scale(1); }
  }

  /* Data stream */
  @keyframes stream {
    0%   { transform: translateY(0); opacity:0.6; }
    100% { transform: translateY(-200px); opacity:0; }
  }

  /* Shield glow pulse */
  @keyframes shieldGlowPulse {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50%      { opacity: 0.35; transform: scale(1.05); }
  }

  /* Shield orbit ring rotation */
  @keyframes orbitSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbitSpinReverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg); }
  }

  /* Shield energy wave */
  @keyframes energyWave {
    0%   { transform: scale(0.8); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  .orb-a { animation: floatA 18s ease-in-out infinite; }
  .orb-b { animation: floatB 22s ease-in-out infinite; }
  .orb-c { animation: floatC 26s ease-in-out infinite; }

  .grid-svg { animation: gridDrift 8s ease-in-out infinite; }

  .reveal-1 { animation: revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .reveal-2 { animation: revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  .reveal-3 { animation: revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
  .reveal-4 { animation: revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
  .reveal-5 { animation: revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.7s both; }

  .badge-blink { animation: badgePulse 2.6s ease-in-out infinite; }

  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
    position: relative;
    overflow: hidden;
  }
  .glass-card::before {
    content:'';
    position:absolute; inset:0; border-radius:20px;
    background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
    pointer-events:none;
  }
  .glass-card:hover {
    border-color: rgba(0,229,255,0.3);
    box-shadow: var(--card-hover-shadow);
    transform: translateY(-4px);
  }

  .pillar-icon-wrap {
    animation: pulseRing 3s ease-in-out infinite;
  }

  .compliance-strip {
    background: var(--comp-bg);
    backdrop-filter: blur(24px);
    border: 1px solid var(--comp-border);
    border-radius: 24px;
    position:relative; overflow:hidden;
  }
  .compliance-strip::after {
    content:'';
    position:absolute; inset:0; border-radius:24px;
    background: var(--comp-overlay);
    pointer-events:none;
  }

  .compliance-badge {
    background: var(--badge-bg);
    border: 1px solid var(--badge-border);
    border-radius:14px;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
    cursor:default;
  }
  .compliance-badge:hover {
    background: rgba(0,229,255,0.07);
    border-color: rgba(0,229,255,0.25);
    transform: translateY(-3px);
  }

  .hero-title-gradient {
    background: linear-gradient(135deg, var(--hero-g1) 0%, var(--hero-g2) 40%, var(--hero-g3) 75%, var(--hero-g4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-number {
    animation: countIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.8s both;
  }

  .scanline-effect {
    animation: scanline 6s linear infinite;
    pointer-events:none;
  }

  .stream-particle {
    animation: stream 3s linear infinite;
  }

  /* ── CTA Button from Protocol Page ── */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    padding: 13px 28px; border-radius: 10px;
    background: linear-gradient(135deg, var(--cyan) 0%, #00b4d8 100%);
    color: var(--btn-text);
    border: none; cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 0 24px rgba(0,229,255,0.3);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(0,229,255,0.5);
  }
`;

/* ─────────────────────────────────────────────
   SVG Grid Background
───────────────────────────────────────────── */
function GridBackground() {
  return (
    <svg
      className="grid-svg absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="rgba(0,229,255,0.07)"
            strokeWidth="0.8"
          />
        </pattern>
        <radialGradient id="gridFade" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="gridMask">
          <rect width="100%" height="100%" fill="url(#gridFade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Animated Orbs
───────────────────────────────────────────── */
function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cyan orb – top-left */}
      <div
        className="orb-a absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: "-200px", left: "-200px",
          background: "radial-gradient(circle, rgba(0,229,255,0.13) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Indigo orb – top-right */}
      <div
        className="orb-b absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: "-100px", right: "-150px",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Emerald orb – bottom-center */}
      <div
        className="orb-c absolute rounded-full"
        style={{
          width: 500, height: 500,
          bottom: "-100px", left: "40%",
          background: "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated Shield Hero Visual
───────────────────────────────────────────── */
function AnimatedShieldHero() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Shield SVG path
  const shieldPath = "M150 10 L280 60 L280 160 C280 230 150 290 150 290 C150 290 20 230 20 160 L20 60 Z";
  // Inner checkmark path
  const checkPath = "M100 155 L135 190 L200 120";

  // Canvas particle deflection system
  const initParticles = useCallback((w, h) => {
    const pts = [];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 160 + Math.random() * 200;
      pts.push({
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        targetX: w / 2,
        targetY: h / 2,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.5,
        deflected: false,
        deflectTimer: 0,
        color: ['0,229,255', '99,102,241', '52,211,153'][Math.floor(Math.random() * 3)],
      });
    }
    return pts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const shieldRadius = 95;
    const cx = w / 2;
    const cy = h / 2;

    particlesRef.current = initParticles(w, h);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        // Drift toward center
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (p.deflected) {
          p.deflectTimer--;
          if (p.deflectTimer <= 0) {
            p.deflected = false;
            // Reset to outer edge
            const angle = Math.random() * Math.PI * 2;
            const resetDist = 160 + Math.random() * 200;
            p.x = cx + Math.cos(angle) * resetDist;
            p.y = cy + Math.sin(angle) * resetDist;
            p.vx = (Math.random() - 0.5) * 0.3;
            p.vy = (Math.random() - 0.5) * 0.3;
          } else {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
          }
        } else {
          // Attract toward center
          p.vx += dx * 0.00015;
          p.vy += dy * 0.00015;
          p.x += p.vx;
          p.y += p.vy;

          // Deflect off shield
          if (dist < shieldRadius) {
            const angle = Math.atan2(p.y - cy, p.x - cx);
            const speed = 2.5 + Math.random() * 2;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.deflected = true;
            p.deflectTimer = 80 + Math.floor(Math.random() * 60);

            // Draw impact flash
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            const flashGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
            flashGrad.addColorStop(0, `rgba(${p.color}, 0.8)`);
            flashGrad.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = flashGrad;
            ctx.fill();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alpha = p.deflected ? Math.max(0.1, p.opacity * (p.deflectTimer / 100)) : p.opacity;
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();

        // Draw trail line toward center when not deflected
        if (!p.deflected && dist < 200) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          const trailX = p.x + (cx - p.x) * 0.15;
          const trailY = p.y + (cy - p.y) * 0.15;
          ctx.lineTo(trailX, trailY);
          ctx.strokeStyle = `rgba(${p.color}, ${alpha * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  // Orbital particle data
  const orbits = [
    { size: 240, duration: 7, dotColor: '#00e5ff', dotSize: 5, tiltX: 65, tiltY: 15, delay: 0 },
    { size: 290, duration: 11, dotColor: '#6366f1', dotSize: 4, tiltX: 75, tiltY: -20, delay: -3, reverse: true },
    { size: 340, duration: 15, dotColor: '#34d399', dotSize: 3.5, tiltX: 55, tiltY: 30, delay: -7 },
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 420,
      height: 360,
      margin: '48px auto 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {/* Layer 4: Canvas Particle Deflection Field */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 2: Pulsing Glow Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`glow-${i}`}
          style={{
            position: 'absolute',
            width: 180 + i * 50,
            height: 180 + i * 50,
            borderRadius: '50%',
            background: [
              'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
            ][i],
            zIndex: 2,
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.3 + i * 0.1, 1],
            opacity: [0.4, 0.08, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Energy wave bursts */}
      {[0, 1].map((i) => (
        <div
          key={`wave-${i}`}
          style={{
            position: 'absolute',
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: '1px solid rgba(0,229,255,0.15)',
            animation: `energyWave 4s ease-out ${i * 2}s infinite`,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Layer 3: Orbiting Data Particles */}
      {orbits.map((orbit, i) => (
        <div
          key={`orbit-${i}`}
          style={{
            position: 'absolute',
            width: orbit.size,
            height: orbit.size,
            perspective: '600px',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transform: `rotateX(${orbit.tiltX}deg) rotateY(${orbit.tiltY}deg)`,
              animation: `${orbit.reverse ? 'orbitSpinReverse' : 'orbitSpin'} ${orbit.duration}s linear infinite`,
              animationDelay: `${orbit.delay}s`,
            }}
          >
            {/* Orbit ring */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `1px solid rgba(${orbit.dotColor === '#00e5ff' ? '0,229,255' : orbit.dotColor === '#6366f1' ? '99,102,241' : '52,211,153'}, 0.08)`,
            }} />
            {/* Orbiting dot */}
            <div style={{
              position: 'absolute',
              top: -orbit.dotSize / 2,
              left: '50%',
              marginLeft: -orbit.dotSize / 2,
              width: orbit.dotSize,
              height: orbit.dotSize,
              borderRadius: '50%',
              background: orbit.dotColor,
              boxShadow: `0 0 ${orbit.dotSize * 3}px ${orbit.dotColor}, 0 0 ${orbit.dotSize * 6}px ${orbit.dotColor}40`,
            }} />
            {/* Second dot on opposite side */}
            <div style={{
              position: 'absolute',
              bottom: -orbit.dotSize / 2,
              left: '50%',
              marginLeft: -orbit.dotSize / 2,
              width: orbit.dotSize * 0.7,
              height: orbit.dotSize * 0.7,
              borderRadius: '50%',
              background: orbit.dotColor,
              opacity: 0.5,
              boxShadow: `0 0 ${orbit.dotSize * 2}px ${orbit.dotColor}60`,
            }} />
          </div>
        </div>
      ))}

      {/* Layer 1: SVG Shield Path-Draw + Inner Icon */}
      <motion.svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
        style={{ position: 'relative', zIndex: 4 }}
      >
        {/* Shield outline - draws itself */}
        <motion.path
          d={shieldPath}
          stroke="url(#shieldStrokeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Shield fill - fades in after outline draws */}
        <motion.path
          d={shieldPath}
          fill="url(#shieldFillGrad)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 2.2 }}
        />

        {/* Inner glow shield (smaller) */}
        <motion.path
          d="M150 35 L260 75 L260 160 C260 220 150 270 150 270 C150 270 40 220 40 160 L40 75 Z"
          stroke="rgba(0,229,255,0.15)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', delay: 1.0 }}
        />

        {/* Checkmark inside shield */}
        <motion.path
          d={checkPath}
          stroke="#00e5ff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 2.8 }}
        />


        {/* Gradients */}
        <defs>
          <linearGradient id="shieldStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="shieldFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,229,255,0.06)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.04)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.06)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Breathing scale wrapper for the whole shield area */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Ambient glow behind shield */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Scroll-triggered reveal wrapper
───────────────────────────────────────────── */
function ScrollReveal({ children, direction = 'up', delay = 0, style = {}, className = '' }) {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: false, amount: 0.15, margin: '-40px' });
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollDir = useRef('down');
  const hasAnimated = useRef(false);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      scrollDir.current = currentY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine offset based on scroll direction
  const getOffset = useCallback(() => {
    if (direction === 'left')  return { x: 60, y: 0 };
    if (direction === 'right') return { x: -60, y: 0 };
    // For vertical: scrolling down → enter from below (y: 50), scrolling up → enter from above (y: -50)
    // For vertical: exiting top (scroll down) → place above; exiting bottom (scroll up) → place below
    return scrollDir.current === 'down' ? { x: 0, y: -50 } : { x: 0, y: 50 };
  }, [direction]);

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1, x: 0, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: hasAnimated.current ? 0 : delay },
      });
      hasAnimated.current = true;
    } else {
      const offset = getOffset();
      controls.start({
        opacity: 0, x: offset.x, y: offset.y, filter: 'blur(6px)',
        transition: { duration: 0.4, ease: 'easeIn' },
      });
    }
  }, [isInView, controls, getOffset, delay]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Hero Section  (side-by-side: text left, shield right)
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative px-6 pt-36 pb-24 max-w-7xl mx-auto"
      style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
    >
      {/* Left column – text content */}
      <div style={{ flex: '1 1 420px', minWidth: 320 }}>
        {/* Badge */}
        <ScrollReveal direction="up" delay={0}>
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{
              background: "rgba(0,229,255,0.08)",
              border: "1px solid rgba(0,229,255,0.25)",
            }}
          >
            <span className="badge-blink">
              <Lock size={13} color="#00e5ff" />
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                color: "#00e5ff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Data Protection Standard
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                background: "rgba(0,229,255,0.18)",
                color: "#00e5ff",
                padding: "2px 8px",
                borderRadius: 99,
                letterSpacing: "0.06em",
              }}
            >
              v3.1
            </span>
          </div>
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal direction="up" delay={0.12}>
          <h1
            className="hero-title-gradient leading-tight mb-6"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Military-Grade Protection
            <br />
            for Medical Records.
          </h1>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal direction="up" delay={0.24}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.05rem",
              color: "var(--text-sub)",
              lineHeight: 1.75,
              maxWidth: 560,
            }}
          >
            In healthcare, a data breach is a critical failure. SMRIS utilizes a{" "}
            <span style={{ color: "var(--accent-highlight)", fontWeight: 600 }}>three-pillar security architecture</span>{" "}
            to ensure patient data remains private, tamper-proof, and entirely under strict access control.
          </p>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal direction="up" delay={0.36}>
          <div className="flex flex-wrap gap-10 mt-14">
            {[
              { value: "256-bit", label: "AES Encryption", color: "#00e5ff" },
              { value: "Zero", label: "Plaintext Exposure", color: "#34d399" },
              { value: "100%", label: "Audit Coverage", color: "#6366f1" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="stat-number"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: s.color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    color: "var(--text-label)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right column – Shield animation */}
      <ScrollReveal direction="right" delay={0.15} style={{ flex: '1 1 380px', minWidth: 300, display: 'flex', justifyContent: 'center' }}>
        <AnimatedShieldHero />
      </ScrollReveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Pillar Card
───────────────────────────────────────────── */
function PillarCard({ icon: Icon, accentColor, tag, title, description, details, delay, index }) {
  return (
    <ScrollReveal direction="up" delay={index * 0.15}>
      <div
        className="glass-card p-8 flex flex-col gap-5"
        style={{ height: '100%' }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div
            className="pillar-icon-wrap flex-shrink-0 flex items-center justify-center rounded-2xl"
            style={{
              width: 56, height: 56,
              background: `rgba(${accentColor}, 0.1)`,
              border: `1px solid rgba(${accentColor}, 0.25)`,
            }}
          >
            <Icon size={26} style={{ color: `rgb(${accentColor})` }} />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: `rgb(${accentColor})`,
              background: `rgba(${accentColor}, 0.1)`,
              border: `1px solid rgba(${accentColor}, 0.2)`,
              padding: "4px 10px",
              borderRadius: 99,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              marginTop: 4,
            }}
          >
            {tag}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-main)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.93rem",
            color: "var(--text-dim)",
            lineHeight: 1.75,
            flexGrow: 1,
          }}
        >
          {description}
        </p>

        {/* Detail bullets */}
        <ul className="flex flex-col gap-2 mt-1">
          {details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <CheckCircle2
                size={15}
                style={{ color: `rgb(${accentColor})`, marginTop: 3, flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.84rem",
                  color: "var(--text-dim)",
                }}
              >
                {d}
              </span>
            </li>
          ))}
        </ul>

        {/* Bottom accent line */}
        <div
          className="h-px w-full mt-2 rounded-full"
          style={{ background: `linear-gradient(90deg, rgb(${accentColor}), transparent)`, opacity: 0.3 }}
        />
      </div>
    </ScrollReveal>
  );
}

/* ─────────────────────────────────────────────
   Three Pillars Section
───────────────────────────────────────────── */
const pillars = [
  {
    icon: Database,
    accentColor: "0,229,255",
    tag: "Pillar I · RLS",
    title: "Row Level Security",
    description:
      "Every PostgreSQL query runs through Supabase Row Level Security policies. A physician can only SELECT, INSERT, or UPDATE rows where their user_id matches the patient's assigned provider — at the database engine level, not the application layer.",
    details: [
      "Policy enforcement at the Postgres engine layer",
      "Zero cross-patient data leakage by default",
      "Role-based isolation: Doctor, Nurse, Admin, Auditor",
    ],
    delay: 0.1,
  },
  {
    icon: Layers,
    accentColor: "99,102,241",
    tag: "Pillar II · Off-Chain",
    title: "Hybrid Data Isolation",
    description:
      "Bulky files (PDFs, DICOM scans, lab reports) are stored in encrypted off-chain vaults. Only the SHA-256 cryptographic hash of each file is anchored on-chain, providing immutable proof-of-integrity without exposing sensitive data to the ledger.",
    details: [
      "Files stored in AES-256 encrypted vault (off-chain)",
      "On-chain hash anchoring for tamper-proof audit trails",
      "Hash mismatch triggers automatic integrity alert",
    ],
    delay: 0.25,
  },
  {
    icon: KeyRound,
    accentColor: "52,211,153",
    tag: "Pillar III · E2EE",
    title: "End-to-End Encryption",
    description:
      "Documents are encrypted on the client device using the patient's derived public key before any byte leaves the browser. The server never receives plaintext. Only the authorized recipient can decrypt and render the record.",
    details: [
      "Client-side encryption before network transmission",
      "X25519 key exchange + AES-GCM 256-bit payload encryption",
      "Server holds zero decryption capability",
    ],
    delay: 0.4,
  },
];

function PillarsSection() {
  return (
    <section className="relative px-6 pb-20 max-w-6xl mx-auto">
      {/* Section label */}
      <ScrollReveal direction="up" delay={0}>
        <div className="text-center mb-12">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(0,229,255,0.6)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Architecture Overview
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--text-main)",
              marginTop: 10,
            }}
          >
            Three Pillars of Trust
          </h2>
        </div>
      </ScrollReveal>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {pillars.map((p, i) => (
          <PillarCard key={p.tag} {...p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Architecture Diagram Strip
───────────────────────────────────────────── */
function ArchitectureDiagramInner() {
  const nodes = [
    { label: "Client Browser", sub: "E2EE locally", icon: Cpu, color: "0,229,255" },
    { label: "API Gateway", sub: "TLS 1.3 transit", icon: Activity, color: "99,102,241" },
    { label: "Postgres + RLS", sub: "Row-level isolation", icon: Database, color: "0,229,255" },
    { label: "Off-chain Vault", sub: "AES-256 at rest", icon: ShieldCheck, color: "52,211,153" },
    { label: "Blockchain Layer", sub: "Hash anchored", icon: Layers, color: "99,102,241" },
  ];

  return (
    <section className="relative px-6 pb-20 max-w-6xl mx-auto">
      <div
        className="glass-card p-8"
        style={{ border: "1px solid rgba(0,229,255,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck size={20} color="#00e5ff" />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-main)",
            }}
          >
            Data Flow Architecture
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(0,229,255,0.6)",
              marginLeft: "auto",
              letterSpacing: "0.1em",
            }}
          >
            ZERO PLAINTEXT EXPOSURE
          </span>
        </div>

        {/* Nodes */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 52, height: 52,
                    background: `rgba(${node.color}, 0.1)`,
                    border: `1px solid rgba(${node.color}, 0.25)`,
                  }}
                >
                  <node.icon size={22} style={{ color: `rgb(${node.color})` }} />
                </div>
                <div className="text-center">
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {node.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      color: `rgba(${node.color}, 0.7)`,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {node.sub}
                  </div>
                </div>
              </div>
              {/* Animated connector arrow – vertically centered with 52px icon */}
              {i < nodes.length - 1 && (
                <div
                  className="hidden sm:flex items-center justify-center"
                  style={{ width: 36, height: 52 }}
                >
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" style={{ overflow: 'visible' }}>
                    <motion.line
                      x1="0" y1="10" x2="18" y2="10"
                      stroke={`rgba(${nodes[i].color}, 0.25)`}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.3, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M16 4 L24 10 L16 16"
                      stroke={`rgb(${nodes[i].color})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ x: -4, opacity: 0 }}
                      animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3,
                      }}
                    />
                    <motion.circle
                      r="2"
                      fill={`rgb(${nodes[i].color})`}
                      initial={{ cx: 0, cy: 10, opacity: 0 }}
                      animate={{ cx: [0, 20], opacity: [0.8, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.8 + i * 0.3,
                      }}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  return (
    <ScrollReveal direction="up" delay={0.1}>
      <ArchitectureDiagramInner />
    </ScrollReveal>
  );
}

/* ─────────────────────────────────────────────
   Compliance Strip
───────────────────────────────────────────── */
const certs = [
  {
    icon: FileCheck2,
    label: "HIPAA",
    sub: "Health Insurance Portability & Accountability Act",
    color: "0,229,255",
  },
  {
    icon: Globe,
    label: "GDPR",
    sub: "General Data Protection Regulation (EU)",
    color: "99,102,241",
  },
  {
    icon: Award,
    label: "SOC 2 Type II",
    sub: "Service Organization Control — Security & Availability",
    color: "52,211,153",
  },
  {
    icon: ShieldCheck,
    label: "ISO 27001",
    sub: "Information Security Management System",
    color: "0,229,255",
  },
];

function ComplianceStripInner() {
  return (
    <section className="relative px-6 pb-28 max-w-6xl mx-auto">
      <div className="compliance-strip p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(52,211,153,0.7)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Regulatory Compliance
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "var(--text-main)",
              marginTop: 10,
            }}
          >
            Built on a Foundation of Trust
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: "var(--text-dim)",
              marginTop: 10,
              maxWidth: 500,
              margin: "12px auto 0",
            }}
          >
            SMRIS is engineered to comply with the world's most stringent healthcare
            and data-privacy standards from day one.
          </p>
        </div>

        {/* Badges */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {certs.map((c) => (
            <div key={c.label} className="compliance-badge flex items-start gap-4 p-5">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width: 46, height: 46,
                  background: `rgba(${c.color}, 0.1)`,
                  border: `1px solid rgba(${c.color}, 0.22)`,
                }}
              >
                <c.icon size={22} style={{ color: `rgb(${c.color})` }} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    color: "var(--text-dim)",
                    marginTop: 3,
                    lineHeight: 1.5,
                  }}
                >
                  {c.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <CheckCircle2 size={15} color="#34d399" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(52,211,153,0.7)",
              letterSpacing: "0.08em",
            }}
          >
            Audited annually by independent third-party security firms
          </span>
        </div>
      </div>
    </section>
  );
}

function ComplianceStrip() {
  return (
    <ScrollReveal direction="up" delay={0.1}>
      <ComplianceStripInner />
    </ScrollReveal>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function Security() {
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

  return (
    <>
      <style>{globalStyles}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          fontFamily: "'Inter', sans-serif",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        {/* Layer 0 – Grid */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <GridBackground />
        </div>

        {/* Layer 1 – Orbs */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <Orbs />
        </div>

        {/* Subtle scanline sweep */}
        <div
          className="scanline-effect"
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.08), transparent)",
            zIndex: 1,
          }}
        />

        {/* ── SMRIS ROUTED NAVBAR ── */}
        <nav
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            transition: "all 0.3s ease",
            background: scrolled ? "var(--glass-bg)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
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
              SECURITY
            </span>
          </div>

          <div className="hidden md:flex gap-8 items-center font-body text-sm font-medium absolute left-1/2 -translate-x-1/2">
            <span onClick={() => navigate('/')} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors">Home</span>
            <span onClick={() => navigate('/security')} className="cursor-pointer text-cyan-600 dark:text-[#00e5ff] border-b-2 border-cyan-600 dark:border-[#00e5ff] pb-1 transition-colors">Security</span>
            <span onClick={() => navigate('/protocol')} className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00e5ff] transition-colors">Protocol</span>
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

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <HeroSection />
          <PillarsSection />
          <ArchitectureDiagram />
          <ComplianceStrip />
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid var(--footer-border)", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10, flexWrap: "wrap", gap: 20 }}>
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
    </>
  );
}