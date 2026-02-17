'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import InteractiveModelViewer from '@/components/3d/InteractiveModelViewer'

const badges = [
  { label: 'BCA 3rd Year',       icon: '🎓' },
  { label: 'Shivaji University', icon: '🏛️' },
  { label: 'Palus, Sangli',      icon: '📍' },
  { label: 'Fresher',            icon: '🚀' },
]

// ── Strengths — no fake numbers, honest labels ──────────────────
const strengths = [
  {
    icon: '☕',
    title: 'Java & Spring Boot',
    tag: 'Core Strength',
    tagColor: '#4ade80',
    tagBg: 'rgba(74,222,128,0.12)',
    desc: 'Deep understanding of Spring ecosystem — Boot, Security, Data JPA, Hibernate. Built real APIs with JWT auth, role-based access, and complex DB relationships.',
  },
  {
    icon: '🔐',
    title: 'Spring Security & JPA',
    tag: 'Core Strength',
    tagColor: '#4ade80',
    tagBg: 'rgba(74,222,128,0.12)',
    desc: 'Implemented JWT-based auth, role-based authorization, and session management. Proficient with Hibernate ORM, entity mapping, and database queries via Spring Data JPA.',
  },
  {
    icon: '🌐',
    title: 'React & Next.js',
    tag: 'Comfortable',
    tagColor: '#fbbf24',
    tagBg: 'rgba(251,191,36,0.10)',
    desc: 'Building modern UIs with React and Next.js — REST API integration, component design, Tailwind CSS styling and responsive layouts.',
  },
  {
    icon: '🐳',
    title: 'Docker & Cloud',
    tag: 'Growing',
    tagColor: '#94a3b8',
    tagBg: 'rgba(148,163,184,0.09)',
    desc: 'Containerising Spring Boot apps with Docker. Learning Kubernetes, AWS, and cloud deployment as part of the CrowdSpark-X microservices project.',
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ backgroundColor: '#0f0f0f' }}
    >
      {/* CSS blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-[150px]"
          style={{ backgroundColor: 'rgba(78,205,196,0.05)' }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-[150px]"
          style={{ backgroundColor: 'rgba(255,107,107,0.05)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: 3D model ── */}
          <motion.div
            className="h-[480px] relative rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Canvas
              dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
              frameloop="always"
              gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
            >
              <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={50} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <InteractiveModelViewer scale={1.1} />
            </Canvas>

            {/* Overlay labels */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="rounded-xl px-4 py-2.5"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-base font-bold" style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>BCA 3rd Year</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Arts, Commerce &amp; Science College
                </div>
              </div>
              <div className="rounded-xl px-4 py-2.5 text-right"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-base font-bold" style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>2 Projects</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Shipped &amp; In Progress</div>
              </div>
            </div>
            <div className="absolute top-4 right-4 rounded-full px-3 py-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Drag to rotate</span>
            </div>
          </motion.div>

          {/* ── Right: text + strengths ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: '#4ecdc4' }}>
              Who I am
            </p>

            <h2 className="font-heading font-bold mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#ffffff' }}>
              About{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Me</span>
            </h2>

            <p className="leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              Hi, I'm{' '}
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Ajay Patil</span>
              {' '}— a Java &amp; Spring Boot developer and BCA student from Palus, Sangli, Maharashtra.
              My strength is backend engineering — building secure, scalable REST APIs with
              Spring Boot, Spring Security, JPA and Hibernate.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              I've built CrowdSpark-X — a full-stack crowdfunding platform — and I'm currently
              rebuilding it as a microservices architecture with Spring Boot, Kafka, Docker and
              Next.js. I'm not just studying — I'm shipping real code.
            </p>

            {/* Info badges */}
            <div className="flex flex-wrap gap-2.5 mb-10">
              {badges.map((b) => (
                <div key={b.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                  }}>
                  <span>{b.icon}</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Strength cards — no percentages */}
            <div className="space-y-3 mb-10">
              {strengths.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="rounded-xl p-4 flex gap-4"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(8px)',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ borderColor: 'rgba(255,255,255,0.15)', transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl flex-shrink-0 mt-0.5">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: '#ffffff' }}>{s.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{ backgroundColor: s.tagBg, color: s.tagColor }}>
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="mailto:aj9411979585@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-sm cursor-hover"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)', boxShadow: '0 0 24px rgba(255,107,107,0.3)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Hire Me →
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}