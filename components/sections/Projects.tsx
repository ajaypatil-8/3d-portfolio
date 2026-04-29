'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

const projects = [
{
    id: 1,
    title: 'AeroSphere',
    subtitle: 'Airline Booking & Management System — Java / Docker / AWS',
    description:
      'A production-grade full-stack airline booking platform with multi-role authentication, real-time seat availability, flight search, booking management, and Razorpay payment gateway — fully Dockerized and self-hosted on AWS EC2 with a custom domain, free SSL via Let\'s Encrypt, and automated CI/CD via GitHub Actions.',
    tech: ['Java 11', 'JSP/Servlets', 'Apache Tomcat 9', 'MySQL 8', 'Nginx', 'Docker', 'Maven', 'AWS EC2', 'Let\'s Encrypt', 'GitHub Actions'],
    highlights: [
      'Deployed on AWS EC2 t3.small with Elastic IP & custom domain',
      'Free HTTPS via Let\'s Encrypt — auto-renewing SSL certificate',
      '3-service Docker Compose stack (Tomcat + MySQL + Nginx)',
      'Nginx: HTTP→HTTPS redirect, rate limiting, gzip & HSTS headers',
      'Razorpay payment gateway + Gmail SMTP notifications',
      'CI/CD pipeline — auto-deploy on every git push',
    ],
    status: 'completed',
    statusLabel: 'Live & Deployed',
    color: '#6366f1',
    icon: '✈️',
    github: 'https://github.com/ajaypatil-8/aerosphere-airline-management-system',
    demo: 'https://aerosphere.work.gd',
  },
  {
    id: 2,
    title: 'CrowdSpark-X',
    subtitle: 'Crowdfunding Platform — PHP Version',
    description:
      'A full-stack crowdfunding web application allowing users to create and support fundraising campaigns. Features multi-role dashboards, real-time donation tracking, Cloudinary media uploads and email verification via PHPMailer SMTP.',
    tech: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript', 'Cloudinary', 'PHPMailer', 'XAMPP'],
    highlights: [
      'Multi-role system (Admin, Creator, User)',
      'Campaign creation with images & videos',
      'Secure login & email verification (SMTP)',
      'Admin dashboard & campaign approval',
      'Real-time donation progress tracking',
    ],
    status: 'completed',
    statusLabel: 'Completed & Working',
    color: '#4ecdc4',
    icon: '🏆',
    github: 'https://github.com/ajaypatil-8/College-Major-Project-php-',
    demo: 'https://crowdspark-x.infinityfreeapp.com',
  },
  {
    id: 3,
    title: 'CrowdSpark-X Advanced',
    subtitle: 'Microservices Architecture — Spring Boot Version',
    description:
      'An advanced scalable rebuild of CrowdSpark using Spring Boot microservices, Next.js frontend, Kafka event streaming, Docker containers, and PostgreSQL. Designed for production-level performance and clean architecture.',
    tech: ['Spring Boot', 'Next.js', 'PostgreSQL', 'Docker', 'Kafka', 'REST API', 'JWT', 'TypeScript'],
    highlights: [
      'RESTful API with Spring Boot backend',
      'Next.js modern frontend UI',
      'JWT authentication & Spring Security',
      'Kafka for real-time event streaming',
      'Dockerised microservices architecture',
    ],
    status: 'in-progress',
    statusLabel: 'In Progress — Actively Building',
    color: '#ff6b6b',
    icon: '🚀',
    github: 'https://github.com/ajaypatil-8/Crowdspark-Backend',
    demo: null,
  },
]

/* ─── GitHub SVG ─────────────────────────────────────────────────────── */

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

/* ─── Status badge ───────────────────────────────────────────────────── */

function StatusBadge({ status, label }: { status: string; label: string }) {
  const isCompleted = status === 'completed'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background:   isCompleted ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
        color:        isCompleted ? '#4ade80'                : '#fbbf24',
        border:       `1px solid ${isCompleted ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: isCompleted ? '#4ade80' : '#fbbf24' }}
      />
      {label}
    </span>
  )
}

/* ─── Feature row ────────────────────────────────────────────────────── */

function FeatureItem({
  text, color, delay,
}: { text: string; color: string; delay: number }) {
  return (
    <motion.li
      className="flex items-start gap-3 text-sm"
      style={{ color: 'var(--text-secondary)' }}
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35 }}
    >
      <span
        className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        ✓
      </span>
      {text}
    </motion.li>
  )
}

/* ─── Project card ───────────────────────────────────────────────────── */

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { theme } = useTheme()

  return (
    <motion.div
      key={project.id}
      className="rounded-3xl overflow-hidden relative"
      style={{
        backgroundColor: 'var(--bg-card)',
        border:          `1px solid ${project.color}22`,
        backdropFilter:  'blur(12px)',
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* ── Colored accent bar at top ── */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${project.color}, ${project.color}55, transparent)`,
        }}
      />

      {/* ── Subtle glow blob behind card header ── */}
      <div
        className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
        style={{
          background:    `radial-gradient(circle, ${project.color}0d 0%, transparent 70%)`,
          borderRadius:  '50%',
          transform:     'translate(-30%, -30%)',
        }}
      />

      <div className="p-8 md:p-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: info ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{project.icon}</span>
              <StatusBadge status={project.status} label={project.statusLabel} />
            </div>

            <h3
              className="font-heading font-bold mb-1"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--text-primary)' }}
            >
              {project.title}
            </h3>
            <p className="text-sm font-mono mb-4" style={{ color: project.color }}>
              {project.subtitle}
            </p>
            <p className="leading-relaxed text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-mono transition-colors"
                  style={{
                    border:          `1px solid ${project.color}35`,
                    color:           project.color,
                    backgroundColor: `${project.color}10`,
                  }}
                >
                  {t}
                </span>
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
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <GithubIcon />
                GitHub ↗
              </motion.a>

              {project.demo && (
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                  style={{
                    color:           project.color,
                    backgroundColor: `${project.color}15`,
                    border:          `1px solid ${project.color}40`,
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Live Demo ↗
                </motion.a>
              )}
            </div>
          </div>

          {/* ── Right: highlights ── */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: theme === 'light' ? `${project.color}06` : `${project.color}08`,
              border:          `1px solid ${project.color}20`,
            }}
          >
            {/* mini header strip */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {['#ff5f56','#ffbd2e','#27c93f'].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-muted)' }}>
                key-features.md
              </span>
            </div>

            <ul className="space-y-3">
              {project.highlights.map((h, i) => (
                <FeatureItem
                  key={i}
                  text={h}
                  color={project.color}
                  delay={index * 0.1 + i * 0.06}
                />
              ))}
            </ul>

            {/* Progress bar for in-progress projects */}
            {project.status === 'in-progress' && (
              <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${project.color}20` }}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Development Progress
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#fbbf24' }}>~85%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>

                {/* milestone chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['API ✓', 'Auth ✓', 'JWT ✓', 'SpringBoot Backend ✓ ' ,'Kafka…', 'Frontend…'].map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-full text-xs font-mono"
                      style={{
                        backgroundColor: m.includes('✓') ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                        color:           m.includes('✓') ? '#4ade80'               : '#fbbf24',
                        border:          `1px solid ${m.includes('✓') ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}`,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Projects section ───────────────────────────────────────────────── */

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* ambient blobs */}
      <div
        className="absolute top-20 left-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'rgba(78,205,196,0.05)' }}
      />
      <div
        className="absolute bottom-20 right-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: 'rgba(255,107,107,0.05)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#4ecdc4' }}>
            What I've built
          </p>
          <h2
            className="font-heading font-bold mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Featured{' '}
            <span style={{
              background:            'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip:  'text',
              WebkitTextFillColor:   'transparent',
              backgroundClip:        'text',
            }}>
              Projects
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 480, margin: '0 auto' }}>
            Real projects — not tutorial clones. Built to solve real problems with production-level thinking.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            More projects coming soon — actively building!
          </p>
          <motion.a
            href="https://github.com/ajaypatil-8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm"
            style={{
              border:         '1px solid var(--border-strong)',
              color:          'var(--text-secondary)',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={{ scale: 1.04, color: 'var(--text-primary)' }}
            whileTap={{ scale: 0.97 }}
          >
            <GithubIcon />
            View GitHub Profile ↗
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}