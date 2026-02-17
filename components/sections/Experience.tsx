'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const education = [
  {
    year: '2023 – Present',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'Arts, Commerce & Science College, Palus',
    sub: 'Shivaji University, Kolhapur',
    description:
      'Currently in 3rd year, studying Data Structures, DBMS, Operating Systems, Web Technologies and Software Engineering. Complementing academics with real-world full-stack projects in Java & Spring Boot.',
    tags: ['3rd Year', 'BCA', 'Shivaji University'],
    color: '#4ecdc4',
    icon: '🎓',
  },
  {
    year: '2020 – 2023',
    title: 'Higher Secondary (12th) — Science',
    org: 'Palus, Sangli, Maharashtra',
    sub: 'Maharashtra State Board',
    description:
      'Completed HSC with focus on Science stream. Discovered passion for programming and started self-learning web development alongside academics.',
    tags: ['HSC', 'Science', 'Maharashtra Board'],
    color: '#a855f7',
    icon: '📚',
  },
]

const selfLearning = [
  {
    year: '2024 – Present',
    title: 'Spring Boot & Microservices',
    org: 'Self-Learning & Projects',
    description:
      'Mastering Spring Boot, Spring Security, Spring Data JPA, REST API design and microservices architecture. Built CrowdSpark-X Advanced as a hands-on production project.',
    tags: ['Spring Boot', 'Microservices', 'Docker', 'Kafka'],
    color: '#ff6b6b',
    icon: '⚙️',
  },
  {
    year: '2024',
    title: 'Full Stack Development with PHP',
    org: 'Self-Built Project',
    description:
      'Built CrowdSpark-X — a complete full-stack crowdfunding platform using PHP, MySQL, Cloudinary and PHPMailer. Handled everything from DB design to SMTP email integration.',
    tags: ['PHP', 'MySQL', 'Cloudinary', 'SMTP'],
    color: '#ffd93d',
    icon: '🏆',
  },
  {
    year: '2023 – 2024',
    title: 'React & Next.js Frontend',
    org: 'Self-Learning',
    description:
      'Learned React.js and Next.js to build the frontend for CrowdSpark-X Advanced. Comfortable with TypeScript, Tailwind CSS, REST API integration and component-based architecture.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    color: '#4ecdc4',
    icon: '🎨',
  },
  {
    year: '2024',
    title: 'Docker & Cloud Basics',
    org: 'Self-Learning',
    description:
      'Learned Docker containerisation, Kubernetes basics, and cloud fundamentals on AWS and Azure. Actively containerising the CrowdSpark-X microservices for deployment.',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
    color: '#a855f7',
    icon: '🐳',
  },
]

function TimelineCard({
  item, index, side
}: {
  item: typeof selfLearning[0]
  index: number
  side: 'left' | 'right'
}) {
  return (
    <motion.div
      className={`flex items-start gap-6 ${side === 'right' ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Content */}
      <div className="flex-1">
        <div className={`glass rounded-2xl p-6 group hover:bg-white/10 transition-all ${side === 'right' ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-3 mb-3 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono"
              style={{ backgroundColor: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
              {item.year}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">
            {item.title}
          </h3>
          <p className="text-sm font-medium mb-1" style={{ color: item.color }}>{item.org}</p>
          {'sub' in item && <p className="text-xs text-white/40 mb-3">{(item as any).sub}</p>}
          <p className="text-white/55 text-sm leading-relaxed mb-4">{item.description}</p>
          <div className={`flex flex-wrap gap-2 ${side === 'right' ? 'justify-end' : ''}`}>
            {item.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-white/50 bg-white/5 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 mt-4 rounded-full"
            style={{ backgroundColor: item.color }} />
        </div>
      </div>

      {/* Timeline dot */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0 pt-6">
        <div className="w-4 h-4 rounded-full border-4 border-primary"
          style={{ backgroundColor: item.color }} />
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.from('.exp-card', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
    })
  }, [])

  return (
    <section id="experience" ref={sectionRef}
      className="relative min-h-screen py-24 bg-primary overflow-hidden">

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-blue rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-accent text-sm font-mono tracking-widest uppercase mb-4">Background</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold">
            Education & <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-white/40 mt-4 text-sm">
            Fresher — but self-driven, project-focused, and actively building production-level skills.
          </p>
        </motion.div>

        {/* Education */}
        <div className="mb-14">
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-6 text-center">📚 Education</p>
          <div className="space-y-5">
            {education.map((item, i) => (
              <motion.div key={i} className="exp-card glass rounded-2xl p-6 group hover:bg-white/10 transition-all"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <span className="px-3 py-0.5 rounded-full text-xs font-mono"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                        {item.year}
                      </span>
                    </div>
                    <p className="font-medium text-sm mb-0.5" style={{ color: item.color }}>{item.org}</p>
                    <p className="text-white/40 text-xs mb-3">{item.sub}</p>
                    <p className="text-white/55 text-sm leading-relaxed mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-white/50 bg-white/5 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Self-learning timeline */}
        <div>
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-8 text-center">
            🚀 Self-Learning & Projects Timeline
          </p>

          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent-blue to-accent-purple hidden md:block" />

            <div className="space-y-8">
              {selfLearning.map((item, i) => (
                <TimelineCard key={i} item={item} index={i} side={i % 2 === 0 ? 'left' : 'right'} />
              ))}
            </div>
          </div>
        </div>

        {/* Hire me CTA */}
        <motion.div className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="glass rounded-2xl p-8 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-semibold text-sm">Open to Jobs & Internships</span>
            </div>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              I'm a fresher with real project experience in Java, Spring Boot, React, Docker and cloud.
              Looking for an opportunity to grow in a professional team environment.
            </p>
            <motion.a href="mailto:aj9411979585@gmail.com"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-accent via-accent-blue to-accent-purple text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-accent/30 transition-shadow cursor-hover"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Get In Touch — aj9411979585@gmail.com
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
