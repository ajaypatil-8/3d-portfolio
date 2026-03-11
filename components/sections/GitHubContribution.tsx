'use client'

import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

/* ─── Types & constants ──────────────────────────────────────────────── */

interface ContributionDay {
  date:  string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const USERNAME     = 'ajaypatil-8'
const START_FROM   = '2025-12-01'
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DARK_COLORS  = ['#161b22','#0e4429','#006d32','#26a641','#39d353']
const LIGHT_COLORS = ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39']
const REFRESH_MS   = 5 * 60 * 1000

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count < 3)  return 1
  if (count < 6)  return 2
  if (count < 10) return 3
  return 4
}

/* ─── Animated count-up number ──────────────────────────────────────── */

function CountUp({ value, suffix = '' }: { value: number | string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const isNum = typeof value === 'number'

  useEffect(() => {
    if (!isInView || !isNum || !ref.current) return
    const controls = animate(0, value as number, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toString() + suffix
      },
    })
    return controls.stop
  }, [isInView, value, isNum, suffix])

  return (
    <span ref={ref}>
      {isNum ? '0' + suffix : value}
    </span>
  )
}

/* ─── Skeleton grid loader ───────────────────────────────────────────── */

function SkeletonGrid() {
  return (
    <div className="inline-block min-w-full">
      <div className="flex gap-[3px]">
        {Array.from({ length: 18 }).map((_, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => (
              <motion.div
                key={di}
                className="w-[11px] h-[11px] rounded-sm"
                style={{ backgroundColor: 'var(--border)' }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: (wi + di) * 0.04 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Gradient text ──────────────────────────────────────────────────── */

function GradientText({ children, from, to }: { children: React.ReactNode; from: string; to: string }) {
  return (
    <span style={{
      backgroundImage:      `linear-gradient(135deg, ${from}, ${to})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor:  'transparent',
      backgroundClip:       'text',
    }}>
      {children}
    </span>
  )
}

/* ─── Streak calculation ─────────────────────────────────────────────── */

function calcCurrentStreak(days: ContributionDay[]): number {
  if (!days.length) return 0
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++
    else break
  }
  return streak
}

/* ─── GitHubContributions ────────────────────────────────────────────── */

export default function GitHubContributions() {
  const { theme }  = useTheme()
  const COLORS     = theme === 'light' ? LIGHT_COLORS : DARK_COLORS
  const accentGreen  = theme === 'light' ? '#216e39' : '#39d353'
  const accentGreen2 = theme === 'light' ? '#30a14e' : '#26a641'

  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [stats, setStats]       = useState({ total: 0, longestStreak: 0, currentStreak: 0 })
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing]   = useState(false)

  const fetchContributions = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

    try {
      const currentYear  = new Date().getFullYear()
      const yearsToFetch = [2025]
      if (currentYear > 2025) yearsToFetch.push(currentYear)

      const results = await Promise.all(
        yearsToFetch.map(y =>
          fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${y}`)
            .then(r => r.json())
            .catch(() => ({ contributions: [] }))
        )
      )

      const todayStr = new Date().toISOString().split('T')[0]

      const days: ContributionDay[] = results
        .flatMap(data => data.contributions ?? [])
        .map((d: any) => ({ date: d.date, count: d.count, level: getLevel(d.count) }))
        .filter(d => d.date >= START_FROM && d.date <= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))

      if (!days.length) { setError(true); setLoading(false); setRefreshing(false); return }

      let total = 0, longest = 0, temp = 0
      days.forEach(d => {
        total += d.count
        if (d.count > 0) { temp++; longest = Math.max(longest, temp) }
        else temp = 0
      })

      const current = calcCurrentStreak(days)

      setContributions(days)
      setStats({ total, longestStreak: longest, currentStreak: current })
      setError(false)
      setLastUpdated(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchContributions() }, [fetchContributions])

  useEffect(() => {
    const interval = setInterval(() => fetchContributions(true), REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchContributions])

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') fetchContributions(true) }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchContributions])

  /* build week columns */
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < contributions.length; i += 7) weeks.push(contributions.slice(i, i + 7))

  const monthPositions: { label: string; weekIndex: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    if (!week[0]) return
    const m = new Date(week[0].date).getMonth()
    if (m !== lastMonth) { monthPositions.push({ label: MONTH_LABELS[m], weekIndex: wi }); lastMonth = m }
  })

  /* ─── stat cards config ─── */
  const statCards = [
    { label: 'Contributions',  value: stats.total,          color: accentGreen,  suffix: '' },
    { label: 'Longest Streak', value: stats.longestStreak,  color: accentGreen2, suffix: 'd' },
    { label: 'Current Streak', value: stats.currentStreak,  color: '#4ecdc4',    suffix: 'd' },
  ]

  return (
    <section
      id="github-contributions"
      className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* ambient blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(57,211,83,0.08)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#4ecdc4' }}>
            GitHub Activity
          </p>
          <h2
            className="font-heading font-bold mb-2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)' }}
          >
            Contribution{' '}
            <GradientText from={accentGreen} to={accentGreen2}>Graph</GradientText>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Dec 2025 – Present · Live
            {lastUpdated && (
              <span style={{ color: 'var(--text-faint)', marginLeft: '0.5rem' }}>
                · Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </motion.div>

        {/* Stat cards — count-up animation */}
        <motion.div
          className="flex justify-center gap-6 sm:gap-10 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              className="text-center px-4 py-3 rounded-xl"
              style={{
                backgroundColor: `${s.color}0d`,
                border:          `1px solid ${s.color}22`,
              }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: s.color }}>
                {loading ? (
                  <span className="opacity-30">—</span>
                ) : (
                  <CountUp value={s.value} suffix={s.suffix} />
                )}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contribution grid */}
        <motion.div
          className="rounded-2xl p-5 sm:p-6 overflow-x-auto"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <SkeletonGrid />
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Fetching contributions…
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
              Could not load contributions.{' '}
              <a
                href={`https://github.com/${USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
                style={{ color: '#4ecdc4' }}
              >
                View on GitHub ↗
              </a>
            </div>
          ) : (
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex mb-1.5 ml-8">
                {weeks.map((_, wi) => {
                  const mp = monthPositions.find(m => m.weekIndex === wi)
                  return (
                    <div
                      key={wi}
                      className="w-[14px] mr-[3px] flex-shrink-0 text-[10px] leading-none"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {mp ? mp.label : ''}
                    </div>
                  )
                })}
              </div>

              {/* Day-of-week labels + grid */}
              <div className="flex gap-0">
                <div
                  className="flex flex-col mr-2 text-[10px] leading-none flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {['','Mon','','Wed','','Fri',''].map((d, i) => (
                    <div key={i} className="h-[14px] mb-[3px] flex items-center">{d}</div>
                  ))}
                </div>

                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <motion.div
                          key={di}
                          className="w-[11px] h-[11px] rounded-sm flex-shrink-0"
                          style={{ backgroundColor: COLORS[day.level] }}
                          whileHover={{ scale: 1.6, zIndex: 10 }}
                          title={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: wi * 0.004 + di * 0.002 }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div
                className="flex items-center justify-end gap-1.5 mt-4 text-[11px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <span>Less</span>
                {COLORS.map((color, i) => (
                  <div
                    key={i}
                    className="w-[11px] h-[11px] rounded-sm"
                    style={{
                      backgroundColor: color,
                      border: theme === 'light' && i === 0 ? '1px solid var(--border)' : 'none',
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          )}

          {/* Action row */}
          <div className="text-center mt-5 flex items-center justify-center gap-3 flex-wrap">
            <motion.a
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{
                border:          '1px solid var(--border-strong)',
                color:           'var(--text-secondary)',
                backgroundColor: 'var(--bg-card)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Full Profile ↗
            </motion.a>

            <motion.button
              onClick={() => fetchContributions(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm"
              style={{
                border:          '1px solid var(--border)',
                color:           'var(--text-muted)',
                backgroundColor: 'var(--bg-card)',
                opacity:         refreshing ? 0.6 : 1,
              }}
              whileHover={{ scale: refreshing ? 1 : 1.05 }}
              whileTap={{ scale: refreshing ? 1 : 0.97 }}
              title="Refresh now"
            >
              <motion.svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </motion.svg>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}