'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import AnimatedSphere from '@/components/3d/AnimatedSphere'
import Particles from '@/components/3d/Particles'
import FloatingCube from '@/components/3d/FloatingCube'

export default function Hero() {
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const btnRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.timeline({ delay: 2.6 })
      .from(titleRef.current,    { y: 70, opacity: 0, duration: 0.9, ease: 'power3.out' })
      .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .from(btnRef.current,      { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
  }, [])

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-primary">

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
          frameloop="always"
          gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, alpha: false }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={58} />
          <OrbitControls
            enableZoom={false} enablePan={false}
            autoRotate autoRotateSpeed={0.35}
            enableDamping dampingFactor={0.04}
            minPolarAngle={Math.PI * 0.3} maxPolarAngle={Math.PI * 0.7}
          />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 3]} intensity={0.6} />
          <AnimatedSphere />
          <Particles />
          <FloatingCube position={[-3.2,  1.4, -1.5]} color="#ff6b6b" speed={0.45} />
          <FloatingCube position={[ 3.2, -1.4, -1.5]} color="#4ecdc4" speed={0.55} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center pointer-events-none">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.6 }}>

            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 pointer-events-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/70 text-sm font-mono">Open to Jobs & Internships</span>
            </motion.div>

            <h1 ref={titleRef} className="text-5xl sm:text-7xl md:text-8xl font-heading font-bold mb-4 leading-none">
              <span className="text-white">Ajay</span>{' '}
              <span className="gradient-text">Patil</span>
            </h1>

            <p ref={subtitleRef} className="text-lg sm:text-2xl text-white/60 mb-3 font-mono">
              Full Stack Developer
            </p>

            <p className="text-base text-white/40 mb-10 max-w-xl mx-auto">
              Java · Spring Boot · React · Next.js · Docker · Cloud
            </p>

            <div ref={btnRef} className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
              <motion.button
                className="px-8 py-4 bg-accent text-white rounded-full text-base font-semibold hover:bg-accent/80 transition-colors cursor-hover"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                View Projects
              </motion.button>
              <motion.button
                className="px-8 py-4 border border-white/20 text-white/80 rounded-full text-base font-semibold hover:bg-white/5 hover:border-white/40 transition-all cursor-hover"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Download CV
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary pointer-events-none" />
    </section>
  )
}
