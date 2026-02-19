'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const education = [
  {
    year: '2023-26 (Present)', icon: '🎓', color: '#4ecdc4',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'Arts, Commerce & Science College, Palus',
    sub: 'Shivaji University, Kolhapur',
    description: 'Currently in 3rd year, studying Data Structures, DBMS, Operating Systems, Web Technologies and Software Engineering. Complementing academics with real-world full-stack projects in Java & Spring Boot.',
    tags: ['3rd Year', 'BCA', 'Shivaji University'],
  },
  {
    year: '2022 – 2023', icon: '📚', color: '#a855f7',
    title: 'Higher Secondary (12th) — Commerce',
    org: 'Palus, Sangli, Maharashtra',
    sub: 'Maharashtra State Board',
    description: 'Completed HSC with focus on Commerce stream. Discovered passion for programming and started self-learning web development alongside academics.',
    tags: ['HSC', 'Commerce', 'Maharashtra Board'],
  },
]

const selfLearning = [
  {
    year: '2025 – Present', icon: '⚙️', color: '#ff6b6b',
    title: 'Spring Boot & Microservices',
    org: 'Self-Learning & Projects',
    description: 'Mastering Spring Boot, Spring Security, Spring Data JPA, REST API design and microservices architecture. Built CrowdSpark-X Advanced as a hands-on production project.',
    tags: ['Spring Boot', 'Microservices', 'Docker', 'Kafka'],
  },
  {
    year: '2024-25', icon: '🏆', color: '#ffd93d',
    title: 'Full Stack Development with PHP',
    org: 'Self-Built Project',
    description: 'Built CrowdSpark-X — a complete full-stack crowdfunding platform using PHP, MySQL, Cloudinary and PHPMailer. Handled everything from DB design to SMTP email integration.',
    tags: ['PHP', 'MySQL', 'Cloudinary', 'SMTP'],
  },
  {
    year: '2024 – Present', icon: '🎨', color: '#4ecdc4',
    title: 'React & Next.js Frontend',
    org: 'Self-Learning',
    description: 'Learned React.js and Next.js to build the frontend for CrowdSpark-X Advanced. Comfortable with TypeScript, Tailwind CSS, REST API integration and component-based architecture.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    year: '2026 – Present', icon: '🐳', color: '#a855f7',
    title: 'Docker & Cloud Basics',
    org: 'Self-Learning',
    description: 'Learned Docker containerisation, Kubernetes basics, and cloud fundamentals on AWS and Azure. Actively containerising the CrowdSpark-X microservices for deployment.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
  },
]

function TimelineCard({ item, index, side }: { item: typeof selfLearning[0]; index: number; side: 'left' | 'right' }) {
  return (
    <motion.div
      className={`flex items-start gap-4 ${side === 'right' ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}>
      <div className="flex-1">
        <div className={`rounded-xl p-4 group transition-all ${side === 'right' ? 'text-right' : ''}`}
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}>
          <div className={`flex items-center gap-2 mb-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono"
              style={{ backgroundColor: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
              {item.year}
            </span>
          </div>
          <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
          <p className="text-xs font-medium mb-2" style={{ color: item.color }}>{item.org}</p>
          {'sub' in item && <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{(item as any).sub}</p>}
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
          <div className={`flex flex-wrap gap-1.5 ${side === 'right' ? 'justify-end' : ''}`}>
            {item.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="h-px w-0 group-hover:w-full transition-all duration-500 mt-3 rounded-full"
            style={{ backgroundColor: item.color }} />
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center flex-shrink-0 pt-4">
        <div className="w-3 h-3 rounded-full border-[3px]"
          style={{ backgroundColor: item.color, borderColor: 'var(--bg-primary)' }} />
      </div>

      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section id="experience" ref={sectionRef} className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(78,205,196,0.4)' }} />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(96,165,250,0.4)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: '#4ecdc4' }}>Background</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Education &amp; <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Journey</span>
          </h2>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            Fresher — but self-driven, project-focused, and actively building production-level skills.
          </p>
        </motion.div>

        {/* Education */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-widest mb-4 text-center"
            style={{ color: 'var(--text-muted)' }}>📚 Education</p>
          <div className="space-y-3">
            {education.map((item, i) => (
              <motion.div key={i} className="rounded-xl p-4 transition-all"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-shrink-0"><span className="text-2xl">{item.icon}</span></div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                        {item.year}
                      </span>
                    </div>
                    <p className="font-medium text-xs mb-0.5" style={{ color: item.color }}>{item.org}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                          style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Self-learning timeline */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-6 text-center"
            style={{ color: 'var(--text-muted)' }}>🚀 Self-Learning &amp; Projects Timeline</p>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{ background: 'linear-gradient(to bottom, #4ecdc4, #60a5fa, #a855f7)' }} />
            <div className="space-y-5">
              {selfLearning.map((item, i) => (
                <TimelineCard key={i} item={item} index={i} side={i % 2 === 0 ? 'left' : 'right'} />
              ))}
            </div>
          </div>
        </div>

        {/* Hire me CTA */}
        <motion.div className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="rounded-2xl p-6 max-w-xl mx-auto"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-bold text-sm">Open to Jobs &amp; Internships</span>
            </div>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I'm a fresher with real project experience in Java, Spring Boot, React, Docker and cloud.
              Looking for an opportunity to grow in a professional team environment.
            </p>
            <motion.a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=aj9411979585@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
              target="_blank" rel="noopener noreferrer"
              className="inline-block px-7 py-3 text-white rounded-full font-semibold text-sm cursor-hover"
              style={{ background: 'linear-gradient(135deg, #4ecdc4, #60a5fa, #a855f7)' }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Get In Touch — aj9411979585@gmail.com
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}