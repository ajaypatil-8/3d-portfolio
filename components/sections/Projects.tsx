'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: '3D Product Configurator',
    description: 'Interactive 3D product customization with real-time rendering',
    tech: ['Three.js', 'React', 'WebGL'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    color: '#ff6b6b',
  },
  {
    id: 2,
    title: 'Immersive Portfolio',
    description: 'Award-winning portfolio with stunning 3D interactions',
    tech: ['Next.js', 'Framer Motion', 'GSAP'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
    color: '#4ecdc4',
  },
  {
    id: 3,
    title: 'Virtual Exhibition',
    description: 'Virtual art gallery with interactive 3D environment',
    tech: ['Three.js', 'React Three Fiber', 'Blender'],
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&h=600&fit=crop',
    color: '#a855f7',
  },
  {
    id: 4,
    title: 'E-commerce Platform',
    description: 'Modern e-commerce with 3D product previews',
    tech: ['Next.js', 'TypeScript', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=800&h=600&fit=crop',
    color: '#ffd93d',
  },
  {
    id: 5,
    title: 'Data Visualization Dashboard',
    description: '3D data visualization with interactive charts',
    tech: ['D3.js', 'Three.js', 'React'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    color: '#6bcf7f',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return

    gsap.from('.project-title', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-secondary overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="project-title text-4xl md:text-6xl font-heading font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured <span className="gradient-text">Projects</span>
        </motion.h2>

        {/* Swiper Carousel */}
        <div className="mb-12">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="project-swiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {projects.map((project, index) => (
              <SwiperSlide key={project.id} className="!w-[300px] md:!w-[400px]">
                <motion.div
                  className="relative group cursor-hover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                    {/* Project Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"
                      style={{
                        background: `linear-gradient(to top, ${project.color}dd, transparent)`,
                      }}
                    />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                      <p className="text-white/80 mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <motion.button
                        className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Project
                      </motion.button>
                    </div>
                  </div>

                  {/* 3D Card Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Project Counter */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 glass rounded-full px-6 py-3">
            <span className="text-accent font-bold text-2xl">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/50">/</span>
            <span className="text-white/50 text-2xl">
              {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* View All Projects Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-4 border-2 border-accent text-accent rounded-full text-lg font-semibold hover:bg-accent hover:text-white transition-colors cursor-hover"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>

      <style jsx global>{`
        .project-swiper {
          padding: 50px 0;
        }

        .project-swiper .swiper-slide {
          transition: all 0.3s;
        }

        .project-swiper .swiper-pagination-bullet {
          background: #ff6b6b;
        }

        .project-swiper .swiper-button-next,
        .project-swiper .swiper-button-prev {
          color: #ff6b6b;
        }
      `}</style>
    </section>
  )
}
