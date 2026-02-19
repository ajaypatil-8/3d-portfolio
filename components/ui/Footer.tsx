'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { useTheme } from '@/components/providers/ThemeProvider'

gsap.registerPlugin(ScrollToPlugin)

const navLinks = [
  { name: 'Home',       href: '#hero' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Skills',     href: '#skills' },
  { name: 'About',      href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
]

const techStack = [
  'Java', 'Spring Boot', 'Next.js', 'React',
  'Docker', 'PostgreSQL', 'MySQL', 'REST API',
]

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/ajaypatil-8',
    color: '#4ecdc4',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ajaypatil-8sink/',
    color: '#a855f7',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=aj9411979585@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect.',
    color: '#ff6b6b',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

function BackToTop() {
  const [hovered, setHovered] = useState(false)
  const handleClick = () => gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power3.inOut' })

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-12 h-12 rounded-full flex items-center justify-center cursor-hover overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Back to top"
    >
      <motion.span className="absolute inset-0 bg-white/20"
        initial={{ y: '100%' }}
        animate={{ y: hovered ? '0%' : '100%' }}
        transition={{ duration: 0.3 }} />
      <motion.svg className="w-5 h-5 text-white relative z-10"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
        animate={{ y: hovered ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </motion.svg>
    </motion.button>
  )
}

export default function Footer() {
  const { theme } = useTheme()
  const year = new Date().getFullYear()

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) gsap.to(window, { duration: 1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }

  return (
    <footer className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderTop: '1px solid var(--footer-border)',
      }}>

      {/* Ambient glows */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: 'rgba(78,205,196,0.05)' }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: 'rgba(168,85,247,0.05)' }} />

      {/* Top availability bar */}
      <div style={{ borderBottom: '1px solid var(--footer-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Available</span> for full-time jobs &amp; internships
            </span>
          </div>
          <motion.a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aj9411979585@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
            target="_blank" rel="noopener noreferrer"
            className="text-sm font-mono cursor-hover transition-colors"
            style={{ color: 'var(--accent)' }}
            whileHover={{ x: 3 }}
          >
            aj9411979585@gmail.com →
          </motion.a>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand col */}
          <motion.div className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)' }}>
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <div>
                <div className="font-heading font-bold text-lg leading-none" style={{ color: 'var(--text-primary)' }}>
                  Ajay <span className="gradient-text">Patil</span>
                </div>
                <div className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>Full Stack Developer</div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              BCA student from Palus, Sangli — building production-grade apps with
              Java, Spring Boot, and modern web tech. Actively looking for my first opportunity.
            </p>

            <div className="flex gap-2.5">
              {socials.map((s, i) => (
                <motion.a key={s.name} href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center cursor-hover"
                  style={{ color: 'var(--text-muted)' }}
                  whileHover={{ scale: 1.12, color: s.color }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav links */}
          <motion.div className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}>
              <span className="w-4 h-px bg-accent inline-block" style={{ backgroundColor: 'var(--accent)' }} />
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link, i) => (
                <motion.li key={link.name}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <a href={link.href}
                    onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                    className="text-sm flex items-center gap-2 group cursor-hover"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <span className="w-0 group-hover:w-3 h-px transition-all duration-200"
                      style={{ backgroundColor: 'var(--accent)' }} />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Tech stack */}
          <motion.div className="md:col-span-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}>
              <span className="w-4 h-px inline-block" style={{ backgroundColor: '#60a5fa' }} />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <motion.span key={tech}
                  className="px-3 py-1 glass rounded-full text-xs cursor-hover"
                  style={{ color: 'var(--text-muted)' }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  whileHover={{ scale: 1.05, color: 'var(--text-primary)' }}>
                  {tech}
                </motion.span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs" style={{ color: 'var(--text-faint)' }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Palus, Dist. Sangli, Maharashtra, India
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-6"
          style={{ background: 'linear-gradient(to right, transparent, var(--border-strong), transparent)' }} />

        {/* Bottom bar */}
        <motion.div className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              © {year} Ajay Patil. All rights reserved.
            </p>
            <span className="hidden sm:block w-px h-3" style={{ backgroundColor: 'var(--border-strong)' }} />
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              Built with Next.js · Node.js · ❤️
            </p>
          </div>
          <BackToTop />
        </motion.div>
      </div>
    </footer>
  )
}