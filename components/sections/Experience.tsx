'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

/* ─── Animation CSS ──────────────────────────────────────────────────── */
const EXP_CSS = `
@keyframes exp-float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-16px); }
}
@keyframes exp-dot-pulse {
  0%,100% { box-shadow: 0 0 0 0 currentColor; transform: scale(1); }
  50%      { box-shadow: 0 0 0 8px transparent; transform: scale(1.15); }
}
@keyframes exp-line-draw {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
@keyframes exp-shimmer {
  0%   { transform: translateX(-200%) skewX(-12deg); }
  100% { transform: translateX(300%)  skewX(-12deg); }
}
@keyframes exp-glow-pulse {
  0%,100% { opacity: 0.5; }
  50%      { opacity: 1; }
}
@keyframes exp-blob {
  0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
  50%      { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
}
@keyframes exp-badge-glow {
  0%,100% { box-shadow: 0 0 6px currentColor; }
  50%      { box-shadow: 0 0 18px currentColor, 0 0 32px currentColor; }
}
@keyframes exp-ring-out {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}
`

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
    description: "Deployed a full airline booking system on AWS EC2 (t3.small) with Elastic IP, custom domain aerosphere.work.gd, free HTTPS via Let's Encrypt (certbot), and a 3-service Docker Compose stack (Tomcat + MySQL + Nginx). Configured Nginx with HTTP→HTTPS redirect, HSTS, rate limiting, and gzip. Integrated Razorpay payments and Gmail SMTP.",
    tags: ['AWS EC2', 'Docker', 'Nginx', "Let's Encrypt", 'GitHub Actions', 'MySQL'],
  },
  {
    year: '2026 – Present', icon: '🐳', color: '#a855f7',
    title: 'Docker & Cloud Basics',
    org: 'Self-Learning',
    description: 'Learned Docker containerisation, Kubernetes basics, and cloud fundamentals on AWS and Azure. Actively containerising the CrowdSpark-X microservices for deployment.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
  },
]

/* ─── Tag Pill ───────────────────────────────────────────────────────── */
function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <motion.span
      className="px-2 py-0.5 rounded-full text-xs"
      style={{
        color: color ?? 'var(--text-muted)',
        backgroundColor: color ? `${color}12` : 'var(--bg-card-hover)',
        border: `1px solid ${color ? color + '28' : 'var(--border)'}`,
      }}
      whileHover={color ? { backgroundColor: `${color}22`, scale: 1.05 } : { scale: 1.05 }}
      transition={{ duration: 0.15 }}
    >
      {label}
    </motion.span>
  )
}

/* ─── Education Card (DESIGN PRESERVED — enhanced visually) ─────────── */
function EducationCard({ item, index }: { item: typeof education[0]; index: number }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="rounded-2xl relative overflow-hidden group"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${hov ? item.color + '40' : 'var(--border)'}`,
        transition: 'border-color 0.3s',
      }}
      initial={{ opacity: 0, y: 20, x: -16 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Animated left color border */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: `linear-gradient(to bottom, ${item.color}, ${item.color}55)` }}
        initial={{ scaleY: 0, transformOrigin: 'top' }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 + 0.2, duration: 0.45 }}
      />

      {/* Top gradient bar */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${item.color}, ${item.color}55, transparent)`,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 + 0.15, duration: 0.6 }}
      />

      {/* Ambient glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 0% 50%, ${item.color}10 0%, transparent 60%)` }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer on hover */}
      {hov && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 30%, ${item.color}12 50%, transparent 70%)`,
            animation: 'exp-shimmer 0.6s ease forwards',
          }}
        />
      )}

      <div className="p-5 pl-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon with glow circle */}
          <div className="flex-shrink-0 relative">
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl relative"
              style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}
              animate={hov ? { boxShadow: `0 0 20px ${item.color}40` } : { boxShadow: 'none' }}
              transition={{ duration: 0.3 }}
            >
              {item.icon}
              {hov && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ animation: 'exp-ring-out 0.8s ease-out forwards', border: `1px solid ${item.color}`, borderRadius: '0.75rem' }}
                />
              )}
            </motion.div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <motion.span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  border: `1px solid ${item.color}30`,
                  animation: hov ? `exp-badge-glow 1.4s ease-in-out infinite` : 'none',
                }}
              >
                {item.year}
              </motion.span>
            </div>
            <p className="font-medium text-xs mb-0.5" style={{ color: item.color }}>{item.org}</p>
            <p className="text-xs mb-2.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              {item.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => <Tag key={tag} label={tag} color={item.color} />)}
            </div>
          </div>
        </div>

        {/* Animated bottom line */}
        <div
          className="h-px w-0 group-hover:w-full mt-4 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${item.color}, transparent)`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Timeline Card Content ──────────────────────────────────────────── */
function CardContent({ item, index, align }: {
  item: typeof selfLearning[0]
  index: number
  align: 'left' | 'right'
}) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="rounded-2xl relative overflow-hidden group"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${hov ? item.color + '45' : 'var(--border)'}`,
        transition: 'border-color 0.3s',
      }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Top gradient bar */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${item.color}, ${item.color}44, transparent)`,
          transformOrigin: align === 'left' ? 'right' : 'left',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.55 }}
      />

      {/* Glow ambient */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}10 0%, transparent 65%)` }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {hov && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 25%, ${item.color}10 50%, transparent 75%)`,
            animation: 'exp-shimmer 0.6s ease forwards',
          }}
        />
      )}

      <div className="p-5 relative z-10">
        <div className={`flex items-center gap-2 mb-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${item.color}16`, border: `1px solid ${item.color}28` }}
          >
            {item.icon}
          </div>
          <motion.span
            className="px-2.5 py-0.5 rounded-full text-xs font-mono"
            style={{
              backgroundColor: `${item.color}15`,
              color: item.color,
              border: `1px solid ${item.color}30`,
            }}
          >
            {item.year}
          </motion.span>
        </div>

        <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          {item.title}
        </h3>
        <p className="text-xs font-semibold mb-2.5" style={{ color: item.color }}>{item.org}</p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          {item.description}
        </p>

        <div className={`flex flex-wrap gap-1.5 ${align === 'right' ? 'justify-end' : ''}`}>
          {item.tags.map(tag => <Tag key={tag} label={tag} color={item.color} />)}
        </div>

        {/* Bottom line sweep */}
        <div
          className="h-px w-0 group-hover:w-full mt-3 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${align === 'right' ? 'transparent, ' : ''}${item.color}${align === 'right' ? '' : ', transparent'}`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Timeline Card ──────────────────────────────────────────────────── */
function TimelineCardFixed({ item, index, side }: {
  item: typeof selfLearning[0]
  index: number
  side: 'left' | 'right'
}) {
  const isLeft = side === 'left'
  return (
    <motion.div
      className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left column */}
      <div className={isLeft ? 'md:pr-8' : 'hidden md:block'}>
        {isLeft && <CardContent item={item} index={index} align="right" />}
      </div>

      {/* Center dot */}
      <div className="hidden md:flex justify-center items-start pt-5 relative z-10">
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.09 + 0.18, type: 'spring', stiffness: 320, damping: 18 }}
        >
          {/* Outer pulse ring */}
          <div
            className="absolute w-6 h-6 rounded-full"
            style={{
              backgroundColor: item.color,
              opacity: 0.22,
              animation: `exp-dot-pulse 2.2s ${index * 0.3}s ease-in-out infinite`,
            }}
          />
          {/* Inner dot */}
          <div
            className="w-4 h-4 rounded-full border-[3px] relative z-10"
            style={{
              backgroundColor: item.color,
              borderColor: 'var(--bg-primary)',
              boxShadow: `0 0 12px ${item.color}60, 0 0 24px ${item.color}28`,
            }}
          />
        </motion.div>
      </div>

      {/* Right column */}
      <div className={!isLeft ? 'md:pl-8' : 'hidden md:block'}>
        {!isLeft && <CardContent item={item} index={index} align="left" />}
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden col-span-1">
        <CardContent item={item} index={index} align="left" />
      </div>
    </motion.div>
  )
}

/* ─── Experience Section ─────────────────────────────────────────────── */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' })

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <style>{EXP_CSS}</style>

      {/* Ambient blobs */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div
          className="absolute top-1/4 left-0"
          style={{
            width: 520, height: 520,
            transform: 'translate(-22%,-15%)',
            background: 'radial-gradient(circle, rgba(78,205,196,0.6) 0%, transparent 65%)',
            animation: 'exp-blob 14s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute bottom-1/4 right-0"
          style={{
            width: 520, height: 520,
            transform: 'translate(22%,15%)',
            background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 65%)',
            animation: 'exp-blob 18s 5s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute top-2/3 left-1/2"
          style={{
            width: 360, height: 360,
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 65%)',
            animation: 'exp-blob 11s 2s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <motion.p
            className="text-xs font-mono tracking-widest uppercase mb-3"
            style={{ color: '#4ecdc4' }}
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.15em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Background
          </motion.p>

          <h2
            className="font-heading font-bold mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--text-primary)' }}
          >
            Education &amp;{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Journey
            </span>
          </h2>

          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Fresher — but self-driven, project-focused, and actively building production-level skills.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2">
            <motion.div className="h-px flex-1 max-w-[120px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #4ecdc4)' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} />
            <div className="flex gap-1">
              {['#ff6b6b','#4ecdc4','#a855f7'].map((c,i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 + i * 0.06, type: 'spring' }} />
              ))}
            </div>
            <motion.div className="h-px flex-1 max-w-[120px] rounded-full" style={{ background: 'linear-gradient(90deg, #a855f7, transparent)' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} />
          </div>
        </motion.div>

        {/* ── Education ── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(78,205,196,0.4))' }}
            />
            <p
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                color: '#4ecdc4',
                backgroundColor: 'rgba(78,205,196,0.08)',
                border: '1px solid rgba(78,205,196,0.22)',
              }}
            >
              📚 Education
            </p>
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, rgba(78,205,196,0.4), transparent)' }}
            />
          </div>

          <div className="space-y-4">
            {education.map((item, i) => (
              <EducationCard key={i} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Self-Learning Timeline ── */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,107,0.4))' }}
            />
            <p
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                color: '#ff6b6b',
                backgroundColor: 'rgba(255,107,107,0.08)',
                border: '1px solid rgba(255,107,107,0.22)',
              }}
            >
              🚀 Self-Learning &amp; Projects Timeline
            </p>
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, rgba(255,107,107,0.4), transparent)' }}
            />
          </div>

          <div className="relative" ref={lineRef}>
            {/* Animated center line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block -translate-x-1/2 overflow-hidden"
              style={{ zIndex: 1 }}
            >
              <motion.div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(to bottom, #4ecdc4, #60a5fa 40%, #a855f7 70%, #ff6b6b)',
                  opacity: 0.45,
                  transformOrigin: 'top',
                }}
                initial={{ scaleY: 0 }}
                animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            </div>

            <div className="space-y-6">
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

        {/* ── Hire Me CTA ── */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="rounded-2xl p-8 max-w-xl mx-auto relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            {/* Animated gradient top border */}
            <div
              className="absolute top-0 inset-x-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, #4ecdc4, #60a5fa, #a855f7, #ff6b6b, #4ecdc4)',
                backgroundSize: '200% 100%',
                animation: 'exp-shimmer 3s linear infinite',
              }}
            />

            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(78,205,196,0.06) 0%, transparent 60%)' }}
            />

            <div className="flex items-center justify-center gap-2 mb-3 relative z-10">
              <span
                className="w-2.5 h-2.5 bg-green-400 rounded-full"
                style={{ animation: 'exp-ring-out 1.5s ease-out infinite' }}
              />
              <span
                className="w-2.5 h-2.5 bg-green-400 rounded-full absolute"
                style={{ animation: 'exp-dot-pulse 1.5s ease-in-out infinite' }}
              />
              <span className="text-green-400 font-bold text-sm ml-1">Open to Jobs &amp; Internships</span>
            </div>

            <p className="text-xs mb-6 leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
              I&apos;m a fresher with real project experience in Java, Spring Boot, React, Docker and cloud.
              Looking for an opportunity to grow in a professional team environment.
            </p>

            <motion.a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 text-white rounded-full font-semibold text-sm relative overflow-hidden z-10"
              style={{ background: 'linear-gradient(135deg, #4ecdc4, #60a5fa, #a855f7)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(78,205,196,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                initial={{ x: '-130%' }}
                whileHover={{ x: '130%' }}
                transition={{ duration: 0.48 }}
              />
              <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="relative">Get In Touch — ajaypatil8eight@gmail.com</span>
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
