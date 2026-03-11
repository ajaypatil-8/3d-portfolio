'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

type CursorState = 'default' | 'hover' | 'text'

/* Detect if device is primarily touch — if so, skip the custom cursor entirely */
function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export default function CustomCursor() {
  const { theme } = useTheme()
  const [mounted, setMounted]   = useState(false)
  const [isTouch, setIsTouch]   = useState(true)   // start hidden; confirm on mount
  const [state,   setState]     = useState<CursorState>('default')
  const [clicked, setClicked]   = useState(false)
  const [visible, setVisible]   = useState(false)
  const [label,   setLabel]     = useState<string | null>(null)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  /* Ring tracks with lag */
  const ringX = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.5 })
  const ringY = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.5 })

  /* Dot snaps quickly */
  const dotX = useSpring(rawX, { stiffness: 600, damping: 32, mass: 0.1 })
  const dotY = useSpring(rawY, { stiffness: 600, damping: 32, mass: 0.1 })

  /* RAF ref for throttling mousemove */
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
    setIsTouch(isTouchDevice())
  }, [])

  useEffect(() => {
    if (!mounted || isTouch) return

    /* Inject global cursor:none */
    const style = document.createElement('style')
    style.id = 'hide-cursor'
    style.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(style)

    /* Throttled mousemove via rAF */
    const onMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rawX.set(e.clientX)
        rawY.set(e.clientY)
        if (!visible) setVisible(true)
        rafRef.current = null
      })
    }

    const onLeave  = () => setVisible(false)
    const onEnter  = () => setVisible(true)
    const onDown   = () => setClicked(true)
    const onUp     = () => setClicked(false)

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)

    /* Bind hover/text states to interactive elements */
    const bindElements = () => {
      document.querySelectorAll<HTMLElement>(
        'a, button, .cursor-hover, [data-cursor]'
      ).forEach(el => {
        if (el.dataset.cursorBound) return
        const dCur  = el.dataset.cursor
        const dText = el.dataset.cursorLabel
        el.addEventListener('mouseenter', () => {
          setState(dCur === 'text' ? 'text' : 'hover')
          setLabel(dText ?? null)
        })
        el.addEventListener('mouseleave', () => {
          setState('default')
          setLabel(null)
        })
        el.dataset.cursorBound = '1'
      })

      document.querySelectorAll<HTMLElement>(
        'input, textarea, [contenteditable]'
      ).forEach(el => {
        if (el.dataset.cursorBound) return
        el.addEventListener('mouseenter', () => setState('text'))
        el.addEventListener('mouseleave', () => setState('default'))
        el.dataset.cursorBound = '1'
      })
    }

    bindElements()

    const observer = new MutationObserver(bindElements)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      observer.disconnect()
      document.getElementById('hide-cursor')?.remove()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [mounted, isTouch])   // eslint-disable-line react-hooks/exhaustive-deps

  /* Don't render anything on touch devices or before mount */
  if (!mounted || isTouch) return null

  const isDark  = theme === 'dark'
  const isHover = state === 'hover'
  const isText  = state === 'text'

  const ringBorderColor = isHover
    ? 'rgba(255,107,107,0.8)'
    : isText
    ? 'rgba(0,0,0,0)'
    : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'

  const ringBgColor = isHover
    ? (isDark ? 'rgba(255,107,107,0.08)' : 'rgba(255,107,107,0.12)')
    : 'rgba(0,0,0,0)'

  const dotColor = isHover
    ? 'rgba(255,107,107,1)'
    : isText
    ? (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)')
    : (isDark ? 'rgba(255,255,255,1)'   : 'rgba(17,17,17,1)')

  const rippleBorderColor = isDark ? 'rgba(78,205,196,0.5)' : 'rgba(14,165,233,0.5)'
  const labelColor        = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
  const ringSize          = clicked ? 28 : isHover ? 48 : isText ? 4 : 36

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ width: ringSize, height: ringSize, x: -ringSize / 2, y: -ringSize / 2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor:     isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            animate={{
              borderColor:     ringBorderColor,
              backgroundColor: ringBgColor,
              rotate:          isHover ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Dashed orbit ring on hover */}
          <AnimatePresence>
            {isHover && (
              <motion.div
                className="absolute inset-[-3px] rounded-full border border-dashed"
                style={{ borderColor: 'rgba(255,107,107,0.4)' }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  rotate:  { duration: 4, repeat: Infinity, ease: 'linear' },
                  opacity: { duration: 0.2 },
                }}
              />
            )}
          </AnimatePresence>

          {/* Data-cursor-label tooltip */}
          <AnimatePresence>
            {label && (
              <motion.span
                className="absolute text-[10px] font-mono whitespace-nowrap"
                style={{ top: -20, color: labelColor }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <motion.div
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,1)' : 'rgba(17,17,17,1)' }}
          animate={{
            width:           isText ? 2    : clicked ? 3    : isHover ? 5    : 6,
            height:          isText ? 20   : clicked ? 3    : isHover ? 5    : 6,
            x:               isText ? -1   : clicked ? -1.5 : isHover ? -2.5 : -3,
            y:               isText ? -10  : clicked ? -1.5 : isHover ? -2.5 : -3,
            backgroundColor: dotColor,
            borderRadius:    isText ? '2px' : '50%',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      </motion.div>

      {/* Click ripple */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            key="ripple"
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
            style={{ x: dotX, y: dotY, borderColor: rippleBorderColor }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.8 }}
            animate={{ width: 60, height: 60, x: -30, y: -30, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}