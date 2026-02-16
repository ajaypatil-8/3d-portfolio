'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import AnimatedSphere from '@/components/3d/AnimatedSphere'
import Particles from '@/components/3d/Particles'
import FloatingCube from '@/components/3d/FloatingCube'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.5 })

    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }).from(
      subtitleRef.current,
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
    )
  }, [])

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-primary"
    >
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ecdc4" />
          <pointLight position={[10, -10, -5]} intensity={0.5} color="#ff6b6b" />

          <AnimatedSphere />
          <Particles count={3000} />

          <FloatingCube position={[-3, 2, -2]} color="#ff6b6b" speed={0.5} />
          <FloatingCube position={[3, -2, -2]} color="#4ecdc4" speed={0.7} />
          <FloatingCube position={[2, 2, -3]} color="#a855f7" speed={0.6} />

          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }}
          >
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-8xl font-heading font-bold mb-6"
            >
              <span className="gradient-text">Creative Developer</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl md:text-3xl text-white/70 mb-12 max-w-3xl mx-auto"
            >
              Crafting immersive digital experiences with cutting-edge 3D
              technology
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-accent text-white rounded-full text-lg font-semibold hover:bg-accent/80 transition-colors cursor-hover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-colors cursor-hover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download CV
              </motion.button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-accent rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary pointer-events-none" />
    </section>
  )
}
