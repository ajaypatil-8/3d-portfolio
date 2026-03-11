'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center rounded-full cursor-hover overflow-hidden"
      style={{
        width:           '36px',    /* 36 px on all breakpoints — compact enough for mobile nav */
        height:          '36px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        border:          `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.11)'}`,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background glow on hover */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Icon swap with AnimatePresence for clean enter/exit */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          /* Sun icon — shown in dark mode to switch to light */
          <motion.svg
            key="sun"
            className="w-[18px] h-[18px] relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: '#fbbf24' }}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{   rotate:  90,  opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </motion.svg>
        ) : (
          /* Moon icon — shown in light mode to switch to dark */
          <motion.svg
            key="moon"
            className="w-[18px] h-[18px] relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: '#6366f1' }}
            initial={{ rotate:  90, opacity: 0, scale: 0.6 }}
            animate={{ rotate:   0, opacity: 1, scale: 1 }}
            exit={{   rotate: -90,  opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}