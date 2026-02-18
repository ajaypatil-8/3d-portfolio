'use client'

import { motion } from 'framer-motion'

const quickInfo = [
  { icon: '🎓', label: 'BCA Final Year', value: '2025-26' },
  { icon: '🏛️', label: 'University', value: 'Shivaji University , kolhapur' },
  { icon: '📍', label: 'Location', value: 'Palus, MH' },
  { icon: '💻', label: 'Experience', value: '2+ Years' },
]

const skills = [
  {
    icon: '⚙️',
    title: 'Java & Spring Boot',
    tag: 'Core',
    color: '#4ade80',
    keywords: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'JPA', 'Hibernate', 'REST API'],
  },
  {
    icon: '🗄️',
    title: 'Database & Backend',
    tag: 'Core',
    color: '#4ade80',
    keywords: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQL'],
  },
  {
    icon: '🎨',
    title: 'React & Next.js',
    tag: 'Proficient',
    color: '#fbbf24',
    keywords: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    icon: '🐳',
    title: 'Docker & Cloud',
    tag: 'Learning',
    color: '#94a3b8',
    keywords: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      {/* CSS blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(78,205,196,0.06)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(255,107,107,0.06)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Big hero title — full width, centered ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xl font-mono tracking-widest uppercase mb-4" style={{ color: '#4ecdc4' }}>
            About Me
          </p>
          <h2
            className="font-heading font-bold leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: '#ffffff' }}
          >
            Java Backend{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Developer</span>
            <br />
            <span className="font-light" style={{ fontSize: '0.6em', color: 'rgba(255,255,255,0.45)' }}>
              &amp; Full Stack Engineer
            </span>
          </h2>
        </motion.div>

        {/* ── Body row: Intro + Quick Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-start mb-10">

          {/* Left: Intro + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="leading-relaxed text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <strong style={{ color: '#ffffff' }}>Ajay Patil</strong> — BCA Final Year (2025-26) from Palus, Maharashtra.
              Specializing in <strong style={{ color: '#4ade80' }}>Java backend development</strong> with Spring Boot,
              Spring Security, JPA, and Hibernate. Built <strong style={{ color: '#ffffff' }}>CrowdSpark-X</strong> (PHP → Spring Boot microservices).
              Hands-on with JWT auth, Docker, Kafka, and cloud deployment.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="mailto:aj9411979585@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)', boxShadow: '0 0 16px rgba(255,107,107,0.2)' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Hire Me →
              </motion.a>
              <motion.a
                href="https://github.com/ajaypatil-8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.75)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
                whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub ↗
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Quick Info Cards */}
          <motion.div
            className="grid grid-cols-2 gap-2.5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {quickInfo.map((item, i) => (
              <div key={i}
                className="flex flex-col gap-1 px-3 py-2.5 rounded-lg text-center"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                <span className="text-lg">{item.icon}</span>
                <div className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</div>
                <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>{item.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Skills row — horizontal compact cards ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {skills.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-4 text-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.14)', transition: { duration: 0.2 } }}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-sm font-bold mb-1" style={{ color: '#ffffff' }}>{s.title}</div>
              <div className="text-xs px-2 py-0.5 rounded-full inline-block mb-2.5 font-mono"
                style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                {s.tag}
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {s.keywords.slice(0, 4).map(kw => (
                  <span key={kw} className="text-[0.6rem] px-1.5 py-0.5 rounded font-mono"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.3)',
                    }}>
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}