'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import DNAHelix from '@/components/3d/DNAHelix'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  { name: 'React & Next.js', level: 95 },
  { name: 'Three.js & WebGL', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'Node.js', level: 85 },
  { name: 'UI/UX Design', level: 92 },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ref = useInView(sectionRef)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.from('.skill-bar', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
      },
      width: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-gradient-to-b from-primary to-secondary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D Model */}
          <motion.div
            className="h-[500px] relative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 8]} />
              <OrbitControls enableZoom={false} enablePan={false} />

              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, 0, -5]} color="#ff6b6b" intensity={0.5} />
              <pointLight position={[10, 0, -5]} color="#4ecdc4" intensity={0.5} />

              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <DNAHelix />
              </Float>
            </Canvas>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 glass rounded-lg p-4">
              <motion.div
                className="text-3xl font-bold gradient-text"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                5+ Years
              </motion.div>
              <div className="text-sm text-white/60">Experience</div>
            </div>

            <div className="absolute bottom-4 right-4 glass rounded-lg p-4">
              <motion.div
                className="text-3xl font-bold gradient-text"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                50+ Projects
              </motion.div>
              <div className="text-sm text-white/60">Completed</div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              ref={titleRef}
              className="text-4xl md:text-6xl font-heading font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              About <span className="gradient-text">Me</span>
            </motion.h2>

            <motion.p
              className="text-lg text-white/70 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              I'm a passionate creative developer specializing in building
              stunning 3D web experiences. With a strong foundation in modern
              web technologies and a keen eye for design, I transform ideas into
              interactive digital masterpieces.
            </motion.p>

            <motion.p
              className="text-lg text-white/70 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              My expertise lies in combining cutting-edge technologies like
              Three.js, React, and WebGL to create immersive experiences that
              push the boundaries of what's possible on the web.
            </motion.p>

            {/* Skills */}
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-semibold">{skill.name}</span>
                    <span className="text-accent">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="skill-bar h-full bg-gradient-to-r from-accent via-accent-blue to-accent-purple rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="mt-12 px-8 py-4 bg-accent text-white rounded-full text-lg font-semibold hover:bg-accent/80 transition-colors cursor-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
