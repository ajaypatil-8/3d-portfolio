'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    id: 1,
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
    statusLabel: '✅ Completed & Working',
    color: '#4ecdc4',
    gradient: 'from-[#4ecdc4]/20 to-[#0f172a]',
    icon: '🏆',
    github: 'https://github.com/ajaypatil-8/College-Major-Project-php-',
    demo: 'https://crowdspark-x.infinityfreeapp.com',
  },
  {
    id: 2,
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
    statusLabel: '🚀 In Progress — Actively Building',
    color: '#ff6b6b',
    gradient: 'from-[#ff6b6b]/20 to-[#0f172a]',
    icon: '🚀',
    github: 'https://github.com/ajaypatil-8/Crowdspark-Backend',
    demo: null,
  },
]

function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
      status === 'completed'
        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    }`}>
      {label}
    </span>
  )
}

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export default function Projects() {
  return (
    <section id="projects" className="relative min-h-screen py-24 overflow-hidden"
      style={{ backgroundColor: '#111111' }}>

      {/* CSS blobs */}
      <div className="absolute top-20 left-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: 'rgba(78,205,196,0.05)' }} />
      <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: 'rgba(255,107,107,0.05)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#4ecdc4' }}>
            What I've built
          </p>
          <h2 className="font-heading font-bold mb-4"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#ffffff' }}>
            Featured{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Projects</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', maxWidth: 480, margin: '0 auto' }}>
            Real projects — not tutorial clones. Built to solve real problems with production-level thinking.
          </p>
        </motion.div>

        {/* Project cards */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${project.color}20`,
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                  {/* Left */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{project.icon}</span>
                      <StatusBadge status={project.status} label={project.statusLabel} />
                    </div>

                    <h3 className="font-heading font-bold text-white mb-1"
                      style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>
                      {project.title}
                    </h3>
                    <p className="text-sm font-mono mb-4" style={{ color: project.color }}>
                      {project.subtitle}
                    </p>
                    <p className="leading-relaxed text-sm mb-6" style={{ color: 'rgba(255,255,255,0.58)' }}>
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t) => (
                        <span key={t}
                          className="px-3 py-1 rounded-full text-xs font-mono"
                          style={{
                            border: `1px solid ${project.color}35`,
                            color: project.color,
                            backgroundColor: `${project.color}10`,
                          }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* ✅ Buttons — open in NEW TAB */}
                    <div className="flex flex-wrap gap-3">
                      <motion.a
                        href={project.github}
                        target="_blank"          // ← opens new tab
                        rel="noopener noreferrer" // ← security best practice
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                        whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.14)' }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <GithubIcon />
                        GitHub ↗
                      </motion.a>

                      {project.demo && (
                        <motion.a
                          href={project.demo}
                          target="_blank"          // ← opens new tab
                          rel="noopener noreferrer" // ← security best practice
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                          style={{
                            backgroundColor: `${project.color}20`,
                            border: `1px solid ${project.color}45`,
                          }}
                          whileHover={{ scale: 1.04, backgroundColor: `${project.color}30` }}
                          whileTap={{ scale: 0.96 }}
                        >
                          Live Demo ↗
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Right — highlights */}
                  <div className="rounded-2xl p-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs font-mono uppercase tracking-widest mb-4"
                      style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Key Features
                    </p>
                    <ul className="space-y-3">
                      {project.highlights.map((h, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 text-sm"
                          style={{ color: 'rgba(255,255,255,0.65)' }}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + i * 0.07 }}
                        >
                          <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                            ✓
                          </span>
                          {h}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Progress for in-progress */}
                    {project.status === 'in-progress' && (
                      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            Development Progress
                          </span>
                          <span className="text-xs font-mono" style={{ color: '#fbbf24' }}>~55%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)' }}
                            initial={{ width: 0 }}
                            whileInView={{ width: '55%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div className="text-center mt-14"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            More projects coming soon — actively building!
          </p>
          <motion.a
            href="https://github.com/ajaypatil-8"
            target="_blank"           // ← new tab
            rel="noopener noreferrer"  // ← security
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.35)', color: '#ffffff' }}
          >
            <GithubIcon />
            View GitHub Profile ↗
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}