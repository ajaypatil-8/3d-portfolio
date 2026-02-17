'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const navItems = [
  { name: 'Home',       href: '#hero' },
  { name: 'About',      href: '#about' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Skills',     href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
]

export default function Navigation() {
  const [isOpen,        setIsOpen]        = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredItem,   setHoveredItem]   = useState<string | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  // ── Track which section is in view ──────────────────────────────
  useEffect(() => {
    const ids = navItems.map(item => item.href.replace('#', ''))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // ── Scrolled state ───────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Lock body scroll when mobile menu open ───────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Smooth scroll ────────────────────────────────────────────────
  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: el, offsetY: 72 },
        ease: 'power3.inOut',
      })
    }
  }, [])

  return (
    <>
      {/* ── Scroll progress bar ─────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #a855f7)',
        }}
      />

      {/* ── Main nav ────────────────────────────────────────────── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ──────────────────────────────────────────── */}
            <motion.a
              href="#hero"
              onClick={e => { e.preventDefault(); handleNavClick('#hero') }}
              className="flex items-center gap-3 cursor-hover group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated initials badge */}
              <div className="relative w-9 h-9">
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent via-accent-blue to-accent-purple"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                />
                <div className="absolute inset-[2px] rounded-xl bg-[#0a0a0a] flex items-center justify-center"
                  style={{ borderRadius: 'inherit' }}>
                  <span className="text-xs font-bold gradient-text">AP</span>
                </div>
              </div>

              <div className="flex flex-col -space-y-0.5">
                <span className="text-base font-heading font-bold text-white leading-none">
                  Ajay <span className="gradient-text">Patil</span>
                </span>
                <span className="text-[10px] text-white/35 font-mono tracking-wider">
                  Full Stack Dev
                </span>
              </div>
            </motion.a>

            {/* ── Desktop links ─────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-hover"
                    style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.5)' }}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => { e.preventDefault(); handleNavClick(item.href) }}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ color: '#ffffff' }}
                  >
                    {/* Hover pill */}
                    {hoveredItem === item.name && !isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-white/[0.06]"
                        layoutId="nav-hover"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Active pill */}
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/[0.1]"
                        layoutId="nav-active"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <span className="relative z-10">{item.name}</span>

                    {/* Active dot */}
                    {isActive && (
                      <motion.span
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                        layoutId="nav-dot"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.a>
                )
              })}
            </div>

            {/* ── CTA + hamburger ───────────────────────────────── */}
            <div className="flex items-center gap-3">
              <motion.a
                href="mailto:aj9411979585@gmail.com"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white cursor-hover overflow-hidden relative group"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer */}
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%', skewX: -15 }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative">Hire Me</span>
                <motion.span
                  className="relative text-white/80"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >→</motion.span>
              </motion.a>

              {/* Hamburger */}
              <motion.button
                className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] cursor-hover"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <motion.span className="block w-5 h-[1.5px] bg-white rounded-full origin-center"
                  animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }} />
                <motion.span className="block w-5 h-[1.5px] bg-white rounded-full"
                  animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }} />
                <motion.span className="block w-5 h-[1.5px] bg-white rounded-full origin-center"
                  animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
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

            {/* Drawer panel — slides in from right */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[95] w-[280px] bg-[#0f0f0f] border-l border-white/[0.08] md:hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.06]">
                <span className="text-white font-heading font-bold">
                  Ajay <span className="gradient-text">Patil</span>
                </span>
                <button onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 flex flex-col gap-1 px-3 py-6">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.href.replace('#', '')
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors cursor-hover ${
                        isActive
                          ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                          : 'text-white/55 hover:text-white hover:bg-white/[0.05]'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={e => { e.preventDefault(); handleNavClick(item.href) }}
                    >
                      {/* Active indicator */}
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isActive ? 'bg-accent' : 'bg-white/20'
                      }`} />
                      {item.name}
                      {isActive && (
                        <span className="ml-auto text-xs text-accent/70 font-mono">active</span>
                      )}
                    </motion.a>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-6 pb-8 space-y-3">
                <motion.a
                  href="mailto:aj9411979585@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm cursor-hover relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Hire Me →
                </motion.a>

                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/40 text-xs font-mono">Open to opportunities</span>
                </div>

                {/* Social row */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  {[
                    { href: 'https://github.com', label: 'GitHub',
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                    { href: 'https://linkedin.com', label: 'LinkedIn',
                      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors">
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