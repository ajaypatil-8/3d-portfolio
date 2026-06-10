'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/components/providers/ThemeProvider'

type CursorState = 'default' | 'hover' | 'text'

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
  const [mounted, setMounted] = useState(false)
  const [isTouch, setIsTouch] = useState(true)
  const [state,   setState]   = useState<CursorState>('default')
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)
  const [label,   setLabel]   = useState<string | null>(null)

  /* ── Direct DOM refs for position — no React state, no re-renders ── */
  const ringRef  = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLDivElement>(null)

  /* ── Position buffers — plain objects, never trigger React renders ──
     BEFORE: useMotionValue × 2 + useSpring × 4 = 6 Framer Motion hooks,
             each running their own RAF spring solver on every mouse move.
     AFTER : one lerp loop, two multiplications per frame, zero hooks.     */
  const mousePos = useRef({ x: -200, y: -200 })
  const ringPos  = useRef({ x: -200, y: -200 })
  const dotPos   = useRef({ x: -200, y: -200 })
  const clickPos = useRef({ x: 0,    y: 0    }) // captures position at click time
  const animRef  = useRef<number | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
    setIsTouch(isTouchDevice())
  }, [])

  /* ── Single lerp RAF loop ─────────────────────────────────────────────────
     ring lerp 0.14  ≈ stiffness 120, damping 24  (same feel, near-zero CPU)
     dot  lerp 0.55  ≈ stiffness 600, damping 32  (snappy follow)
     Writes directly to style.transform — zero React reconciler involvement. */
  useEffect(() => {
    if (!mounted || isTouch) return

    const tick = () => {
      const mx = mousePos.current.x, my = mousePos.current.y

      ringPos.current.x += (mx - ringPos.current.x) * 0.14
      ringPos.current.y += (my - ringPos.current.y) * 0.14
      dotPos.current.x  += (mx - dotPos.current.x)  * 0.55
      dotPos.current.y  += (my - dotPos.current.y)  * 0.55

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px,${ringPos.current.y}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px,${dotPos.current.y}px)`
      }

      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [mounted, isTouch])

  /* ── Event listeners ── */
  useEffect(() => {
    if (!mounted || isTouch) return

    const style = document.createElement('style')
    style.id = 'hide-cursor'
    style.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(style)

    /* onMove just stores coords — the RAF loop reads them each frame */
    const onMove  = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      if (!visible) setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown  = () => {
      clickPos.current = { ...dotPos.current }  // snapshot position at click time
      setClicked(true)
    }
    const onUp    = () => setClicked(false)

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)

    const bindElements = () => {
      document.querySelectorAll<HTMLElement>('a, button, .cursor-hover, [data-cursor]').forEach(el => {
        if (el.dataset.cursorBound) return
        const dCur  = el.dataset.cursor
        const dText = el.dataset.cursorLabel
        el.addEventListener('mouseenter', () => {
          setState(dCur === 'text' ? 'text' : 'hover')
          setLabel(dText ?? null)
        })
        el.addEventListener('mouseleave', () => { setState('default'); setLabel(null) })
        el.dataset.cursorBound = '1'
      })
      document.querySelectorAll<HTMLElement>('input, textarea, [contenteditable]').forEach(el => {
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
    }
  }, [mounted, isTouch]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || isTouch) return null

  const isDark  = theme === 'dark'
  const isHover = state === 'hover'
  const isText  = state === 'text'

  const ringSize          = clicked ? 28 : isHover ? 48 : isText ? 4 : 36
  const ringBorderColor   = isHover  ? 'rgba(255,107,107,0.8)'
                          : isText   ? 'rgba(0,0,0,0)'
                          : isDark   ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'
  const ringBgColor       = isHover  ? (isDark ? 'rgba(255,107,107,0.08)' : 'rgba(255,107,107,0.12)')
                          : 'rgba(0,0,0,0)'
  const dotColor          = isHover  ? 'rgba(255,107,107,1)'
                          : isText   ? (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)')
                          :             (isDark ? 'rgba(255,255,255,1)'  : 'rgba(17,17,17,1)')
  const rippleBorderColor = isDark   ? 'rgba(78,205,196,0.5)' : 'rgba(14,165,233,0.5)'
  const labelColor        = isDark   ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'

  return (
    <>
      {/* Dashed orbit ring — pure CSS animation, runs on compositor thread */}
      <style>{`
        @keyframes _cursor-spin { to { transform: rotate(360deg); } }
        ._cursor-dashed {
          position:absolute; inset:-3px; border-radius:50%;
          border:1px dashed rgba(255,107,107,0.4);
          animation:_cursor-spin 4s linear infinite;
        }
      `}</style>

      {/* ── Ring — wrapper positioned by lerp RAF, child animated by Framer ──
           Only the SIZE + COLOUR change triggers Framer (on hover/click),
           not the position — so the spring solver fires infrequently.        */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  'translate(-200px,-200px)',
          willChange: 'transform',
          transition: 'opacity 0.2s',
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ width: ringSize, height: ringSize, x: -ringSize / 2, y: -ringSize / 2 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)' }}
            animate={{ borderColor: ringBorderColor, backgroundColor: ringBgColor, rotate: isHover ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* Dashed ring: CSS animation instead of Framer repeat:Infinity */}
          {isHover && <div className="_cursor-dashed" />}
          <AnimatePresence>
            {label && (
              <motion.span
                className="absolute text-[10px] font-mono whitespace-nowrap"
                style={{ top: -20, color: labelColor }}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              >{label}</motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Dot — wrapper positioned by lerp RAF ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  'translate(-200px,-200px)',
          willChange: 'transform',
          transition: 'opacity 0.2s',
        }}
      >
        <motion.div
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,1)' : 'rgba(17,17,17,1)' }}
          animate={{
            width:           isText ? 2   : clicked ? 3   : isHover ? 5   : 6,
            height:          isText ? 20  : clicked ? 3   : isHover ? 5   : 6,
            x:               isText ? -1  : clicked ? -1.5: isHover ? -2.5: -3,
            y:               isText ? -10 : clicked ? -1.5: isHover ? -2.5: -3,
            backgroundColor: dotColor,
            borderRadius:    isText ? '2px' : '50%',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      </div>

      {/* ── Click ripple — anchored to click position, not chasing cursor ── */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            key="ripple"
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
            style={{
              borderColor: rippleBorderColor,
              left: clickPos.current.x,
              top:  clickPos.current.y,
            }}
            initial={{ width: 0,  height: 0,  x: 0,   y: 0,   opacity: 0.8 }}
            animate={{ width: 60, height: 60, x: -30, y: -30, opacity: 0   }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}