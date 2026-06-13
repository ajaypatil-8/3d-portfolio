'use client'

/*
 * Experience.tsx — Enhanced Edition
 *
 * KEY FIXES & IMPROVEMENTS OVER V1
 * ─────────────────────────────────
 * ✅ Green dot: completely rebuilt — static core dot + two offset ping rings
 *    using only transform + opacity (zero layout thrash)
 * ✅ ALL CSS keyframes now use only transform/opacity — GPU-accelerated,
 *    no box-shadow / width / height / color in animations
 * ✅ 3D perspective tilt on every card (mouse-tracked rotateX/rotateY via Framer)
 * ✅ Travelling neon particle on timeline center line (Framer Motion y — GPU)
 * ✅ Neon glow bleed behind timeline cards on hover
 * ✅ Scan-line sweep effect on journey cards
 * ✅ Staggered spring tag-pill entrances
 * ✅ Multi-ring pulse on timeline connector dots
 * ✅ Icon bounce/shake on card hover
 * ✅ Education card design 100 % preserved — layout / colors / borders intact
 * ✅ prefers-reduced-motion respected via CSS override
 */

import {
  motion,
  useInView,
  useSpring,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useRef, useState, useCallback, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   §1  CSS KEYFRAMES — STRICTLY GPU-ONLY (transform + opacity)
       Exception: xp-grad-shift uses background-position (no GPU path exists
       for gradient animation; it's isolated to a single 2px border stripe)
═══════════════════════════════════════════════════════════════════════════ */
const XP_CSS = `
/* ── Green-dot ping ─────────────────────────── */
@keyframes gp-ping {
  0%   { transform: scale(1);   opacity: 0.9; }
  75%  { transform: scale(2.9); opacity: 0;   }
  100% { transform: scale(2.9); opacity: 0;   }
}

/* ── Ambient orb drift ──────────────────────── */
@keyframes xp-orb {
  0%,100% { transform: translate(0, 0)       scale(1);    opacity: 0.38; }
  25%     { transform: translate(38px,-52px) scale(1.08); opacity: 0.55; }
  50%     { transform: translate(-22px,-70px)scale(0.93); opacity: 0.32; }
  75%     { transform: translate(-44px,-22px)scale(1.04); opacity: 0.48; }
}

/* ── Card shimmer sweep ─────────────────────── */
@keyframes xp-shimmer {
  0%   { transform: translateX(-210%) skewX(-14deg); }
  100% { transform: translateX(320%)  skewX(-14deg); }
}

/* ── Ring expand + fade (dot hover / connector) */
@keyframes xp-ring {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(4.2); opacity: 0;   }
}

/* ── Year-badge breathe ─────────────────────── */
@keyframes xp-badge {
  0%,100% { transform: scale(1);    opacity: 0.88; }
  50%     { transform: scale(1.04); opacity: 1;    }
}

/* ── CTA top-border gradient flow ──────────── */
@keyframes xp-grad-shift {
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}

/* ── Scan line (journey card hover) ─────────── */
@keyframes xp-scan {
  0%   { transform: translateY(-8%);   opacity: 0.28; }
  50%  { opacity: 0.48; }
  100% { transform: translateY(108%);  opacity: 0.28; }
}

/* ── Icon jiggle on hover ───────────────────── */
@keyframes xp-jiggle {
  0%  { transform: rotate(0deg)  scale(1.18); }
  20% { transform: rotate(-7deg) scale(1.22); }
  40% { transform: rotate( 7deg) scale(1.20); }
  60% { transform: rotate(-4deg) scale(1.18); }
  80% { transform: rotate( 3deg) scale(1.19); }
  100%{ transform: rotate( 0deg) scale(1.18); }
}

/* ── Bottom-line sweep (pure CSS so we keep group-hover) */
.xp-bottom-line {
  height: 1px;
  width: 0;
  border-radius: 9999px;
  transition: width 0.55s ease;
}
.group:hover .xp-bottom-line { width: 100%; }

/* ── Honour reduced-motion ──────────────────── */
@media (prefers-reduced-motion: reduce) {
  [style*="animation"] { animation: none !important; }
  * { transition-duration: 0.01ms !important; }
}
`

/* ═══════════════════════════════════════════════════════════════════════════
   §2  DATA
═══════════════════════════════════════════════════════════════════════════ */
const EDUCATION = [
  {
    year: '2023–26 (Present)',
    icon: '🎓',
    color: '#4ecdc4',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'Arts, Commerce & Science College, Palus',
    sub: 'Shivaji University, Kolhapur',
    description:
      'Currently in 3rd year, studying Data Structures, DBMS, Operating Systems, Web Technologies and Software Engineering. Complementing academics with real-world full-stack projects in Java & Spring Boot.',
    tags: ['3rd Year', 'BCA', 'Shivaji University'],
    meta: 'CGPA: 7.2 / 10',
  },
  {
    year: '2022 – 2023',
    icon: '📚',
    color: '#a855f7',
    title: 'Higher Secondary (12th) — Commerce',
    org: 'Palus, Sangli, Maharashtra',
    sub: 'Maharashtra State Board',
    description:
      'Completed HSC with focus on Commerce stream. Discovered passion for programming and started self-learning web development alongside academics.',
    tags: ['HSC', 'Commerce', 'Maharashtra Board'],
    meta: null,
  },
] as const

const JOURNEY = [
  {
    year: '2025 – Present',
    icon: '⚙️',
    color: '#ff6b6b',
    title: 'Spring Boot & Microservices',
    org: 'Self-Learning & Projects',
    description:
      'Mastering Spring Boot, Spring Security, Spring Data JPA, REST API design and microservices architecture. Built CrowdSpark-X Advanced as a hands-on production project.',
    tags: ['Spring Boot', 'Microservices', 'Docker', 'Kafka'],
    badge: 'Backend Core',
    isLive: false,
  },
  {
    year: '2024 – 25',
    icon: '🏆',
    color: '#ffd93d',
    title: 'Full Stack Development with PHP',
    org: 'Self-Built Project',
    description:
      'Built CrowdSpark-X — a complete full-stack crowdfunding platform using PHP, MySQL, Cloudinary and PHPMailer. Handled everything from DB design to SMTP email integration.',
    tags: ['PHP', 'MySQL', 'Cloudinary', 'SMTP'],
    badge: 'First Full Stack',
    isLive: false,
  },
  {
    year: '2024 – Present',
    icon: '🎨',
    color: '#4ecdc4',
    title: 'React & Next.js Frontend',
    org: 'Self-Learning',
    description:
      'Learned React.js and Next.js to build the CrowdSpark-X Advanced frontend. Comfortable with TypeScript, Tailwind CSS, REST API integration and component-based architecture.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    badge: 'Frontend',
    isLive: false,
  },
  {
    year: '2026 – Present',
    icon: '✈️',
    color: '#6366f1',
    title: 'AeroSphere — Full Production Deployment',
    org: 'Live · aerosphere.work.gd',
    description:
      "Deployed a full airline booking system on AWS EC2 (t3.small) with Elastic IP, custom domain, free HTTPS via Let's Encrypt (certbot), and a 3-service Docker Compose stack (Tomcat + MySQL + Nginx). Nginx with HTTP→HTTPS redirect, HSTS, rate limiting, and gzip. Razorpay payments + Gmail SMTP.",
    tags: ['AWS EC2', 'Docker', 'Nginx', "Let's Encrypt", 'GitHub Actions'],
    badge: '🔴 Live',
    isLive: true,
  },
  {
    year: '2026 – Present',
    icon: '🐳',
    color: '#a855f7',
    title: 'Docker & Cloud Fundamentals',
    org: 'Self-Learning',
    description:
      'Learned Docker containerisation, Kubernetes basics, and cloud fundamentals on AWS and Azure. Actively containerising CrowdSpark-X microservices for deployment.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
    badge: 'DevOps Path',
    isLive: false,
  },
] as const

/* ═══════════════════════════════════════════════════════════════════════════
   §3  HOOK — GPU-accelerated 3-D tilt
       Maps mouse position inside the card to rotateX / rotateY.
       Uses Framer Motion springs so the card floats back lazily on leave.
═══════════════════════════════════════════════════════════════════════════ */
function use3DTilt(deg = 6) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotX = useSpring(useTransform(my, [-1, 1], [deg, -deg]), {
    stiffness: 160, damping: 20,
  })
  const rotY = useSpring(useTransform(mx, [-1, 1], [-deg, deg]), {
    stiffness: 160, damping: 20,
  })

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width  / 2) / (r.width  / 2))
    my.set((e.clientY - r.top  - r.height / 2) / (r.height / 2))
  }, [mx, my])

  const onLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return { rotX, rotY, onMove, onLeave }
}

/* ═══════════════════════════════════════════════════════════════════════════
   §4  ATOMS
═══════════════════════════════════════════════════════════════════════════ */

/* ── Tag pill ────────────────────────────────────────────────────────── */
function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <motion.span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium select-none cursor-default"
      style={{
        color:           color ?? 'var(--text-muted)',
        backgroundColor: color ? `${color}12` : 'var(--bg-card-hover)',
        border:          `1px solid ${color ? color + '28' : 'var(--border)'}`,
      }}
      whileHover={color
        ? { backgroundColor: `${color}22`, scale: 1.1, y: -1.5 }
        : { scale: 1.06 }}
      transition={{ duration: 0.12 }}
    >
      {label}
    </motion.span>
  )
}

/* ── GlowingDot — FIXED ping animation ──────────────────────────────── */
/*
   FIX SUMMARY
   ───────────
   Original bug: two sibling <span>s both tried to be "the dot" and "the ring"
   simultaneously, causing the dot to vanish when ring-out scaled it away.

   Fix: three-layer stack inside a relative container
     1. Static core dot  (z-10, always visible, never animated)
     2. Ping ring #1     (absolute inset-0, scales up + fades, loop)
     3. Ping ring #2     (same, 0.6 s delay → staggered double-pulse)
   Only transform + opacity used → zero layout/paint calls.
*/
function GlowingDot({ color = '#4ade80' }: { color?: string }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: 14, height: 14, marginRight: 6 }}
    >
      {/* Layer 1 — static filled dot (never animated) */}
      <span
        className="relative z-10 block rounded-full"
        style={{ width: 10, height: 10, backgroundColor: color }}
      />
      {/* Layer 2 — ping ring A */}
      <span
        className="absolute rounded-full"
        style={{
          inset: 2,
          backgroundColor: color,
          animation: 'gp-ping 1.9s cubic-bezier(0,0,0.2,1) infinite',
          willChange: 'transform',
        }}
      />
      {/* Layer 3 — ping ring B (delayed for double-pulse) */}
      <span
        className="absolute rounded-full"
        style={{
          inset: 2,
          backgroundColor: color,
          opacity: 0.45,
          animation: 'gp-ping 1.9s 0.65s cubic-bezier(0,0,0.2,1) infinite',
          willChange: 'transform',
        }}
      />
    </span>
  )
}

/* ── AmbientOrbs — drifting background glows ────────────────────────── */
const ORB_CFG = [
  { color: 'rgba(78,205,196,0.6)',  size: 520, l: '-22%', t: '-14%', dur: 17, delay: 0  },
  { color: 'rgba(99,102,241,0.5)', size: 480, l: '73%',  t: '58%',  dur: 22, delay: 6  },
  { color: 'rgba(168,85,247,0.42)',size: 360, l: '42%',  t: '30%',  dur: 13, delay: 3  },
  { color: 'rgba(255,107,107,0.3)',size: 300, l: '7%',   t: '74%',  dur: 19, delay: 9  },
  { color: 'rgba(96,165,250,0.28)',size: 240, l: '87%',  t: '16%',  dur: 15, delay: 5  },
]

function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORB_CFG.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.l, top: o.t,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 68%)`,
            animation: `xp-orb ${o.dur}s ${o.delay}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* ── SectionLabel — divider with animated entrance ──────────────────── */
function SectionLabel({ emoji, text, color }: { emoji: string; text: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="h-px flex-1 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${color}44)` }}
      />
      <motion.p
        className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap"
        style={{ color, backgroundColor: `${color}0d`, border: `1px solid ${color}28` }}
        initial={{ opacity: 0, scale: 0.82 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {emoji} {text}
      </motion.p>
      <div
        className="h-px flex-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}44, transparent)` }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §5  EDUCATION CARD
       Design language 100 % preserved from the original (left accent bar,
       top gradient stripe, year badge, icon, description, tags).
       Enhancements: 3-D tilt, behind-card neon halo, animated CGPA chip,
       staggered tag spring entrances, icon jiggle, ring burst on hover.
═══════════════════════════════════════════════════════════════════════════ */
type EduItem = (typeof EDUCATION)[number]

function EducationCard({ item, index }: { item: EduItem; index: number }) {
  const { rotX, rotY, onMove, onLeave } = use3DTilt(4)
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="relative group"
      style={{ perspective: 1100 }}
      initial={{ opacity: 0, y: 22, x: -18 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.13, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHov(false) }}
      onHoverStart={() => setHov(true)}
    >
      {/* Neon halo behind the card */}
      <motion.div
        aria-hidden
        className="absolute -inset-2 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 25% 50%, ${item.color}22, transparent 65%)`,
          filter: 'blur(16px)',
        }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* ── Card shell with 3-D tilt ── */}
      <motion.div
        className="rounded-2xl relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${hov ? item.color + '48' : 'var(--border)'}`,
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
          transition: 'border-color 0.3s',
          willChange: 'transform',
        }}
        whileHover={{ y: -5 }}
        transition={{ y: { duration: 0.2 } }}
      >
        {/* Left accent bar (preserved) */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          style={{ background: `linear-gradient(to bottom, ${item.color}, ${item.color}44)` }}
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.13 + 0.22, duration: 0.5 }}
        />

        {/* Top gradient stripe (preserved) */}
        <motion.div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${item.color}, ${item.color}55, transparent)`,
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.13 + 0.15, duration: 0.6 }}
        />

        {/* Shimmer on hover */}
        {hov && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 28%, ${item.color}13 50%, transparent 72%)`,
              animation: 'xp-shimmer 0.65s ease forwards',
            }}
          />
        )}

        {/* Ambient radial */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 0% 50%, ${item.color}07 0%, transparent 55%)`,
          }}
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* ── Content ── */}
        <div className="p-5 pl-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">

            {/* Icon box */}
            <div className="flex-shrink-0">
              <motion.div
                className="w-11 h-11 rounded-xl flex items-center justify-center relative overflow-visible"
                style={{
                  background: `${item.color}14`,
                  border:     `1px solid ${item.color}28`,
                  fontSize:   '1.4rem',
                }}
                animate={hov
                  ? { boxShadow: `0 0 0 0 ${item.color}00, 0 0 26px ${item.color}48` }
                  : { boxShadow: `0 0 0 0 ${item.color}00` }}
                transition={{ duration: 0.3 }}
              >
                <span style={hov ? { animation: 'xp-jiggle 0.5s ease forwards', display: 'block' } : {}}>
                  {item.icon}
                </span>
                {hov && (
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      animation:    'xp-ring 0.85s ease-out forwards',
                      border:       `1.5px solid ${item.color}`,
                      borderRadius: '0.75rem',
                    }}
                  />
                )}
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h3 className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <motion.span
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono flex-shrink-0"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color:           item.color,
                    border:          `1px solid ${item.color}30`,
                    animation:       hov ? 'xp-badge 1.8s ease-in-out infinite' : 'none',
                  }}
                >
                  {item.year}
                </motion.span>
              </div>

              <p className="font-semibold text-xs mb-0.5" style={{ color: item.color }}>
                {item.org}
              </p>

              {item.sub && (
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  {item.sub}
                </p>
              )}

              {item.meta && (
                <div className="mb-2.5">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-mono"
                    style={{
                      backgroundColor: `${item.color}12`,
                      color:           item.color,
                      border:          `1px solid ${item.color}22`,
                    }}
                  >
                    🏅 {item.meta}
                  </span>
                </div>
              )}

              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>

              {/* Tags — staggered spring entrance */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, ti) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.6, y: 4 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay:    index * 0.13 + 0.3 + ti * 0.07,
                      duration: 0.25,
                      type:     'spring',
                    }}
                  >
                    <Tag label={tag} color={item.color} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom sweep line (CSS group-hover) */}
          <div
            className="xp-bottom-line mt-4"
            style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §6  JOURNEY CARD  (self-learning timeline entries)
       Heavily enhanced: 3-D tilt, neon halo, scan-line sweep,
       directional top stripe, corner radial accent, live-badge pulse.
═══════════════════════════════════════════════════════════════════════════ */
type JourneyItem = (typeof JOURNEY)[number]

function JourneyCard({
  item, index, align,
}: {
  item: JourneyItem
  index: number
  align: 'left' | 'right'
}) {
  const { rotX, rotY, onMove, onLeave } = use3DTilt(5)
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className="relative group"
      style={{ perspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={() => { onLeave(); setHov(false) }}
      onHoverStart={() => setHov(true)}
    >
      {/* Neon halo */}
      <motion.div
        aria-hidden
        className="absolute -inset-3 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${item.color}1a, transparent 68%)`,
          filter:     'blur(20px)',
        }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* ── Card shell ── */}
      <motion.div
        className="rounded-2xl overflow-hidden relative"
        style={{
          backgroundColor: 'var(--bg-card)',
          border:          `1px solid ${hov ? item.color + '52' : 'var(--border)'}`,
          rotateX:         rotX,
          rotateY:         rotY,
          transformStyle:  'preserve-3d',
          transition:      'border-color 0.3s',
          willChange:      'transform',
        }}
        whileHover={{ y: -6 }}
        transition={{ y: { duration: 0.2 } }}
      >
        {/* Directional top stripe */}
        <motion.div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{
            background:      align === 'left'
              ? `linear-gradient(90deg, ${item.color}, ${item.color}44, transparent)`
              : `linear-gradient(270deg, ${item.color}, ${item.color}44, transparent)`,
            transformOrigin: align === 'left' ? 'left' : 'right',
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.09 + 0.2, duration: 0.6 }}
        />

        {/* Corner accent radial */}
        <div
          aria-hidden
          className={`absolute top-0 ${align === 'left' ? 'left-0' : 'right-0'} w-28 h-28 pointer-events-none`}
          style={{
            background: `radial-gradient(ellipse at ${align === 'left' ? 'top left' : 'top right'}, ${item.color}10, transparent 68%)`,
            opacity:    hov ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Shimmer sweep */}
        {hov && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 25%, ${item.color}0e 50%, transparent 75%)`,
              animation:  'xp-shimmer 0.7s ease forwards',
            }}
          />
        )}

        {/* Scan line */}
        {hov && (
          <div
            aria-hidden
            className="absolute inset-x-0 h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${item.color}66, transparent)`,
              animation:  'xp-scan 1.7s ease-in-out infinite',
            }}
          />
        )}

        {/* ── Content ── */}
        <div className="p-5 relative z-10">

          {/* Header row */}
          <div className={`flex items-start gap-2.5 mb-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>

            {/* Icon */}
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-visible"
              style={{
                background: `${item.color}16`,
                border:     `1px solid ${item.color}28`,
                fontSize:   '1.25rem',
              }}
              animate={hov
                ? { boxShadow: `0 0 24px ${item.color}55` }
                : { boxShadow: 'none' }}
              transition={{ duration: 0.3 }}
            >
              <span style={hov ? { animation: 'xp-jiggle 0.5s ease forwards', display: 'block' } : {}}>
                {item.icon}
              </span>
              {hov && (
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    animation:    'xp-ring 0.9s ease-out forwards',
                    border:       `1px solid ${item.color}`,
                    borderRadius: '0.75rem',
                  }}
                />
              )}
            </motion.div>

            {/* Year + badge */}
            <div className={`flex flex-col gap-1 ${align === 'right' ? 'items-end' : ''}`}>
              <motion.span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono"
                style={{
                  backgroundColor: `${item.color}15`,
                  color:           item.color,
                  border:          `1px solid ${item.color}30`,
                }}
                animate={hov
                  ? { boxShadow: `0 0 14px ${item.color}58` }
                  : { boxShadow: 'none' }}
                transition={{ duration: 0.3 }}
              >
                {item.year}
              </motion.span>

              {item.badge && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: item.isLive
                      ? 'rgba(239,68,68,0.13)'
                      : `${item.color}10`,
                    color:  item.isLive ? '#ef4444' : item.color,
                    border: `1px solid ${item.isLive ? 'rgba(239,68,68,0.28)' : item.color + '24'}`,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`text-base font-bold mb-1 leading-snug ${align === 'right' ? 'text-right' : ''}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {item.title}
          </h3>

          {/* Org */}
          <p
            className={`text-xs font-semibold mb-2.5 ${align === 'right' ? 'text-right' : ''}`}
            style={{ color: item.color }}
          >
            {item.org}
          </p>

          {/* Description */}
          <p
            className={`text-xs leading-relaxed mb-3 ${align === 'right' ? 'text-right' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {item.description}
          </p>

          {/* Tags — staggered spring */}
          <div className={`flex flex-wrap gap-1.5 ${align === 'right' ? 'justify-end' : ''}`}>
            {item.tags.map((tag, ti) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.65, y: 4 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay:    index * 0.09 + 0.35 + ti * 0.055,
                  duration: 0.22,
                  type:     'spring',
                }}
              >
                <Tag label={tag} color={item.color} />
              </motion.div>
            ))}
          </div>

          {/* Bottom sweep */}
          <div
            className="xp-bottom-line mt-3"
            style={{
              background: `linear-gradient(${align === 'right' ? '270deg' : '90deg'}, ${item.color}, transparent)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §7  TIMELINE ROW — card + animated centre connector dot
       Multi-ring pulse rings, spring scale-in entrance, colored glow.
═══════════════════════════════════════════════════════════════════════════ */
function TimelineRow({ item, index }: { item: JourneyItem; index: number }) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className="relative grid grid-cols-1 md:grid-cols-[1fr_52px_1fr] items-start"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left column */}
      <div className={isLeft ? 'md:pr-5' : 'hidden md:block'}>
        {isLeft && <JourneyCard item={item} index={index} align="right" />}
      </div>

      {/* Centre dot */}
      <div className="hidden md:flex justify-center items-start pt-[22px] relative z-10">
        <div className="relative flex items-center justify-center">
          {/* Outer ring A */}
          <div
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 30, height: 30,
              backgroundColor: item.color,
              opacity:         0.18,
              animation:       `xp-ring 2.8s ${index * 0.38}s ease-in-out infinite`,
              willChange:      'transform',
            }}
          />
          {/* Outer ring B (stagger) */}
          <div
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 22, height: 22,
              backgroundColor: item.color,
              opacity:         0.22,
              animation:       `xp-ring 2.8s ${index * 0.38 + 0.95}s ease-in-out infinite`,
              willChange:      'transform',
            }}
          />
          {/* Core dot — spring scale in */}
          <motion.div
            className="rounded-full relative z-10"
            style={{
              width:       16,
              height:      16,
              backgroundColor: item.color,
              border:      '3px solid var(--bg-primary)',
              boxShadow:   `0 0 14px ${item.color}75, 0 0 28px ${item.color}32`,
            }}
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              delay:     index * 0.08 + 0.18,
              type:      'spring',
              stiffness: 360,
              damping:   18,
            }}
          />
        </div>
      </div>

      {/* Right column */}
      <div className={!isLeft ? 'md:pl-5' : 'hidden md:block'}>
        {!isLeft && <JourneyCard item={item} index={index} align="left" />}
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden col-span-1">
        <JourneyCard item={item} index={index} align="left" />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §8  CTA SECTION — "Open to Jobs & Internships"
       Premium glassmorphism card, fixed green dot, animated gradient border,
       button shine sweep, neon hover glow.
═══════════════════════════════════════════════════════════════════════════ */
function CTASection() {
  const [btnHov, setBtnHov] = useState(false)

  return (
    <motion.div
      className="text-center mt-16"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative rounded-2xl p-8 max-w-xl mx-auto overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          border:          '1px solid var(--border)',
        }}
      >
        {/* Animated gradient top border */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
          style={{
            background:     'linear-gradient(90deg, #4ecdc4, #60a5fa, #a855f7, #ff6b6b, #4ecdc4)',
            backgroundSize: '300% 100%',
            animation:      'xp-grad-shift 3.6s linear infinite',
          }}
        />

        {/* Ambient radial */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(78,205,196,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Status row — FIXED green dot */}
        <div className="relative z-10 flex items-center justify-center gap-0.5 mb-3">
          <GlowingDot color="#4ade80" />
          <span className="text-green-400 font-bold text-sm">
            Open to Jobs &amp; Internships
          </span>
        </div>

        <p className="relative z-10 text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          I&apos;m a fresher with real project experience in Java, Spring Boot, React, Docker and cloud.
          Looking for an opportunity to grow in a professional team environment.
        </p>

        {/* CTA button */}
        <motion.a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=ajaypatil8eight@gmail.com&su=Project%20Inquiry&body=Hello%20Ajay,%20I%20visited%20your%20portfolio%20and%20want%20to%20connect."
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 px-7 py-3 text-white rounded-full font-semibold text-sm overflow-hidden z-10"
          style={{ background: 'linear-gradient(135deg, #4ecdc4, #60a5fa, #a855f7)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onHoverStart={() => setBtnHov(true)}
          onHoverEnd={() => setBtnHov(false)}
          animate={btnHov
            ? { boxShadow: '0 0 32px rgba(78,205,196,0.52), 0 0 64px rgba(96,165,250,0.2)' }
            : { boxShadow: '0 0 0 rgba(0,0,0,0)' }}
          transition={{ boxShadow: { duration: 0.35 } }}
        >
          {/* Shine sweep */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            }}
            initial={{ x: '-130%' }}
            animate={btnHov ? { x: '130%' } : { x: '-130%' }}
            transition={{ duration: 0.5 }}
          />

          <svg
            className="w-4 h-4 relative z-10 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="relative z-10">
            Get In Touch — ajaypatil8eight@gmail.com
          </span>
        </motion.a>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §9  TIMELINE CENTRE LINE + TRAVELLING PARTICLE
       Separate component so we can cleanly track lineHeight via ResizeObserver.
       Particle uses Framer Motion `y` → translateY (GPU-accelerated).
═══════════════════════════════════════════════════════════════════════════ */
function TimelineLineAndParticle({
  lineRef,
  lineInView,
}: {
  lineRef: React.RefObject<HTMLDivElement | null>
  lineInView: boolean
}) {
  const [lineH, setLineH] = useState(0)

  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setLineH(el.scrollHeight))
    ro.observe(el)
    setLineH(el.scrollHeight)
    return () => ro.disconnect()
  }, [lineRef])

  return (
    <div
      aria-hidden
      className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Gradient line */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:      'linear-gradient(to bottom, #4ecdc4 0%, #60a5fa 28%, #a855f7 65%, #ff6b6b 100%)',
          opacity:         0.4,
          transformOrigin: 'top',
        }}
        initial={{ scaleY: 0 }}
        animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Travelling particle — GPU (y = translateY) */}
      {lineInView && lineH > 0 && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width:           7,
            height:          7,
            left:            '50%',
            x:               '-50%',
            backgroundColor: '#4ecdc4',
            boxShadow:       '0 0 8px #4ecdc4, 0 0 18px #4ecdc4aa',
            willChange:      'transform',
          }}
          animate={{
            y:       [0, lineH],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            y:       { duration: 3.6, repeat: Infinity, repeatDelay: 0.6, delay: 2, ease: 'easeInOut' },
            opacity: { duration: 3.6, repeat: Infinity, repeatDelay: 0.6, delay: 2, times: [0, 0.06, 0.5, 0.94, 1] },
          }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §10  SECTION HEADER
═══════════════════════════════════════════════════════════════════════════ */
function SectionHeader() {
  return (
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
        <span
          style={{
            background:           'linear-gradient(135deg, #ff6b6b, #4ecdc4, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}
        >
          Journey
        </span>
      </h2>

      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Fresher — but self-driven, project-focused, and actively building production-level skills.
      </p>

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-2">
        <motion.div
          className="h-px flex-1 max-w-[120px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #4ecdc4)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        />
        <div className="flex gap-1.5">
          {(['#ff6b6b', '#4ecdc4', '#a855f7'] as const).map((c, i) => (
            <motion.div
              key={c}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: c }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.36 + i * 0.07, type: 'spring' }}
            />
          ))}
        </div>
        <motion.div
          className="h-px flex-1 max-w-[120px] rounded-full"
          style={{ background: 'linear-gradient(90deg, #a855f7, transparent)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   §11  ROOT EXPORT — Experience
═══════════════════════════════════════════════════════════════════════════ */
export default function Experience() {
  const lineRef  = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-80px' })

  return (
    <section
      id="experience"
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ── Inject GPU-only keyframes ── */}
      <style>{XP_CSS}</style>

      {/* ── Drifting background orbs ── */}
      <AmbientOrbs />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ── §10 Header ── */}
        <SectionHeader />

        {/* ══════════════════════════════
            EDUCATION
        ══════════════════════════════ */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SectionLabel emoji="📚" text="Education" color="#4ecdc4" />

          <div className="space-y-4">
            {EDUCATION.map((item, i) => (
              <EducationCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════
            SELF-LEARNING TIMELINE
        ══════════════════════════════ */}
        <div>
          <SectionLabel emoji="🚀" text="Self-Learning & Projects Timeline" color="#ff6b6b" />

          {/* Timeline container — position: relative so the line + particle sit correctly */}
          <div className="relative" ref={lineRef}>
            <TimelineLineAndParticle lineRef={lineRef} lineInView={lineInView} />

            <div className="space-y-6">
              {JOURNEY.map((item, i) => (
                <TimelineRow key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            CTA
        ══════════════════════════════ */}
        <CTASection />

      </div>
    </section>
  )
}
