'use client'

import { createContext, useContext, useEffect, useState, startTransition } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'dark',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light') {
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'

    // Apply DOM + localStorage changes — called inside VTA callback or directly
    const apply = () => {
      if (next === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      localStorage.setItem('theme', next)
      // Defer React re-render so it doesn't block the first paint
      startTransition(() => setTheme(next))
    }

    // View Transition API: browser snapshots the page, runs apply() instantly,
    // then GPU-crossfades old → new. Far cheaper than 300 ms per-element CSS transitions.
    if (typeof document.startViewTransition === 'function') {
      // Suppress the per-element CSS transitions while VTA owns the animation
      document.documentElement.classList.add('vta-theme-change')
      const vt = document.startViewTransition(apply)
      vt.finished.finally(() => {
        document.documentElement.classList.remove('vta-theme-change')
      })
    } else {
      // Fallback: plain apply — CSS transitions in globals.css handle the blend
      apply()
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}