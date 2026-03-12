'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { useTheme } from '@/components/providers/ThemeProvider'
import { GeometricBackgroundScene } from '@/components/3d/GeometricBackground'

gsap.registerPlugin(ScrollToPlugin)

/* ─── Typewriter ─────────────────────────────────────────────────────────── */
function Typewriter({ texts, delay = 0 }: { texts: string[]; delay?: number }) {
  const [display,  setDisplay]  = useState('')
  const [idx,      setIdx]      = useState(0)
  const [charIdx,  setCharIdx]  = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [started,  setStarted]  = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const cur = texts[idx]
    if (!deleting && charIdx <= cur.length) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c + 1) }, 70)
      return () => clearTimeout(t)
    }
    if (!deleting && charIdx > cur.length) {
      const t = setTimeout(() => setDeleting(true), 2200)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c - 1) }, 36)
      return () => clearTimeout(t)
    }
    setDeleting(false)
    setIdx(i => (i + 1) % texts.length)
    setCharIdx(0)
  }, [started, charIdx, deleting, idx, texts])

  return (
    <span>
      {display}
      <span style={{
        display: 'inline-block', width: '2px', height: '1em',
        background: 'currentColor', marginLeft: '2px',
        verticalAlign: 'text-bottom', animation: 'tw-blink 1s step-end infinite',
      }} />
    </span>
  )
}

/* ─── Tech Pill ──────────────────────────────────────────────────────────── */
const PILL_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  JAVA:         { border: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.08)' },
  'SPRING BOOT':{ border: '#4ade80', text: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
  REACT:        { border: '#60a5fa', text: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  'NEXT.JS':    { border: '#a78bfa', text: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  DOCKER:       { border: '#38bdf8', text: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
  CLOUD:        { border: '#fbbf24', text: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
}
const PILL_COLORS_LIGHT: Record<string, { border: string; text: string; bg: string }> = {
  JAVA:         { border: '#dc2626', text: '#dc2626', bg: 'rgba(220,38,38,0.07)'   },
  'SPRING BOOT':{ border: '#16a34a', text: '#16a34a', bg: 'rgba(22,163,74,0.07)'  },
  REACT:        { border: '#2563eb', text: '#2563eb', bg: 'rgba(37,99,235,0.07)'  },
  'NEXT.JS':    { border: '#7c3aed', text: '#7c3aed', bg: 'rgba(124,58,237,0.07)' },
  DOCKER:       { border: '#0284c7', text: '#0284c7', bg: 'rgba(2,132,199,0.07)'  },
  CLOUD:        { border: '#d97706', text: '#d97706', bg: 'rgba(217,119,6,0.07)'  },
}

function TechPill({ label, theme }: { label: string; theme: 'dark' | 'light' }) {
  const map = theme === 'dark' ? PILL_COLORS : PILL_COLORS_LIGHT
  const c   = map[label] ?? { border: '#888', text: '#888', bg: 'transparent' }
  return (
    <span style={{
      border:          `1px solid ${c.border}`,
      color:           c.text,
      background:      c.bg,
      borderRadius:    '999px',
      padding:         '3px 12px',
      fontSize:        '0.60rem',
      fontWeight:      600,
      letterSpacing:   '0.10em',
      fontFamily:      'monospace',
      whiteSpace:      'nowrap',
    }}>
      {label}
    </span>
  )
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({
  value, label, color, delay, theme,
}: { value: string; label: string; color: string; delay: number; theme: 'dark' | 'light' }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center px-5 py-3"
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:     theme === 'light' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.05)',
        border:         `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius:   '14px',
        backdropFilter: 'blur(16px)',
        minWidth:       '82px',
      }}
    >
      <span style={{
        fontWeight:           800,
        fontSize:             'clamp(1.1rem,3.5vw,1.55rem)',
        background:           `linear-gradient(135deg,${color},${color}bb)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor:  'transparent',
        backgroundClip:       'text',
        lineHeight:           1.1,
        fontVariantNumeric:   'tabular-nums',
      }}>{value}</span>
      <span style={{
        color:         theme === 'light' ? 'rgba(0,0,0,0.40)' : 'rgba(255,255,255,0.38)',
        fontSize:      '0.58rem',
        fontFamily:    'monospace',
        letterSpacing: '0.12em',
        marginTop:     '3px',
        textTransform: 'uppercase',
      }}>{label}</span>
    </motion.div>
  )
}

/* ─── 3D Scene (right side) ──────────────────────────────────────────────── */
const ThreeScene = memo(function ThreeScene({
  theme, isMobile,
}: { theme: 'dark' | 'light'; isMobile: boolean }) {
  return (
    <Canvas
      dpr={[1, isMobile ? 1.2 : 1.8]}
      gl={{
        antialias:       !isMobile,
        alpha:           true,
        stencil:         false,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={52} />
      <ambientLight intensity={theme === 'light' ? 1.4 : 0.55} />
      <directionalLight position={[4, 6, 4]}  intensity={theme === 'light' ? 0.7 : 1.4} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#8866ff" />
      <pointLight       position={[2, 3, 2]}   intensity={0.9} color="#4ecdc4" distance={9} />
      <pointLight       position={[-2, -1, 2]} intensity={0.5} color="#ff6b6b" distance={7} />
      <GeometricBackgroundScene theme={theme} isMobile={isMobile} />
    </Canvas>
  )
})

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [isMobile, setIsMobile] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  /* Animation refs */
  const badgeRef  = useRef<HTMLDivElement>(null)
  const nameRef   = useRef<HTMLDivElement>(null)
  const lineRef   = useRef<HTMLDivElement>(null)
  const roleRef   = useRef<HTMLDivElement>(null)
  const pillsRef  = useRef<HTMLDivElement>(null)
  const btnsRef   = useRef<HTMLDivElement>(null)
  const statsRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    let t: ReturnType<typeof setTimeout>
    const h = () => { clearTimeout(t); t = setTimeout(check, 120) }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); clearTimeout(t) }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const els = [
      badgeRef.current, nameRef.current, lineRef.current,
      roleRef.current, pillsRef.current, btnsRef.current, statsRef.current,
    ]
    gsap.set(els, { opacity: 0, y: 24 })
    const tl = gsap.timeline({ delay: isMobile ? 0.6 : 0.9 })
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out' })
      .to(nameRef.current,  { opacity: 1, y: 0, duration: 0.70, ease: 'power3.out' }, '-=0.22')
      .to(lineRef.current,  { opacity: 1, y: 0, duration: 0.36, ease: 'power3.out' }, '-=0.40')
      .to(roleRef.current,  { opacity: 1, y: 0, duration: 0.40, ease: 'power3.out' }, '-=0.22')
      .to(pillsRef.current, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, '-=0.25')
      .to(btnsRef.current,  { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, '-=0.22')
      .to(statsRef.current, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, '-=0.22')
    return () => { tl.kill() }
  }, [mounted, isMobile])

  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id)
    if (el) gsap.to(window, { duration: 1.1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }, [])

  /* Colours */
  const bg         = dark ? '#0e0e16' : '#f0f0f7'
  const textPri    = dark ? '#ffffff' : '#0a0a14'
  const textMuted  = dark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)'
  const badgeBg    = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.70)'
  const badgeBdr   = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'
  const badgeText  = dark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.55)'
  const btn2Bg     = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.60)'
  const btn2Bdr    = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)'

  const PILLS = ['JAVA', 'SPRING BOOT', 'REACT', 'NEXT.JS', 'DOCKER', 'CLOUD']
  const STATS = [
    { value: '2',   label: 'Projects',   color: '#ff6b6b' },
    { value: 'BCA', label: '3rd Year',   color: '#4ecdc4' },
    { value: '8+',  label: 'Tech Stack', color: '#a855f7' },
  ]

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bg,
        height:    isMobile ? '100svh' : '100vh',
        minHeight: isMobile ? '100svh' : '100vh',
      }}
    >
      <style>{`@keyframes tw-blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      {/* ── 3D Canvas — full bleed right half on desktop, full on mobile ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {mounted && (
          <ThreeScene theme={theme} isMobile={isMobile} />
        )}
      </div>

      {/* ── Left fade vignette — keeps text readable over 3D ── */}
      {!isMobile && (
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            zIndex: 1,
            width: '52%',
            background: `linear-gradient(to right, ${bg} 30%, ${bg}cc 65%, transparent 100%)`,
          }}
        />
      )}
      {/* Top & bottom edge fades */}
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ zIndex: 1, background: `linear-gradient(to bottom,${bg},transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ zIndex: 1, background: `linear-gradient(to top,${bg},transparent)` }} />

      {/* ══════════════════════════════════════════════════════════════
          LEFT SIDE — all text content
          ══════════════════════════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 flex items-center ${isMobile ? 'justify-center' : 'justify-start'}`}
        style={{ zIndex: 10 }}
      >
        <div
          className={`w-full ${isMobile ? 'max-w-sm mx-auto px-5 text-left' : 'max-w-lg ml-[5vw] xl:ml-[8vw] px-4 text-left'}`}
        >

          {/* Badge */}
          <div ref={badgeRef} className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background:     badgeBg,
                border:         `1px solid ${badgeBdr}`,
                backdropFilter: 'blur(16px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span style={{
                color:         badgeText,
                fontSize:      '0.62rem',
                fontFamily:    'monospace',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}>
                Open to Jobs &amp; Internships
              </span>
            </span>
          </div>

          {/* ── Stacked name — Ajay / Patil ── */}
          <div ref={nameRef} className="mb-3">
            {/* "Ajay" — solid, very large */}
            <div style={{
              fontSize:      isMobile ? 'clamp(4rem, 18vw, 5.5rem)' : 'clamp(4.5rem, 8.5vw, 7rem)',
              fontWeight:    900,
              lineHeight:    1.0,
              letterSpacing: '-0.025em',
              color:         textPri,
              fontFamily:    'var(--font-heading, sans-serif)',
            }}>
              Ajay
            </div>

            {/* "Patil" — gradient pink→purple→teal */}
            <div style={{
              fontSize:      isMobile ? 'clamp(4rem, 18vw, 5.5rem)' : 'clamp(4.5rem, 8.5vw, 7rem)',
              fontWeight:    900,
              lineHeight:    1.0,
              letterSpacing: '-0.025em',
              fontFamily:    'var(--font-heading, sans-serif)',
              background:    'linear-gradient(110deg, #ff5fa0 0%, #a855f7 45%, #4ecdc4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
              filter: dark ? 'drop-shadow(0 0 32px rgba(168,85,247,0.35))' : 'none',
            }}>
              Patil
            </div>
          </div>

          {/* Gradient underline divider — matches image 2 */}
          <div
            ref={lineRef}
            style={{
              height:       '3px',
              width:        isMobile ? '140px' : '180px',
              borderRadius: '2px',
              background:   'linear-gradient(90deg, #ff5fa0, #a855f7, #4ecdc4)',
              marginBottom: '1.1rem',
              opacity:      dark ? 0.85 : 0.70,
            }}
          />

          {/* Typewriter role */}
          <div ref={roleRef} className="mb-4">
            <span style={{
              fontSize:      isMobile ? '0.88rem' : '1.05rem',
              fontFamily:    'monospace',
              fontWeight:    600,
              color:         textMuted,
              letterSpacing: '0.02em',
              minHeight:     '1.6em',
              display:       'block',
            }}>
              <Typewriter
                texts={['Java & Spring Boot', 'React & Next.js', 'Full Stack Dev', 'Cloud Architect']}
                delay={1200}
              />
            </span>
          </div>

          {/* Tech pills — exactly as in image 2 */}
          <div
            ref={pillsRef}
            className="flex flex-wrap gap-2 mb-7"
          >
            {PILLS.map(p => (
              <TechPill key={p} label={p} theme={theme} />
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            ref={btnsRef}
            className={`flex gap-3 mb-8 ${isMobile ? 'flex-col' : 'flex-row items-center'}`}
          >
            <motion.button
              onClick={() => scrollTo('#projects')}
              className="relative overflow-hidden rounded-full font-bold px-8 py-3.5 text-white text-sm"
              style={{
                background: 'linear-gradient(135deg, #ff5fa0 0%, #a855f7 55%, #4ecdc4 100%)',
                boxShadow:  dark
                  ? '0 4px 28px rgba(168,85,247,0.35), 0 2px 14px rgba(255,95,160,0.22)'
                  : '0 4px 20px rgba(168,85,247,0.28)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)' }}
                initial={{ x: '-120%' }}
                whileHover={{ x: '120%' }}
                transition={{ duration: 0.50 }}
              />
              <span className="relative">View Projects →</span>
            </motion.button>

            <motion.button
              onClick={() => scrollTo('#contact')}
              className="rounded-full font-bold px-7 py-3.5 text-sm"
              style={{
                color:           textPri,
                border:          `1.5px solid ${btn2Bdr}`,
                backgroundColor: btn2Bg,
                backdropFilter:  'blur(14px)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              Get in Touch
            </motion.button>
          </div>

          {/* Stat cards */}
          <div ref={statsRef} className="flex items-center gap-3">
            {STATS.map((s, i) => (
              <StatCard
                key={s.label}
                value={s.value}
                label={s.label}
                color={s.color}
                delay={0.08 * i}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <span style={{
            color: textMuted, fontSize: '0.52rem',
            letterSpacing: '0.35em', fontFamily: 'monospace',
          }}>SCROLL</span>
          <motion.div
            className="w-px h-8"
            style={{ background: `linear-gradient(to bottom, #4ecdc4, transparent)` }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  )
}