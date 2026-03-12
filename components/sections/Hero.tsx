'use client'

import { Canvas }            from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion }            from 'framer-motion'
import { useEffect, useState, useCallback, memo } from 'react'
import { gsap }              from 'gsap'
import { ScrollToPlugin }    from 'gsap/dist/ScrollToPlugin'
import { useTheme }          from '@/components/providers/ThemeProvider'
import GeometricBackground   from '@/components/3d/GeometricBackground'
import CentralScene          from '@/components/3d/InteractiveModelViewer'

gsap.registerPlugin(ScrollToPlugin)

/* ─── Typewriter ──────────────────────────────────────────────────────────── */
function Typewriter({ texts, delay = 0 }: { texts: string[]; delay?: number }) {
  const [display, setDisplay]   = useState('')
  const [idx, setIdx]           = useState(0)
  const [charIdx, setCharIdx]   = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [started, setStarted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const cur = texts[idx]
    if (!deleting && charIdx <= cur.length) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c + 1) }, 68)
      return () => clearTimeout(t)
    }
    if (!deleting && charIdx > cur.length) {
      const t = setTimeout(() => setDeleting(true), 2300); return () => clearTimeout(t)
    }
    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c - 1) }, 32)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx < 0) {
      setDeleting(false); setIdx(i => (i + 1) % texts.length); setCharIdx(0)
    }
  }, [started, charIdx, deleting, idx, texts])

  return (
    <span>
      {display}
      <span style={{
        display: 'inline-block', width: '2px', height: '1em',
        background: '#4ecdc4', marginLeft: '2px',
        verticalAlign: 'text-bottom',
        animation: 'hero-blink 1s step-end infinite',
      }} />
    </span>
  )
}

/* ─── 3-D Scene — full viewport canvas, orb offset right on desktop ───────── */
const Scene = memo(function Scene({
  theme, isMobile,
}: {
  theme: 'dark' | 'light'
  isMobile: boolean
}) {
  return (
    <Canvas
      dpr={isMobile ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.8)}
      frameloop="always"
      gl={{
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
        stencil: false,
        alpha: true,
      }}
    >
      {/*
        Camera looks straight ahead.
        On desktop we shift the CentralScene group to the right (+2.8 x)
        so the plasma orb is centered inside the right column.
      */}
      <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={50} />

      {/* Atmospheric background — full spread */}
      <GeometricBackground theme={theme} />

      {/* Main 3-D centerpiece — pushed right on desktop */}
      <group position={isMobile ? [0, 0, 0] : [2.8, 0, 0]}>
        <CentralScene theme={theme} isMobile={isMobile} />
      </group>
    </Canvas>
  )
})

/* ─── Chip ────────────────────────────────────────────────────────────────── */
function Chip({
  children, color = '#4ecdc4', delay = 0,
}: {
  children: string; color?: string; delay?: number
}) {
  const { theme } = useTheme()
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.80 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'inline-block',
        padding: '4px 13px',
        borderRadius: '999px',
        border: `1px solid ${color}40`,
        background: `${color}0e`,
        color: theme === 'light' ? `${color}bb` : `${color}cc`,
        fontSize: '0.67rem',
        fontFamily: 'monospace',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(6px)',
        userSelect: 'none',
      }}
    >
      {children}
    </motion.span>
  )
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({
  value, label, color, delay,
}: {
  value: string; label: string; color: string; delay: number
}) {
  const { theme } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        padding: '10px 18px',
        borderRadius: '12px',
        border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
        background: theme === 'light' ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(18px)',
        minWidth: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />
      <span style={{
        fontWeight: 800,
        fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
      }}>
        {value}
      </span>
      <span style={{
        color: theme === 'light' ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.35)',
        fontSize: '0.58rem', fontFamily: 'monospace',
        letterSpacing: '0.13em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </motion.div>
  )
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { theme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(timer); timer = setTimeout(check, 120) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer) }
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id)
    if (el) gsap.to(window, { duration: 1.1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }, [])

  const bg     = theme === 'light' ? '#f2f2f7' : '#050508'
  const vigRgb = theme === 'light' ? '242,242,247' : '5,5,8'

  const STATS = [
    { value: '2',   label: 'Projects',   color: '#ff6b6b' },
    { value: 'BCA', label: '3rd Year',   color: '#4ecdc4' },
    { value: '8+',  label: 'Tech Stack', color: '#a855f7' },
  ]

  const CHIPS = [
    { text: 'Java',        color: '#ff6b6b' },
    { text: 'Spring Boot', color: '#4ecdc4' },
    { text: 'React',       color: '#60a5fa' },
    { text: 'Next.js',     color: '#a855f7' },
    { text: 'Docker',      color: '#34d399' },
    { text: 'Cloud',       color: '#fbbf24' },
  ]

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: bg,
        height:    isMobile ? '100svh' : '100vh',
        minHeight: isMobile ? '100svh' : '100vh',
      }}
    >
      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hero-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hero-ping  { 75%,100%{transform:scale(2.2);opacity:0} }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 0 — Full-viewport 3-D canvas (behind everything)
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {mounted && <Scene theme={theme} isMobile={isMobile} />}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 1 — Gradient masks so text is always readable
          On desktop: strong left-side fade covers ~50% width
          On mobile:  radial vignette + top+bottom fades
      ══════════════════════════════════════════════════════════════════ */}

      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '110px',
        zIndex: 1, pointerEvents: 'none',
        background: `linear-gradient(to bottom, ${bg}ee, transparent)`,
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
        zIndex: 1, pointerEvents: 'none',
        background: `linear-gradient(to top, ${bg}, transparent)`,
      }} />

      {/* Desktop — solid left panel backing the text column */}
      {!isMobile && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '52%',
          zIndex: 1, pointerEvents: 'none',
          /* deep solid on the left, feathering into transparent on the right */
          background: theme === 'dark'
            ? `linear-gradient(to right,
                rgba(5,5,8,0.97)  0%,
                rgba(5,5,8,0.92) 55%,
                rgba(5,5,8,0.60) 78%,
                rgba(5,5,8,0.00) 100%)`
            : `linear-gradient(to right,
                rgba(242,242,247,0.98)  0%,
                rgba(242,242,247,0.93) 55%,
                rgba(242,242,247,0.62) 78%,
                rgba(242,242,247,0.00) 100%)`,
        }} />
      )}

      {/* Mobile — radial vignette to separate text from 3-D */}
      {isMobile && (
        <div style={{
          position: 'absolute', inset: 0,
          zIndex: 1, pointerEvents: 'none',
          background: `radial-gradient(ellipse 90% 65% at 50% 62%,
            rgba(${vigRgb},0.0) 0%,
            rgba(${vigRgb},0.50) 45%,
            rgba(${vigRgb},0.92) 100%)`,
        }} />
      )}

      {/* Right-edge soft fade (desktop) — blends 3-D into bg on far right */}
      {!isMobile && (
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '12%',
          zIndex: 1, pointerEvents: 'none',
          background: `linear-gradient(to left, ${bg}cc, transparent)`,
        }} />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 2 — UI content
          Desktop: flex row → left column (text) + right spacer (3D shows through)
          Mobile:  flex column → 3D peek at top, text below centered
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-end' : 'center',
      }}>

        {/* ── LEFT / BOTTOM text column ───────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          gap: isMobile ? '1.0rem' : '1.25rem',
          padding: isMobile
            ? '0 1.4rem 3.5rem 1.4rem'
            : '0 0 0 clamp(2.5rem, 5vw, 5rem)',
          width: isMobile ? '100%' : '50%',
          flexShrink: 0,
        }}>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px',
              padding: '5px 16px 5px 10px',
              borderRadius: '999px',
              border: `1px solid ${theme === 'light' ? 'rgba(78,205,196,0.28)' : 'rgba(78,205,196,0.20)'}`,
              background: theme === 'light' ? 'rgba(255,255,255,0.70)' : 'rgba(78,205,196,0.06)',
              backdropFilter: 'blur(16px)',
            }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
                <span style={{ position:'absolute',inset:0,borderRadius:'50%',background:'#22d37a',opacity:0.75,animation:'hero-ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                <span style={{ position:'relative',width:'8px',height:'8px',borderRadius:'50%',background:'#22d37a' }} />
              </span>
              <span style={{
                fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.10em',
                color: theme === 'light' ? 'rgba(0,0,0,0.52)' : 'rgba(255,255,255,0.52)',
                textTransform: 'uppercase',
              }}>
                Open to Jobs &amp; Internships
              </span>
            </span>
          </motion.div>

          {/* Name */}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                margin: 0, fontWeight: 900, lineHeight: 0.93,
                letterSpacing: '-0.03em',
                fontSize: isMobile
                  ? 'clamp(3.6rem, 17vw, 6rem)'
                  : 'clamp(4.5rem, 8.5vw, 7.5rem)',
              }}
            >
              <span style={{
                display: 'block',
                color: theme === 'light' ? '#111118' : '#eeeeff',
              }}>
                Ajay
              </span>
              <span style={{
                display: 'block',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #a855f7 48%, #4ecdc4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: theme === 'dark' ? 'drop-shadow(0 0 36px rgba(168,85,247,0.42))' : 'none',
              }}>
                Patil
              </span>
            </motion.h1>
          </div>

          {/* Accent line under name */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '2px',
              width: isMobile ? '140px' : '200px',
              transformOrigin: isMobile ? 'center' : 'left',
              background: 'linear-gradient(90deg, #ff6b6b, #a855f7, #4ecdc4)',
              borderRadius: '2px',
            }}
          />

          {/* Typewriter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.95 }}
            style={{
              margin: 0,
              fontFamily: 'monospace', fontWeight: 600,
              fontSize: isMobile ? 'clamp(0.82rem, 3.2vw, 1.05rem)' : 'clamp(0.95rem, 1.8vw, 1.25rem)',
              color: theme === 'light' ? 'rgba(0,0,0,0.52)' : 'rgba(238,238,255,0.58)',
              letterSpacing: '0.02em',
              minHeight: '1.65em',
            }}
          >
            <Typewriter
              texts={['Full Stack Developer', 'Java + Spring Boot', 'React + Next.js', 'Cloud Architect']}
              delay={1500}
            />
          </motion.p>

          {/* Tech chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.10 }}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '7px',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            {CHIPS.map((c, i) => (
              <Chip key={c.text} color={c.color} delay={1.15 + i * 0.055}>{c.text}</Chip>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.40 }}
            style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            <motion.button
              onClick={() => scrollTo('#projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative', overflow: 'hidden',
                padding: isMobile ? '11px 24px' : '12px 30px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #a855f7 55%, #4ecdc4 100%)',
                border: 'none', borderRadius: '999px',
                color: '#fff', fontWeight: 700, cursor: 'pointer',
                fontSize: isMobile ? '0.84rem' : '0.90rem',
                boxShadow: theme === 'dark'
                  ? '0 0 36px rgba(255,107,107,0.26), 0 4px 20px rgba(168,85,247,0.20)'
                  : '0 4px 20px rgba(255,107,107,0.30)',
              }}
            >
              <motion.span
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                }}
                initial={{ x: '-120%' }}
                whileHover={{ x: '120%' }}
                transition={{ duration: 0.50 }}
              />
              <span style={{ position: 'relative' }}>View Projects →</span>
            </motion.button>

            <motion.button
              onClick={() => scrollTo('#contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: isMobile ? '11px 24px' : '12px 30px',
                background: theme === 'light' ? 'rgba(255,255,255,0.60)' : 'rgba(78,205,196,0.06)',
                border: `1.5px solid ${theme === 'light' ? 'rgba(99,102,241,0.30)' : 'rgba(78,205,196,0.30)'}`,
                borderRadius: '999px',
                color: theme === 'light' ? '#111118' : '#eeeeff',
                fontWeight: 600, cursor: 'pointer',
                fontSize: isMobile ? '0.84rem' : '0.90rem',
                backdropFilter: 'blur(14px)',
                boxShadow: theme === 'dark' ? '0 0 20px rgba(78,205,196,0.06)' : 'none',
              }}
            >
              Get in Touch
            </motion.button>
          </motion.div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '10px',
            justifyContent: isMobile ? 'center' : 'flex-start',
            paddingTop: '2px',
          }}>
            {STATS.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} color={s.color} delay={1.50 + i * 0.09} />
            ))}
          </div>
        </div>

        {/* ── RIGHT spacer — 3-D shows through here ──────────────────────── */}
        {!isMobile && <div style={{ flex: 1 }} />}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 3 — Decorative chrome
      ══════════════════════════════════════════════════════════════════ */}

      {/* Thin vertical separator line (desktop) */}
      {!isMobile && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: '50%', top: '12%', bottom: '12%',
            width: '1px',
            transformOrigin: 'top center',
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.22) 30%, rgba(168,85,247,0.18) 70%, transparent)'
              : 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.35) 30%, rgba(168,85,247,0.28) 70%, transparent)',
            zIndex: 8,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Section label — bottom left */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          style={{
            position: 'absolute', bottom: '2.2rem', left: 'clamp(2.5rem,5vw,5rem)',
            zIndex: 20, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
        >
          <div style={{ width: '22px', height: '1px', background: theme === 'light' ? 'rgba(0,0,0,0.20)' : 'rgba(255,255,255,0.18)' }} />
        </motion.div>
      )}

      {/* Scroll cue — bottom center */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          style={{
            position: 'absolute', bottom: '1.8rem', left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
          }}
        >
          <span style={{
            fontFamily: 'monospace', fontSize: '0.50rem', letterSpacing: '0.26em',
            color: theme === 'light' ? 'rgba(0,0,0,0.20)' : 'rgba(255,255,255,0.20)',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <motion.div
            style={{ width: '1px', background: 'linear-gradient(to bottom, #4ecdc4, transparent)' }}
            animate={{ height: ['0px', '36px', '0px'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  )
}