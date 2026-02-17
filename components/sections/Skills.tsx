'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import GeometricBackground from '@/components/3d/GeometricBackground'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    title: 'Backend',
    icon: '⚙️',
    color: '#ff6b6b',
    skills: [
      { name: 'Java',             level: 80 },
      { name: 'Spring Boot',      level: 78 },
      { name: 'Spring Security',  level: 70 },
      { name: 'Spring Data JPA',  level: 75 },
      { name: 'Hibernate',        level: 72 },
      { name: 'REST APIs',        level: 82 },
      { name: 'Microservices',    level: 60 },
      { name: 'Maven / Gradle',   level: 74 },
    ],
  },
  {
    title: 'Frontend',
    icon: '🎨',
    color: '#4ecdc4',
    skills: [
      { name: 'React.js',          level: 72 },
      { name: 'Next.js',           level: 68 },
      { name: 'TypeScript',        level: 65 },
      { name: 'Tailwind CSS',      level: 75 },
      { name: 'HTML / CSS',        level: 82 },
      { name: 'Axios / Fetch',     level: 78 },
      { name: 'REST Integration',  level: 80 },
    ],
  },
  {
    title: 'Database & Cloud',
    icon: '🗄️',
    color: '#a855f7',
    skills: [
      { name: 'MySQL',        level: 78 },
      { name: 'PostgreSQL',   level: 72 },
      { name: 'MongoDB',      level: 65 },
      { name: 'Redis',        level: 55 },
      { name: 'Docker',       level: 68 },
      { name: 'Kubernetes',   level: 50 },
      { name: 'AWS',          level: 55 },
      { name: 'Azure',        level: 48 },
    ],
  },
]

const tools = [
  { name: 'IntelliJ IDEA', icon: '🧠' },
  { name: 'VS Code',        icon: '💻' },
  { name: 'GitHub',         icon: '🐙' },
  { name: 'Postman',        icon: '📮' },
  { name: 'Docker Desktop', icon: '🐳' },
  { name: 'XAMPP',          icon: '🛠️' },
  { name: 'Cloudinary',     icon: '☁️' },
  { name: 'Kafka',          icon: '📨' },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.from('.skill-cat', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      y: 50, opacity: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out',
    })
  }, [])

  return (
    <section id="skills" ref={sectionRef}
      className="relative min-h-screen py-24 bg-gradient-to-b from-secondary to-primary overflow-hidden">

      {/* 3D background — dpr=1, opacity low */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Canvas dpr={1} frameloop="always"
          gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={65} />
          <ambientLight intensity={1} />
          <GeometricBackground />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-accent text-sm font-mono tracking-widest uppercase mb-4">Tech Stack</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-white/40 mt-4 text-sm max-w-lg mx-auto">
            Focused on Java backend engineering with full-stack capabilities and cloud deployment.
          </p>
        </motion.div>

        {/* Skill categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {skillCategories.map((cat, ci) => (
            <motion.div key={cat.title}
              className="skill-cat glass rounded-2xl p-7"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-bold" style={{ color: cat.color }}>{cat.title}</h3>
              </div>
              <div className="space-y-3.5">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/80 text-xs font-medium">{skill.name}</span>
                      <span className="text-white/35 text-xs">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: ci * 0.1 + si * 0.06, ease: 'easeOut' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tools */}
        <motion.div className="text-center"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-5">Daily Tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool, i) => (
              <motion.div key={tool.name}
                className="glass px-4 py-2.5 rounded-full flex items-center gap-2 cursor-hover"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.08 }}>
                <span>{tool.icon}</span>
                <span className="text-white/70 text-sm font-medium">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fresher note */}
        <motion.div className="mt-12 text-center glass rounded-2xl p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-white/60 text-sm leading-relaxed">
            🎓 <span className="text-white font-semibold">Currently in 3rd year BCA</span> at Arts, Commerce & Science College, Palus
            (Shivaji University, Kolhapur). Actively learning advanced Spring Boot microservices,
            cloud deployment and system design to be production-ready.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
