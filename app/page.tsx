'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'

const Hero       = dynamic(() => import('@/components/sections/Hero'),            { ssr: false })
const Projects   = dynamic(() => import('@/components/sections/Projects'),        { ssr: false })
const Skills     = dynamic(() => import('@/components/sections/Skills'),          { ssr: false })
const GitHub     = dynamic(() => import('@/components/sections/GitHubContribution'), { ssr: false })
const About      = dynamic(() => import('@/components/sections/About'),           { ssr: false })
const Experience = dynamic(() => import('@/components/sections/Experience'),      { ssr: false })
const Contact    = dynamic(() => import('@/components/sections/Contact'),         { ssr: false })
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'),        { ssr: false })

const MIN_MS = 2200

export default function Home() {
  const [loading, setLoading] = useState(true)
  const timerDone  = useRef(false)
  const windowDone = useRef(false)

  function tryDismiss() {
    if (timerDone.current && windowDone.current) setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      timerDone.current = true
      tryDismiss()
    }, MIN_MS)

    if (document.readyState === 'complete') {
      windowDone.current = true
      tryDismiss()
    } else {
      const onLoad = () => {
        windowDone.current = true
        tryDismiss()
      }
      window.addEventListener('load', onLoad, { once: true })
      return () => {
        clearTimeout(t)
        window.removeEventListener('load', onLoad)
      }
    }

    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <CustomCursor />

      <main className="relative">
        <Navigation />

        <Hero />
        <Projects />
        <Skills />
        <GitHub />
        <About />
        <Experience />
        <Contact />

        <Footer />
      </main>
    </>
  )
}