'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const USERNAME     = 'ajaypatil-8'
const START_FROM   = '2025-12-01'
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DARK_COLORS  = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
const LIGHT_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
const REFRESH_MS   = 5 * 60 * 1000

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count < 3)  return 1
  if (count < 6)  return 2
  if (count < 10) return 3
  return 4
}

function GradientText({ children, from, to }: { children: React.ReactNode; from: string; to: string }) {
  return (
    <span style={{
      backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>
      {children}
    </span>
  )
}

function calcCurrentStreak(days: ContributionDay[]): number {
  if (!days.length) return 0
  let streak = 0
  // Walk backwards — days is already cut off at today so no future empty cells
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++
    else break
  }
  return streak
}

export default function GitHubContributions() {
  const { theme } = useTheme()
  const COLORS = theme === 'light' ? LIGHT_COLORS : DARK_COLORS

  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [stats, setStats]     = useState({ total: 0, longestStreak: 0, currentStreak: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchContributions = useCallback(async () => {
    try {
      const currentYear = new Date().getFullYear()
      const yearsToFetch = [2025]
      if (currentYear > 2025) yearsToFetch.push(currentYear)

      const results = await Promise.all(
        yearsToFetch.map(y =>
          fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${y}`)
            .then(r => r.json())
            .catch(() => ({ contributions: [] }))
        )
      )

      // TODAY — cut off here so future empty cells don't break streak
      const todayStr = new Date().toISOString().split('T')[0]

      const days: ContributionDay[] = results
        .flatMap(data => data.contributions ?? [])
        .map((d: any) => ({ date: d.date, count: d.count, level: getLevel(d.count) }))
        .filter(d => d.date >= START_FROM && d.date <= todayStr) // ← key fix
        .sort((a, b) => a.date.localeCompare(b.date))

      if (!days.length) { setError(true); setLoading(false); return }

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
    }
  }, [])

  useEffect(() => { fetchContributions() }, [fetchContributions])

  useEffect(() => {
    const interval = setInterval(fetchContributions, REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchContributions])

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') fetchContributions() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchContributions])

  const weeks: ContributionDay[][] = []
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }

  const monthPositions: { label: string; weekIndex: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    if (!week[0]) return
    const m = new Date(week[0].date).getMonth()
    if (m !== lastMonth) { monthPositions.push({ label: MONTH_LABELS[m], weekIndex: wi }); lastMonth = m }
  })

  const accentGreen  = theme === 'light' ? '#216e39' : '#39d353'
  const accentGreen2 = theme === 'light' ? '#30a14e' : '#26a641'

  return (
    <section id="github-contributions" className="relative py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(57,211,83,0.08)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm font-mono tracking-widest uppercase mb-3" style={{ color: '#4ecdc4' }}>
            GitHub Activity
          </p>
          <h2 className="font-heading font-bold mb-2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)' }}>
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

        <motion.div className="flex justify-center gap-10 mb-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {[
            { label: 'Contributions',  value: stats.total,                   color: accentGreen  },
            { label: 'Longest Streak', value: `${stats.longestStreak} days`, color: accentGreen2 },
            { label: 'Current Streak', value: `${stats.currentStreak} days`, color: '#4ecdc4'    },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div className="rounded-2xl p-6 overflow-x-auto"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

          {loading ? (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
              Loading contributions…
            </div>
          ) : error ? (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
              Could not load contributions.{' '}
              <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer"
                className="underline" style={{ color: '#4ecdc4' }}>View on GitHub ↗</a>
            </div>
          ) : (
            <div className="inline-block min-w-full">
              <div className="flex mb-1.5 ml-8">
                {weeks.map((_, wi) => {
                  const mp = monthPositions.find(m => m.weekIndex === wi)
                  return (
                    <div key={wi} className="w-[14px] mr-[3px] flex-shrink-0 text-[10px] leading-none"
                      style={{ color: 'var(--text-muted)' }}>
                      {mp ? mp.label : ''}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-0">
                <div className="flex flex-col mr-2 text-[10px] leading-none flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}>
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                    <div key={i} className="h-[14px] mb-[3px] flex items-center">{d}</div>
                  ))}
                </div>
                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <motion.div key={di}
                          className="w-[11px] h-[11px] rounded-sm cursor-pointer flex-shrink-0"
                          style={{ backgroundColor: COLORS[day.level] }}
                          whileHover={{ scale: 1.5 }}
                          title={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 mt-4 text-[11px]"
                style={{ color: 'var(--text-muted)' }}>
                <span>Less</span>
                {COLORS.map((color, i) => (
                  <div key={i} className="w-[11px] h-[11px] rounded-sm"
                    style={{
                      backgroundColor: color,
                      border: theme === 'light' && i === 0 ? '1px solid var(--border)' : 'none',
                    }} />
                ))}
                <span>More</span>
              </div>
            </div>
          )}

          <div className="text-center mt-5 flex items-center justify-center gap-3">
            <motion.a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Full Profile ↗
            </motion.a>

            <motion.button
              onClick={fetchContributions}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              title="Refresh now">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}