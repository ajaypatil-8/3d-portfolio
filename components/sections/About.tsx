'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRef, useState, useEffect } from 'react'

/* ─── Animation CSS ──────────────────────────────────────────────────── */
const ABOUT_CSS = `
@keyframes about-float-a {
  0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
  33%     { transform: translateY(-22px) rotate(8deg) scale(1.05); }
  66%     { transform: translateY(-10px) rotate(-5deg) scale(0.97); }
}
@keyframes about-float-b {
  0%,100% { transform: translateY(0px) translateX(0px); }
  50%     { transform: translateY(-28px) translateX(14px); }
}
@keyframes about-blob {
  0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; transform:translate(0,0) scale(1); }
  33%     { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; transform:translate(8%,-6%) scale(1.04); }
  66%     { border-radius:50% 60% 30% 60%/30% 50% 70% 40%; transform:translate(-6%,4%) scale(0.97); }
}
@keyframes about-shimmer {
  0%   { transform: translateX(-200%) skewX(-15deg); }
  100% { transform: translateX(300%) skewX(-15deg); }
}
@keyframes about-bar-glow {
  0%,100% { box-shadow: 0 0 6px currentColor; }
  50%     { box-shadow: 0 0 18px currentColor, 0 0 36px currentColor; }
}
@keyframes about-ring-pulse {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
@keyframes about-border-spin {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes about-dot-blink {
  0%,100% { opacity:1; } 50% { opacity:0.3; }
}
`

/* ─── Data ───────────────────────────────────────────────────────────── */
const quickInfo = [
  { icon: '🎓', label: 'BCA Final Year', value: '2025-26',                 color: '#4ecdc4' },
  { icon: '🏛️', label: 'University',     value: 'Shivaji University',      color: '#a855f7' },
  { icon: '📍', label: 'Location',       value: 'Palus, MH',               color: '#ff6b6b' },
  { icon: '💻', label: 'Experience',     value: '2+ Years',                color: '#fbbf24' },
]

const skills = [
  {
    icon: '⚙️', title: 'Java & Spring Boot', tag: 'Core', color: '#4ade80', pct: 88,
    keywords: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'JPA', 'Hibernate', 'REST API'],
  },
  {
    icon: '🗄️', title: 'Database & Backend', tag: 'Core', color: '#4ade80', pct: 82,
    keywords: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL'],
  },
  {
    icon: '🎨', title: 'React & Next.js', tag: 'Proficient', color: '#fbbf24', pct: 76,
    keywords: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    icon: '🐳', title: 'Docker & Cloud', tag: 'Comfortable', color: '#38bdf8', pct: 70,
    keywords: ['Docker', 'Docker Compose', 'Nginx', 'AWS EC2', 'GitHub Actions', "Let's Encrypt", 'CI/CD'],
  },
]

/* ─── Floating Particles ─────────────────────────────────────────────── */
function Particles({ count = 14 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + (i % 4),
    x: (i * 7.3) % 100,
    y: (i * 11.7) % 100,
    delay: (i * 0.6) % 7,
    dur: 7 + (i % 5),
    color: ['#4ecdc4','#ff6b6b','#a855f7','#fbbf24','#60a5fa'][i % 5],
    anim: i % 2 === 0 ? 'about-float-a' : 'about-float-b',
  }))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            backgroundColor: p.color,
            opacity: 0.22,
            animation: `${p.anim} ${p.dur}s ${p.delay}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Skill Card ─────────────────────────────────────────────────────── */
function SkillCard({ s, i }: { s: typeof skills[0]; i: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      className="rounded-2xl p-5 text-center relative overflow-hidden cursor-pointer select-none"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${hov ? s.color + '50' : 'var(--border)'}`,
        transition: 'border-color 0.3s',
        willChange: 'transform',
      }}
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.12 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.22, ease: 'easeOut' } }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Shimmer sweep on hover */}
      {hov && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 30%, ${s.color}20 50%, transparent 70%)`,
            animation: 'about-shimmer 0.65s ease forwards',
          }}
        />
      )}

      {/* Ambient glow background */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.color}14 0%, transparent 65%)` }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated top progress bar */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl overflow-hidden"
        style={{ background: `${s.color}20` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${s.color}80, ${s.color}, ${s.color}80)`,
            animation: hov ? 'about-bar-glow 1.4s ease-in-out infinite' : 'none',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${s.pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
        />
      </div>

      {/* Icon ring */}
      <div className="relative inline-flex items-center justify-center mb-3 mt-2">
        {hov && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 44, height: 44,
              background: `radial-gradient(circle, ${s.color}40 0%, transparent 70%)`,
              animation: 'about-ring-pulse 0.8s ease-out forwards',
            }}
          />
        )}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl relative z-10"
          style={{ background: `${s.color}14`, border: `1px solid ${s.color}28` }}
        >
          {s.icon}
        </div>
      </div>

      <div className="text-sm font-bold mb-1.5 relative" style={{ color: 'var(--text-primary)' }}>
        {s.title}
      </div>

      <div
        className="text-xs px-2.5 py-0.5 rounded-full inline-block mb-3 font-mono relative"
        style={{ backgroundColor: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}
      >
        {s.tag}
      </div>

      <div className="flex flex-wrap gap-1 justify-center relative">
        {s.keywords.map((kw, ki) => (
          <motion.span
            key={kw}
            className="text-[0.6rem] px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 + i * 0.05 + ki * 0.03, type: 'spring', stiffness: 260 }}
          >
            {kw}
          </motion.span>
        ))}
      </div>

      {/* Bottom pct indicator */}
      <div
        className="flex justify-between items-center mt-3 pt-2.5 relative"
        style={{ borderTop: `1px solid ${s.color}18` }}
      >
        <span className="text-[0.6rem] font-mono" style={{ color: 'var(--text-muted)' }}>proficiency</span>
        <motion.span
          className="text-xs font-bold font-mono"
          style={{ color: s.color }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.08 }}
        >
          {s.pct}%
        </motion.span>
      </div>
    </motion.div>
  )
}

/* ─── Quick Info Card ────────────────────────────────────────────────── */
function InfoCard({ item, i }: { item: typeof quickInfo[0]; i: number }) {
  return (
    <motion.div
      className="flex flex-col gap-1.5 px-4 py-3.5 rounded-xl text-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.18 + i * 0.07, type: 'spring', stiffness: 220, damping: 22 }}
      whileHover={{ y: -4, borderColor: item.color + '50', transition: { duration: 0.2 } }}
    >
      {/* Animated bottom accent */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + i * 0.09, duration: 0.55 }}
      />
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${item.color}12 0%, transparent 70%)` }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
      <span className="text-xl relative z-10">{item.icon}</span>
      <div className="text-[0.65rem] relative z-10" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
      <div className="text-xs font-bold relative z-10" style={{ color: item.color }}>{item.value}</div>
    </motion.div>
  )
}

/* ─── About Section ──────────────────────────────────────────────────── */
export default function About() {
  const { theme } = useTheme()

  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <style>{ABOUT_CSS}</style>
      <Particles />

      {/* ambient morphing blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div
          className="absolute top-0 left-1/4"
          style={{
            width: 640, height: 640,
            transform: 'translate(-20%,-20%)',
            background: 'radial-gradient(circle, rgba(78,205,196,0.10) 0%, transparent 65%)',
            animation: 'about-blob 14s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4"
          style={{
            width: 640, height: 640,
            transform: 'translate(20%,20%)',
            background: 'radial-gradient(circle, rgba(255,107,107,0.10) 0%, transparent 65%)',
            animation: 'about-blob 18s 4s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute top-1/2 right-0"
          style={{
            width: 400, height: 400,
            transform: 'translate(30%,-50%)',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)',
            animation: 'about-blob 12s 2s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-sm font-mono tracking-widest uppercase mb-4"
            style={{ color: '#4ecdc4' }}
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.1em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            About Me
          </motion.p>

          <h2
            className="font-heading font-bold leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--text-primary)' }}
          >
            Java Backend{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Developer
            </span>
            <br />
            <span className="font-light" style={{ fontSize: '0.55em', color: 'var(--text-muted)' }}>
              &amp; Full Stack Engineer
            </span>
          </h2>

          {/* Animated gradient underline */}
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #ff6b6b)' }}
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#4ecdc4' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
            />
            <motion.div
              className="h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #a855f7)' }}
              initial={{ width: 0 }}
              whileInView={{ width: 160 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#a855f7' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 300 }}
            />
            <motion.div
              className="h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, #a855f7, transparent)' }}
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* ── Bio + Quick Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start mb-14">

          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {/* Available badge */}
            <motion.div
              className="flex items-center gap-2.5 mb-5"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                  style={{ animation: 'about-ring-pulse 1.4s ease-out infinite' }}
                />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span
                className="text-xs font-mono px-3 py-1 rounded-full"
                style={{
                  color: '#4ade80',
                  backgroundColor: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.22)',
                  animation: 'about-dot-blink 2.5s ease-in-out infinite',
                }}
              >
                Currently open to Jobs &amp; Internships
              </span>
            </motion.div>

            {/* Bio text */}
            <p className="leading-relaxed text-sm mb-6" style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Ajay Patil</strong> — BCA Final Year
              (2025-26) from Palus, Maharashtra. Specializing in{' '}
              <strong style={{ color: '#4ade80' }}>Java backend development</strong> with Spring Boot,
              Spring Security, JPA, and Hibernate. Built{' '}
              <strong style={{ color: 'var(--text-primary)' }}>CrowdSpark-X</strong> (PHP → Spring Boot
              microservices). Hands-on with JWT auth, Docker, Kafka, and cloud deployment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="mailto:ajaypatil8eight@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white text-sm relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #a855f7)',
                  boxShadow: '0 4px 20px rgba(255,107,107,0.28)',
                }}
                whileHover={{ scale: 1.06, boxShadow: '0 6px 30px rgba(255,107,107,0.45)' }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                  initial={{ x: '-130%' }}
                  whileHover={{ x: '130%' }}
                  transition={{ duration: 0.48 }}
                />
                <svg className="w-3.5 h-3.5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="relative">Mail Me →</span>
              </motion.a>

              <motion.a
                href="https://github.com/ajaypatil-8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
                whileHover={{ scale: 1.06, borderColor: '#4ecdc4', color: '#4ecdc4' }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub ↗
              </motion.a>

              <motion.a
                href="/resume/Ajay_Patil_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{ border: '1px solid rgba(78,205,196,0.35)', color: '#4ecdc4', backgroundColor: 'rgba(78,205,196,0.08)' }}
                whileHover={{ scale: 1.06, backgroundColor: 'rgba(78,205,196,0.18)', borderColor: '#4ecdc4', boxShadow: '0 0 18px rgba(78,205,196,0.25)' }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume ↓
              </motion.a>
            </div>
          </motion.div>

          {/* Quick info grid */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            style={{ minWidth: 270 }}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            {quickInfo.map((item, i) => <InfoCard key={i} item={item} i={i} />)}
          </motion.div>
        </div>

        {/* ── Skill Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((s, i) => <SkillCard key={i} s={s} i={i} />)}
        </div>
      </div>
    </section>
  )
}
