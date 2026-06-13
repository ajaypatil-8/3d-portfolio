'use client'

import { motion, useReducedMotion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useCallback, memo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { useTheme } from '@/components/providers/ThemeProvider'
import Image from 'next/image'

gsap.registerPlugin(ScrollToPlugin)
type Theme = 'dark' | 'light'

/* ═══════════════════════════════════════════════════════ DATA */

const ROLES = [
  'Java Full Stack Developer',
  'Spring Boot Engineer',
  'React & Next.js Dev',
  'Cloud & Docker Enthusiast',
  'Immediate Joiner',
]

const TECH_CHIPS = [
  { label: 'Java',        color: '#f87171', icon: '☕', glow: 'rgba(248,113,113,0.35)' },
  { label: 'Spring Boot', color: '#4ade80', icon: '🌿', glow: 'rgba(74,222,128,0.35)'  },
  { label: 'React',       color: '#60a5fa', icon: '⚛️', glow: 'rgba(96,165,250,0.35)'  },
  { label: 'Next.js',     color: '#a78bfa', icon: '▲',  glow: 'rgba(167,139,250,0.35)' },
  { label: 'Docker',      color: '#38bdf8', icon: '🐳', glow: 'rgba(56,189,248,0.35)'  },
  { label: 'PostgreSQL',  color: '#fb923c', icon: '🐘', glow: 'rgba(251,146,60,0.35)'  },
]

const STATS = [
  { display: '3+',  label: 'Projects',   color: '#ff6b6b', target: 3  },
  { display: 'BCA', label: 'Final Year', color: '#4ecdc4', target: null },
  { display: '12+', label: 'Tech Stack', color: '#a855f7', target: 12 },
  { display: '∞',   label: 'Curiosity',  color: '#f59e0b', target: null },
]

const SOCIALS = [
  {
    label: 'GitHub', href: 'https://github.com/ajaypatil-8',
    hoverColor: '#e6edf3',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com/in/ajaypatil-8eight',
    hoverColor: '#0a66c2',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: 'Email', href: 'mailto:ajaypatil8eight@gmail.com',
    hoverColor: '#ea4335',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  },
]

/* ═══════════════════════════════════════════════════════ KEYFRAMES */

const KEYFRAMES = `
  @keyframes _h-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes _h-spin     { to { transform: rotate(360deg) } }
  @keyframes _h-spin-rev { to { transform: rotate(-360deg) } }
  @keyframes _h-glow     { from{opacity:.5} to{opacity:1} }
  @keyframes _h-grad     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes _h-shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
  @keyframes _h-float    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
  @keyframes _h-pulse    { 0%,100%{transform:scale(1) opacity:.6} 50%{transform:scale(1.12) opacity:1} }
  @keyframes _h-rotate-hue { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
  @keyframes _h-orb0 { 0%{transform:translate(-50%,-50%) translate(0,0)} 100%{transform:translate(-50%,-50%) translate(44px,38px)} }
  @keyframes _h-orb1 { 0%{transform:translate(-50%,-50%) translate(0,0)} 100%{transform:translate(-50%,-50%) translate(-36px,28px)} }
  @keyframes _h-orb2 { 0%{transform:translate(-50%,-50%) translate(0,0)} 100%{transform:translate(-50%,-50%) translate(-28px,-40px)} }
  @keyframes _h-orb3 { 0%{transform:translate(-50%,-50%) translate(0,0)} 100%{transform:translate(-50%,-50%) translate(32px,-24px)} }
  @keyframes _h-scan  { 0%{top:-100%} 100%{top:200%} }
  @keyframes _h-chip-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes _h-particle {
    0%   { transform: translate(0,0) scale(1);    opacity: 0.8; }
    100% { transform: translate(var(--px),var(--py)) scale(0); opacity: 0; }
  }
  @keyframes _h-code-scroll { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
  @keyframes _h-border-rotate { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }
  @keyframes _h-line-draw { from{width:0;opacity:0} to{width:100%;opacity:1} }
  @media (prefers-reduced-motion:reduce){
    *,[class*="_h-"],[style*="animation"]{animation-duration:0.001ms!important;transition-duration:0.001ms!important}
  }
`

/* ═══════════════════════════════════════════════════════ CANVAS PARTICLES (pure CSS - no canvas API, lag-free) */

const ParticleBurst = memo(function ParticleBurst({ theme }: { theme: Theme }) {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * 360
    const dist = 60 + Math.random() * 120
    const px = Math.round(Math.cos((angle * Math.PI) / 180) * dist)
    const py = Math.round(Math.sin((angle * Math.PI) / 180) * dist)
    const colors = ['#ff5fa0', '#a855f7', '#4ecdc4', '#60a5fa', '#f97316']
    const color = colors[i % colors.length]
    const size = 2 + Math.random() * 3
    const delay = Math.random() * 0.6
    const dur = 1.2 + Math.random() * 1.4
    return { px, py, color, size, delay, dur, i }
  })

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
      {particles.map(p => (
        <div
          key={p.i}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            '--px': `${p.px}px`,
            '--py': `${p.py}px`,
            animation: `_h-particle ${p.dur}s ${p.delay}s ease-out infinite`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
})

/* ═══════════════════════════════════════════════════════ AMBIENT ORB BACKGROUND */

const OrbBackground = memo(function OrbBackground({ theme }: { theme: Theme }) {
  const dark = theme === 'dark'
  const orbs = [
    { color: dark ? '#7c3aed' : '#a78bfa', x: '12%',  y: '20%',  size: 700, dur: 18, i: 0 },
    { color: dark ? '#db2777' : '#f472b6', x: '74%',  y: '15%',  size: 580, dur: 23, i: 1 },
    { color: dark ? '#0d9488' : '#2dd4bf', x: '82%',  y: '72%',  size: 620, dur: 27, i: 2 },
    { color: dark ? '#1d4ed8' : '#60a5fa', x: '8%',   y: '78%',  size: 500, dur: 21, i: 3 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, contain: 'layout paint' }} aria-hidden>
      {/* Gradient mesh */}
      <div style={{
        position: 'absolute', inset: 0,
        background: dark
          ? 'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,58,237,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(13,148,136,0.07) 0%, transparent 50%)'
          : 'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(167,139,250,0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(45,212,191,0.06) 0%, transparent 50%)',
      }} />

      {/* Animated orbs */}
      {orbs.map((orb) => (
        <div key={orb.i} style={{
          position: 'absolute', left: orb.x, top: orb.y,
          width: orb.size, height: orb.size,
          transform: 'translate(-50%,-50%)', borderRadius: '50%',
          background: `radial-gradient(circle, ${orb.color}${dark ? '24' : '18'} 0%, transparent 65%)`,
          animation: `_h-orb${orb.i} ${orb.dur}s ease-in-out infinite alternate`,
          willChange: 'transform',
        }} />
      ))}

      {/* Fine dot grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: dark ? 0.05 : 0.055 }}>
        <defs>
          <pattern id="hg2" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={dark ? '#ffffff' : '#000000'} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hg2)" />
      </svg>

      {/* Horizontal scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${dark ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.18)'} 30%, ${dark ? 'rgba(78,205,196,0.25)' : 'rgba(78,205,196,0.18)'} 70%, transparent 100%)`,
        animation: '_h-scan 10s linear infinite',
        willChange: 'top',
      }} />

      {/* Top & bottom fades */}
      <div className="absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, var(--bg-secondary), transparent)' }} />
    </div>
  )
})

/* ═══════════════════════════════════════════════════════ TYPEWRITER */

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
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c + 1) }, 48)
      return () => clearTimeout(t)
    }
    if (!del && charIdx > cur.length) {
      const t = setTimeout(() => setDel(true), 2600)
      return () => clearTimeout(t)
    }
    if (del && charIdx >= 0) {
      const t = setTimeout(() => { setDisplay(cur.slice(0, charIdx)); setCharIdx(c => c - 1) }, 22)
      return () => clearTimeout(t)
    }
    setDel(false)
    setIdx(i => (i + 1) % texts.length)
    setCharIdx(0)
  }, [started, charIdx, del, idx, texts])

  return (
    <span>
      {display}
      <span aria-hidden style={{
        display: 'inline-block', width: '2px', height: '1em',
        background: 'linear-gradient(to bottom, #ff5fa0, #a855f7, #4ecdc4)',
        marginLeft: '2px', verticalAlign: 'text-bottom',
        animation: '_h-blink 1s step-end infinite', borderRadius: '2px',
      }} />
    </span>
  )
}

/* ═══════════════════════════════════════════════════════ ANIMATED STAT */

function AnimStat({ stat }: { stat: typeof STATS[0] }) {
  const ref  = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    if (!stat.target || done.current || !ref.current) return
    const el  = ref.current
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return
      done.current = true; obs.disconnect()
      const start = performance.now()
      const dur   = 1600
      const tick  = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        const v = Math.round(ease * (stat.target as number))
        if (el) el.textContent = v + '+'
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [stat])

  return (
    <div className="flex flex-col items-center cursor-default group gap-1">
      <span ref={ref}
        className="font-heading font-black tabular-nums"
        style={{
          fontSize: 'clamp(1.3rem,2.8vw,1.9rem)',
          background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          lineHeight: 1,
          filter: `drop-shadow(0 0 10px ${stat.color}55)`,
          transition: 'filter 0.3s',
        }}
      >
        {stat.display}
      </span>
      <span style={{
        color: 'var(--text-muted)', fontSize: '0.52rem',
        fontFamily: 'monospace', letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        {stat.label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ FLOATING CHIP */

function FloatingChip({ label, sub, color, pos, delay, theme, chipDelay = 0 }: {
  label: string; sub?: string; color: string
  pos: React.CSSProperties; delay: number; theme: Theme; chipDelay?: number
}) {
  const dark = theme === 'dark'
  return (
    <motion.div
      style={{
        position: 'absolute', zIndex: 20,
        background: dark ? 'rgba(10,10,18,0.95)' : 'rgba(255,255,255,0.95)',
        border: `1px solid ${color}40`,
        borderRadius: '16px', padding: '9px 14px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px ${color}20, 0 0 20px ${color}15`,
        animation: `_h-chip-float ${3.5 + chipDelay}s ease-in-out infinite`,
        animationDelay: `${chipDelay}s`,
        willChange: 'transform',
        ...pos,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div>
        <div style={{
          fontSize: '0.48rem', fontFamily: 'monospace',
          letterSpacing: '0.10em', color,
          textTransform: 'uppercase', marginBottom: '3px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: color, display: 'inline-block',
            boxShadow: `0 0 6px ${color}`,
            animation: '_h-blink 2s ease-in-out infinite',
          }} />
          {label}
        </div>
        {sub && (
          <div style={{
            fontSize: '0.66rem', fontWeight: 700,
            color: dark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.78)',
            whiteSpace: 'nowrap',
          }}>{sub}</div>
        )}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════ CODE STREAM (decorative right panel) */

const CodeStream = memo(function CodeStream({ theme }: { theme: Theme }) {
  const dark = theme === 'dark'
  const lines = [
    { text: '@RestController',           color: '#f97316' },
    { text: '@RequestMapping("/api")',    color: '#60a5fa' },
    { text: 'class AjayController {',    color: dark ? '#e2e8f0' : '#1e293b' },
    { text: '  @Autowired',              color: '#f97316' },
    { text: '  ProjectService service;', color: dark ? '#94a3b8' : '#475569' },
    { text: '',                          color: 'transparent' },
    { text: '  @GetMapping("/hello")',   color: '#60a5fa' },
    { text: '  public String greet() {', color: dark ? '#e2e8f0' : '#1e293b' },
    { text: '    return "Hello World!";',color: '#4ade80' },
    { text: '  }',                       color: dark ? '#e2e8f0' : '#1e293b' },
    { text: '}',                         color: dark ? '#e2e8f0' : '#1e293b' },
    { text: '',                          color: 'transparent' },
    { text: '// React Component',        color: dark ? '#64748b' : '#94a3b8' },
    { text: 'const Hero = () => {',      color: dark ? '#e2e8f0' : '#1e293b' },
    { text: '  const [name] =',          color: dark ? '#94a3b8' : '#475569' },
    { text: '    useState("Ajay");',     color: '#4ade80' },
    { text: '  return <div>{name}</div>',color: '#60a5fa' },
    { text: '}',                         color: dark ? '#e2e8f0' : '#1e293b' },
    { text: '',                          color: 'transparent' },
    { text: '# Docker Deploy',           color: dark ? '#64748b' : '#94a3b8' },
    { text: 'docker build -t app .',     color: '#4ade80' },
    { text: 'docker run -p 8080:8080',   color: '#4ade80' },
    { text: '  ajay/spring-app',         color: '#4ecdc4' },
  ]

  // Double for seamless loop
  const doubled = [...lines, ...lines]

  return (
    <div style={{
      position: 'absolute',
      right: 0, top: 0, bottom: 0,
      width: '220px',
      overflow: 'hidden',
      maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
      pointerEvents: 'none',
      zIndex: 1,
      opacity: dark ? 0.22 : 0.13,
    }} aria-hidden>
      <div style={{
        animation: '_h-code-scroll 18s linear infinite',
        willChange: 'transform',
        paddingTop: '40px',
      }}>
        {doubled.map((line, i) => (
          <div key={i} style={{
            fontFamily: 'monospace', fontSize: '0.60rem',
            lineHeight: '1.9',
            paddingLeft: '16px',
            color: line.color,
            whiteSpace: 'nowrap',
          }}>
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════ MAGNETIC BUTTON */

function MagneticButton({
  children, onClick, href, target, rel, className, style, ariaLabel
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30 })
  const sy = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.25)
    y.set((e.clientY - cy) * 0.25)
  }, [x, y])

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block', cursor: 'pointer' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
    >
      <div className={className} style={style} aria-label={ariaLabel}>
        {children}
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {inner}
      </a>
    )
  }

  return (
    <div onClick={onClick} style={{ display: 'inline-block' }}>
      {inner}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ PROFILE CARD */

const ProfileCard = memo(function ProfileCard({ theme, isMobile }: { theme: Theme; isMobile: boolean }) {
  const dark = theme === 'dark'
  const size = isMobile ? 'clamp(180px,50vw,210px)' : 'clamp(240px,22vw,296px)'
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative flex-shrink-0 select-none"
      initial={{ opacity: 0, scale: 0.78, y: 20, rotateY: -12 }}
      animate={{ opacity: 1, scale: 1,     y: 0,  rotateY: 0   }}
      transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Particle burst on hover */}
      {hovered && <ParticleBurst theme={theme} />}

      {/* Outer conic ring */}
      <div style={{
        position: 'absolute', inset: '-5px', borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #ff5fa0, #a855f7, #4ecdc4, #60a5fa, #f97316, #ff5fa0)',
        animation: '_h-spin 6s linear infinite',
        willChange: 'transform', zIndex: 0,
      }} />

      {/* Middle counter-spin ring */}
      <div style={{
        position: 'absolute', inset: '5px', borderRadius: '50%',
        background: 'conic-gradient(from 60deg, #4ecdc4 0%, transparent 40%, #6366f1 60%, transparent 80%, #ff5fa0 100%)',
        animation: '_h-spin-rev 9s linear infinite',
        opacity: 0.5, willChange: 'transform', zIndex: 1,
      }} />

      {/* BG fill */}
      <div style={{
        position: 'absolute', inset: '4px', borderRadius: '50%',
        background: dark ? '#0a0a10' : '#f0f0f6', zIndex: 2,
      }} />

      {/* Animated glow halo */}
      <motion.div
        animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 0.9 : 0.5 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', inset: '-32px', borderRadius: '50%',
          background: `radial-gradient(circle, ${dark ? 'rgba(168,85,247,0.28)' : 'rgba(168,85,247,0.18)'} 0%, transparent 65%)`,
          willChange: 'transform, opacity', zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* Second color halo */}
      <div style={{
        position: 'absolute', inset: '-20px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(78,205,196,0.18) 0%, transparent 65%)`,
        animation: '_h-glow 3.5s ease-in-out infinite alternate',
        willChange: 'opacity', zIndex: 0, pointerEvents: 'none',
        animationDelay: '1.2s',
      }} />

      {/* Profile image */}
      <motion.div
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 3,
          width: size, height: size,
          borderRadius: '50%', overflow: 'hidden',
        }}
      >
        <Image
          src="/images/Profile.jpeg"
          alt="Ajay Patil"
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width:768px) 210px, 296px"
        />
        {/* Hover sheen overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? '200%' : '-100%' }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* Open-to-work badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, type: 'spring', stiffness: 250, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        style={{
          position: 'absolute', bottom: '-12px', right: '-12px', zIndex: 10,
          background: dark
            ? 'linear-gradient(135deg,rgba(10,10,22,0.97),rgba(20,20,36,0.97))'
            : 'linear-gradient(135deg,rgba(255,255,255,0.97),rgba(242,242,255,0.97))',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'}`,
          borderRadius: '16px', padding: '7px 14px',
          display: 'flex', alignItems: 'center', gap: '7px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(78,205,196,0.18), 0 0 20px rgba(78,205,196,0.12)`,
          cursor: 'default',
        }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>
        <span style={{
          color: dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.72)',
          fontSize: '0.58rem', fontFamily: 'monospace',
          letterSpacing: '0.09em', fontWeight: 700,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>Open to Work</span>
      </motion.div>

      {/* Floating chips — desktop only */}
      {!isMobile && (
        <>
          <FloatingChip label="Education"  sub="🎓 BCA Final Year · Shivaji Uni" color="#60a5fa" pos={{ top: '-16px',   left: '-150px' }} delay={1.8} theme={theme} chipDelay={0}   />
          <FloatingChip label="Exploring"  sub="Kafka · K8s · AWS"              color="#a855f7" pos={{ bottom: '30px', left: '-134px' }} delay={2.1} theme={theme} chipDelay={0.8} />
          <FloatingChip label="Live"       sub="✈ AeroSphere"                   color="#4ecdc4" pos={{ top: '24px',    right: '-126px'}} delay={2.3} theme={theme} chipDelay={1.4} />
          <FloatingChip label="Building"   sub="🚀 CrowdSpark v2"               color="#f97316" pos={{ bottom: '67px',right: '-140px'}} delay={2.5} theme={theme} chipDelay={2.1} />
        </>
      )}
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════ HERO */

export default function Hero() {
  const { theme }      = useTheme()
  const dark           = theme === 'dark'
  const prefersReduced = useReducedMotion()

  const [isMobile, setIsMobile] = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)
  const [hoveredChip, setHoveredChip] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    let t: ReturnType<typeof setTimeout>
    const h = () => { clearTimeout(t); t = setTimeout(check, 150) }
    window.addEventListener('resize', h)
    return () => { window.removeEventListener('resize', h); clearTimeout(t) }
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id)
    if (el) gsap.to(window, { duration: 1.1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }, [])

  const up = (delay: number) => ({
    initial:    { opacity: 0, y: prefersReduced ? 0 : 24 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  const bdr = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)'
  const pri = dark ? '#ffffff' : '#0a0a14'
  const mut = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.48)'

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        height: isMobile ? 'auto' : '100vh',
        minHeight: isMobile ? '100svh' : 'unset',
        maxHeight: isMobile ? 'none' : '100vh',
        display: 'flex', alignItems: 'center',
      }}
    >
      {/* ── Keyframes ── */}
      <style>{KEYFRAMES}</style>

      {/* ── Ambient background ── */}
      {mounted && <OrbBackground theme={theme} />}

      {/* ── Code stream (desktop decorative) ── */}
      {mounted && !isMobile && <CodeStream theme={theme} />}

      {/* ── Main content ── */}
      <div className="relative w-full" style={{ zIndex: 10, paddingTop: '72px' }}>
        <div className={`mx-auto px-6 ${
          isMobile
            ? 'max-w-sm flex flex-col items-center gap-10 pb-16 pt-4'
            : 'max-w-6xl flex flex-row items-center justify-between gap-8 py-0'
        }`} style={{ height: isMobile ? 'auto' : 'calc(100vh - 72px)' }}>

          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div
            className={`flex flex-col ${isMobile ? 'items-center text-center w-full' : 'items-start text-left'}`}
            style={{ flex: '0 0 auto', maxWidth: isMobile ? '100%' : '520px' }}
          >

            {/* ── Availability pill ── */}
            <motion.div className="mb-4" {...up(0.48)}>
              <div
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2"
                style={{
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${bdr}`,
                  backdropFilter: 'blur(10px)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* shimmer sweep */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '9999px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                  animation: '_h-shimmer 4s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span style={{ color: mut, fontSize: '0.57rem', fontFamily: 'monospace', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  Open to Jobs &amp; Internships
                </span>
                <span style={{
                  color: dark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)',
                  fontSize: '0.52rem', fontFamily: 'monospace',
                }}>
                  📍 Palus, MH
                </span>
              </div>
            </motion.div>

            {/* ── Greeting ── */}
            <motion.div className="mb-1" {...up(0.58)}>
              <span style={{
                fontSize: isMobile ? '0.68rem' : '0.76rem',
                color: mut, fontFamily: 'monospace',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                Hi there, I'm
                <motion.span
                  style={{ display: 'inline-block' }}
                  animate={{ rotate: [0, 0, 22, 0, 22, 0] }}
                  transition={{ delay: 2.0, duration: 1.0, repeat: 0 }}
                >
                  👋
                </motion.span>
              </span>
            </motion.div>

            {/* ── Name ── */}
            <motion.div className="mb-3" style={{ lineHeight: 0.95 }} {...up(0.66)}>
              {/* "Ajay" — solid */}
              <div
                className="font-heading font-black"
                style={{
                  fontSize: isMobile ? 'clamp(3.4rem,16vw,4.8rem)' : 'clamp(3.6rem,6.5vw,5.8rem)',
                  letterSpacing: '-0.03em', lineHeight: 1.0, color: pri,
                  position: 'relative', display: 'inline-block',
                }}
              >
                Ajay
              </div>
              {/* "Patil." — animated gradient */}
              <div
                className="font-heading font-black"
                style={{
                  fontSize: isMobile ? 'clamp(3.4rem,16vw,4.8rem)' : 'clamp(3.6rem,6.5vw,5.8rem)',
                  letterSpacing: '-0.03em', lineHeight: 1.05,
                  background: 'linear-gradient(110deg, #ff5fa0 0%, #a855f7 30%, #4ecdc4 60%, #60a5fa 80%, #ff5fa0 100%)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  animation: '_h-grad 5.5s ease infinite',
                  filter: dark ? 'drop-shadow(0 0 28px rgba(168,85,247,0.45))' : 'drop-shadow(0 0 16px rgba(168,85,247,0.28))',
                  display: 'block',
                }}
              >
                Patil.
              </div>
            </motion.div>

            {/* ── Decorative accent bar ── */}
            <motion.div
              className="mb-4"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center' }}
            >
              <div style={{
                height: '3px', width: '160px', borderRadius: '2px',
                background: 'linear-gradient(90deg, #ff5fa0, #a855f7, #4ecdc4)',
                opacity: dark ? 0.9 : 0.75,
                boxShadow: dark ? '0 0 12px rgba(168,85,247,0.5)' : 'none',
              }} />
            </motion.div>

            {/* ── Typewriter role ── */}
            <motion.div className="mb-4" {...up(0.82)}>
              <p style={{
                fontSize: isMobile ? '0.88rem' : '0.98rem',
                fontFamily: 'monospace', fontWeight: 600,
                color: mut, minHeight: '1.6em',
              }}>
                <Typewriter texts={ROLES} delay={900} />
              </p>
            </motion.div>

            {/* ── Bio ── */}
            <motion.p
              className="mb-5"
              style={{ fontSize: isMobile ? '0.82rem' : '0.89rem', color: mut, lineHeight: 1.82, maxWidth: '440px' }}
              {...up(0.90)}
            >
              Backend-focused full-stack developer building production-grade Spring Boot APIs,
              Dockerized cloud deployments, and reactive React interfaces.
              BCA Final Year · Immediate Joiner.
            </motion.p>

            {/* ── Tech chips ── */}
            <motion.div
              className={`flex flex-wrap gap-1.5 mb-6 ${isMobile ? 'justify-center' : ''}`}
              {...up(0.96)}
            >
              {TECH_CHIPS.map((c, i) => (
                <motion.span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  transition={{ delay: 1.0 + i * 0.06, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    scale: 1.12, y: -3,
                    boxShadow: `0 6px 20px ${c.glow}, 0 0 0 1px ${c.color}60`,
                    transition: { duration: 0.15 },
                  }}
                  onHoverStart={() => setHoveredChip(c.label)}
                  onHoverEnd={() => setHoveredChip(null)}
                  style={{
                    border: `1px solid ${hoveredChip === c.label ? c.color + '70' : c.color + '38'}`,
                    color: c.color,
                    background: hoveredChip === c.label ? `${c.color}18` : `${c.color}0d`,
                    borderRadius: '999px', padding: '4px 11px',
                    fontSize: '0.58rem', fontWeight: 700,
                    letterSpacing: '0.09em', fontFamily: 'monospace',
                    whiteSpace: 'nowrap', cursor: 'default',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  {/* Shimmer on hover */}
                  {hoveredChip === c.label && (
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: '999px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                      animation: '_h-shimmer 1s ease-in-out',
                      pointerEvents: 'none',
                    }} />
                  )}
                  <span style={{ fontSize: '0.70rem', position: 'relative' }}>{c.icon}</span>
                  <span style={{ position: 'relative' }}>{c.label.toUpperCase()}</span>
                </motion.span>
              ))}
            </motion.div>

            {/* ── CTA buttons ── */}
            <motion.div
              className={`flex flex-wrap gap-2.5 mb-6 ${isMobile ? 'justify-center' : ''}`}
              {...up(1.02)}
            >
              {/* Primary — gradient shimmer */}
              <motion.button
                onClick={() => scrollTo('#projects')}
                className="relative overflow-hidden rounded-full font-bold px-6 py-2.5 text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #ff5fa0 0%, #a855f7 55%, #4ecdc4 100%)',
                  boxShadow: dark
                    ? '0 4px 28px rgba(168,85,247,0.50), 0 2px 14px rgba(255,95,160,0.30)'
                    : '0 4px 22px rgba(168,85,247,0.34)',
                  letterSpacing: '0.02em', border: 'none', cursor: 'pointer',
                  backgroundSize: '200% 200%', animation: '_h-grad 4s ease infinite',
                }}
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.94 }}
              >
                <span style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
                  animation: '_h-shimmer 2.2s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
                <span className="relative">View Projects →</span>
              </motion.button>

              {/* Secondary */}
              <motion.button
                onClick={() => scrollTo('#contact')}
                className="rounded-full font-bold px-5 py-2.5 text-sm"
                style={{
                  color: pri,
                  border: `1.5px solid ${dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.13)'}`,
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  letterSpacing: '0.02em', cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                whileHover={{
                  scale: 1.07, y: -2,
                  background: dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
                }}
                whileTap={{ scale: 0.94 }}
              >
                Get in Touch
              </motion.button>

              {/* Resume */}
              <motion.a
                href="/resume/Ajay_Patil_Resume.pdf"
                target="_blank" rel="noopener noreferrer"
                className="rounded-full font-bold px-5 py-2.5 text-sm inline-flex items-center gap-1.5"
                style={{
                  color: '#a855f7', border: '1.5px solid rgba(168,85,247,0.35)',
                  background: 'rgba(168,85,247,0.08)',
                  letterSpacing: '0.02em', textDecoration: 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
                whileHover={{
                  scale: 1.07, y: -2,
                  background: 'rgba(168,85,247,0.14)',
                  boxShadow: '0 4px 20px rgba(168,85,247,0.30)',
                }}
                whileTap={{ scale: 0.94 }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Résumé
              </motion.a>
            </motion.div>

            {/* ── Stats ── */}
            <motion.div
              className={`flex items-center gap-4 mb-6 ${isMobile ? 'justify-center' : ''}`}
              {...up(1.08)}
            >
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  <AnimStat stat={s} />
                  {i < STATS.length - 1 && (
                    <div className="w-px h-8" style={{ background: bdr }} />
                  )}
                </div>
              ))}
            </motion.div>

            {/* ── Social links ── */}
            <motion.div
              className={`flex items-center gap-2.5 ${isMobile ? 'justify-center' : ''}`}
              {...up(1.14)}
            >
              <span style={{
                fontSize: '0.52rem', fontFamily: 'monospace',
                letterSpacing: '0.11em', color: mut, textTransform: 'uppercase',
              }}>
                Find me
              </span>
              {SOCIALS.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: '36px', height: '36px',
                    color: hoveredSocial === s.label ? s.hoverColor : (dark ? 'rgba(255,255,255,0.44)' : 'rgba(0,0,0,0.42)'),
                    border: `1px solid ${hoveredSocial === s.label ? s.hoverColor + '50' : bdr}`,
                    background: hoveredSocial === s.label
                      ? s.hoverColor + '16'
                      : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                    textDecoration: 'none',
                    transition: 'color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s',
                    boxShadow: hoveredSocial === s.label ? `0 4px 18px ${s.hoverColor}30` : 'none',
                  }}
                  onMouseEnter={() => setHoveredSocial(s.label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  whileHover={{ scale: 1.16, y: -2 }}
                  whileTap={{ scale: 0.90 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ══════════════ RIGHT COLUMN ══════════════ */}
          {mounted && (
            <div
              className={`flex-shrink-0 flex items-center justify-center ${isMobile ? 'order-first' : ''}`}
              style={{ position: 'relative', paddingRight: isMobile ? 0 : '24px' }}
            >
              <ProfileCard theme={theme} isMobile={isMobile} />
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <AnimatePresence>
        {!isMobile && mounted && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.7 }}
          >
            <span style={{
              color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.24)',
              fontSize: '0.44rem', letterSpacing: '0.45em',
              fontFamily: 'monospace', textTransform: 'uppercase',
            }}>
              Scroll
            </span>
            <motion.div
              className="w-px rounded-full"
              style={{ height: '36px', background: 'linear-gradient(to bottom, #a855f7, transparent)' }}
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}