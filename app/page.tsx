'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'

const Hero         = dynamic(() => import('@/components/sections/Hero'),               { ssr: false })
const Projects     = dynamic(() => import('@/components/sections/Projects'),           { ssr: false })
const Skills       = dynamic(() => import('@/components/sections/Skills'),             { ssr: false })
const GitHub       = dynamic(() => import('@/components/sections/GitHubContribution'), { ssr: false })
const About        = dynamic(() => import('@/components/sections/About'),              { ssr: false })
const Experience   = dynamic(() => import('@/components/sections/Experience'),         { ssr: false })
const Contact      = dynamic(() => import('@/components/sections/Contact'),            { ssr: false })
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'),             { ssr: false })

export default function Home() {
  return (
    <>
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