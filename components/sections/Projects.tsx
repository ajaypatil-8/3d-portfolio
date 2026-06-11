'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ═══════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════ */
const projects = [
  {
    id: 1,
    title: 'AeroSphere',
    subtitle: 'Airline Booking & Management System',
    stack: 'Java · Docker · AWS · Nginx',
    description:
      'Production-grade full-stack airline booking platform with multi-role auth, real-time seat availability, flight search, booking management, and Razorpay payment gateway — fully Dockerized and self-hosted on AWS EC2 with custom domain, free SSL via Let\'s Encrypt, and automated CI/CD via GitHub Actions.',
    tech: ['Java 11', 'JSP/Servlets', 'Tomcat 9', 'MySQL 8', 'Nginx', 'Docker', 'Maven', 'AWS EC2', 'Let\'s Encrypt', 'GitHub Actions'],
    highlights: [
      'Deployed on AWS EC2 t3.small with Elastic IP & custom domain',
      'Free HTTPS via Let\'s Encrypt — auto-renewing SSL certificate',
      '3-service Docker Compose stack (Tomcat + MySQL + Nginx)',
      'Nginx: HTTP→HTTPS redirect, rate limiting, gzip & HSTS headers',
      'Razorpay payment gateway + Gmail SMTP notifications',
      'CI/CD pipeline — auto-deploy on every git push',
    ],
    status: 'live',
    statusLabel: 'Live & Deployed',
    color: '#6366f1',
    secondColor: '#818cf8',
    icon: '✈️',
    github: 'https://github.com/ajaypatil-8/aerosphere-airline-management-system',
    demo: 'https://aerosphere.work.gd',
    stats: [
      { label: 'Services', value: '3' },
      { label: 'Uptime', value: '99%' },
      { label: 'Stack', value: 'Full' },
    ],
  },
  {
    id: 2,
    title: 'CrowdSpark-X',
    subtitle: 'Crowdfunding Platform',
    stack: 'PHP · MySQL · Cloudinary · SMTP',
    description:
      'Full-stack crowdfunding web application enabling campaign creation and donation management. Features multi-role dashboards, real-time donation tracking, Cloudinary media uploads, and email verification via PHPMailer SMTP.',
    tech: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript', 'Cloudinary', 'PHPMailer', 'XAMPP'],
    highlights: [
      'Multi-role system (Admin, Creator, User)',
      'Campaign creation with images & videos via Cloudinary',
      'Secure login & email verification via SMTP',
      'Admin dashboard with campaign approval flow',
      'Real-time donation progress tracking',
    ],
    status: 'completed',
    statusLabel: 'Completed & Working',
    color: '#4ecdc4',
    secondColor: '#2dd4bf',
    icon: '🏆',
    github: 'https://github.com/ajaypatil-8/College-Major-Project-php-',
    demo: 'https://crowdspark-x.infinityfreeapp.com',
    stats: [
      { label: 'Roles', value: '3' },
      { label: 'Features', value: '12+' },
      { label: 'Type', value: 'SaaS' },
    ],
  },
  {
    id: 3,
    title: 'CrowdSpark Advanced',
    subtitle: 'Microservices Architecture',
    stack: 'Spring Boot · Next.js · Kafka · Docker',
    description:
      'Advanced scalable rebuild of CrowdSpark using Spring Boot microservices, Next.js frontend, Kafka event streaming, Docker containers, and PostgreSQL — designed for production-level performance and clean architecture with JWT security.',
    tech: ['Spring Boot', 'Next.js', 'PostgreSQL', 'Docker', 'Kafka', 'REST API', 'JWT', 'TypeScript'],
    highlights: [
      'RESTful API with Spring Boot backend',
      'Next.js modern frontend UI',
      'JWT authentication & Spring Security',
      'Kafka for real-time event streaming',
      'Dockerized microservices architecture',
    ],
    status: 'building',
    statusLabel: 'Actively Building',
    color: '#f97316',
    secondColor: '#fb923c',
    icon: '🚀',
    github: 'https://github.com/ajaypatil-8/Crowdspark-Backend',
    demo: null,
    progress: 85,
    milestones: [
      { label: 'API', done: true },
      { label: 'Auth', done: true },
      { label: 'JWT', done: true },
      { label: 'Spring Boot', done: true },
      { label: 'Kafka', done: false },
      { label: 'Frontend', done: false },
    ],
    stats: [
      { label: 'Services', value: '5+' },
      { label: 'Progress', value: '85%' },
      { label: 'Type', value: 'Micro' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════════════
   GITHUB ICON
   ═══════════════════════════════════════════════════════════════════════ */
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

/* ═══════════════════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════════════════ */
function StatusBadge({ status, label }: { status: string; label: string }) {
  const cfg = {
    live:      { bg: 'rgba(74,222,128,0.12)',  text: '#4ade80', border: 'rgba(74,222,128,0.30)',  pulse: '#4ade80' },
    completed: { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8', border: 'rgba(99,102,241,0.30)',  pulse: '#818cf8' },
    building:  { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24', border: 'rgba(251,191,36,0.30)',  pulse: '#fbbf24' },
  }[status] ?? { bg: 'rgba(156,163,175,0.12)', text: '#9ca3af', border: 'rgba(156,163,175,0.3)', pulse: '#9ca3af' }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      <span className="relative flex w-2 h-2">
        {status !== 'completed' && (
          <span
            className="absolute inline-flex w-full h-full rounded-full opacity-75"
            style={{ backgroundColor: cfg.pulse, animation: '_proj-ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }}
          />
        )}
        <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: cfg.pulse }} />
      </span>
      {label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   TERMINAL PANEL
   ═══════════════════════════════════════════════════════════════════════ */
function TerminalPanel({ highlights, color, projectIndex }: {
  highlights: string[]
  color: string
  projectIndex: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden h-full"
      style={{
        background:  '#0d1117',
        border:      `1px solid ${color}28`,
        fontFamily:  'ui-monospace, "Cascadia Code", "Fira Code", monospace',
        minHeight:   '260px',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: '#161b22', borderBottom: `1px solid ${color}18` }}
      >
        <div className="flex gap-1.5">
          {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span className="text-[11px] ml-2" style={{ color: '#6e7681' }}>
          highlights.sh
        </span>
        <div
          className="ml-auto text-[10px] px-2 py-0.5 rounded"
          style={{ background: `${color}18`, color }}
        >
          bash
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        <div className="mb-3" style={{ fontSize: '12px' }}>
          <span style={{ color: '#3fb950' }}>❯ </span>
          <span style={{ color: '#e6edf3' }}>cat key-features.txt</span>
        </div>

        {highlights.map((h, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2"
            style={{ fontSize: '12px', lineHeight: '1.6' }}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: projectIndex * 0.08 + i * 0.07 + 0.2 }}
          >
            <span style={{ color, flexShrink: 0, marginTop: '3px', fontSize: '10px' }}>▸</span>
            <span style={{ color: '#c9d1d9' }}>{h}</span>
          </motion.div>
        ))}

        <div className="pt-2" style={{ fontSize: '12px' }}>
          <span style={{ color: '#3fb950' }}>❯ </span>
          <span style={{ color: '#6e7681' }}>█</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   STAT CHIP
   ═══════════════════════════════════════════════════════════════════════ */
function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-2 rounded-xl"
      style={{ background: `${color}0d`, border: `1px solid ${color}22` }}
    >
      <span
        className="text-lg font-black font-mono tabular-nums"
        style={{ color, lineHeight: 1 }}
      >{value}</span>
      <span className="text-[10px] mt-1 font-mono tracking-wider uppercase" style={{ color: `${color}88` }}>
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PROJECT CARD  — animated gradient border + 3D tilt
   ═══════════════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { theme } = useTheme()
  const cardRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  /* 3D tilt — direct DOM, no spring solver */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width  - 0.5
    const y    = (e.clientY - rect.top)  / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-6px) scale(1.005)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)'
    setHovered(false)
  }, [])

  const c  = project.color
  const c2 = project.secondColor

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gradient border wrapper */}
              <div
  className="relative rounded-3xl p-[1.5px]"
  style={{
    backgroundImage: hovered
      ? `linear-gradient(135deg, ${c}, ${c2}, #ffffff22, ${c2}, ${c})`
      : `linear-gradient(135deg, ${c}66, ${c}22, ${c}44)`,
  }}
>
        {/* Card */}
        <div
          ref={cardRef}
          className="relative rounded-[22px] overflow-hidden"
          style={{
            background:    theme === 'dark'
              ? 'linear-gradient(145deg, #0f0f13 0%, #0a0a0e 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8f8fc 100%)',
            transition:    'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            transformStyle:'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background project number */}
          <div
            className="absolute font-black select-none pointer-events-none font-heading"
            style={{
              fontSize:      'clamp(7rem, 14vw, 13rem)',
              color:         `${c}07`,
              top:           '-0.15em',
              right:         '0.05em',
              lineHeight:    1,
              letterSpacing: '-0.04em',
              zIndex:        0,
              userSelect:    'none',
            }}
          >
            {String(project.id).padStart(2, '0')}
          </div>

          {/* Top color bar */}
          <div
            className="h-[3px] w-full"
            style={{ background: `linear-gradient(90deg, ${c}, ${c2}, transparent 80%)` }}
          />

          {/* Ambient glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width:      '500px',
              height:     '500px',
              background: `radial-gradient(circle, ${c}0b 0%, transparent 65%)`,
              top:        '-150px',
              left:       '-100px',
              zIndex:     0,
            }}
          />

          {/* Card content */}
          <div className="relative z-10 p-8 md:p-10">

            {/* ── Top row: status + stats ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <StatusBadge status={project.status} label={project.statusLabel} />
              <div className="flex gap-2">
                {project.stats?.map(s => (
                  <StatChip key={s.label} label={s.label} value={s.value} color={c} />
                ))}
              </div>
            </div>

            {/* ── Title block ── */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{project.icon}</span>
                <div>
                  <h3
                    className="font-heading font-black leading-none"
                    style={{
                      fontSize:             'clamp(1.6rem, 3.5vw, 2.2rem)',
                      color:                'var(--text-primary)',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="font-mono text-sm mt-0.5"
                    style={{ color: c }}
                  >
                    {project.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-xs font-mono tracking-widest" style={{ color: `${c}88` }}>
                {project.stack}
              </p>
            </div>

            {/* ── Two columns ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* Left: description + tech + buttons */}
              <div className="flex flex-col gap-5">

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <motion.span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-mono cursor-default"
                      style={{
                        border:          `1px solid ${c}35`,
                        color:           c,
                        backgroundColor: `${c}0e`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 + i * 0.04 }}
                      whileHover={{
                        backgroundColor: `${c}22`,
                        scale: 1.06,
                        transition: { duration: 0.12 },
                      }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{
                      color:           'var(--text-primary)',
                      backgroundColor: 'var(--bg-card-hover)',
                      border:          '1px solid var(--border-strong)',
                    }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <GithubIcon />
                    Source Code
                  </motion.a>

                  {project.demo && (
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold overflow-hidden"
                      style={{
                        color:  '#fff',
                        background: `linear-gradient(135deg, ${c}, ${c2})`,
                      }}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <motion.span
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%', skewX: -15 }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.45 }}
                      />
                      <span className="relative">Live Demo ↗</span>
                    </motion.a>
                  )}
                </div>

                {/* Progress (in-progress only) */}
                {'progress' in project && project.progress && (
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: `${c}0a`, border: `1px solid ${c}1e` }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Development Progress
                      </span>
                      <span className="text-xs font-mono font-bold" style={{ color: c }}>
                        {project.progress}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden mb-3"
                      style={{ background: 'var(--border)' }}
                    >
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{
                          background: `linear-gradient(90deg, ${c}, ${c2})`,
                          boxShadow:  `0 0 8px ${c}66`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${project.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                      >
                        {/* Shimmer on progress bar */}
                        <motion.div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                        />
                      </motion.div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.milestones?.map(m => (
                        <span
                          key={m.label}
                          className="px-2 py-0.5 rounded-full text-[11px] font-mono"
                          style={{
                            background: m.done ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                            color:      m.done ? '#4ade80'               : '#fbbf24',
                            border:     `1px solid ${m.done ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}`,
                          }}
                        >
                          {m.done ? '✓ ' : '○ '}{m.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: terminal */}
              <TerminalPanel
                highlights={project.highlights}
                color={c}
                projectIndex={index}
              />
            </div>
          </div>

          {/* Hover scan shimmer */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-[22px]"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${c}0a 50%, transparent 60%)`,
                }}
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: '200%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════════ */
function SectionHeader() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="text-center mb-16 relative">
      {/* Eyebrow */}
      <motion.div
        className="inline-flex items-center gap-2 mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, #4ecdc4)' }} />
        <span
          className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full"
          style={{
            color:        '#4ecdc4',
            background:   'rgba(78,205,196,0.08)',
            border:       '1px solid rgba(78,205,196,0.2)',
          }}
        >
          What I've Built
        </span>
        <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #4ecdc4)' }} />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-heading font-black mb-4"
        style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: 'var(--text-primary)', lineHeight: 1.1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        Featured{' '}
        <span
          style={{
            background:           'linear-gradient(135deg, #ff6b6b 0%, #f97316 30%, #a855f7 65%, #4ecdc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}
        >
          Projects
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-sm mx-auto max-w-md"
        style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Real projects — not tutorial clones. Built to solve real problems
        with production-level thinking.
      </motion.p>

      {/* Animated underline */}
      <motion.div
        className="mx-auto mt-5 h-[2px] rounded-full"
        style={{ background: 'linear-gradient(90deg, #ff6b6b, #a855f7, #4ecdc4)' }}
        initial={{ width: 0 }}
        animate={inView ? { width: '120px' } : {}}
        transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   FLOATING ORBS (background decoration)
   ═══════════════════════════════════════════════════════════════════════ */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[
        { color: 'rgba(78,205,196,0.12)', size: 520, x: '-20%', y: '-15%', delay: 0    },
        { color: 'rgba(255,107,107,0.10)', size: 600, x: '75%',  y: '60%',  delay: 0.5 },
        { color: 'rgba(168,85,247,0.08)',  size: 480, x: '30%',  y: '30%',  delay: 1.0 },
      ].map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:      o.size,
            height:     o.size,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 65%)`,
            left:       o.x,
            top:        o.y,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: o.delay }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   BOTTOM CTA
   ═══════════════════════════════════════════════════════════════════════ */
function BottomCta() {
  return (
    <motion.div
      className="text-center mt-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="inline-flex flex-col items-center gap-5 px-10 py-8 rounded-3xl relative overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border:     '1px solid var(--border)',
        }}
      >
        {/* Corner accents */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-6 h-6 pointer-events-none`}
            style={{
              background: `radial-gradient(circle, rgba(78,205,196,0.3) 0%, transparent 80%)`,
            }}
          />
        ))}

        <p className="text-sm font-mono tracking-wide" style={{ color: 'var(--text-muted)' }}>
          More projects actively in progress
        </p>

        <motion.a
          href="https://github.com/ajaypatil-8"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-semibold overflow-hidden"
          style={{
            border:          '1.5px solid var(--border-strong)',
            color:           'var(--text-primary)',
            backgroundColor: 'var(--bg-card-hover)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <GithubIcon />
          View GitHub Profile ↗
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.a>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════ */
export default function Projects() {
  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* CSS for animated gradient border + status ping + progress shimmer */}
      <style>{`
        @keyframes _proj-border {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes _proj-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <FloatingOrbs />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <SectionHeader />

        <div className="space-y-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <BottomCta />
      </div>
    </section>
  )
}