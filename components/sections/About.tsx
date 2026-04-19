'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ─── Data ───────────────────────────────────────────────────────────── */

const quickInfo = [
  { icon: '🎓', label: 'BCA Final Year', value: '2025-26'                     },
  { icon: '🏛️', label: 'University',     value: 'Shivaji University, Kolhapur' },
  { icon: '📍', label: 'Location',       value: 'Palus, MH'                   },
  { icon: '💻', label: 'Experience',     value: '2+ Years'                    },
]

const skills = [
  {
    icon: '⚙️', title: 'Java & Spring Boot', tag: 'Core', color: '#4ade80',
    keywords: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'JPA', 'Hibernate', 'REST API'],
  },
  {
    icon: '🗄️', title: 'Database & Backend', tag: 'Core', color: '#4ade80',
    keywords: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL'],
  },
  {
    icon: '🎨', title: 'React & Next.js', tag: 'Proficient', color: '#fbbf24',
    keywords: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    icon: '🐳', title: 'Docker & Cloud', tag: 'Comfortable', color: '#38bdf8',
    keywords: ['Docker', 'Docker Compose', 'Nginx', 'Railway', 'GitHub Actions', 'AWS', 'CI/CD'],
  },
]

/* ─── Skill card ─────────────────────────────────────────────────────── */

function SkillCard({ s, i }: { s: typeof skills[0]; i: number }) {
  return (
    <motion.div
      className="rounded-xl p-4 text-center group"
      style={{
        backgroundColor: 'var(--bg-card)',
        border:          '1px solid var(--border)',
        transition:      'border-color 0.2s, transform 0.2s',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* colored top accent */}
      <div
        className="h-0.5 w-8 mx-auto rounded-full mb-3"
        style={{ backgroundColor: s.color }}
      />

      <div className="text-2xl mb-2">{s.icon}</div>
      <div className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
        {s.title}
      </div>

      <div
        className="text-xs px-2 py-0.5 rounded-full inline-block mb-3 font-mono"
        style={{ backgroundColor: `${s.color}15`, color: s.color }}
      >
        {s.tag}
      </div>

      {/* keywords — show all, wrap naturally */}
      <div className="flex flex-wrap gap-1 justify-center">
        {s.keywords.map(kw => (
          <span
            key={kw}
            className="text-[0.6rem] px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}
          >
            {kw}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Quick info grid ────────────────────────────────────────────────── */

function QuickInfoGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-2.5"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {quickInfo.map((item, i) => (
        <motion.div
          key={i}
          className="flex flex-col gap-1 px-3 py-2.5 rounded-lg text-center"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
        >
          <span className="text-lg">{item.icon}</span>
          <div className="text-[0.65rem]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
          <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── About section ──────────────────────────────────────────────────── */

export default function About() {
  const { theme } = useTheme()

  return (
    <section
      id="about"
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(78,205,196,0.06)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(255,107,107,0.06)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p
            className="text-sm font-mono tracking-widest uppercase mb-4"
            style={{ color: '#4ecdc4' }}
          >
            About Me
          </p>

          {/*
            FIX: original used text-xl for the "About Me" label (way too large for a label)
            and clamp(2.8rem, 7vw, 5.5rem) for the heading — 5.5rem is very large.
            Reduced to clamp(2.2rem, 5vw, 4rem) so it doesn't dwarf other section headings.
          */}
          <h2
            className="font-heading font-bold leading-[1.05] mb-3"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color:    'var(--text-primary)',
            }}
          >
            Java Backend{' '}
            <span style={{
              background:           'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Developer
            </span>
            <br />
            <span
              className="font-light"
              style={{ fontSize: '0.55em', color: 'var(--text-muted)' }}
            >
              &amp; Full Stack Engineer
            </span>
          </h2>
        </motion.div>

        {/* ── Bio + quick info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start mb-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="leading-relaxed text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Ajay Patil</strong> — BCA Final Year
              (2025-26) from Palus, Maharashtra. Specializing in{' '}
              <strong style={{ color: '#4ade80' }}>Java backend development</strong> with Spring Boot,
              Spring Security, JPA, and Hibernate. Built{' '}
              <strong style={{ color: 'var(--text-primary)' }}>CrowdSpark-X</strong> (PHP → Spring Boot
              microservices). Hands-on with JWT auth, Docker, Kafka, and cloud deployment.
            </p>

            <div className="flex flex-wrap gap-3">
              {/* Mail CTA */}
              <motion.a
                href="mailto:ajaypatil8eight@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white text-sm"
                style={{
                  background:  'linear-gradient(135deg, #ff6b6b, #a855f7)',
                  boxShadow:   '0 0 16px rgba(255,107,107,0.2)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Mail Me →
              </motion.a>

              {/* GitHub */}
              <motion.a
                href="https://github.com/ajaypatil-8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{
                  border:          '1px solid var(--border-strong)',
                  color:           'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub ↗
              </motion.a>

              {/* Resume download — links to the PDF in /public/resume/ */}
              <motion.a
                href="/resume/Ajay_Patil_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{
                  border:          '1px solid rgba(78,205,196,0.35)',
                  color:           '#4ecdc4',
                  backgroundColor: 'rgba(78,205,196,0.08)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume ↓
              </motion.a>
            </div>
          </motion.div>

          <QuickInfoGrid />
        </div>

        {/* ── Skill cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {skills.map((s, i) => (
            <SkillCard key={i} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}