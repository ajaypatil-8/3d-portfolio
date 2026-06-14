'use client'

/*
 * Skills.tsx — Professional Edition
 *
 * WHAT CHANGED FROM V1
 * ─────────────────────────────────────────────────────────────────────
 * ✅ ALL proficiency labels removed (Familiar / Comfortable / Proficient)
 *    Skills are presented as equals — professional, clean, recruiter-ready
 * ✅ "Currently Exploring" section added — shows Kafka, K8s, AWS depth
 *    etc. as active learning items (professional, not "I don't know this")
 * ✅ ALL CSS keyframes GPU-only (transform + opacity ONLY)
 *    Removed: sk-blob (border-radius), sk-bar-glow (box-shadow) — both
 *    triggered repaints on every frame causing lag
 * ✅ 3-D perspective tilt on every category card (mouse-tracked via Framer)
 * ✅ Neon halo behind cards on hover (separate layer, pointer-events: none)
 * ✅ Scan-line sweep on featured card hover
 * ✅ Staggered spring entrances for every skill pill
 * ✅ Icon jiggle + ring burst on card icon hover
 * ✅ Tool chips: icon spin + neon border on hover
 * ✅ prefers-reduced-motion respected via CSS media query
 */

import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useRef, useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   §1  CSS — STRICTLY GPU-ONLY KEYFRAMES
       Only: transform, opacity, background-position (gradient border only)
═══════════════════════════════════════════════════════════════════════ */
const SK_CSS = `
/* Shimmer card sweep */
@keyframes sk-shimmer {
  0%   { transform: translateX(-210%) skewX(-13deg); }
  100% { transform: translateX(320%)  skewX(-13deg); }
}

/* Ambient orb drift */
@keyframes sk-orb {
  0%,100% { transform: translate(0,0)        scale(1);    opacity: 0.35; }
  25%     { transform: translate(36px,-48px) scale(1.07); opacity: 0.52; }
  50%     { transform: translate(-22px,-62px)scale(0.93); opacity: 0.30; }
  75%     { transform: translate(-42px,-20px)scale(1.04); opacity: 0.44; }
}

/* Ring expand + fade */
@keyframes sk-ring {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(4.2); opacity: 0;   }
}

/* Icon jiggle */
@keyframes sk-jiggle {
  0%  { transform: rotate(0deg)  scale(1.22); }
  20% { transform: rotate(-8deg) scale(1.26); }
  40% { transform: rotate( 8deg) scale(1.22); }
  60% { transform: rotate(-4deg) scale(1.20); }
  80% { transform: rotate( 3deg) scale(1.21); }
  100%{ transform: rotate( 0deg) scale(1.22); }
}

/* Gradient border flow (background-position — no GPU path for gradients) */
@keyframes sk-grad-flow {
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}

/* Scan line */
@keyframes sk-scan {
  0%   { transform: translateY(-6%);   opacity: 0.22; }
  50%  { opacity: 0.42; }
  100% { transform: translateY(108%);  opacity: 0.22; }
}

/* Exploring item pulse */
@keyframes sk-pulse {
  0%,100% { transform: scale(1);    opacity: 0.88; }
  50%     { transform: scale(1.05); opacity: 1;    }
}

/* Skill pill pop on hover */
@keyframes sk-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.14); }
  100% { transform: scale(1); }
}

/* Tool icon spin */
@keyframes sk-spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Reduced-motion kill-switch */
@media (prefers-reduced-motion: reduce) {
  [style*="animation"] { animation: none !important; }
  * { transition-duration: 0.01ms !important; }
}
`

/* ═══════════════════════════════════════════════════════════════════════
   §2  DATA — No proficiency labels
       All skills per category presented as equal, professional pills.
       "Currently Exploring" items shown separately with active-learning feel.
═══════════════════════════════════════════════════════════════════════ */
const SKILL_CATS = [
  {
    title:    'Backend Engineering',
    icon:     '⚙️',
    color:    '#ff6b6b',
    bg:       'rgba(255,107,107,0.06)',
    border:   'rgba(255,107,107,0.16)',
    badge:    'Core Stack',
    skills: [
      'Java 11+',
      'Spring Boot',
      'Spring Security',
      'Spring Data JPA',
      'Hibernate / ORM',
      'REST API Design',
      'JWT & RBAC',
      'Microservices',
      'Maven',
      'OOP & SOLID',
    ],
  },
  {
    title:    'Frontend',
    icon:     '🎨',
    color:    '#4ecdc4',
    bg:       'rgba(78,205,196,0.06)',
    border:   'rgba(78,205,196,0.16)',
    badge:    'Full Stack',
    skills: [
      'React.js',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'JavaScript (ES6+)',
      'HTML5 / CSS3',
      'JSP / Servlets',
      'REST Integration',
    ],
  },
  {
    title:    'Database & DevOps',
    icon:     '☁️',
    color:    '#a855f7',
    bg:       'rgba(168,85,247,0.06)',
    border:   'rgba(168,85,247,0.16)',
    badge:    'Live Deployed',
    skills: [
      'PostgreSQL',
      'MySQL 8',
      'MongoDB',
      'Docker & Compose',
      'Nginx',
      'GitHub Actions CI/CD',
      'AWS EC2',
      'Linux / SSH',
      "Let's Encrypt (SSL)",
    ],
  },
] as const

const EXPLORING = [
  { label: 'Apache Kafka',        icon: '📨', note: 'Event-driven architecture'   },
  { label: 'Kubernetes',          icon: '⚓', note: 'Container orchestration'      },
  { label: 'AWS (S3 · IAM · RDS)',icon: '☁️', note: 'Cloud services depth'         },
  { label: 'Spring Cloud',        icon: '🌩️', note: 'Microservices ecosystem'      },
  { label: 'Redis',               icon: '⚡', note: 'Caching & pub-sub'            },
  { label: 'System Design',       icon: '🏗️', note: 'Distributed systems'          },
] as const

const TOOLS = [
  { name: 'IntelliJ IDEA',  icon: '🧠' },
  { name: 'VS Code',        icon: '💻' },
  { name: 'GitHub',         icon: '🐙' },
  { name: 'Postman',        icon: '📮' },
  { name: 'Docker Desktop', icon: '🐳' },
  { name: 'AWS EC2',        icon: '☁️' },
  { name: 'Cloudinary',     icon: '🖼️' },
  { name: 'UptimeRobot',    icon: '📡' },
  { name: 'Git',            icon: '🔧' },
  { name: 'NetBeans',       icon: '🛠️' },
] as const

/* ═══════════════════════════════════════════════════════════════════════
   §3  HOOK — GPU-accelerated 3-D tilt (mouse → rotateX / rotateY)
═══════════════════════════════════════════════════════════════════════ */
function use3DTilt(deg = 5) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotX = useSpring(useTransform(my, [-1, 1], [deg, -deg]), {
    stiffness: 165, damping: 22,
  })
  const rotY = useSpring(useTransform(mx, [-1, 1], [-deg, deg]), {
    stiffness: 165, damping: 22,
  })

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) / (r.width  / 2))
    my.set((e.clientY - r.top  - r.height / 2) / (r.height / 2))
  }, [mx, my])

  const onLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return { rotX, rotY, onMove, onLeave }
}

/* ═══════════════════════════════════════════════════════════════════════
   §4  AMBIENT ORBS
═══════════════════════════════════════════════════════════════════════ */
const ORB_CFG = [
  { color: 'rgba(255,107,107,0.55)', s: 500, l: '-18%', t: '-10%', dur: 16, d: 0  },
  { color: 'rgba(168,85,247,0.48)',  s: 480, l: '75%',  t: '60%',  dur: 21, d: 6  },
  { color: 'rgba(78,205,196,0.40)',  s: 340, l: '44%',  t: '28%',  dur: 13, d: 3  },
  { color: 'rgba(96,165,250,0.28)',  s: 260, l: '88%',  t: '15%',  dur: 17, d: 5  },
]

function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORB_CFG.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width:      o.s,
            height:     o.s,
            left:       o.l,
            top:        o.t,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 68%)`,
            opacity:    0.11,
            animation:  `sk-orb ${o.dur}s ${o.d}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §5  SECTION HEADER
═══════════════════════════════════════════════════════════════════════ */
function SectionHeader() {
  return (
    <motion.div
      className="text-center mb-10"
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
        <span
          style={{
            background:           'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}
        >
          Expertise
        </span>
      </h2>

      <p
        className="mx-auto mb-5"
        style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: 440 }}
      >
        Focused on Java backend engineering with full-stack capabilities and production cloud deployment.
      </p>

      <div className="flex items-center justify-center gap-2">
        <motion.div
          className="h-px rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #ff6b6b)', width: 90 }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
        />
        <div className="flex gap-1.5">
          {(['#ff6b6b', '#4ecdc4', '#a855f7'] as const).map((c, i) => (
            <motion.div
              key={c} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }}
              initial={{ scale: 0 }} whileInView={{ scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.36 + i * 0.07, type: 'spring' }}
            />
          ))}
        </div>
        <motion.div
          className="h-px rounded-full"
          style={{ background: 'linear-gradient(90deg, #a855f7, transparent)', width: 90 }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §6  SKILL PILL — No proficiency indicator, just clean category-colored pills
═══════════════════════════════════════════════════════════════════════ */
function SkillPill({
  label, color, delay,
}: {
  label: string
  color: string
  delay: number
}) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-default select-none"
      style={{
        backgroundColor: hov ? `${color}1e` : `${color}0d`,
        border:          `1px solid ${hov ? color + '44' : color + '22'}`,
        transition:      'background-color 0.18s, border-color 0.18s',
        animation:       hov ? 'sk-pop 0.3s ease' : 'none',
      }}
      initial={{ opacity: 0, scale: 0.72, y: 6 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.24, type: 'spring', stiffness: 280, damping: 20 }}
      whileHover={{ scale: 1.09, y: -2 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Category-colored dot */}
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §7  CATEGORY CARD — 3-D tilt, neon halo, shimmer, scan line, no levels
═══════════════════════════════════════════════════════════════════════ */
function CategoryCard({
  cat, index,
}: {
  cat: typeof SKILL_CATS[number]
  index: number
}) {
  const { rotX, rotY, onMove, onLeave } = use3DTilt(4)
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="relative group"
      style={{ perspective: 1100 }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.52, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHov(false) }}
      onHoverStart={() => setHov(true)}
    >
      {/* Neon halo */}
      <motion.div
        aria-hidden
        className="absolute -inset-3 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${cat.color}1c, transparent 68%)`,
          filter:     'blur(20px)',
        }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.38 }}
      />

      {/* Card */}
      <motion.div
        className="rounded-2xl p-5 flex flex-col relative overflow-hidden h-full"
        style={{
          backgroundColor: cat.bg,
          border:          `1px solid ${hov ? cat.color + '44' : cat.border}`,
          backdropFilter:  'blur(12px)',
          rotateX:         rotX,
          rotateY:         rotY,
          transformStyle:  'preserve-3d',
          transition:      'border-color 0.28s',
          willChange:      'transform',
        }}
        whileHover={{ y: -5 }}
        transition={{ y: { duration: 0.2 } }}
      >
        {/* Top gradient stripe */}
        <motion.div
          className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
          style={{
            background:      `linear-gradient(90deg, ${cat.color}, ${cat.color}44, transparent)`,
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.18, duration: 0.58 }}
        />

        {/* Ambient radial top */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${cat.color}10 0%, transparent 62%)`,
          }}
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer on hover */}
        {hov && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 28%, ${cat.color}0e 50%, transparent 72%)`,
              animation:  'sk-shimmer 0.65s ease forwards',
            }}
          />
        )}

        {/* Scan line on hover */}
        {hov && (
          <div
            aria-hidden
            className="absolute inset-x-0 h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${cat.color}60, transparent)`,
              animation:  'sk-scan 1.8s ease-in-out infinite',
            }}
          />
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            {/* Icon box */}
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-visible"
              style={{
                backgroundColor: `${cat.color}18`,
                border:          `1px solid ${cat.color}28`,
                fontSize:        '1.15rem',
              }}
              animate={hov
                ? { boxShadow: `0 0 22px ${cat.color}50` }
                : { boxShadow: 'none' }}
              transition={{ duration: 0.28 }}
            >
              <span style={hov ? { animation: 'sk-jiggle 0.5s ease forwards', display: 'block' } : {}}>
                {cat.icon}
              </span>
              {hov && (
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    animation:    'sk-ring 0.85s ease-out forwards',
                    border:       `1.5px solid ${cat.color}`,
                    borderRadius: '0.75rem',
                  }}
                />
              )}
            </motion.div>

            <div>
              <h3 className="text-sm font-bold leading-none mb-1" style={{ color: cat.color }}>
                {cat.title}
              </h3>
              {/* Badge */}
              <motion.span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${cat.color}14`,
                  color:           cat.color,
                  border:          `1px solid ${cat.color}25`,
                  animation:       hov ? 'sk-pulse 1.8s ease-in-out infinite' : 'none',
                }}
              >
                {cat.badge}
              </motion.span>
            </div>
          </div>

          {/* Skill count */}
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${cat.color}14`, color: cat.color }}
          >
            {cat.skills.length}
          </span>
        </div>

        {/* ── Skills grid — NO proficiency labels ── */}
        <div className="flex flex-wrap gap-1.5 flex-1 relative z-10">
          {cat.skills.map((skill, si) => (
            <SkillPill
              key={skill}
              label={skill}
              color={cat.color}
              delay={index * 0.08 + si * 0.03}
            />
          ))}
        </div>

        {/* Bottom decorative line */}
        <div
          className="h-px w-0 group-hover:w-full mt-4 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${cat.color}, transparent)`,
            transition: 'width 0.55s ease',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §8  CURRENTLY EXPLORING CARD
       Professional label for active learning — not "I don't know this"
       but "I'm actively going deep on this right now"
═══════════════════════════════════════════════════════════════════════ */
function ExploringItem({
  item, index,
}: {
  item: typeof EXPLORING[number]
  index: number
}) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="relative group flex items-center gap-3 px-4 py-3 rounded-xl cursor-default"
      style={{
        backgroundColor: hov ? 'rgba(96,165,250,0.10)' : 'rgba(96,165,250,0.05)',
        border:          `1px solid ${hov ? 'rgba(96,165,250,0.40)' : 'rgba(96,165,250,0.18)'}`,
        transition:      'background-color 0.2s, border-color 0.2s',
      }}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -2 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Animated gradient left border on hover */}
      {hov && (
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl"
          style={{
            background:     'linear-gradient(to bottom, #60a5fa, #a855f7)',
            backgroundSize: '100% 200%',
            animation:      'sk-grad-flow 2s linear infinite',
          }}
        />
      )}

      {/* Icon */}
      <span
        className="text-lg flex-shrink-0 select-none"
        style={{ animation: hov ? 'sk-jiggle 0.5s ease forwards' : 'none' }}
      >
        {item.icon}
      </span>

      {/* Label + note */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>
          {item.label}
        </p>
        <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
          {item.note}
        </p>
      </div>

      {/* "Active" pulse dot */}
      <span className="relative flex-shrink-0 flex items-center justify-center w-3 h-3">
        <span
          className="block w-2 h-2 rounded-full relative z-10"
          style={{ backgroundColor: '#60a5fa' }}
        />
        <span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: '#60a5fa',
            animation:       'sk-ring 2s 0.4s ease-in-out infinite',
            willChange:      'transform',
          }}
        />
      </span>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §9  TOOL CHIP — icon spin on hover, neon border
═══════════════════════════════════════════════════════════════════════ */
function ToolChip({
  tool, index,
}: {
  tool: typeof TOOLS[number]
  index: number
}) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2 rounded-full cursor-default select-none"
      style={{
        backgroundColor: hov ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border:          `1px solid ${hov ? 'rgba(78,205,196,0.4)' : 'var(--border)'}`,
        transition:      'background-color 0.18s, border-color 0.18s',
        backdropFilter:  'blur(8px)',
      }}
      initial={{ opacity: 0, scale: 0.78 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 240, damping: 20 }}
      whileHover={{ scale: 1.08, y: -3 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      <span
        className="text-sm select-none"
        style={{ animation: hov ? 'sk-spin 0.45s ease' : 'none' }}
      >
        {tool.icon}
      </span>
      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {tool.name}
      </span>
      {hov && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#4ecdc4' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        />
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §10  BIO CARD — polished right panel
═══════════════════════════════════════════════════════════════════════ */
function BioCard() {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="rounded-2xl p-6 relative overflow-hidden h-full"
      style={{
        backgroundColor: 'var(--bg-card)',
        border:          `1px solid ${hov ? 'rgba(78,205,196,0.35)' : 'var(--border)'}`,
        backdropFilter:  'blur(12px)',
        transition:      'border-color 0.28s',
      }}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
    >
      {/* Top accent bar */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, #4ecdc4, #a855f7, #ff6b6b)', transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.22, duration: 0.65 }}
      />

      {/* Shimmer */}
      {hov && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 28%, rgba(78,205,196,0.06) 50%, transparent 72%)',
            animation:  'sk-shimmer 0.65s ease forwards',
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(78,205,196,0.14)', border: '1px solid rgba(78,205,196,0.28)' }}
          >
            🎓
          </div>
          <div>
            <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
              Final Year BCA — Expected June 2026
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Arts, Commerce &amp; Science College, Palus · CGPA 7.2
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Backend-focused Java Full Stack developer with end-to-end ownership — database design →
          API development → containerisation → cloud deployment → production monitoring.
          Open to immediate joining across India.
        </p>

        {/* Stack tags */}
        <div
          className="flex flex-wrap gap-2 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {(['Java ⚙️', 'Spring Boot 🍃', 'React ⚛️', 'Docker 🐳', 'AWS ☁️'] as const).map((tag, ti) => (
            <motion.span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full font-mono"
              style={{
                backgroundColor: 'var(--bg-card-hover)',
                color:           'var(--text-secondary)',
                border:          '1px solid var(--border)',
              }}
              initial={{ opacity: 0, scale: 0.82 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + ti * 0.05, type: 'spring' }}
              whileHover={{
                scale:       1.06,
                color:       '#4ecdc4',
                borderColor: 'rgba(78,205,196,0.38)',
                y:           -1,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   §11  ROOT EXPORT — Skills
═══════════════════════════════════════════════════════════════════════ */
export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <style>{SK_CSS}</style>
      <AmbientOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── §5 Header ── */}
        <SectionHeader />

        {/* ══════════════════════════════
            CATEGORY CARDS — 3 cols
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {SKILL_CATS.map((cat, ci) => (
            <CategoryCard key={cat.title} cat={cat} index={ci} />
          ))}
        </div>

        {/* ══════════════════════════════
            CURRENTLY EXPLORING
        ══════════════════════════════ */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Sub-header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.4))' }}
            />
            <motion.p
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap"
              style={{
                color:           '#60a5fa',
                backgroundColor: 'rgba(96,165,250,0.08)',
                border:          '1px solid rgba(96,165,250,0.22)',
              }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, type: 'spring' }}
            >
              🔬 Currently Exploring
            </motion.p>
            <div
              className="h-px flex-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.4), transparent)' }}
            />
          </div>

          {/* Exploring grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXPLORING.map((item, i) => (
              <ExploringItem key={item.label} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════
            TOOLS + BIO
        ══════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

          {/* Daily tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.44 }}
          >
            {/* Sub-label */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-px flex-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,107,0.35))' }}
              />
              <p
                className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap"
                style={{
                  color:           'var(--text-muted)',
                  backgroundColor: 'var(--bg-card)',
                  border:          '1px solid var(--border)',
                }}
              >
                🛠 Daily Tools
              </p>
              <div
                className="h-px flex-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(255,107,107,0.35), transparent)' }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {TOOLS.map((tool, i) => (
                <ToolChip key={tool.name} tool={tool} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Bio card */}
          <BioCard />
        </div>

      </div>
    </section>
  )
}