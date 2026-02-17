'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const loaderRef   = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const percentRef  = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.to(progressRef.current, {
      width: '100%',
      duration: 1.8,          // was 2.5 — shaved 700ms
      ease: 'power2.inOut',
      onUpdate() {
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(this.progress() * 100)}%`
        }
      },
    })
    .to(loaderRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
    .set(loaderRef.current, { display: 'none' })

    return () => { tl.kill() }
  }, [])

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[10000] bg-primary flex items-center justify-center">
      <div className="text-center px-8">
        <motion.h1
          className="text-5xl md:text-7xl font-heading font-bold gradient-text mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.h1>
        <div className="w-56 md:w-80 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
            <div ref={progressRef} className="h-full bg-gradient-to-r from-accent via-accent-blue to-accent-purple w-0 rounded-full" />
          </div>
          <span ref={percentRef} className="text-white/40 font-mono text-xs">0%</span>
        </div>
        <motion.div className="mt-8 flex gap-2 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 bg-accent rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
