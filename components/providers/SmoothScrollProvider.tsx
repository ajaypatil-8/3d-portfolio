'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration:        1.1,    // slightly longer = silkier momentum feel
      easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite:        false,
    })
    lenisRef.current = lenis

    /* Keep ScrollTrigger positions in sync with Lenis scroll value */
    lenis.on('scroll', () => ScrollTrigger.update())

    /* Proxy so ScrollTrigger reads position from Lenis, not window.scrollY */
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenisRef.current?.scrollTo(value, { immediate: true })
        }
        return lenisRef.current?.scroll ?? window.scrollY
      },
      getBoundingClientRect() {
        return {
          top: 0, left: 0,
          width:  window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    ScrollTrigger.defaults({ scroller: document.documentElement })

    const tickerFn = (time: number) => lenis.raf(time * 1000) // s → ms
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerFn)
      ScrollTrigger.scrollerProxy(document.documentElement, undefined as any)
      ScrollTrigger.refresh()
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}