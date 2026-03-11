'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const loaderRef   = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const percentRef  = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    /*
      On mobile, the 3-D scene takes a bit less time — use a shorter duration
      so users don't sit at a blank screen. On desktop keep 1.8 s.
    */
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const duration = isMobile ? 1.2 : 1.8

    const tl = gsap.timeline()

    tl.to(progressRef.current, {
      width: '100%',
      duration,
      ease: 'power2.inOut',
      onUpdate() {
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(this.progress() * 100)}%`
        }
      },
    })
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
    })
    .set(loaderRef.current, { display: 'none' })

    return () => { tl.kill() }
  }, [])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="text-center px-8">

        {/* Title */}
        <motion.h1
          className="font-heading font-bold gradient-text mb-8"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Portfolio
        </motion.h1>

        {/* Progress bar */}
        <div className="w-48 sm:w-72 md:w-80 mx-auto">
          <div
            className="h-[2px] rounded-full overflow-hidden mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div
              ref={progressRef}
              className="h-full w-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #a855f7)',
              }}
            />
          </div>
          <span
            ref={percentRef}
            className="font-mono text-xs"
            style={{ color: 'var(--text-faint)' }}
          >
            0%
          </span>
        </div>

        {/* Bouncing dots */}
        <motion.div
          className="mt-8 flex gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#4ecdc4' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}