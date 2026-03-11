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
  { name: 'Home',       href: '#hero'       },
  { name: 'Projects',   href: '#projects'   },
  { name: 'Skills',     href: '#skills'     },
  { name: 'About',      href: '#about'      },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact'    },
]

export default function Navigation() {
  const { theme } = useTheme()

  const [isOpen,        setIsOpen]        = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredItem,   setHoveredItem]   = useState<string | null>(null)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  /*
    Elite addition: hide nav when scrolling DOWN on mobile to reclaim screen space.
    Show it again when scrolling UP.
  */
  const [navHidden,     setNavHidden]     = useState(false)
  const lastScrollY     = useRef(0)
  const scrolling       = useRef(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  /* ── Active section detection ── */
  useEffect(() => {
    const ids = navItems.map(item => item.href.replace('#', ''))

    const onScroll = () => {
      if (scrolling.current) return
      const scrollY = window.scrollY + window.innerHeight * 0.35
      let current   = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) current = id
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Scroll → glass / hide-on-mobile-scroll-down ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)

      /* hide on scroll-down (mobile only, only after 120 px) */
      const isMobile = window.innerWidth < 768
      if (isMobile && !isOpen) {
        if (y > lastScrollY.current && y > 120) setNavHidden(true)
        else setNavHidden(false)
      } else {
        setNavHidden(false)
      }
      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isOpen])

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = (isOpen || lightboxOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen, lightboxOpen])

  /* ── Escape to close lightbox ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLightboxOpen(false); setIsOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* ── Smooth scroll ── */
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
      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]"
        style={{ scaleX, background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #a855f7)' }}
      />

      {/* ── Main nav ──
          On mobile: slides off the top when scrolling down, slides back on scroll up.
          Reduced entrance delay from 2.2s → 1.0s so it appears alongside content.
      */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500"
        style={{
          backgroundColor:    scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter:     scrolled ? 'blur(20px)'    : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)'  : 'none',
          borderBottom:       scrolled ? '1px solid var(--footer-border)' : '1px solid transparent',
          boxShadow:          scrolled ? '0 4px 24px rgba(0,0,0,0.12)'   : 'none',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y:       navHidden ? -80 : 0,
          opacity: navHidden ? 0   : 1,
        }}
        transition={
          navHidden
            ? { duration: 0.3, ease: 'easeIn' }
            : { duration: 0.4, ease: 'easeOut' }
        }
        // First entrance — override with a one-time delay via CSS-level Framer initial
        // We handle initial appearance separately below
      >

        {/* ── Entrance wrapper (one-time slide-in) ── */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
            <div className="flex items-center justify-between h-[64px] sm:h-[72px]">

              {/* Logo */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <motion.button
                  onClick={() => setLightboxOpen(true)}
                  className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View profile photo"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)', padding: '1.5px' }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }} />
                  </motion.div>
                  <div className="absolute inset-[2px] rounded-full overflow-hidden">
                    <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="36px" />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2"
                    style={{ borderColor: 'var(--bg-primary)' }}
                  />
                </motion.button>

                <motion.a
                  href="#hero"
                  onClick={e => { e.preventDefault(); handleNavClick('#hero') }}
                  className="flex flex-col -space-y-0.5 cursor-hover"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    className="text-sm sm:text-base font-heading font-bold leading-none"
                    style={{ color: textColor }}
                  >
                    Ajay <span className="gradient-text">Patil</span>
                  </span>
                  <span
                    className="text-[9px] sm:text-[10px] font-mono tracking-wider"
                    style={{ color: mutedColor }}
                  >
                    Full Stack Dev
                  </span>
                </motion.a>
              </div>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.replace('#', '')
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="relative px-3 lg:px-4 py-2 rounded-full text-sm font-medium cursor-hover"
                      style={{ color: isActive ? textColor : mutedColor }}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + i * 0.07 }}
                      onClick={e => { e.preventDefault(); handleNavClick(item.href) }}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Hover bg */}
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

                      {/* Active bg */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            key={`bg-${item.name}`}
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: 'var(--bg-card-hover)',
                              border:          '1px solid var(--border)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>

                      <span className="relative z-10">{item.name}</span>

                      {/*
                        Elite improvement: replace the tiny dot with a gradient
                        underline bar that grows from the center.
                      */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            key={`bar-${item.name}`}
                            className="absolute bottom-0.5 left-1/2 h-[2px] rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                              x: '-50%',
                            }}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '60%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.a>
                  )
                })}
              </div>

              {/* CTA + controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Resume (desktop) */}
                <motion.a
                  href={RESUME_FILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold cursor-hover"
                  style={{
                    color:           'var(--text-secondary)',
                    backgroundColor: 'var(--bg-card)',
                    border:          '1px solid var(--border-strong)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-card-hover)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Resume
                </motion.a>

                {/* Mail CTA (desktop) */}
                <motion.a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white cursor-hover overflow-hidden relative"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%', skewX: -15 }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative">Mail me</span>
                  <motion.span
                    className="relative text-white/80"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.a>

                <ThemeToggle />

                {/* Hamburger (mobile) */}
                <motion.button
                  className="md:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex flex-col items-center justify-center gap-[5px] cursor-hover rounded-xl"
                  style={{
                    backgroundColor: isOpen ? 'var(--bg-card)' : 'transparent',
                    border:          isOpen ? '1px solid var(--border)' : '1px solid transparent',
                    transition:      'background-color 0.2s',
                  }}
                  onClick={() => setIsOpen(!isOpen)}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle menu"
                  aria-expanded={isOpen}
                >
                  <motion.span
                    className="block w-5 h-[1.5px] rounded-full origin-center"
                    style={{ backgroundColor: textColor }}
                    animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block w-5 h-[1.5px] rounded-full"
                    style={{ backgroundColor: textColor }}
                    animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="block w-5 h-[1.5px] rounded-full origin-center"
                    style={{ backgroundColor: textColor }}
                    animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative p-[3px] rounded-3xl"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)' }}
              >
                <div
                  className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-[22px] overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <Image
                    src={PROFILE_IMG}
                    alt="Ajay Patil"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  Ajay Patil
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: mutedColor }}>
                  Full Stack Developer · Java Backend
                </p>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
                style={{ color: mutedColor, border: '1px solid var(--border)' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close (Esc)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[95] w-[280px] md:hidden flex flex-col"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderLeft:      '1px solid var(--border)',
                /*
                  Safe area padding for iOS notch / home indicator.
                  env() falls back gracefully on non-iOS.
                */
                paddingBottom:   'max(2rem, env(safe-area-inset-bottom))',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 h-[64px] flex-shrink-0"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setIsOpen(false); setLightboxOpen(true) }}
                    className="relative w-8 h-8 rounded-full overflow-hidden"
                    style={{ border: '1px solid var(--border-strong)' }}
                  >
                    <Image src={PROFILE_IMG} alt="Ajay Patil" fill className="object-cover object-top" sizes="32px" />
                  </button>
                  <span className="font-heading font-bold" style={{ color: textColor }}>
                    Ajay <span className="gradient-text">Patil</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ color: mutedColor, border: '1px solid var(--border)' }}
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col gap-1 px-3 py-5 overflow-y-auto">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.replace('#', '')
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-hover"
                      style={{
                        color:           isActive ? textColor : mutedColor,
                        backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                        border:          `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={e => { e.preventDefault(); handleNavClick(item.href) }}
                    >
                      {/* Active indicator bar */}
                      <span
                        className="w-1 h-4 rounded-full flex-shrink-0 transition-all"
                        style={{
                          background: isActive
                            ? 'linear-gradient(to bottom, #ff6b6b, #4ecdc4)'
                            : 'var(--border-strong)',
                        }}
                      />
                      {item.name}
                      {isActive && (
                        <span className="ml-auto text-[10px] font-mono" style={{ color: 'var(--accent)' }}>
                          active
                        </span>
                      )}
                    </motion.a>
                  )
                })}
              </nav>

              {/* Drawer footer CTAs */}
              <div className="px-5 pb-2 space-y-3 flex-shrink-0">
                <motion.a
                  href={RESUME_FILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm cursor-hover"
                  style={{
                    color:           'var(--text-secondary)',
                    backgroundColor: 'var(--bg-card)',
                    border:          '1px solid var(--border-strong)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Download Resume
                </motion.a>

                <motion.a
                  href="mailto:ajaypatil8eight@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm cursor-hover"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Mail Me →
                </motion.a>

                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-mono" style={{ color: mutedColor }}>Theme</span>
                  <ThemeToggle />
                </div>

                <div className="flex items-center justify-center gap-2 pb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono" style={{ color: mutedColor }}>
                    Open to opportunities
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}