'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'

// Lazy-load every heavy section so they don't all parse+render at once
const Hero       = dynamic(() => import('@/components/sections/Hero'),       { ssr: false })
const About      = dynamic(() => import('@/components/sections/About'),      { ssr: false })
const Projects   = dynamic(() => import('@/components/sections/Projects'),   { ssr: false })
const Skills     = dynamic(() => import('@/components/sections/Skills'),     { ssr: false })
const Experience = dynamic(() => import('@/components/sections/Experience'), { ssr: false })
const Contact    = dynamic(() => import('@/components/sections/Contact'),    { ssr: false })
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'),   { ssr: false })

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 2.4s matches the new faster loading screen
    const t = setTimeout(() => setLoading(false), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {loading && <LoadingScreen />}
      <CustomCursor />
      <main className="relative">
        <Navigation />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
