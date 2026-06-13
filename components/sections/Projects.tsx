'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useCallback, memo } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ════════════════════════════════════════════════════════════════════════════
   KEYFRAMES
════════════════════════════════════════════════════════════════════════════ */
const PROJ_KF = `
  @keyframes _p-ping  { 75%,100%{transform:scale(2.4);opacity:0} }
  @keyframes _p-glow  { 0%,100%{opacity:0.28} 50%{opacity:0.82} }
  @keyframes _p-scan  { 0%{top:-1px} 100%{top:calc(100% + 1px)} }
  @keyframes _p-shim  { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
  @keyframes _p-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes _p-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes _p-pulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.14);opacity:1} }
  @keyframes _p-orb0  {
    0%  {transform:translate(-50%,-50%) translate(0px,0px)}
    100%{transform:translate(-50%,-50%) translate(42px,32px)}
  }
  @keyframes _p-orb1  {
    0%  {transform:translate(-50%,-50%) translate(0px,0px)}
    100%{transform:translate(-50%,-50%) translate(-36px,26px)}
  }
  @keyframes _p-orb2  {
    0%  {transform:translate(-50%,-50%) translate(0px,0px)}
    100%{transform:translate(-50%,-50%) translate(28px,-36px)}
  }
  @keyframes _p-counter {
    from{transform:translateY(60%);opacity:0}
    to  {transform:translateY(0);   opacity:1}
  }
  @media(prefers-reduced-motion:reduce){
    *,[style*="animation"]{animation-duration:.001ms!important;transition-duration:.001ms!important}
  }
`

/* ════════════════════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 1,
    title: 'AeroSphere',
    subtitle: 'Airline Booking & Management System',
    stack: 'Java · Docker · AWS · Nginx',
    description:
      "Production-grade full-stack airline booking platform with multi-role auth, real-time seat availability, flight search, booking management, and Razorpay payment gateway — fully Dockerized and self-hosted on AWS EC2 with custom domain, free SSL via Let's Encrypt, and automated CI/CD via GitHub Actions.",
    tech: ['Java 11', 'JSP/Servlets', 'Tomcat 9', 'MySQL 8', 'Nginx', 'Docker', 'Maven', 'AWS EC2', "Let's Encrypt", 'GitHub Actions'],
    highlights: [
      'Deployed on AWS EC2 t3.small with Elastic IP & custom domain',
      "Free HTTPS via Let's Encrypt — auto-renewing SSL certificate",
      '3-service Docker Compose stack (Tomcat + MySQL + Nginx)',
      'Nginx: HTTP→HTTPS redirect, rate limiting, gzip & HSTS headers',
      'Razorpay payment gateway + Gmail SMTP notifications',
      'CI/CD pipeline — auto-deploy on every git push',
    ],
    status: 'live' as const,
    statusLabel: 'Live & Deployed',
    color: '#6366f1',
    secondColor: '#818cf8',
    icon: '✈️',
    github: 'https://github.com/ajaypatil-8/aerosphere-airline-management-system',
    demo: 'https://aerosphere.work.gd',
    stats: [
      { label: 'Services', value: '3'    },
      { label: 'Uptime',   value: '99%'  },
      { label: 'Stack',    value: 'Full' },
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
    status: 'completed' as const,
    statusLabel: 'Completed & Working',
    color: '#4ecdc4',
    secondColor: '#2dd4bf',
    icon: '🏆',
    github: 'https://github.com/ajaypatil-8/College-Major-Project-php-',
    demo: 'https://crowdspark-x.infinityfreeapp.com',
    stats: [
      { label: 'Roles',    value: '3'    },
      { label: 'Features', value: '12+'  },
      { label: 'Type',     value: 'SaaS' },
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
    status: 'building' as const,
    statusLabel: 'Actively Building',
    color: '#f97316',
    secondColor: '#fb923c',
    icon: '🚀',
    github: 'https://github.com/ajaypatil-8/Crowdspark-Backend',
    demo: null,
    progress: 85,
    milestones: [
      { label: 'API',         done: true  },
      { label: 'Auth',        done: true  },
      { label: 'JWT',         done: true  },
      { label: 'Spring Boot', done: true  },
      { label: 'Kafka',       done: false },
      { label: 'Frontend',    done: false },
    ],
    stats: [
      { label: 'Services', value: '5+'   },
      { label: 'Progress', value: '85%'  },
      { label: 'Type',     value: 'Micro'},
    ],
  },
] as const

type Project = (typeof PROJECTS)[number]

/* ════════════════════════════════════════════════════════════════════════════
   GITHUB ICON
════════════════════════════════════════════════════════════════════════════ */
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

/* ════════════════════════════════════════════════════════════════════════════
   EXTERNAL LINK ICON
════════════════════════════════════════════════════════════════════════════ */
const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

/* ════════════════════════════════════════════════════════════════════════════
   SECTION BACKGROUND  (orbs · grid · scan line)
════════════════════════════════════════════════════════════════════════════ */
const SectionBg = memo(function SectionBg({ dark }: { dark: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
      style={{ contain: 'layout paint' }}
    >
      {/* Ambient orbs */}
      {([
        { c: dark ? '#6366f1' : '#818cf8', x: '5%',  y: '6%',  s: 640, dur: 22, i: 0 },
        { c: dark ? '#f97316' : '#fb923c', x: '76%', y: '54%', s: 560, dur: 27, i: 1 },
        { c: dark ? '#4ecdc4' : '#2dd4bf', x: '36%', y: '76%', s: 500, dur: 24, i: 2 },
      ] as const).map(o => (
        <div key={o.i} style={{
          position: 'absolute', left: o.x, top: o.y,
          width: o.s, height: o.s, borderRadius: '50%',
          background: `radial-gradient(circle, ${o.c}${dark ? '16' : '0e'} 0%, transparent 65%)`,
          animation: `_p-orb${o.i} ${o.dur}s ease-in-out infinite alternate`,
          willChange: 'transform',
        }} />
      ))}

      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: dark ? 0.042 : 0.048 }}>
        <defs>
          <pattern id="_proj-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={dark ? '#fff' : '#000'} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#_proj-grid)" />
      </svg>

      {/* Horizontal scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent 0%,
          ${dark ? 'rgba(99,102,241,.22)' : 'rgba(99,102,241,.13)'} 30%,
          ${dark ? 'rgba(78,205,196,.22)' : 'rgba(78,205,196,.13)'} 70%,
          transparent 100%)`,
        animation: '_p-scan 14s linear infinite',
        willChange: 'top',
      }} />

      {/* Edge fades */}
      <div className="absolute inset-x-0 top-0 h-28"
        style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-28"
        style={{ background: 'linear-gradient(to top, var(--bg-secondary), transparent)' }} />
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
   SECTION HEADER
════════════════════════════════════════════════════════════════════════════ */
function SectionHeader() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <div ref={ref} className="text-center mb-20 relative">

      {/* Eyebrow pill */}
      <motion.div
        className="inline-flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.52 }}
      >
        <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, #4ecdc4)' }} />

        <span className="relative inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase
          px-4 py-1.5 rounded-full overflow-hidden"
          style={{ color: '#4ecdc4', background: 'rgba(78,205,196,.08)', border: '1px solid rgba(78,205,196,.22)' }}
        >
          {/* Pulse dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: '_p-ping 1.6s cubic-bezier(0,0,.2,1) infinite' }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          What I've Built
          <span style={{ color: 'rgba(78,205,196,.42)', fontSize: '.5rem', letterSpacing: '.06em' }}>
            // 3 projects
          </span>
          {/* Shimmer sweep */}
          <span style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent)',
            animation: '_p-shim 4.5s ease-in-out infinite', pointerEvents: 'none',
          }} />
        </span>

        <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, #4ecdc4)' }} />
      </motion.div>

      {/* Main title */}
      <motion.h2
        className="font-heading font-black mb-4"
        style={{ fontSize: 'clamp(2.6rem,6.5vw,4.4rem)', lineHeight: 1.06, color: 'var(--text-primary)' }}
        initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.72, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        Featured{' '}
        <span style={{
          background: 'linear-gradient(135deg,#ff6b6b 0%,#f97316 22%,#a855f7 60%,#4ecdc4 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 26px rgba(168,85,247,.38))',
        }}>Projects</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-sm mx-auto max-w-sm leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.24 }}
      >
        Real projects — not tutorial clones. Built to solve real problems
        with production-level thinking.
      </motion.p>

      {/* Animated accent bar */}
      <motion.div
        className="mx-auto mt-5 h-[2px] rounded-full"
        style={{ background: 'linear-gradient(90deg,#ff6b6b,#a855f7,#4ecdc4)' }}
        initial={{ width: 0, opacity: 0 }}
        animate={inView ? { width: 134, opacity: 1 } : {}}
        transition={{ duration: 0.88, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Three floating dots */}
      <motion.div
        className="flex items-center justify-center gap-3 mt-5"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.56 }}
      >
        {(['#6366f1', '#4ecdc4', '#f97316'] as const).map((cc, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: cc,
            boxShadow: `0 0 12px ${cc}99`,
            animation: `_p-float ${2.4 + i * 0.35}s ease-in-out ${i * 0.28}s infinite`,
          }} />
        ))}
      </motion.div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   STATUS BADGE
════════════════════════════════════════════════════════════════════════════ */
function StatusBadge({ status, label }: { status: string; label: string }) {
  const cfg = ({
    live:      { bg: 'rgba(74,222,128,.10)',  text: '#4ade80', border: 'rgba(74,222,128,.28)'  },
    completed: { bg: 'rgba(99,102,241,.10)',  text: '#818cf8', border: 'rgba(99,102,241,.28)'  },
    building:  { bg: 'rgba(251,191,36,.10)',  text: '#fbbf24', border: 'rgba(251,191,36,.28)'  },
  } as Record<string, { bg: string; text: string; border: string }>)[status]
    ?? { bg: 'rgba(156,163,175,.10)', text: '#9ca3af', border: 'rgba(156,163,175,.25)' }

  return (
    <span
      className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
        font-mono overflow-hidden"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {/* Animated dot */}
      <span className="relative flex w-2 h-2">
        {status !== 'completed' && (
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75"
            style={{ backgroundColor: cfg.text, animation: '_p-ping 1.6s cubic-bezier(0,0,.2,1) infinite' }} />
        )}
        <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: cfg.text }} />
      </span>
      {label}
      {/* Shimmer */}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.09),transparent)',
        animation: '_p-shim 5s ease-in-out infinite', pointerEvents: 'none',
      }} />
    </span>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   STAT CHIP
════════════════════════════════════════════════════════════════════════════ */
function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      className="flex flex-col items-center px-4 py-2 rounded-xl relative overflow-hidden cursor-default"
      style={{ background: `${color}0d`, border: `1px solid ${color}24` }}
      whileHover={{ scale: 1.08, background: `${color}1d` }}
      transition={{ duration: 0.14 }}
    >
      <span className="text-lg font-black font-mono tabular-nums leading-none" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] mt-1 font-mono tracking-wider uppercase" style={{ color: `${color}77` }}>
        {label}
      </span>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)',
        animation: '_p-shim 7s ease-in-out infinite', pointerEvents: 'none',
      }} />
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   TERMINAL PANEL
════════════════════════════════════════════════════════════════════════════ */
function TerminalPanel({
  highlights, color, cardIndex = 0,
}: {
  highlights: readonly string[]
  color: string
  cardIndex?: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{
        background: '#0d1117',
        border: `1px solid ${color}2a`,
        fontFamily: 'ui-monospace,"Cascadia Code","Fira Code",monospace',
        minHeight: 268,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(to right,#161b22,#0d1117)', borderBottom: `1px solid ${color}18` }}
      >
        <div className="flex gap-1.5">
          {(['#ff5f56','#ffbd2e','#27c93f'] as const).map(cc => (
            <div key={cc} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cc }} />
          ))}
        </div>
        <span className="ml-2 text-[11px]" style={{ color: '#6e7681' }}>highlights.sh</span>
        <div className="ml-auto text-[10px] px-2 py-0.5 rounded-md font-bold"
          style={{ background: `${color}1c`, color }}>
          bash
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1">
        {/* Prompt */}
        <div className="mb-3 flex items-center gap-2" style={{ fontSize: 12 }}>
          <span style={{ color: '#3fb950' }}>❯</span>
          <span style={{ color: '#e6edf3' }}>cat key-features.txt</span>
        </div>

        {/* Lines */}
        <div className="space-y-1.5">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2"
              style={{ fontSize: 11.5, lineHeight: 1.65 }}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: cardIndex * 0.06 + i * 0.08 + 0.15, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{ color, flexShrink: 0, marginTop: 3, fontSize: 9 }}>▸</span>
              <span style={{ color: '#c9d1d9' }}>{h}</span>
            </motion.div>
          ))}
        </div>

        {/* Blinking cursor */}
        <motion.div
          className="mt-3 flex items-center gap-1.5"
          style={{ fontSize: 12 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: cardIndex * 0.06 + highlights.length * 0.08 + 0.3 }}
        >
          <span style={{ color: '#3fb950' }}>❯</span>
          <span style={{ color: '#6e7681', animation: '_p-blink 1.2s step-end infinite' }}>█</span>
        </motion.div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   PROGRESS PANEL  (building projects only)
════════════════════════════════════════════════════════════════════════════ */
function ProgressPanel({
  progress, milestones, color, secondColor,
}: {
  progress: number
  milestones: readonly { label: string; done: boolean }[]
  color: string
  secondColor: string
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div
      ref={ref}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: `${color}09`, border: `1px solid ${color}22` }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Development Progress
        </span>
        <span className="text-xs font-mono font-bold tabular-nums" style={{ color }}>
          {progress}%
        </span>
      </div>

      {/* Progress track */}
      <div className="h-2.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,.06)' }}>
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg,${color},${secondColor})`,
            boxShadow: `0 0 14px ${color}55`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${progress}%` } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          {/* Shimmer on bar */}
          <span style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent)',
            animation: '_p-shim 2.8s ease-in-out 2s infinite',
          }} />
        </motion.div>
      </div>

      {/* Milestone chips */}
      <div className="flex flex-wrap gap-1.5">
        {milestones.map((m, i) => (
          <motion.span
            key={m.label}
            className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold"
            style={{
              background: m.done ? 'rgba(74,222,128,.10)' : 'rgba(251,191,36,.10)',
              color:      m.done ? '#4ade80'              : '#fbbf24',
              border:     `1px solid ${m.done ? 'rgba(74,222,128,.26)' : 'rgba(251,191,36,.26)'}`,
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {m.done ? '✓' : '○'} {m.label}
          </motion.span>
        ))}
      </div>

      {/* Background shimmer */}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.02),transparent)',
        animation: '_p-shim 10s ease-in-out infinite', pointerEvents: 'none',
      }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   PROJECT CARD
════════════════════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { theme } = useTheme()
  const dark      = theme === 'dark'
  const cardRef   = useRef<HTMLDivElement>(null)
  const spotRef   = useRef<HTMLDivElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const techRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const c  = project.color
  const c2 = project.secondColor
  const techInView = useInView(techRef, { once: true, margin: '-5%' })

  /* ── Mouse: spotlight + 3D tilt (zero React re-renders) ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const y    = e.clientY - rect.top
    const cx   = x / rect.width  - 0.5
    const cy   = y / rect.height - 0.5
    if (spotRef.current) {
      spotRef.current.style.background =
        `radial-gradient(circle 390px at ${x}px ${y}px, ${c}15 0%, transparent 70%)`
    }
    cardRef.current.style.transform =
      `perspective(1400px) rotateX(${(-cy * 5.5).toFixed(2)}deg) rotateY(${(cx * 5.5).toFixed(2)}deg) translateY(-5px) scale(1.005)`
  }, [c])

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.background = 'none'
    if (cardRef.current) cardRef.current.style.transform =
      'perspective(1400px) rotateX(0) rotateY(0) translateY(0) scale(1)'
    setHovered(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 68, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* ── Outer glow ring (opacity transition = GPU composited) ── */}
      <div style={{
        position: 'absolute', inset: -24, borderRadius: 36, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse, ${c}18 0%, transparent 65%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.45s ease',
        willChange: 'opacity',
      }} />

      {/* ── Spinning conic border wrapper ── */}
      <div
        ref={wrapRef}
        className="relative rounded-3xl overflow-hidden"
        style={{ padding: '1.5px', zIndex: 1 }}
      >
        {/* Rotating conic gradient (creates the animated border) */}
        <motion.div
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '200%', height: '200%',
            translateX: '-50%', translateY: '-50%',
            background: hovered
              ? `conic-gradient(from 0deg, ${c}, ${c2}, #a855f7, #60a5fa, ${c2}, ${c})`
              : `conic-gradient(from 0deg, ${c}52, ${c}18, ${c2}2c, ${c}18, ${c}52)`,
          }}
          animate={hovered ? { rotate: 360 } : { rotate: 0 }}
          transition={hovered
            ? { duration: 4, repeat: Infinity, ease: 'linear', repeatType: 'loop' }
            : { duration: 0.55 }
          }
        />

        {/* ── Card body ── */}
        <div
          ref={cardRef}
          className="relative rounded-[22px] overflow-hidden"
          style={{
            background: dark
              ? 'linear-gradient(148deg,#0e0e16 0%,#09090f 100%)'
              : 'linear-gradient(148deg,#ffffff 0%,#f5f5fc 100%)',
            transition: 'transform 0.46s cubic-bezier(0.22,1,0.36,1)',
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Mouse spotlight overlay */}
          <div ref={spotRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

          {/* Card-internal scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg,transparent 0%,${c}1e 50%,transparent 100%)`,
            animation: '_p-scan 9s linear infinite', willChange: 'top',
            pointerEvents: 'none', zIndex: 2,
          }} />

          {/* Top colour stripe */}
          <div style={{ height: 3, background: `linear-gradient(90deg,${c},${c2},transparent 75%)` }} />

          {/* Giant background number */}
          <div
            className="absolute font-black select-none pointer-events-none font-heading"
            style={{
              fontSize: 'clamp(8rem,15vw,14rem)',
              color: `${c}08`,
              top: '-0.12em', right: '0.04em',
              lineHeight: 1, letterSpacing: '-0.04em', zIndex: 0,
              transition: 'color 0.4s ease',
            }}
          >
            {String(project.id).padStart(2, '0')}
          </div>

          {/* Ambient glow blob */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 580, height: 580,
              background: `radial-gradient(circle,${c}0c 0%,transparent 65%)`,
              top: -170, left: -140, zIndex: 0,
              animation: '_p-glow 5.5s ease-in-out infinite',
            }}
          />

          {/* ═════════════════════ CARD CONTENT ═════════════════════ */}
          <div className="relative z-10 p-8 md:p-10">

            {/* ── Header row: status badge + stats ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
              <StatusBadge status={project.status} label={project.statusLabel} />
              <div className="flex gap-2 flex-wrap">
                {project.stats.map(s => (
                  <StatChip key={s.label} label={s.label} value={s.value} color={c} />
                ))}
              </div>
            </div>

            {/* ── Title block ── */}
            <div className="mb-7">
              <div className="flex items-center gap-3.5 mb-2">
                {/* Floating icon */}
                <motion.span
                  style={{ fontSize: '2.3rem', display: 'inline-block', animation: '_p-float 3.4s ease-in-out infinite' }}
                  whileHover={{ scale: 1.24, rotate: 12 }}
                  transition={{ duration: 0.2 }}
                >
                  {project.icon}
                </motion.span>
                <div>
                  <h3
                    className="font-heading font-black leading-none"
                    style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text-primary)' }}
                  >
                    {project.title}
                  </h3>
                  <p className="font-mono text-sm mt-1 font-semibold" style={{ color: c }}>
                    {project.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-[11px] font-mono tracking-widest mt-2.5" style={{ color: `${c}6e` }}>
                {project.stack}
              </p>
            </div>

            {/* ── Divider ── */}
            <div className="mb-7 h-px" style={{ background: `linear-gradient(90deg,${c}2a,transparent)` }} />

            {/* ── Two-column body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">

              {/* ── LEFT ── */}
              <div className="flex flex-col gap-6">

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {project.description}
                </p>

                {/* Tech chips — scroll-triggered stagger wave */}
                <div ref={techRef} className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <motion.span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-mono cursor-default relative overflow-hidden"
                      style={{
                        border: `1px solid ${c}32`, color: c, background: `${c}0d`,
                        transition: 'background .18s,border-color .18s,box-shadow .18s',
                      }}
                      initial={{ opacity: 0, scale: 0.7, y: 10 }}
                      animate={techInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{ delay: 0.04 + i * 0.055, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.09, y: -2, background: `${c}20`, boxShadow: `0 4px 16px ${c}22` }}
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold relative overflow-hidden"
                    style={{
                      color: 'var(--text-primary)',
                      background: dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)',
                      border: `1px solid ${dark ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.1)'}`,
                    }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GithubIcon />
                    Source Code
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: 'inherit',
                      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)',
                      animation: '_p-shim 3.8s ease-in-out infinite', pointerEvents: 'none',
                    }} />
                  </motion.a>

                  {project.demo && (
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold relative overflow-hidden text-white"
                      style={{
                        background: `linear-gradient(135deg,${c},${c2})`,
                        boxShadow: `0 4px 22px ${c}44`,
                      }}
                      whileHover={{ scale: 1.06, y: -2, boxShadow: `0 8px 30px ${c}5a` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Sheen sweep */}
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'rgba(255,255,255,.18)' }}
                        initial={{ x: '-100%', skewX: -15 }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.46 }}
                      />
                      <span className="relative flex items-center gap-1.5">
                        <ExternalIcon />
                        Live Demo
                      </span>
                    </motion.a>
                  )}
                </div>

                {/* Progress (building projects only) */}
                {'progress' in project && (
                  <ProgressPanel
                    progress={(project as typeof PROJECTS[2]).progress}
                    milestones={(project as typeof PROJECTS[2]).milestones}
                    color={c}
                    secondColor={c2}
                  />
                )}
              </div>

              {/* ── RIGHT: terminal ── */}
              <TerminalPanel
                highlights={project.highlights}
                color={c}
                cardIndex={index}
              />
            </div>
          </div>

          {/* Hover shimmer sweep across whole card */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-[22px]"
                style={{ background: `linear-gradient(118deg,transparent 42%,${c}0e 50%,transparent 58%)` }}
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: '210%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.88, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   BOTTOM CTA
════════════════════════════════════════════════════════════════════════════ */
function BottomCta() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className="text-center mt-20"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.58 }}
    >
      <div
        className="inline-flex flex-col items-center gap-5 px-12 py-10 rounded-3xl relative overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Glowing corner dots */}
        {([ ['#6366f1',{top:0,left:0}], ['#4ecdc4',{top:0,right:0}], ['#f97316',{bottom:0,left:0}], ['#a855f7',{bottom:0,right:0}] ] as const).map(([cc, pos], i) => (
          <div key={i} style={{
            position: 'absolute', ...(pos as object),
            width: 7, height: 7, borderRadius: '50%',
            background: cc, boxShadow: `0 0 14px ${cc}`,
            animation: `_p-float ${2.8 + i * 0.3}s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}

        {/* Line decoration */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(78,205,196,.25), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(168,85,247,.25), transparent)',
        }} />

        <p className="text-sm font-mono tracking-wide" style={{ color: 'var(--text-muted)' }}>
          More projects actively in progress
        </p>

        <motion.a
          href="https://github.com/ajaypatil-8"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-semibold overflow-hidden"
          style={{
            color: 'var(--text-primary)',
            background: 'var(--bg-card-hover)',
            border: '1.5px solid var(--border-strong)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <GithubIcon />
          View GitHub Profile ↗
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)' }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.a>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════════════════════════════ */
export default function Projects() {
  const { theme } = useTheme()
  const dark      = theme === 'dark'

  return (
    <section
      id="projects"
      className="relative min-h-screen py-28 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <style>{PROJ_KF}</style>
      <SectionBg dark={dark} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <SectionHeader />

        <div className="space-y-14">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <BottomCta />
      </div>
    </section>
  )
}