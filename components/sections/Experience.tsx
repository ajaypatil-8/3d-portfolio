'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

/* ─── Data ───────────────────────────────────────────────────────────── */

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
    year: '2026 – Present', icon: '✈️', color: '#6366f1',
    title: 'AeroSphere — Full Production Deployment',
    org: 'Live Project · aerosphere.work.gd',
    description: 'Deployed a full airline booking system on AWS EC2 (t3.small) with Elastic IP, custom domain aerosphere.work.gd, free HTTPS via Let\'s Encrypt (certbot), and a 3-service Docker Compose stack (Tomcat + MySQL + Nginx). Configured Nginx with HTTP→HTTPS redirect, HSTS, rate limiting, and gzip. Integrated Razorpay payments and Gmail SMTP.',
    tags: ['AWS EC2', 'Docker', 'Nginx', 'Let\'s Encrypt', 'GitHub Actions', 'MySQL'],
  },
  {
    year: '2026 – Present', icon: '🐳', color: '#a855f7',
    title: 'Docker & Cloud Basics',
    org: 'Self-Learning',
    description: 'Learned Docker containerisation, Kubernetes basics, and cloud fundamentals on AWS and Azure. Actively containerising the CrowdSpark-X microservices for deployment.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
  },
]

/* ─── Tag pill ───────────────────────────────────────────────────────── */

function Tag({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs"
      style={{
        color:           'var(--text-muted)',
        backgroundColor: 'var(--bg-card-hover)',
        border:          '1px solid var(--border)',
      }}
    >
      {label}
    </span>
  )
}

/* ─── Timeline card  ─────────────────────────────────────────────────── */
/**
 * FIX: The original code placed the center-line dot and empty spacer on every
 * card regardless of `side`, causing the dots to always appear on the wrong side
 * and the alternation to look broken.
 *
 * Now the layout is:
 *   left  card  →  content | dot | empty-spacer
 *   right card  →  empty-spacer | dot | content
 * The center line is absolutely positioned, and dots sit exactly on it.
 */
function TimelineCard({
  item,
  index,
  side,
}: {
  item: typeof selfLearning[0]
  index: number
  side: 'left' | 'right'
}) {
  return (
    <motion.div
      className="flex items-start relative"
      initial={{ opacity: 0, x: side === 'left' ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      {/* Left spacer (desktop only) — empty on right-side cards */}
      <div className={`flex-1 ${side === 'right' ? 'block' : 'hidden md:block'}`} />

      {/* Center dot + vertical connector (desktop only) */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0 mx-2 pt-5 z-10">
        <motion.div
          className="w-3 h-3 rounded-full border-[3px]"
          style={{ backgroundColor: item.color, borderColor: 'var(--bg-primary)', boxShadow: `0 0 8px ${item.color}60` }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 300 }}
        />
      </div>

      {/* Right spacer (desktop only) — empty on left-side cards */}
      <div className={`flex-1 ${side === 'left' ? 'block' : 'hidden md:block'}`} />

      {/* Card — positioned on the correct side */}
      {/* We use absolute positioning trick: render the card in flex-1 of the correct side */}
      {/* Actually, cleaner: we swap the order based on side */}
      {/* The structure above already handles it: the card needs to be in the right flex-1 slot */}
      {/* Let's use a different approach: render the card absolutely within the correct half */}
    </motion.div>
  )
}

/**
 * Better approach: render each card directly in its half without the buggy
 * three-column flex trick.
 */
function TimelineCardFixed({
  item,
  index,
  side,
}: {
  item: typeof selfLearning[0]
  index: number
  side: 'left' | 'right'
}) {
  const isLeft = side === 'left'

  return (
    <motion.div
      className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      {/* Left column: card if left, empty if right */}
      <div className={isLeft ? 'md:pr-6' : 'hidden md:block'}>
        {isLeft && <CardContent item={item} index={index} align="right" />}
      </div>

      {/* Center dot */}
      <div className="hidden md:flex justify-center items-start pt-5">
        <motion.div
          className="w-3 h-3 rounded-full border-[3px] z-10 relative"
          style={{
            backgroundColor: item.color,
            borderColor:     'var(--bg-primary)',
            boxShadow:       `0 0 8px ${item.color}55`,
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.15, type: 'spring', stiffness: 260 }}
        />
      </div>

      {/* Right column: card if right, empty if left */}
      <div className={!isLeft ? 'md:pl-6' : 'hidden md:block'}>
        {!isLeft && <CardContent item={item} index={index} align="left" />}
      </div>

      {/* Mobile: always render card below (no dot visible on mobile) */}
      <div className="md:hidden col-span-1">
        <CardContent item={item} index={index} align="left" />
      </div>
    </motion.div>
  )
}

function CardContent({
  item,
  index,
  align,
}: {
  item: typeof selfLearning[0]
  index: number
  align: 'left' | 'right'
}) {
  return (
    <motion.div
      className="rounded-xl p-4 group transition-colors"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      whileHover={{ backgroundColor: 'var(--bg-card-hover)' } as any}
    >
      <div className={`flex items-center gap-2 mb-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className="text-lg">{item.icon}</span>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-mono"
          style={{
            backgroundColor: `${item.color}15`,
            color:           item.color,
            border:          `1px solid ${item.color}30`,
          }}
        >
          {item.year}
        </span>
      </div>

      <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
        {item.title}
      </h3>
      <p className="text-xs font-medium mb-2" style={{ color: item.color }}>{item.org}</p>
      {'sub' in item && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          {(item as any).sub}
        </p>
      )}
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {item.description}
      </p>

      <div className={`flex flex-wrap gap-1.5 ${align === 'right' ? 'justify-end' : ''}`}>
        {item.tags.map(tag => <Tag key={tag} label={tag} />)}
      </div>

      {/* bottom accent line on hover */}
      <div
        className="h-px w-0 group-hover:w-full transition-all duration-500 mt-3 rounded-full"
        style={{ backgroundColor: item.color }}
      />
    </motion.div>
  )
}

/* ─── Education card ─────────────────────────────────────────────────── */

function EducationCard({ item, index }: { item: typeof education[0]; index: number }) {
  return (
    <motion.div
      className="rounded-xl p-4 group transition-colors"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ backgroundColor: 'var(--bg-card-hover)' } as any}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">{item.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </h3>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono"
              style={{ backgroundColor: `${item.color}15`, color: item.color }}
            >
              {item.year}
            </span>
          </div>
          <p className="font-medium text-xs mb-0.5" style={{ color: item.color }}>{item.org}</p>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map(tag => <Tag key={tag} label={tag} />)}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Experience section ─────────────────────────────────────────────── */

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ambient blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(78,205,196,0.4)' }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(96,165,250,0.4)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: '#4ecdc4' }}>
            Background
          </p>
          <h2
            className="text-3xl md:text-5xl font-heading font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Education &amp;{' '}
            <span style={{
              background:           'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Journey
            </span>
          </h2>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            Fresher — but self-driven, project-focused, and actively building production-level skills.
          </p>
        </motion.div>

        {/* Education */}
        <div className="mb-10">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4 text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            📚 Education
          </p>
          <div className="space-y-3">
            {education.map((item, i) => (
              <EducationCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Self-learning timeline */}
        <div>
          <p
            className="text-xs font-mono uppercase tracking-widest mb-6 text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            🚀 Self-Learning &amp; Projects Timeline
          </p>

          {/* Center line — positioned behind cards */}
          <div className="relative">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block -translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, #4ecdc4, #60a5fa, #a855f7)',
                opacity: 0.4,
              }}
            />

            <div className="space-y-5">
              {selfLearning.map((item, i) => (
                <TimelineCardFixed
                  key={i}
                  item={item}
                  index={i}
                  side={i % 2 === 0 ? 'left' : 'right'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hire me CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="rounded-2xl p-6 max-w-xl mx-auto relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            {/* subtle gradient top-border */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #4ecdc4, #60a5fa, transparent)' }}
            />

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-bold text-sm">Open to Jobs &amp; Internships</span>
            </div>

            <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I'm a fresher with real project experience in Java, Spring Boot, React, Docker and cloud.
              Looking for an opportunity to grow in a professional team environment.
            </p>

            <motion.a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 text-white rounded-full font-semibold text-sm cursor-hover"
              style={{ background: 'linear-gradient(135deg, #4ecdc4, #60a5fa, #a855f7)' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(78,205,196,0.35)' }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get In Touch — ajaypatil8eight@gmail.com
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}