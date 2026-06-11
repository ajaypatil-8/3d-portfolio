'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, useCallback, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { useTheme } from '@/components/providers/ThemeProvider'
import Image from 'next/image'

gsap.registerPlugin(ScrollToPlugin)

type Theme = 'dark' | 'light'

/* ─── Typewriter ─────────────────────────────────────────────────────────── */
const ROLES = [
  'Java Full Stack Developer',
  'Spring Boot Engineer',
  'React & Next.js Dev',
  'Cloud & Docker Enthusiast',
]

function Typewriter({ texts, delay = 0 }: { texts: string[]; delay?: number }) {
  const [display, setDisplay] = useState('')
  const [idx,     setIdx]     = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [del,     setDel]     = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const cur = texts[idx]
    if (!del && charIdx <= cur.length) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c + 1) }, 55)
      return () => clearTimeout(t)
    }
    if (!del && charIdx > cur.length) {
      const t = setTimeout(() => setDel(true), 2400)
      return () => clearTimeout(t)
    }
    if (del && charIdx >= 0) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c - 1) }, 28)
      return () => clearTimeout(t)
    }
    setDel(false)
    setIdx(i => (i + 1) % texts.length)
    setCharIdx(0)
  }, [started, charIdx, del, idx, texts])

  return (
    <span>
      {display}
      <span
        aria-hidden
        style={{
          display: 'inline-block', width: '2px', height: '1em',
          background: '#a855f7', marginLeft: '2px',
          verticalAlign: 'text-bottom',
          animation: 'tw-blink 1s step-end infinite',
          borderRadius: '1px',
        }}
      />
    </span>
  )
}

/* ─── Orb Background (pure CSS, zero canvas) ─────────────────────────────── */
const OrbBackground = memo(function OrbBackground({ theme }: { theme: Theme }) {
  const dark = theme === 'dark'
  const orbs = [
    { color: dark ? '#7c3aed' : '#a78bfa', x: '15%', y: '20%', size: 600, dur: 18 },
    { color: dark ? '#db2777' : '#ec4899', x: '70%', y: '15%', size: 500, dur: 22 },
    { color: dark ? '#0d9488' : '#14b8a6', x: '80%', y: '65%', size: 550, dur: 26 },
    { color: dark ? '#1d4ed8' : '#3b82f6', x: '10%', y: '70%', size: 450, dur: 20 },
    { color: dark ? '#9333ea' : '#c084fc', x: '50%', y: '50%', size: 400, dur: 30 },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, contain: 'layout paint' }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: orb.x, top: orb.y,
            width: orb.size, height: orb.size,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}${dark ? '28' : '1a'} 0%, transparent 70%)`,
            animation: `orb-float-${i} ${orb.dur}s ease-in-out infinite alternate`,
            willChange: 'transform',
          }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: dark ? 0.055 : 0.07 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={dark ? '#ffffff' : '#000000'} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-secondary), transparent)' }} />
    </div>
  )
})

/* ─── Profile Card ───────────────────────────────────────────────────────── */
const ProfileCard = memo(function ProfileCard({ theme }: { theme: Theme }) {
  const dark = theme === 'dark'
  const size = 'clamp(200px, 26vw, 320px)'
  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ opacity: 0, scale: 0.88, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Spinning aurora ring */}
      <div style={{
        position: 'absolute', inset: '-3px', borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #ff5fa0, #a855f7, #4ecdc4, #60a5fa, #ff5fa0)',
        animation: 'spin-slow 8s linear infinite',
        willChange: 'transform',
        zIndex: 0,
      }} />
      {/* Background fill inside ring */}
      <div style={{
        position: 'absolute', inset: '1px', borderRadius: '50%',
        background: dark ? '#0d0d0d' : '#f5f5f5',
        zIndex: 1,
      }} />
      {/* Glow halo */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        boxShadow: dark
          ? '0 0 60px 20px rgba(168,85,247,0.28), 0 0 120px 40px rgba(78,205,196,0.13)'
          : '0 0 60px 20px rgba(168,85,247,0.18), 0 0 100px 30px rgba(78,205,196,0.10)',
        animation: 'pulse-glow 4s ease-in-out infinite alternate',
        willChange: 'opacity',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      {/* Image */}
      <div style={{
        position: 'relative', zIndex: 3,
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        border: '3px solid transparent',
      }}>
        <Image
          src="/images/Profile.jpeg"
          alt="Ajay Patil"
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width: 768px) 200px, 320px"
        />
      </div>
      {/* Open to work badge */}
      <motion.div
        style={{
          position: 'absolute', bottom: '-8px', right: '-8px', zIndex: 10,
          background: dark
            ? 'linear-gradient(135deg,rgba(20,20,30,0.96),rgba(30,30,45,0.96))'
            : 'linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,240,255,0.96))',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.10)'}`,
          borderRadius: '12px', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 220, damping: 18 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span style={{
          color: dark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.65)',
          fontSize: '0.60rem', fontFamily: 'monospace',
          letterSpacing: '0.08em', fontWeight: 600,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>Open to Work</span>
      </motion.div>
    </motion.div>
  )
})

/* ─── Tech chips data ────────────────────────────────────────────────────── */
const TECH_CHIPS = [
  { label: 'Java',        color: '#f87171', icon: '☕' },
  { label: 'Spring Boot', color: '#4ade80', icon: '🌿' },
  { label: 'React',       color: '#60a5fa', icon: '⚛️' },
  { label: 'Next.js',     color: '#a78bfa', icon: '▲'  },
  { label: 'Docker',      color: '#38bdf8', icon: '🐳' },
  { label: 'PostgreSQL',  color: '#fb923c', icon: '🐘' },
]

/* ─── Stats data ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '3+',  label: 'Projects',   color: '#ff6b6b' },
  { value: 'BCA', label: 'Final Year', color: '#4ecdc4' },
  { value: '12+', label: 'Tech Stack', color: '#a855f7' },
  { value: '∞',   label: 'Curiosity',  color: '#f59e0b' },
]

/* ─── Socials data ───────────────────────────────────────────────────────── */
const SOCIALS = [
  {
    label: 'GitHub', href: 'https://github.com/ajaypatil-8',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com/in/ajaypatil-8eight',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: 'Email', href: 'mailto:ajaypatil8eight@gmail.com',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  },
]

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const prefersReduced = useReducedMotion()

  const [isMobile, setIsMobile] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    let t: ReturnType<typeof setTimeout>
    const h = () => { clearTimeout(t); t = setTimeout(check, 120) }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); clearTimeout(t) }
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id)
    if (el) gsap.to(window, { duration: 1.1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }, [])

  /* ── Shared fade-up helper — used for every left-column block ── */
  const fadeUp = (delay: number) => ({
    initial:    { opacity: 0, y: prefersReduced ? 0 : 22 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  const textPri   = dark ? '#ffffff' : '#0a0a14'
  const textMuted = dark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.44)'
  const mutedBorder = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)'

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        minHeight: isMobile ? '100svh' : '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes tw-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin-slow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-glow  { from{opacity:0.55} to{opacity:1} }
        @keyframes orb-float-0 { from{transform:translate(-50%,-50%) translate(0px,0px)}   to{transform:translate(-50%,-50%) translate(30px,40px)}   }
        @keyframes orb-float-1 { from{transform:translate(-50%,-50%) translate(0px,0px)}   to{transform:translate(-50%,-50%) translate(-40px,25px)}  }
        @keyframes orb-float-2 { from{transform:translate(-50%,-50%) translate(0px,0px)}   to{transform:translate(-50%,-50%) translate(-30px,-35px)} }
        @keyframes orb-float-3 { from{transform:translate(-50%,-50%) translate(0px,0px)}   to{transform:translate(-50%,-50%) translate(35px,-20px)}  }
        @keyframes orb-float-4 { from{transform:translate(-50%,-50%) translate(0px,0px)}   to{transform:translate(-50%,-50%) translate(-20px,30px)}  }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>

      {/* ── Background ── */}
      {mounted && <OrbBackground theme={theme} />}

      {/* ── Content ── */}
      <div className="relative w-full" style={{ zIndex: 10, paddingTop: '80px' }}>
        <div className={`mx-auto px-6 ${
          isMobile
            ? 'max-w-sm flex flex-col items-center gap-10 pb-16 pt-8'
            : 'max-w-6xl flex flex-row items-center justify-between gap-16 py-20'
        }`}>

          {/* ── LEFT column ── */}
          <div className={`flex flex-col ${isMobile ? 'items-center text-center w-full' : 'items-start text-left'}`}
            style={{ flex: '0 0 auto', maxWidth: isMobile ? '100%' : '520px' }}
          >

            {/* Location badge */}
            <motion.div className="mb-5" {...fadeUp(0.55)}>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${mutedBorder}`,
                color: dark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
                fontSize: '0.60rem', fontFamily: 'monospace',
                letterSpacing: '0.10em', textTransform: 'uppercase',
              }}>
                <span style={{ fontSize: '0.75rem' }}>📍</span>
                Palus, Maharashtra, IN
              </span>
            </motion.div>

            {/* Name */}
            <motion.div className="mb-3" style={{ lineHeight: 0.95 }} {...fadeUp(0.65)}>
              <div style={{
                fontSize: isMobile ? 'clamp(3.5rem,16vw,5rem)' : 'clamp(4rem,7vw,6.5rem)',
                fontWeight: 900, letterSpacing: '-0.03em',
                color: textPri, fontFamily: 'var(--font-heading, sans-serif)', lineHeight: 1.0,
              }}>
                Ajay
              </div>
              <div style={{
                fontSize: isMobile ? 'clamp(3.5rem,16vw,5rem)' : 'clamp(4rem,7vw,6.5rem)',
                fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.0,
                fontFamily: 'var(--font-heading, sans-serif)',
                background: 'linear-gradient(110deg, #ff5fa0 0%, #a855f7 50%, #4ecdc4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: dark ? 'drop-shadow(0 0 40px rgba(168,85,247,0.40))' : 'none',
              }}>
                Patil.
              </div>
            </motion.div>

            {/* Accent line */}
            <motion.div className="mb-5" {...fadeUp(0.73)} style={{
              height: '3px', width: '160px', borderRadius: '2px',
              background: 'linear-gradient(90deg, #ff5fa0, #a855f7, #4ecdc4)',
              opacity: dark ? 0.85 : 0.70,
            }} />

            {/* Typewriter */}
            <motion.div className="mb-6" {...fadeUp(0.80)}>
              <p style={{
                fontSize: isMobile ? '0.90rem' : '1.05rem',
                fontFamily: 'monospace', fontWeight: 600,
                color: textMuted, letterSpacing: '0.02em', minHeight: '1.6em',
              }}>
                <Typewriter texts={ROLES} delay={900} />
              </p>
            </motion.div>

            {/* Bio */}
            <motion.p className="mb-6 leading-relaxed" {...fadeUp(0.87)} style={{
              fontSize: isMobile ? '0.85rem' : '0.92rem',
              color: textMuted, maxWidth: '440px', lineHeight: 1.75,
            }}>
              Backend-focused full-stack developer shipping production-grade Spring Boot APIs,
              Dockerized cloud deployments, and reactive React interfaces.
              BCA Final Year · Immediate Joiner.
            </motion.p>

            {/* Tech chips — each has its own animate, no variants inheritance */}
            <motion.div className="flex flex-wrap gap-2 mb-8" {...fadeUp(0.93)}>
              {TECH_CHIPS.map((chip, i) => (
                <motion.span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  style={{
                    border: `1px solid ${chip.color}44`, color: chip.color,
                    background: `${chip.color}10`, borderRadius: '999px',
                    padding: '4px 12px', fontSize: '0.62rem', fontWeight: 700,
                    letterSpacing: '0.08em', fontFamily: 'monospace',
                    whiteSpace: 'nowrap', cursor: 'default',
                  }}
                >
                  <span style={{ fontSize: '0.72rem' }}>{chip.icon}</span>
                  {chip.label.toUpperCase()}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div className="flex flex-wrap gap-3 items-center mb-8" {...fadeUp(1.0)}>
              {/* Primary */}
              <motion.button
                onClick={() => scrollTo('#projects')}
                className="relative overflow-hidden rounded-full font-bold px-7 py-3 text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #ff5fa0 0%, #a855f7 55%, #4ecdc4 100%)',
                  boxShadow: dark
                    ? '0 4px 28px rgba(168,85,247,0.40), 0 2px 14px rgba(255,95,160,0.25)'
                    : '0 4px 20px rgba(168,85,247,0.30)',
                  letterSpacing: '0.02em',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.55 }}
                />
                <span className="relative">View Projects →</span>
              </motion.button>
              {/* Secondary */}
              <motion.button
                onClick={() => scrollTo('#contact')}
                className="rounded-full font-bold px-6 py-3 text-sm"
                style={{
                  color: textPri,
                  border: `1.5px solid ${dark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.16)'}`,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  letterSpacing: '0.02em',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                Get in Touch
              </motion.button>
              {/* Resume */}
              <motion.a
                href="/resume/Ajay_Patil_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full font-bold px-6 py-3 text-sm inline-flex items-center gap-2"
                style={{
                  color: '#a855f7', border: '1.5px solid rgba(168,85,247,0.35)',
                  background: 'rgba(168,85,247,0.06)', letterSpacing: '0.02em',
                  textDecoration: 'none',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Resume
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className={`flex gap-8 ${isMobile ? 'justify-center' : ''}`}
              {...fadeUp(1.07)}
            >
              {STATS.map(s => (
                <div key={s.label} className="flex flex-col">
                  <span style={{
                    fontWeight: 800,
                    fontSize: 'clamp(1.3rem,3vw,1.8rem)',
                    background: `linear-gradient(135deg,${s.color},${s.color}99)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                    fontFamily: 'var(--font-heading, sans-serif)',
                  }}>{s.value}</span>
                  <span style={{
                    color: dark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.45)',
                    fontSize: '0.58rem', fontFamily: 'monospace',
                    letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: '3px',
                  }}>{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Socials */}
            <motion.div
              className={`flex gap-4 mt-8 ${isMobile ? 'justify-center' : ''}`}
              {...fadeUp(1.14)}
            >
              {SOCIALS.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: '40px', height: '40px',
                    color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.42)',
                    border: `1px solid ${mutedBorder}`,
                    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    textDecoration: 'none',
                  }}
                  whileHover={{ scale: 1.12, color: '#a855f7' } as any}
                  whileTap={{ scale: 0.92 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>

          </div>{/* end left column */}

          {/* ── RIGHT column: Profile image ── */}
          {mounted && (
            <div className={`flex-shrink-0 ${isMobile ? 'order-first' : ''}`} style={{ position: 'relative' }}>
              <ProfileCard theme={theme} />

              {/* Floating info chips — desktop only */}
              {!isMobile && (
                <>
                  <motion.div
                    style={{
                      position: 'absolute', top: '-10px', left: '-95px',
                      background: dark ? 'rgba(18,18,28,0.94)' : 'rgba(255,255,255,0.94)',
                      border: `1px solid ${mutedBorder}`, borderRadius: '12px',
                      padding: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.20)',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7, duration: 0.5 }}
                  >
                    <div style={{ fontSize: '0.56rem', fontFamily: 'monospace', letterSpacing: '0.08em', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginBottom: '2px' }}>Education</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textPri, whiteSpace: 'nowrap' }}>🎓 BCA Final Year</div>
                    <div style={{ fontSize: '0.60rem', color: textMuted, whiteSpace: 'nowrap' }}>Shivaji University</div>
                  </motion.div>

                  <motion.div
                    style={{
                      position: 'absolute', bottom: '30px', left: '-115px',
                      background: dark ? 'rgba(18,18,28,0.94)' : 'rgba(255,255,255,0.94)',
                      border: '1px solid rgba(168,85,247,0.28)', borderRadius: '12px',
                      padding: '8px 14px', boxShadow: '0 4px 20px rgba(168,85,247,0.13)',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.0, duration: 0.5 }}
                  >
                    <div style={{ fontSize: '0.56rem', fontFamily: 'monospace', letterSpacing: '0.08em', color: '#a855f7', textTransform: 'uppercase', marginBottom: '2px' }}>Exploring</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)', whiteSpace: 'nowrap' }}>Kafka · K8s · AWS</div>
                  </motion.div>

                  <motion.div
                    style={{
                      position: 'absolute', top: '20px', right: '-105px',
                      background: dark ? 'rgba(18,18,28,0.94)' : 'rgba(255,255,255,0.94)',
                      border: '1px solid rgba(78,205,196,0.28)', borderRadius: '12px',
                      padding: '8px 14px', boxShadow: '0 4px 20px rgba(78,205,196,0.13)',
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                  >
                    <div style={{ fontSize: '0.56rem', fontFamily: 'monospace', letterSpacing: '0.08em', color: '#4ecdc4', textTransform: 'uppercase', marginBottom: '2px' }}>Live Project</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)', whiteSpace: 'nowrap' }}>✈ AeroSphere</div>
                  </motion.div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <span style={{
            color: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)',
            fontSize: '0.50rem', letterSpacing: '0.35em',
            fontFamily: 'monospace', textTransform: 'uppercase',
          }}>Scroll</span>
          <motion.div
            className="w-px"
            style={{ height: '36px', background: 'linear-gradient(to bottom, #a855f7, transparent)' }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  )
}