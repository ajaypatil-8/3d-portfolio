'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import InteractiveModelViewer from '@/components/3d/InteractiveModelViewer'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  { name: 'Java & Spring Boot', level: 78 },
  { name: 'REST API Design',    level: 80 },
  { name: 'React & Next.js',    level: 72 },
  { name: 'Docker & Cloud',     level: 65 },
  { name: 'MySQL & PostgreSQL', level: 75 },
]

const badges = [
  { label: 'BCA 3rd Year',        icon: '🎓' },
  { label: 'Shivaji University',  icon: '🏛️' },
  { label: 'Palus, Sangli',       icon: '📍' },
  { label: 'Fresher',             icon: '🚀' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.from('.skill-bar', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      width: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out',
    })
  }, [])

  return (
    <section id="about" ref={sectionRef}
      className="relative min-h-screen py-24 bg-gradient-to-b from-primary to-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* 3D laptop model */}
          <motion.div className="h-[460px] relative rounded-2xl overflow-hidden glass"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            <Canvas
              dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
              frameloop="always"
              gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
            >
              <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={50} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <InteractiveModelViewer scale={1.1} />
            </Canvas>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="glass rounded-xl px-4 py-2.5">
                <div className="text-lg font-bold gradient-text">BCA 3rd Year</div>
                <div className="text-xs text-white/50">Arts, Commerce & Science College</div>
              </div>
              <div className="glass rounded-xl px-4 py-2.5 text-right">
                <div className="text-lg font-bold gradient-text">2 Projects</div>
                <div className="text-xs text-white/50">Shipped & In Progress</div>
              </div>
            </div>
            <div className="absolute top-4 right-4 glass rounded-full px-3 py-1">
              <span className="text-white/40 text-xs">Drag to rotate</span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>

            <p className="text-accent text-sm font-mono tracking-widest uppercase mb-4">Who I am</p>

            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>

            <p className="text-white/60 mb-4 leading-relaxed">
              Hi, I'm <span className="text-white font-semibold">Ajay Patil</span> — a passionate
              Full Stack Developer and BCA student from Palus, Sangli, Maharashtra. I specialise in
              building scalable backend systems with <span className="text-accent">Java & Spring Boot</span> and
              crafting modern frontends with <span className="text-accent-blue">React & Next.js</span>.
            </p>
            <p className="text-white/60 mb-8 leading-relaxed">
              Even as a fresher, I've built production-grade projects like CrowdSpark-X — a
              full-stack crowdfunding platform — and I'm currently rebuilding it with microservices,
              Docker, Kafka and cloud deployment. I learn fast and build things that actually work.
            </p>

            {/* Info badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((b) => (
                <div key={b.label} className="glass px-4 py-2 rounded-full flex items-center gap-2">
                  <span>{b.icon}</span>
                  <span className="text-white/70 text-sm">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Skill bars */}
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white text-sm font-medium">{skill.name}</span>
                    <span className="text-accent text-sm">{skill.level}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="skill-bar h-full bg-gradient-to-r from-accent via-accent-blue to-accent-purple rounded-full"
                      style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <motion.a
              href="mailto:aj9411979585@gmail.com"
              className="mt-10 inline-block px-7 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent/80 transition-colors cursor-hover"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Hire Me
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
