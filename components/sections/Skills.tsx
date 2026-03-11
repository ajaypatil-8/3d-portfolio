'use client'

import { motion } from 'framer-motion'

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
      { name: 'AWS',        level: 'Familiar'    },
      { name: 'Azure',      level: 'Familiar'    },
      { name: 'Kubernetes', level: 'Familiar'    },
    ],
  },
]

const levelStyle: Record<string, { bg: string; dot: string; border: string }> = {
  Proficient:  { bg: 'rgba(74,222,128,0.10)',  dot: '#4ade80', border: 'rgba(74,222,128,0.22)'  },
  Comfortable: { bg: 'rgba(251,191,36,0.10)',  dot: '#fbbf24', border: 'rgba(251,191,36,0.22)'  },
  Familiar:    { bg: 'rgba(148,163,184,0.08)', dot: '#94a3b8', border: 'rgba(148,163,184,0.18)' },
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
]

const legend = [
  { label: 'Proficient',  dot: '#4ade80', desc: 'Built real projects' },
  { label: 'Comfortable', dot: '#fbbf24', desc: 'Used regularly'      },
  { label: 'Familiar',    dot: '#94a3b8', desc: 'Still growing'       },
]

/* ─── Category progress mini-bar ─────────────────────────────────────── */

function CategoryBar({
  count, total, color,
}: { count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${color}18` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums" style={{ color, minWidth: '2.5ch' }}>
        {count}
      </span>
    </div>
  )
}

/* ─── Skills ─────────────────────────────────────────────────────────── */

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-1/4 w-72 h-72 rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(255,107,107,0.05)' }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(168,85,247,0.05)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#ff6b6b' }}>
            Tech Stack
          </p>
          <h2
            className="font-heading font-bold mb-2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)' }}
          >
            Skills &amp;{' '}
            <span style={{
              background:           'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              Expertise
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: 420, margin: '0 auto' }}>
            Focused on Java backend engineering with full-stack capabilities and cloud deployment.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.dot }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                {l.label}
              </span>
              <span
                className="hidden sm:inline"
                style={{ color: 'var(--text-muted)', fontSize: '0.70rem' }}
              >
                — {l.desc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {skillCategories.map((cat, ci) => {
            const profCount     = cat.skills.filter(s => s.level === 'Proficient').length
            const comfortCount  = cat.skills.filter(s => s.level === 'Comfortable').length
            const familiarCount = cat.skills.filter(s => s.level === 'Familiar').length
            const total         = cat.skills.length

            return (
              <motion.div
                key={cat.title}
                className="rounded-2xl p-5 flex flex-col"
                style={{
                  backgroundColor: cat.bg,
                  border:          `1px solid ${cat.border}`,
                  backdropFilter:  'blur(12px)',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${cat.color}18`, border: `1px solid ${cat.color}28` }}
                    >
                      {cat.icon}
                    </div>
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
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {cat.skills.map((skill, si) => {
                    const ls = levelStyle[skill.level]
                    return (
                      <motion.div
                        key={skill.name}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: ls.bg, border: `1px solid ${ls.border}` }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.06 + si * 0.03 }}
                        whileHover={{ scale: 1.06 }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ls.dot }}
                        />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {skill.name}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Proficiency breakdown with animated bars */}
                <div
                  className="mt-4 pt-3 space-y-1.5"
                  style={{ borderTop: `1px solid ${cat.color}12` }}
                >
                  {profCount     > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-right text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.62rem' }}>
                        Proficient
                      </span>
                      <CategoryBar count={profCount} total={total} color="#4ade80" />
                    </div>
                  )}
                  {comfortCount  > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-right text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.62rem' }}>
                        Comfortable
                      </span>
                      <CategoryBar count={comfortCount} total={total} color="#fbbf24" />
                    </div>
                  )}
                  {familiarCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-right text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.62rem' }}>
                        Familiar
                      </span>
                      <CategoryBar count={familiarCount} total={total} color="#94a3b8" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom row: tools + bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

          {/* Daily tools */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3 text-center md:text-left"
              style={{ color: 'var(--text-muted)' }}
            >
              Daily Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border:          '1px solid var(--border)',
                    backdropFilter:  'blur(8px)',
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.07 }}
                >
                  <span className="text-sm">{tool.icon}</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bio snippet */}
          <motion.div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: 'var(--bg-card)',
              border:          '1px solid var(--border)',
              backdropFilter:  'blur(12px)',
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              🎓{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Currently in 3rd year BCA
              </span>{' '}
              at Arts, Commerce &amp; Science College, Palus (Shivaji University, Kolhapur).
              Actively learning advanced Spring Boot microservices, cloud deployment and system design
              to be production-ready.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}