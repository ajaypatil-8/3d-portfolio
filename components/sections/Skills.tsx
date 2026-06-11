'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

/* ─── Animation CSS ──────────────────────────────────────────────────── */
const SKILLS_CSS = `
@keyframes sk-float {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  33%     { transform: translateY(-16px) rotate(5deg); }
  66%     { transform: translateY(-8px) rotate(-4deg); }
}
@keyframes sk-shimmer {
  0%   { transform: translateX(-200%) skewX(-12deg); }
  100% { transform: translateX(300%)  skewX(-12deg); }
}
@keyframes sk-blob {
  0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
  50%     { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
}
@keyframes sk-bar-glow {
  0%,100% { box-shadow: 0 0 6px currentColor; }
  50%     { box-shadow: 0 0 18px currentColor, 0 0 36px currentColor; }
}
@keyframes sk-ring-out {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.0); opacity: 0;   }
}
@keyframes sk-border-spin {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes sk-pill-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.14); }
  100% { transform: scale(1); }
}
@keyframes sk-tool-spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`

/* ─── Data ───────────────────────────────────────────────────────────── */
const skillCategories = [
  {
    title: 'Backend', icon: '⚙️', color: '#ff6b6b',
    bg: 'rgba(255,107,107,0.07)', border: 'rgba(255,107,107,0.18)',
    skills: [
      { name: 'Java',            level: 'Proficient'  },
      { name: 'Spring Boot',     level: 'Proficient'  },
      { name: 'REST APIs',       level: 'Proficient'  },
      { name: 'Spring Data JPA', level: 'Proficient'  },
      { name: 'Hibernate',       level: 'Proficient'  },
      { name: 'Spring Security', level: 'Proficient'  },
      { name: 'Microservices',   level: 'Comfortable' },
      { name: 'Maven / Gradle',  level: 'Comfortable' },
    ],
  },
  {
    title: 'Frontend & Node', icon: '🎨', color: '#4ecdc4',
    bg: 'rgba(78,205,196,0.07)', border: 'rgba(78,205,196,0.18)',
    skills: [
      { name: 'HTML / CSS',       level: 'Proficient'  },
      { name: 'JavaScript',       level: 'Proficient'  },
      { name: 'React.js',         level: 'Proficient'  },
      { name: 'Next.js',          level: 'Proficient'  },
      { name: 'Tailwind CSS',     level: 'Proficient'  },
      { name: 'Axios / Fetch',    level: 'Proficient'  },
      { name: 'REST Integration', level: 'Proficient'  },
      { name: 'Node.js',          level: 'Comfortable' },
      { name: 'Express.js',       level: 'Comfortable' },
      { name: 'TypeScript',       level: 'Familiar'    },
    ],
  },
  {
    title: 'Database & Cloud', icon: '🗄️', color: '#a855f7',
    bg: 'rgba(168,85,247,0.07)', border: 'rgba(168,85,247,0.18)',
    skills: [
      { name: 'MySQL',      level: 'Proficient'  },
      { name: 'PostgreSQL', level: 'Proficient'  },
      { name: 'Docker',     level: 'Proficient'  },
      { name: 'MongoDB',    level: 'Comfortable' },
      { name: 'Kafka',      level: 'Comfortable' },
      { name: 'Redis',      level: 'Familiar'    },
      { name: 'AWS',        level: 'Comfortable' },
      { name: 'Azure',      level: 'Familiar'    },
      { name: 'Kubernetes', level: 'Familiar'    },
    ],
  },
]

const levelStyle: Record<string, { bg: string; dot: string; border: string; pct: number }> = {
  Proficient:  { bg: 'rgba(74,222,128,0.10)',  dot: '#4ade80', border: 'rgba(74,222,128,0.24)',  pct: 90 },
  Comfortable: { bg: 'rgba(251,191,36,0.10)',  dot: '#fbbf24', border: 'rgba(251,191,36,0.24)',  pct: 68 },
  Familiar:    { bg: 'rgba(148,163,184,0.08)', dot: '#94a3b8', border: 'rgba(148,163,184,0.20)', pct: 42 },
}

const tools = [
  { name: 'IntelliJ IDEA',  icon: '🧠' },
  { name: 'VS Code',        icon: '💻' },
  { name: 'GitHub',         icon: '🐙' },
  { name: 'Postman',        icon: '📮' },
  { name: 'Docker Desktop', icon: '🐳' },
  { name: 'Cloudinary',     icon: '☁️' },
  { name: 'Kafka',          icon: '📨' },
  { name: 'XAMPP',          icon: '🛠️' },
  { name: 'AWS EC2',        icon: '☁️' },
  { name: 'UptimeRobot',    icon: '📡' },
]

const legend = [
  { label: 'Proficient',  dot: '#4ade80', desc: 'Built real projects', pct: 90 },
  { label: 'Comfortable', dot: '#fbbf24', desc: 'Used regularly',      pct: 68 },
  { label: 'Familiar',    dot: '#94a3b8', desc: 'Still growing',       pct: 42 },
]

/* ─── Animated Mini Bar ──────────────────────────────────────────────── */
function CategoryBar({ count, total, color }: { count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${color}18` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums" style={{ color, minWidth: '2ch' }}>{count}</span>
    </div>
  )
}

/* ─── Skill Pill ─────────────────────────────────────────────────────── */
function SkillPill({ skill, ci, si, catColor }: {
  skill: { name: string; level: string }
  ci: number; si: number; catColor: string
}) {
  const ls = levelStyle[skill.level]
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-default select-none"
      style={{
        backgroundColor: hov ? ls.bg.replace('0.10', '0.18').replace('0.08', '0.15') : ls.bg,
        border: `1px solid ${hov ? ls.dot + '50' : ls.border}`,
        transition: 'background-color 0.2s, border-color 0.2s',
        animation: hov ? 'sk-pill-pop 0.3s ease' : 'none',
      }}
      initial={{ opacity: 0, scale: 0.78 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: ci * 0.07 + si * 0.032, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08, y: -2 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ls.dot }} />
      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {skill.name}
      </span>
    </motion.div>
  )
}

/* ─── Category Card ──────────────────────────────────────────────────── */
function CategoryCard({ cat, ci }: { cat: typeof skillCategories[0]; ci: number }) {
  const [hov, setHov] = useState(false)
  const profCount     = cat.skills.filter(s => s.level === 'Proficient').length
  const comfortCount  = cat.skills.filter(s => s.level === 'Comfortable').length
  const familiarCount = cat.skills.filter(s => s.level === 'Familiar').length
  const total         = cat.skills.length

  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: cat.bg,
        border: `1px solid ${hov ? cat.color + '40' : cat.border}`,
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s',
        willChange: 'transform',
      }}
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.52, delay: ci * 0.11, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Top gradient bar */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}44, transparent)`,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: ci * 0.11 + 0.2, duration: 0.55 }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${cat.color}12 0%, transparent 65%)` }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer on hover */}
      {hov && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 30%, ${cat.color}10 50%, transparent 70%)`,
            animation: 'sk-shimmer 0.65s ease forwards',
          }}
        />
      )}

      {/* Card header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${cat.color}18`, border: `1px solid ${cat.color}28` }}
            animate={hov ? { boxShadow: `0 0 20px ${cat.color}40` } : { boxShadow: 'none' }}
            transition={{ duration: 0.3 }}
          >
            {cat.icon}
          </motion.div>
          <h3 className="text-sm font-bold" style={{ color: cat.color }}>{cat.title}</h3>
        </div>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${cat.color}14`, color: cat.color }}
        >
          {total}
        </span>
      </div>

      {/* Skill pills */}
      <div className="flex flex-wrap gap-1.5 flex-1 relative z-10">
        {cat.skills.map((skill, si) => (
          <SkillPill key={skill.name} skill={skill} ci={ci} si={si} catColor={cat.color} />
        ))}
      </div>

      {/* Proficiency bars */}
      <div className="mt-4 pt-3 space-y-2 relative z-10" style={{ borderTop: `1px solid ${cat.color}14` }}>
        {profCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-20 text-right text-[0.62rem] font-mono" style={{ color: 'var(--text-muted)' }}>
              Proficient
            </span>
            <CategoryBar count={profCount} total={total} color="#4ade80" />
          </div>
        )}
        {comfortCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-20 text-right text-[0.62rem] font-mono" style={{ color: 'var(--text-muted)' }}>
              Comfortable
            </span>
            <CategoryBar count={comfortCount} total={total} color="#fbbf24" />
          </div>
        )}
        {familiarCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-20 text-right text-[0.62rem] font-mono" style={{ color: 'var(--text-muted)' }}>
              Familiar
            </span>
            <CategoryBar count={familiarCount} total={total} color="#94a3b8" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Tool Chip ──────────────────────────────────────────────────────── */
function ToolChip({ tool, i }: { tool: typeof tools[0]; i: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-2.5 rounded-full cursor-default select-none"
      style={{
        backgroundColor: hov ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: hov ? '1px solid var(--border-strong)' : '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04, type: 'spring', stiffness: 240 }}
      whileHover={{ scale: 1.08, y: -3, transition: { duration: 0.18 } }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      <span
        className="text-sm"
        style={{ animation: hov ? 'sk-tool-spin 0.5s ease' : 'none' }}
      >
        {tool.icon}
      </span>
      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {tool.name}
      </span>
    </motion.div>
  )
}

/* ─── Skills Section ─────────────────────────────────────────────────── */
export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <style>{SKILLS_CSS}</style>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-1/4"
          style={{
            width: 520, height: 520,
            transform: 'translate(-18%,-18%)',
            background: 'radial-gradient(circle, rgba(255,107,107,0.11) 0%, transparent 65%)',
            animation: 'sk-blob 14s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute bottom-10 right-1/4"
          style={{
            width: 520, height: 520,
            transform: 'translate(18%,18%)',
            background: 'radial-gradient(circle, rgba(168,85,247,0.11) 0%, transparent 65%)',
            animation: 'sk-blob 18s 5s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute top-1/2 right-10"
          style={{
            width: 360, height: 360,
            transform: 'translateY(-50%)',
            background: 'radial-gradient(circle, rgba(78,205,196,0.09) 0%, transparent 65%)',
            animation: 'sk-blob 12s 2s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.52 }}
        >
          <motion.p
            className="text-xs font-mono tracking-widest uppercase mb-3"
            style={{ color: '#ff6b6b' }}
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.15em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Tech Stack
          </motion.p>

          <h2
            className="font-heading font-bold mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.9rem)', color: 'var(--text-primary)' }}
          >
            Skills &amp;{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Expertise
            </span>
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
            Focused on Java backend engineering with full-stack capabilities and cloud deployment.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-2">
            <motion.div className="h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #ff6b6b)', width: 90 }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} />
            <div className="flex gap-1">
              {['#ff6b6b','#4ecdc4','#a855f7'].map((c,i)=>(
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.35+i*0.06, type:'spring' }} />
              ))}
            </div>
            <motion.div className="h-px rounded-full" style={{ background: 'linear-gradient(90deg, #a855f7, transparent)', width: 90 }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} />
          </div>
        </motion.div>

        {/* ── Legend ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-5 mb-10 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {legend.map((l, li) => (
            <motion.div
              key={l.label}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: `${l.dot}10`, border: `1px solid ${l.dot}25` }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + li * 0.07, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.dot }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                {l.label}
              </span>
              <span className="hidden sm:inline" style={{ color: 'var(--text-muted)', fontSize: '0.70rem' }}>
                — {l.desc}
              </span>
              {/* Mini inline bar */}
              <div className="hidden sm:block w-12 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${l.dot}20` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: l.dot }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${l.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 + li * 0.07 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Category Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {skillCategories.map((cat, ci) => (
            <CategoryCard key={cat.title} cat={cat} ci={ci} />
          ))}
        </div>

        {/* ── Bottom row: tools + bio ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

          {/* Daily tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4 text-center md:text-left"
              style={{ color: 'var(--text-muted)' }}
            >
              🛠 Daily Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, i) => (
                <ToolChip key={tool.name} tool={tool} i={i} />
              ))}
            </div>
          </motion.div>

          {/* Bio snippet */}
          <motion.div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            whileHover={{ borderColor: 'rgba(78,205,196,0.3)', transition: { duration: 0.25 } }}
          >
            {/* Top accent */}
            <motion.div
              className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #4ecdc4, #a855f7, #ff6b6b)' }}
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.65 }}
            />

            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'rgba(78,205,196,0.14)', border: '1px solid rgba(78,205,196,0.28)' }}
              >
                🎓
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Currently in 3rd year BCA
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Arts, Commerce &amp; Science College, Palus
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Actively learning advanced Spring Boot microservices, cloud deployment, and system design
              to be production-ready. Committed to building real, deployed solutions that demonstrate
              both technical depth and engineering discipline.
            </p>

            {/* Skill summary tags */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              {['Java ⚙️', 'Spring Boot 🍃', 'React ⚛️', 'Docker 🐳', 'AWS ☁️'].map((tag, ti) => (
                <motion.span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full font-mono"
                  style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + ti * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.06, color: '#4ecdc4', borderColor: 'rgba(78,205,196,0.35)' }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
