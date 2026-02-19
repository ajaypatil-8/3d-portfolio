'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import Image from 'next/image'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useTheme } from '@/components/providers/ThemeProvider'

gsap.registerPlugin(ScrollToPlugin)

const PROFILE_IMG = '/images/Profile.jpg'
const RESUME_FILE = '/resume/Ajay_Patil_Resume.pdf'

const navItems = [
  { name: 'Home',       href: '#hero' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Skills',     href: '#skills' },
  { name: 'About',      href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
]

export default function Navigation() {
  const { theme } = useTheme()
  const [isOpen,        setIsOpen]        = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredItem,   setHoveredItem]   = useState<string | null>(null)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const scrolling = useRef(false)

  // ── Active section detection ─────────────────────────────────────
  useEffect(() => {
    const ids = navItems.map(item => item.href.replace('#', ''))

    const onScroll = () => {
      if (scrolling.current) return
      const scrollY = window.scrollY + window.innerHeight * 0.35

      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) {
          current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Navbar background on scroll ──────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Lock body scroll when drawer / lightbox open ─────────────────
  useEffect(() => {
    document.body.style.overflow = (isOpen || lightboxOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen, lightboxOpen])

  // ── Close lightbox on Escape ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Smooth scroll to section ─────────────────────────────────────
  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) {
      scrolling.current = true
      setActiveSection(href.replace('#', ''))
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: el, offsetY: 72 },
        ease: 'power3.inOut',
        onComplete: () => { scrolling.current = false },
      })
    }
  }, [])

  const textColor  = 'var(--text-primary)'
  const mutedColor = 'var(--text-muted)'

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]"
        style={{ scaleX, background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #a855f7)' }} />

      {/* Main nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--footer-border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.12)' : 'none',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.button onClick={() => setLightboxOpen(true)}
                className="relative w-9 h-9 flex-shrink-0 cursor-pointer"
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                aria-label="View profile photo">
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)', padding: '1.5px' }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }} />
                </motion.div>
                <div className="absolute inset-[2px] rounded-full overflow-hidden">
                  <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="36px" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2"
                  style={{ borderColor: 'var(--bg-primary)' }} />
              </motion.button>

              <motion.a href="#hero"
                onClick={e => { e.preventDefault(); handleNavClick('#hero') }}
                className="flex flex-col -space-y-0.5 cursor-hover"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <span className="text-base font-heading font-bold leading-none" style={{ color: textColor }}>
                  Ajay <span className="gradient-text">Patil</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider" style={{ color: mutedColor }}>Full Stack Dev</span>
              </motion.a>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 rounded-full text-sm font-medium cursor-hover"
                    style={{ color: isActive ? textColor : mutedColor }}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.3 + i * 0.07 }}
                    onClick={e => { e.preventDefault(); handleNavClick(item.href) }}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Hover highlight — only when not active */}
                    <AnimatePresence>
                      {hoveredItem === item.name && !isActive && (
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: 'var(--bg-card-hover)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Active highlight — NO layoutId, just fade in/out */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key={`bg-${item.name}`}
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: 'var(--bg-card-hover)',
                            border: '1px solid var(--border)',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10">{item.name}</span>

                    {/* Active dot — NO layoutId */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key={`dot-${item.name}`}
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ backgroundColor: 'var(--accent)' }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.a>
                )
              })}
            </div>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-2">
              <motion.a href={RESUME_FILE} target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold cursor-hover"
                style={{
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-strong)',
                }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.9 }}
                whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-card-hover)' }}
                whileTap={{ scale: 0.95 }}>
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Resume
              </motion.a>

              <motion.a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=aj9411979585@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
                target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white cursor-hover overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.0 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <motion.span className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%', skewX: -15 }} whileHover={{ x: '200%' }}
                  transition={{ duration: 0.5 }} />
                <span className="relative">Mail me</span>
                <motion.span className="relative text-white/80"
                  animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </motion.a>

              <ThemeToggle />

              {/* Hamburger */}
              <motion.button className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] cursor-hover"
                onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.9 }} aria-label="Toggle menu">
                <motion.span className="block w-5 h-[1.5px] rounded-full origin-center"
                  style={{ backgroundColor: textColor }}
                  animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
                <motion.span className="block w-5 h-[1.5px] rounded-full"
                  style={{ backgroundColor: textColor }}
                  animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} />
                <motion.span className="block w-5 h-[1.5px] rounded-full origin-center"
                  style={{ backgroundColor: textColor }}
                  animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3 }} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} onClick={() => setLightboxOpen(false)}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}>
              <div className="relative p-[3px] rounded-3xl"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)' }}>
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-[22px] overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="384px" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Ajay Patil</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: mutedColor }}>Full Stack Developer · Java Backend</p>
              </div>
              <button onClick={() => setLightboxOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
                style={{ color: mutedColor, border: '1px solid var(--border)' }}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close (Esc)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)} />
            <motion.div className="fixed top-0 right-0 bottom-0 z-[95] w-[280px] md:hidden flex flex-col"
              style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}>

              <div className="flex items-center justify-between px-6 h-[72px]"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setIsOpen(false); setLightboxOpen(true) }}
                    className="relative w-8 h-8 rounded-full overflow-hidden"
                    style={{ border: '1px solid var(--border-strong)' }}>
                    <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="32px" />
                  </button>
                  <span className="font-heading font-bold" style={{ color: textColor }}>
                    Ajay <span className="gradient-text">Patil</span>
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ color: mutedColor }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1 px-3 py-6">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.replace('#', '')
                  return (
                    <motion.a key={item.name} href={item.href}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium cursor-hover"
                      style={{
                        color: isActive ? textColor : mutedColor,
                        backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                        border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                      }}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={e => { e.preventDefault(); handleNavClick(item.href) }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isActive ? 'var(--accent)' : 'var(--border-strong)' }} />
                      {item.name}
                      {isActive && <span className="ml-auto text-xs font-mono" style={{ color: 'var(--accent)' }}>active</span>}
                    </motion.a>
                  )
                })}
              </nav>

              <div className="px-6 pb-8 space-y-3">
                <motion.a href={RESUME_FILE} target="_blank" rel="noopener noreferrer" download
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm cursor-hover"
                  style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }} whileTap={{ scale: 0.97 }}>
                  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Download Resume
                </motion.a>

                <motion.a href="mailto:aj9411979585@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm cursor-hover"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }} whileTap={{ scale: 0.97 }}>
                  Mail Me →
                </motion.a>

                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-mono" style={{ color: mutedColor }}>Theme</span>
                  <ThemeToggle />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono" style={{ color: mutedColor }}>Open to opportunities</span>
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                  {[
                    { href: 'https://github.com/ajaypatil-8', label: 'GitHub',
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                    { href: 'https://www.linkedin.com/in/ajaypatil-8eight/', label: 'LinkedIn',
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center"
                      style={{ color: mutedColor }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}