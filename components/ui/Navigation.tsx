'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import Image from 'next/image'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useTheme } from '@/components/providers/ThemeProvider'

gsap.registerPlugin(ScrollToPlugin)

const PROFILE_IMG = '/images/Profile.jpeg'
const RESUME_FILE = '/resume/Ajay_Patil_Resume.pdf'
const SECTION_IDS = ['hero', 'projects', 'skills', 'about', 'experience', 'contact']

const navItems = [
  { name: 'Home',       href: '#hero',       icon: '⌂' },
  { name: 'Projects',   href: '#projects',   icon: '⬡' },
  { name: 'Skills',     href: '#skills',     icon: '◈' },
  { name: 'About',      href: '#about',      icon: '◎' },
  { name: 'Experience', href: '#experience', icon: '◆' },
  { name: 'Contact',    href: '#contact',    icon: '◉' },
]

/* ════════════════════════════════════════════ CSS */
const NAV_CSS = `
@keyframes nav-spin    { to { transform: rotate(360deg) } }
@keyframes nav-shimmer { 0%{transform:translateX(-130%) skewX(-15deg)} 100%{transform:translateX(230%) skewX(-15deg)} }
@keyframes nav-grad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes nav-pulse   { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
@keyframes nav-glow    { 0%,100%{box-shadow:0 0 6px rgba(168,85,247,.5)} 50%{box-shadow:0 0 18px rgba(168,85,247,.9),0 0 32px rgba(78,205,196,.4)} }
@keyframes nav-rise    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes nav-bar-in  { from{scaleX:0} to{scaleX:1} }
@keyframes nav-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes nav-orbit   { from{transform:rotate(0deg) translateX(14px) rotate(0deg)} to{transform:rotate(360deg) translateX(14px) rotate(-360deg)} }
@keyframes nav-particle{ 0%{transform:translate(0,0) scale(1);opacity:.8} 100%{transform:translate(var(--px),var(--py)) scale(0);opacity:0} }

@media (prefers-reduced-motion:reduce){
  *[style*="nav-"],*[class*="nav-"]{animation:none!important;transition:none!important}
}
`

/* ════════════════════════════════════════════ PARTICLE BURST */
type Particle = { id: number; x: number; y: number; px: string; py: string; color: string }

function ParticleBurst({ active, color }: { active: boolean; color: string }) {
  const particles: Particle[] = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: 50, y: 50,
    px: `${(Math.cos((i / 6) * Math.PI * 2) * 20).toFixed(1)}px`,
    py: `${(Math.sin((i / 6) * Math.PI * 2) * 20).toFixed(1)}px`,
    color,
  }))
  if (!active) return null
  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: '3px', height: '3px',
          borderRadius: '50%',
          backgroundColor: p.color,
          '--px': p.px, '--py': p.py,
          animation: `nav-particle 0.5s ease-out forwards`,
          pointerEvents: 'none',
          zIndex: 20,
        } as React.CSSProperties} />
      ))}
    </>
  )
}

/* ════════════════════════════════════════════ LOGO MARK */
function LogoMark({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      className="relative flex-shrink-0"
      style={{ width: 36, height: 36 }}
      whileHover={{ scale: 1.10 }}
      whileTap={{ scale: 0.93 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      aria-label="View profile photo"
    >
      {/* Spinning conic ring */}
      <div style={{
        position: 'absolute', inset: '-2px', borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #ff6b6b, #a855f7, #4ecdc4, #60a5fa, #ff6b6b)',
        animation: 'nav-spin 5s linear infinite',
        willChange: 'transform',
      }} />
      {/* BG fill */}
      <div style={{
        position: 'absolute', inset: '1.5px', borderRadius: '50%',
        backgroundColor: 'var(--bg-primary)',
      }} />
      {/* Inner counter ring */}
      <div style={{
        position: 'absolute', inset: '3px', borderRadius: '50%',
        border: `1px solid ${hov ? 'rgba(168,85,247,0.35)' : 'transparent'}`,
        transition: 'border-color 0.25s',
      }} />
      {/* Orbiting dot — shows on hover */}
      {hov && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '4px', height: '4px', borderRadius: '50%',
            backgroundColor: '#a855f7',
            boxShadow: '0 0 6px rgba(168,85,247,0.9)',
            animation: 'nav-orbit 1.2s linear infinite',
          }} />
        </div>
      )}
      {/* Profile photo */}
      <div className="absolute inset-[2.5px] rounded-full overflow-hidden">
        <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="36px" priority />
      </div>
      {/* Online dot */}
      <motion.span
        className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
        style={{ width: 10, height: 10, backgroundColor: '#4ade80', borderColor: 'var(--bg-primary)' }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Glow on hover */}
      {hov && (
        <div style={{
          position: 'absolute', inset: '-6px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 65%)',
          pointerEvents: 'none',
          animation: 'nav-glow 1.5s ease-in-out infinite',
        }} />
      )}
    </motion.button>
  )
}

/* ════════════════════════════════════════════ NAV LINK */
function NavLink({
  item, isActive, hovered, onEnter, onLeave, onClick
}: {
  item: typeof navItems[0]
  isActive: boolean
  hovered: boolean
  onEnter: () => void
  onLeave: () => void
  onClick: () => void
}) {
  const [burst, setBurst] = useState(false)

  const handleClick = () => {
    setBurst(true)
    setTimeout(() => setBurst(false), 600)
    onClick()
  }

  return (
    <motion.a
      href={item.href}
      className="relative px-3 lg:px-4 py-2 rounded-full text-sm font-medium overflow-hidden select-none"
      style={{
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
      onClick={e => { e.preventDefault(); handleClick() }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.94 }}
    >
      {/* Hover bg */}
      <AnimatePresence>
        {hovered && !isActive && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'var(--bg-card-hover)' }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* Active bg */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
        )}
      </AnimatePresence>

      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
            initial={{ x: '-130%' }}
            animate={{ x: '230%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
        )}
      </AnimatePresence>

      {/* Label */}
      <span className="relative z-10">{item.name}</span>

      {/* Active underbar */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className="absolute bottom-0.5 left-1/2 h-[2px] rounded-full"
            style={{ background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)', x: '-50%' }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '55%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Particle burst on click */}
      <ParticleBurst active={burst} color={isActive ? '#a855f7' : '#4ecdc4'} />
    </motion.a>
  )
}

/* ════════════════════════════════════════════ HIRE ME BUTTON */
function HireMeButton() {
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
      target="_blank" rel="noopener noreferrer"
      className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #a855f7 55%, #4ecdc4 100%)',
        backgroundSize: '200% 200%',
        animation: 'nav-grad 5s ease infinite',
        boxShadow: hov
          ? '0 0 24px rgba(168,85,247,0.55), 0 0 48px rgba(168,85,247,0.20)'
          : '0 4px 16px rgba(168,85,247,0.30)',
        transition: 'box-shadow 0.3s ease',
        textDecoration: 'none',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.8 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }}
        initial={{ x: '-130%' }}
        animate={hov ? { x: '230%' } : { x: '-130%' }}
        transition={{ duration: 0.50 }}
      />
      {/* Orbiting dot on button */}
      {hov && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '999px',
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '4px', height: '4px', marginTop: '-2px', marginLeft: '-2px',
            borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)',
            animation: 'nav-orbit 1.2s linear infinite',
          }} />
        </div>
      )}
      <span className="relative">Mail me</span>
      <motion.span
        className="relative"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >→</motion.span>
    </motion.a>
  )
}

/* ════════════════════════════════════════════ RESUME BUTTON */
function ResumeButton() {
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href={RESUME_FILE}
      target="_blank" rel="noopener noreferrer"
      className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold relative overflow-hidden"
      style={{
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-strong)',
        textDecoration: 'none',
        boxShadow: hov ? '0 4px 16px rgba(168,85,247,0.15)' : 'none',
        transition: 'box-shadow 0.25s, border-color 0.25s',
        borderColor: hov ? 'rgba(168,85,247,0.35)' : undefined,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.7 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shimmer */}
      <motion.span
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.10), transparent)' }}
        initial={{ x: '-130%' }}
        animate={hov ? { x: '230%' } : { x: '-130%' }}
        transition={{ duration: 0.45 }}
      />
      <motion.svg
        className="w-3.5 h-3.5 opacity-60 relative"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
        animate={hov ? { y: [0, 2, 0] } : {}}
        transition={{ duration: 0.8, repeat: hov ? Infinity : 0, ease: 'easeInOut' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </motion.svg>
      <span className="relative">Resume</span>
    </motion.a>
  )
}

/* ════════════════════════════════════════════ HAMBURGER */
function Hamburger({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  const textColor = 'var(--text-primary)'
  return (
    <motion.button
      className="md:hidden relative flex flex-col items-center justify-center gap-[5px] rounded-xl"
      style={{
        width: 40, height: 40,
        backgroundColor: isOpen ? 'var(--bg-card)' : 'transparent',
        border: isOpen ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <motion.span className="block rounded-full origin-center"
        style={{ width: 20, height: 1.5, backgroundColor: textColor }}
        animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.28 }} />
      <motion.span className="block rounded-full"
        style={{ width: 20, height: 1.5, backgroundColor: textColor }}
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }} />
      <motion.span className="block rounded-full origin-center"
        style={{ width: 20, height: 1.5, backgroundColor: textColor }}
        animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.28 }} />
    </motion.button>
  )
}

/* ════════════════════════════════════════════ PROGRESS BAR */
function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const maxY = document.documentElement.scrollHeight - window.innerHeight
        if (ref.current) ref.current.style.transform = `scaleX(${maxY > 0 ? window.scrollY / maxY : 0})`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[200] pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, #ff6b6b, #a855f7, #4ecdc4)',
        backgroundSize: '200% 100%',
        animation: 'nav-grad 3s ease infinite',
        transform: 'scaleX(0)',
      }}
    />
  )
}

/* ════════════════════════════════════════════ MAIN */
export default function Navigation() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [isOpen,        setIsOpen]        = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredItem,   setHoveredItem]   = useState<string | null>(null)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [navHidden,     setNavHidden]     = useState(false)

  const lastScrollY   = useRef(0)
  const scrolling     = useRef(false)
  const rafPending    = useRef(false)
  const scrolledRef   = useRef(false)
  const isOpenRef     = useRef(false)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  /* Single RAF-throttled scroll handler */
  useEffect(() => {
    const onScroll = () => {
      if (rafPending.current) return
      rafPending.current = true
      requestAnimationFrame(() => {
        rafPending.current = false
        const y = window.scrollY

        const nowScrolled = y > 60
        if (nowScrolled !== scrolledRef.current) {
          scrolledRef.current = nowScrolled
          setScrolled(nowScrolled)
        }

        if (!scrolling.current) {
          const pos = y + window.innerHeight * 0.35
          let current = SECTION_IDS[0]
          for (const id of SECTION_IDS) {
            const el = document.getElementById(id)
            if (el && el.offsetTop <= pos) current = id
          }
          setActiveSection(current)
        }

        if (window.innerWidth < 768 && !isOpenRef.current) {
          setNavHidden(y > lastScrollY.current && y > 120)
        } else {
          setNavHidden(false)
        }
        lastScrollY.current = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (isOpen || lightboxOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen, lightboxOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLightboxOpen(false); setIsOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) {
      scrolling.current = true
      setActiveSection(href.replace('#', ''))
      gsap.to(window, {
        duration: 1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut',
        onComplete: () => { scrolling.current = false },
      })
    }
  }, [])

  const textColor  = 'var(--text-primary)'
  const mutedColor = 'var(--text-muted)'
  const bdr        = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'

  return (
    <>
      <style>{NAV_CSS}</style>
      <ProgressBar />

      {/* ── Nav bar ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          backgroundColor:      scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter:       scrolled ? 'blur(16px)'    : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)'    : 'none',
          borderBottom:         scrolled ? `1px solid var(--footer-border)` : '1px solid transparent',
          boxShadow:            scrolled ? '0 4px 32px rgba(0,0,0,0.10)' : 'none',
          transition:           'background-color 0.4s, backdrop-filter 0.4s, border-color 0.4s, box-shadow 0.4s',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: navHidden ? -80 : 0, opacity: navHidden ? 0 : 1 }}
        transition={navHidden
          ? { duration: 0.28, ease: 'easeIn' }
          : { duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Scrolled: animated gradient top border */}
        {scrolled && (
          <div style={{
            position: 'absolute', top: 0, insetInline: 0, height: '1px',
            background: 'linear-gradient(90deg, #ff6b6b, #a855f7, #4ecdc4, #a855f7, #ff6b6b)',
            backgroundSize: '300% 100%',
            animation: 'nav-grad 4s ease infinite',
            opacity: dark ? 0.5 : 0.35,
            pointerEvents: 'none',
          }} />
        )}

        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
            <div className="flex items-center justify-between h-[64px] sm:h-[72px]">

              {/* Logo area */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <LogoMark onClick={() => setLightboxOpen(true)} />

                <motion.a
                  href="#hero"
                  onClick={e => { e.preventDefault(); handleNavClick('#hero') }}
                  className="flex flex-col -space-y-0.5"
                  style={{ textDecoration: 'none' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-sm sm:text-base font-heading font-bold leading-none" style={{ color: textColor }}>
                    Ajay{' '}
                    <span style={{
                      background: 'linear-gradient(110deg, #ff5fa0, #a855f7, #4ecdc4)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      animation: 'nav-grad 5s ease infinite',
                    }}>Patil</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-wider" style={{ color: mutedColor }}>
                    Full Stack Dev
                  </span>
                </motion.a>
              </div>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      item={item}
                      isActive={activeSection === item.href.replace('#', '')}
                      hovered={hoveredItem === item.name}
                      onEnter={() => setHoveredItem(item.name)}
                      onLeave={() => setHoveredItem(null)}
                      onClick={() => handleNavClick(item.href)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ResumeButton />
                <HireMeButton />
                <ThemeToggle />
                <Hamburger isOpen={isOpen} onClick={() => setIsOpen(o => !o)} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* ── Profile lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              className="relative z-10 flex flex-col items-center gap-5"
              initial={{ scale: 0.78, opacity: 0, y: 22 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.84, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Spinning ring around photo */}
              <div className="relative">
                <div style={{
                  position: 'absolute', inset: '-5px', borderRadius: '24px',
                  background: 'conic-gradient(from 0deg, #ff6b6b, #a855f7, #4ecdc4, #60a5fa, #ff6b6b)',
                  zIndex: 0,
                }} />
                <div style={{ position: 'absolute', inset: '-2px', borderRadius: '22px', backgroundColor: 'var(--bg-primary)', zIndex: 1 }} />
                <div className="relative z-10 overflow-hidden rounded-[20px]"
                  style={{ width: 'min(72vw, 340px)', height: 'min(72vw, 340px)' }}>
                  <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top"
                    sizes="(max-width: 640px) 72vw, 340px" />
                  {/* Overlay gradient */}
                  <div style={{
                    position: 'absolute', bottom: 0, insetInline: 0, height: '35%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
                  }} />
                </div>
              </div>

              {/* Name + role */}
              <div className="text-center">
                <p className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Ajay Patil</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: mutedColor }}>
                  Full Stack Developer · Java &amp; Spring Boot
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#4ade80' }}>Open to opportunities</span>
                </div>
              </div>

              {/* Close */}
              <motion.button
                onClick={() => setLightboxOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
                style={{ color: mutedColor, border: `1px solid ${bdr}` }}
                whileHover={{ scale: 1.04, borderColor: 'rgba(168,85,247,0.35)' }}
                whileTap={{ scale: 0.96 }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close (Esc)
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] md:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[95] md:hidden flex flex-col"
              style={{
                width: 288,
                backgroundColor: 'var(--bg-secondary)',
                borderLeft: `1px solid ${bdr}`,
                paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {/* Top gradient accent */}
              <div style={{
                position: 'absolute', top: 0, insetInline: 0, height: '2px',
                background: 'linear-gradient(90deg, #ff6b6b, #a855f7, #4ecdc4)',
                backgroundSize: '200% 100%',
                animation: 'nav-grad 4s ease infinite',
              }} />

              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-[64px] flex-shrink-0"
                style={{ borderBottom: `1px solid ${bdr}` }}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setIsOpen(false); setLightboxOpen(true) }}
                    className="relative w-8 h-8 rounded-full overflow-hidden"
                    style={{ border: '1px solid var(--border-strong)' }}
                  >
                    <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="32px" />
                  </button>
                  <span className="font-heading font-bold" style={{ color: textColor }}>
                    Ajay{' '}
                    <span style={{
                      background: 'linear-gradient(110deg, #ff5fa0, #a855f7)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Patil</span>
                  </span>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ color: mutedColor, border: `1px solid ${bdr}` }}
                  whileHover={{ scale: 1.08, borderColor: 'rgba(255,107,107,0.4)', color: '#ff6b6b' }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.replace('#', '')
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium relative overflow-hidden"
                      style={{
                        color: isActive ? textColor : mutedColor,
                        backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                        border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                        textDecoration: 'none',
                      }}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      onClick={e => { e.preventDefault(); handleNavClick(item.href) }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Active indicator bar */}
                      <span className="w-1 h-4 rounded-full flex-shrink-0 transition-all duration-300" style={{
                        background: isActive
                          ? 'linear-gradient(to bottom, #ff6b6b, #4ecdc4)'
                          : 'var(--border-strong)',
                      }} />
                      {/* Monospace icon */}
                      <span style={{
                        fontSize: '0.65rem', fontFamily: 'monospace',
                        color: isActive ? 'var(--accent)' : 'var(--text-faint)',
                        flexShrink: 0, width: '12px',
                      }}>
                        {item.icon}
                      </span>
                      {item.name}
                      {isActive && (
                        <>
                          <span className="ml-auto text-[10px] font-mono" style={{ color: 'var(--accent)' }}>active</span>
                          {/* Shimmer on active */}
                          <motion.span
                            className="absolute inset-0 pointer-events-none rounded-xl"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)' }}
                            animate={{ x: ['-130%', '230%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                          />
                        </>
                      )}
                    </motion.a>
                  )
                })}
              </nav>

              {/* Footer CTAs */}
              <div className="px-5 pb-2 space-y-2.5 flex-shrink-0">
                {/* Divider */}
                <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${bdr}, transparent)` }} />

                <motion.a
                  href={RESUME_FILE}
                  target="_blank" rel="noopener noreferrer" download
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm relative overflow-hidden"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-strong)',
                    textDecoration: 'none',
                  }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ borderColor: 'rgba(168,85,247,0.35)', y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Download Resume
                </motion.a>

                <motion.a
                  href="mailto:ajaypatil8eight@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b, #a855f7, #4ecdc4)',
                    backgroundSize: '200% 200%',
                    animation: 'nav-grad 4s ease infinite',
                    textDecoration: 'none',
                  }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.40 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(168,85,247,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)' }}
                    animate={{ x: ['-130%', '230%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  />
                  <span className="relative">Mail Me</span>
                  <motion.span
                    className="relative"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  >→</motion.span>
                </motion.a>

                {/* Theme + status */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-mono" style={{ color: mutedColor }}>Theme</span>
                  <ThemeToggle />
                </div>

                <div className="flex items-center justify-center gap-2 pb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="text-xs font-mono" style={{ color: mutedColor }}>Open to opportunities</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}