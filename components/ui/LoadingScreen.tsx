'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const percentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Animate progress bar
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: function () {
        if (percentRef.current) {
          const progress = Math.round(this.progress() * 100)
          percentRef.current.textContent = `${progress}%`
        }
      },
    })
      .to(loaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      })
      .set(loaderRef.current, { display: 'none' })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] bg-primary flex items-center justify-center"
    >
      <div className="text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-heading font-bold gradient-text mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Portfolio
        </motion.h1>

        <div className="w-64 md:w-96 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-accent via-accent-blue to-accent-purple w-0"
            />
          </div>
          <div
            ref={percentRef}
            className="text-white/50 font-mono text-sm"
          >
            0%
          </div>
        </div>

        <motion.div
          className="mt-12 flex gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-accent rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
