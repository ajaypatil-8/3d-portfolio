'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

type CursorState = 'default' | 'hover' | 'click' | 'text'

export default function CustomCursor() {
  const [state,   setState]   = useState<CursorState>('default')
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)
  const [label,   setLabel]   = useState<string | null>(null)

  // Raw mouse position
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Outer ring — slow, springy
  const ringX = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.5 })
  const ringY = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.5 })

  // Inner dot — snappy
  const dotX = useSpring(rawX, { stiffness: 600, damping: 32, mass: 0.1 })
  const dotY = useSpring(rawY, { stiffness: 600, damping: 32, mass: 0.1 })

  useEffect(() => {
    // Hide system cursor globally
    const style = document.createElement('style')
    style.id = 'hide-cursor'
    style.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(style)

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onLeave  = () => setVisible(false)
    const onEnter  = () => setVisible(true)

    const onDown   = () => { setClicked(true)  }
    const onUp     = () => { setClicked(false) }

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)

    // ── Tag interactive elements with data attributes ──────────────
    const update = () => {
      document.querySelectorAll<HTMLElement>('a, button, .cursor-hover, [data-cursor]').forEach(el => {
        const tag   = el.tagName.toLowerCase()
        const dCur  = el.dataset.cursor          // e.g. data-cursor="View"
        const dText = el.dataset.cursorLabel      // e.g. data-cursor-label="Open"

        const enter = () => {
          setState(dCur === 'text' ? 'text' : 'hover')
          setLabel(dText ?? null)
        }
        const leave = () => { setState('default'); setLabel(null) }

        // Avoid duplicate listeners
        if (!el.dataset.cursorBound) {
          el.addEventListener('mouseenter', enter)
          el.addEventListener('mouseleave', leave)
          el.dataset.cursorBound = '1'
        }
      })

      document.querySelectorAll<HTMLElement>('input, textarea, [contenteditable]').forEach(el => {
        if (!el.dataset.cursorBound) {
          el.addEventListener('mouseenter', () => setState('text'))
          el.addEventListener('mouseleave', () => setState('default'))
          el.dataset.cursorBound = '1'
        }
      })
    }

    update()

    // Re-run when DOM changes (dynamic content)
    const observer = new MutationObserver(update)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      observer.disconnect()
      document.getElementById('hide-cursor')?.remove()
    }
  }, [rawX, rawY, visible])

  // ── Derived sizes ────────────────────────────────────────────────
  const isHover  = state === 'hover'
  const isText   = state === 'text'

  const ringSize    = clicked ? 28 : isHover ? 48 : isText ? 4 : 36
  const ringOpacity = visible ? 1 : 0

  return (
    <>
      {/* ── Outer ring ─────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: ringX, y: ringY, opacity: ringOpacity }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            width:  ringSize,
            height: ringSize,
            x:      -ringSize / 2,
            y:      -ringSize / 2,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {/* Ring border */}
          <motion.div
            className="absolute inset-0 rounded-full border"
            animate={{
              borderColor: isHover
                ? 'rgba(255,107,107,0.8)'
                : isText
                ? 'rgba(255,255,255,0)'
                : 'rgba(255,255,255,0.5)',
              backgroundColor: isHover
                ? 'rgba(255,107,107,0.08)'
                : 'transparent',
              rotate: isHover ? 180 : 0,
            }}
            transition={{ duration: 0.35 }}
          />

          {/* Rotating dashes on hover */}
          <AnimatePresence>
            {isHover && (
              <motion.div
                className="absolute inset-[-3px] rounded-full border border-dashed border-accent/40"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.2 } }}
              />
            )}
          </AnimatePresence>

          {/* Label on hover */}
          <AnimatePresence>
            {label && (
              <motion.span
                className="absolute text-[10px] font-mono text-white/80 whitespace-nowrap"
                style={{ top: -20 }}
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

      {/* ── Inner dot ──────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width:  isText ? 2 : clicked ? 3 : isHover ? 5 : 6,
            height: isText ? 20 : clicked ? 3 : isHover ? 5 : 6,
            x:      isText ? -1 : clicked ? -1.5 : isHover ? -2.5 : -3,
            y:      isText ? -10 : clicked ? -1.5 : isHover ? -2.5 : -3,
            backgroundColor: isHover
              ? '#ff6b6b'
              : isText
              ? 'rgba(255,255,255,0.9)'
              : '#ffffff',
            borderRadius: isText ? '2px' : '50%',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      </motion.div>

      {/* ── Click ripple ───────────────────────────────────────── */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            key="ripple"
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-accent/50"
            style={{ x: dotX, y: dotY }}
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