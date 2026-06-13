'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { useTheme } from '@/components/providers/ThemeProvider'

gsap.registerPlugin(ScrollToPlugin)

/* ═══════════════════════════════════════════════════ CSS */
const FOOTER_CSS = `
@keyframes ft-grad  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes ft-pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
@keyframes ft-spin  { to{transform:rotate(360deg)} }
@keyframes ft-orbit { from{transform:rotate(0deg) translateX(28px) rotate(0deg)} to{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
@keyframes ft-shimmer { 0%{transform:translateX(-100%) skewX(-15deg)} 100%{transform:translateX(300%) skewX(-15deg)} }
@keyframes ft-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes ft-scan  { 0%{transform:translateY(-100%) scaleX(0.5)} 100%{transform:translateY(500%) scaleX(0.8)} }
@keyframes ft-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes ft-glow-pulse { 0%,100%{box-shadow:0 0 8px currentColor,0 0 16px currentColor} 50%{box-shadow:0 0 16px currentColor,0 0 32px currentColor,0 0 48px currentColor} }
@keyframes ft-particle { 0%{transform:translateY(0) translateX(0) scale(1);opacity:0.8} 100%{transform:translateY(-80px) translateX(var(--pdx)) scale(0);opacity:0} }
@keyframes ft-counter-bounce { 0%{transform:translateY(4px);opacity:0} 60%{transform:translateY(-2px)} 100%{transform:translateY(0);opacity:1} }
@keyframes ft-typing { from{width:0} to{width:100%} }
@keyframes ft-border-travel { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes ft-rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

@media (prefers-reduced-motion:reduce) {
  *[class*="ft-"],*[style*="ft-"] { animation:none!important; transition:none!important; }
}
`

/* ═══════════════════════════════════════════════════ DATA */
const navLinks = [
  { name: 'Home',       href: '#hero'       },
  { name: 'Projects',   href: '#projects'   },
  { name: 'Skills',     href: '#skills'     },
  { name: 'About',      href: '#about'      },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact'    },
]

const techStack = [
  { label: 'Java',        color: '#f87171' },
  { label: 'Spring Boot', color: '#4ade80' },
  { label: 'Next.js',     color: '#a78bfa' },
  { label: 'React',       color: '#60a5fa' },
  { label: 'Docker',      color: '#38bdf8' },
  { label: 'PostgreSQL',  color: '#fb923c' },
  { label: 'MySQL',       color: '#facc15' },
  { label: 'REST API',    color: '#4ecdc4' },
]

const socials = [
  {
    name: 'GitHub', href: 'https://github.com/ajaypatil-8', color: '#4ecdc4',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn', href: 'https://www.linkedin.com/in/ajaypatil-8eight/', color: '#a855f7',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect.',
    color: '#ff6b6b',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

/* ═══════════════════════════════════════════════════ BACK TO TOP */

function BackToTop() {
  const [hov, setHov] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () =>
    gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power3.inOut' })

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        width: 44, height: 44,
        background: 'linear-gradient(135deg, #ff6b6b, #a855f7)',
        boxShadow: hov
          ? '0 0 24px rgba(168,85,247,0.6), 0 0 48px rgba(168,85,247,0.25)'
          : '0 4px 16px rgba(168,85,247,0.35)',
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.91 }}
      aria-label="Back to top"
    >
      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }}
        initial={{ x: '-130%' }}
        animate={hov ? { x: '130%' } : { x: '-130%' }}
        transition={{ duration: 0.45 }}
      />
      {/* Orbit ring */}
      {hov && (
        <div style={{
          position: 'absolute', inset: '-4px', borderRadius: '50%',
          border: '1.5px dashed rgba(255,255,255,0.30)',
          animation: 'ft-spin 2s linear infinite',
          pointerEvents: 'none',
        }} />
      )}
      <motion.svg
        className="w-5 h-5 text-white relative z-10"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
        animate={{ y: hov ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </motion.svg>
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════ LIVE CLOCK */

function LiveClock({ dark }: { dark: boolean }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const d = new Date()
      setTime(d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '0.58rem', fontFamily: 'monospace', letterSpacing: '0.06em',
      color: dark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.32)',
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ecdc4', animation: 'ft-pulse 2s ease-in-out infinite', flexShrink: 0 }} />
      IST {time}
    </div>
  )
}

/* ═══════════════════════════════════════════════════ FOOTER */

export default function Footer() {
  const year = new Date().getFullYear()
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: '-60px' })

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) gsap.to(window, { duration: 1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }

  const bdr = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderTop: `1px solid var(--footer-border)`,
      }}
    >
      <style>{FOOTER_CSS}</style>

      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div style={{
          position: 'absolute', bottom: '-40px', left: '10%', width: 480, height: 480,
          borderRadius: '50%', transform: 'translateX(-30%)',
          background: dark ? 'radial-gradient(circle, rgba(78,205,196,0.07) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(78,205,196,0.05) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '10%', width: 480, height: 480,
          borderRadius: '50%', transform: 'translateX(30%)',
          background: dark ? 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 65%)',
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: dark ? 0.018 : 0.012,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, ${dark ? '#fff' : '#000'} 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, ${dark ? '#fff' : '#000'} 40px)`,
        }} />
      </div>

      {/* ── Availability bar ── */}
      <motion.div
        style={{ borderBottom: `1px solid ${bdr}`, position: 'relative' }}
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Animated gradient border bottom */}
        <div style={{
          position: 'absolute', bottom: 0, insetInline: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #4ecdc4, #a855f7, transparent)',
          backgroundSize: '200% 100%',
          animation: 'ft-border-travel 4s ease infinite',
          opacity: dark ? 0.4 : 0.3,
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </div>
              <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Available</span>
                {' '}for full-time jobs &amp; internships
              </span>
            </div>
            <LiveClock dark={dark} />
          </div>

          <motion.a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
            target="_blank" rel="noopener noreferrer"
            className="text-xs sm:text-sm font-mono relative overflow-hidden"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
            whileHover={{ x: 4 }}
          >
            ajaypatil8eight@gmail.com →
          </motion.a>
        </div>
      </motion.div>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 mb-12">

          {/* Brand column */}
          <motion.div
            className="sm:col-span-2 md:col-span-5"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <motion.div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                whileHover={{ scale: 1.08, rotate: 6 }}
              >
                {/* Shimmer */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                  animation: 'ft-shimmer 2.5s ease-in-out infinite',
                }} />
                <span className="text-white font-bold text-sm relative z-10">AP</span>
              </motion.div>
              <div>
                <div className="font-heading font-bold text-lg leading-none" style={{ color: 'var(--text-primary)' }}>
                  Ajay{' '}
                  <span style={{
                    background: 'linear-gradient(110deg, #ff5fa0, #a855f7, #4ecdc4)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    animation: 'ft-grad 5s ease infinite',
                  }}>Patil</span>
                </div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  Full Stack Developer
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              BCA student from Palus, Sangli — building production-grade apps with
              Java, Spring Boot, and modern web tech. Actively looking for my first opportunity.
            </p>

            {/* Location badge */}
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4ecdc4' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                Palus, Dist. Sangli, Maharashtra, India
              </span>
            </div>

            {/* Social icons — enhanced */}
            <div className="flex gap-2.5">
              {socials.map((s, i) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank" rel="noreferrer"
                  aria-label={s.name}
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${bdr}`,
                    color: 'var(--text-muted)',
                  }}
                  initial={{ opacity: 0, y: 12, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 280, damping: 18 }}
                  whileHover={{
                    scale: 1.15, y: -3, color: s.color,
                    borderColor: s.color + '60',
                    boxShadow: `0 4px 20px ${s.color}35`,
                  }}
                  whileTap={{ scale: 0.90 }}
                >
                  {/* Hover fill */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ backgroundColor: s.color, borderRadius: 'inherit', opacity: 0 }}
                    whileHover={{ opacity: 0.10 }}
                  />
                  <span className="relative z-10">{s.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav links */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <h4 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="w-4 h-px inline-block" style={{ backgroundColor: 'var(--accent)' }} />
              Navigation
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.18 + i * 0.05, duration: 0.38 }}
                >
                  <motion.a
                    href={link.href}
                    onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                    className="text-sm flex items-center gap-2 group py-0.5"
                    style={{ color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer' }}
                    whileHover={{ color: 'var(--accent)', x: 4 }}
                    transition={{ duration: 0.16 }}
                  >
                    <motion.span
                      className="hidden sm:block h-px rounded-full"
                      style={{ backgroundColor: 'var(--accent)', width: 0 }}
                      whileHover={{ width: '12px' }}
                      transition={{ duration: 0.2 }}
                    />
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.20 }}
          >
            <h4 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="w-4 h-px inline-block" style={{ backgroundColor: '#60a5fa' }} />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech.label}
                  className="px-3 py-1 rounded-full text-xs relative overflow-hidden"
                  style={{
                    color: 'var(--text-muted)',
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${bdr}`,
                  }}
                  initial={{ opacity: 0, scale: 0.78 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.22 + i * 0.05, type: 'spring', stiffness: 280, damping: 18 }}
                  whileHover={{
                    scale: 1.08, y: -2,
                    color: tech.color,
                    borderColor: tech.color + '50',
                    boxShadow: `0 0 12px ${tech.color}30`,
                  }}
                >
                  {/* Hover shimmer */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                    initial={{ x: '-130%' }}
                    whileHover={{ x: '130%' }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="relative z-10">{tech.label}</span>
                </motion.span>
              ))}
            </div>

            {/* Resume download CTA */}
            <motion.a
              href="/resume/Ajay_Patil_Resume.pdf"
              target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold relative overflow-hidden"
              style={{
                color: '#a855f7',
                border: '1px solid rgba(168,85,247,0.30)',
                background: 'rgba(168,85,247,0.07)',
                textDecoration: 'none',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(168,85,247,0.30)', y: -2 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.18), transparent)' }}
                initial={{ x: '-130%' }}
                whileHover={{ x: '130%' }}
                transition={{ duration: 0.45 }}
              />
              <svg className="w-3.5 h-3.5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="relative z-10">Download Résumé</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ position: 'relative', height: '1px', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--border-strong), transparent)' }} />
          {/* Animated traveling dot on divider */}
          <motion.div
            style={{
              position: 'absolute', top: '-2.5px', left: 0,
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7, #4ecdc4)',
              boxShadow: '0 0 8px rgba(168,85,247,0.7)',
            }}
            animate={isInView ? { left: ['0%', '100%'] } : {}}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.6, repeat: Infinity, repeatDelay: 4 }}
          />
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-6 text-center">
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              © {year} Ajay Patil. All rights reserved.
            </p>
            <span className="hidden sm:block w-px h-3" style={{ backgroundColor: 'var(--border-strong)' }} />
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                Built with Next.js
              </p>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ❤️
              </motion.span>
            </div>
          </div>

          {/* Version badge + back to top */}
          <div className="flex items-center gap-3">
            <div style={{
              fontSize: '0.52rem', fontFamily: 'monospace', letterSpacing: '0.08em',
              color: dark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)',
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${bdr}`,
              borderRadius: '999px', padding: '3px 9px',
            }}>
              v1.0.0
            </div>
            <BackToTop />
          </div>
        </motion.div>
      </div>
    </footer>
  )
}