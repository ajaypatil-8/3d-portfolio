'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Float, Text3D, Center } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import AnimatedTorus from '@/components/3d/AnimatedTorus'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
    ],
    color: '#ff6b6b',
  },
  {
    title: '3D & Animation',
    skills: [
      { name: 'Three.js', level: 90 },
      { name: 'Framer Motion', level: 88 },
      { name: 'GSAP', level: 85 },
      { name: 'Blender', level: 75 },
    ],
    color: '#4ecdc4',
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 82 },
      { name: 'MongoDB', level: 80 },
      { name: 'PostgreSQL', level: 78 },
    ],
    color: '#a855f7',
  },
]

const tools = [
  'Figma',
  'VS Code',
  'Git',
  'Docker',
  'Webpack',
  'Vite',
  'Photoshop',
  'After Effects',
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.from('.skill-category', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    })

    gsap.from('.tool-badge', {
      scrollTrigger: {
        trigger: '.tools-container',
        start: 'top center',
      },
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    })
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-gradient-to-b from-secondary to-primary overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate />

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
            <AnimatedTorus />
          </Float>
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl md:text-6xl font-heading font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Skills & <span className="gradient-text">Expertise</span>
        </motion.h2>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="skill-category glass rounded-2xl p-8 hover:bg-white/10 transition-colors cursor-hover"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>

              <h3 className="text-2xl font-bold mb-6" style={{ color: category.color }}>
                {category.title}
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-white/50">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: category.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tools & Technologies */}
        <motion.div
          className="tools-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center mb-8">
            Tools & <span className="gradient-text">Technologies</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool}
                className="tool-badge glass px-6 py-3 rounded-full cursor-hover"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 107, 107, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-medium">{tool}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 glass rounded-full px-8 py-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold">Certified Developer</div>
              <div className="text-white/50 text-sm">Multiple certifications in web development</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
