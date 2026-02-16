'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    year: '2023 - Present',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovations Inc.',
    description:
      'Leading the development of cutting-edge 3D web applications using Three.js and React. Mentoring junior developers and establishing best practices.',
    achievements: [
      'Increased user engagement by 150%',
      'Reduced load times by 40%',
      'Led a team of 5 developers',
    ],
    color: '#ff6b6b',
  },
  {
    year: '2021 - 2023',
    title: 'Full Stack Developer',
    company: 'Digital Creative Agency',
    description:
      'Developed responsive web applications with focus on performance and user experience. Implemented 3D visualizations for client projects.',
    achievements: [
      'Delivered 20+ client projects',
      'Implemented CI/CD pipeline',
      'Improved code quality by 60%',
    ],
    color: '#4ecdc4',
  },
  {
    year: '2019 - 2021',
    title: 'Frontend Developer',
    company: 'StartUp Ventures',
    description:
      'Built modern web interfaces using React and Next.js. Collaborated with designers to create pixel-perfect implementations.',
    achievements: [
      'Reduced bounce rate by 35%',
      'Optimized mobile performance',
      'Implemented design system',
    ],
    color: '#a855f7',
  },
  {
    year: '2018 - 2019',
    title: 'Junior Developer',
    company: 'Web Solutions Ltd.',
    description:
      'Started career building responsive websites and learning modern web development practices. Gained experience in multiple technologies.',
    achievements: [
      'Completed 15+ projects',
      'Learned React and Node.js',
      'Contributed to open source',
    ],
    color: '#ffd93d',
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !timelineRef.current) return

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    })

    timeline.from('.timeline-line', {
      height: 0,
      duration: 1,
    })

    gsap.from('.experience-card', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-primary overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-blue rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl md:text-6xl font-heading font-bold text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work <span className="gradient-text">Experience</span>
        </motion.h2>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent-blue to-accent-purple timeline-line" />

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                className={`experience-card flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Year Badge */}
                <div className="relative flex-shrink-0">
                  <div
                    className="absolute left-8 md:left-1/2 top-6 w-6 h-6 rounded-full transform -translate-x-1/2 border-4 border-primary z-10"
                    style={{ backgroundColor: exp.color }}
                  />
                </div>

                {/* Content */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'
                  }`}
                >
                  <motion.div
                    className="glass rounded-2xl p-8 hover:bg-white/10 transition-all cursor-hover group"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <motion.div
                      className="inline-block px-4 py-2 rounded-full mb-4"
                      style={{ backgroundColor: `${exp.color}20` }}
                    >
                      <span className="font-bold" style={{ color: exp.color }}>
                        {exp.year}
                      </span>
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
                      {exp.title}
                    </h3>

                    <h4 className="text-lg text-accent-blue mb-4">{exp.company}</h4>

                    <p className="text-white/70 mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    <div className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: exp.color }}
                          />
                          <span className="text-white/60 text-sm">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Hover Effect Line */}
                    <div
                      className="h-1 w-0 group-hover:w-full transition-all duration-500 mt-6 rounded-full"
                      style={{ backgroundColor: exp.color }}
                    />
                  </motion.div>
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Download CV Button */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-accent via-accent-blue to-accent-purple text-white rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition-shadow cursor-hover"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Full CV
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
