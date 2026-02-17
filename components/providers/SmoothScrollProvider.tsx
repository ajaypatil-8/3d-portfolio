'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    })
    lenisRef.current = lenis

    // FIX 2: Tell ScrollTrigger to use Lenis's scroll position, not window.scrollY
    // Without this, ScrollTrigger reads the wrong position during smooth scroll
    // and animations trigger too early or too late
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      ScrollTrigger.update()
    })

    // FIX 3: Sync Lenis scroll position into ScrollTrigger's proxy
    // so gsap.to(window, { scrollTo }) works correctly with Lenis active
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
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    ScrollTrigger.defaults({ scroller: document.documentElement })

    // RAF loop — correct approach (not gsap.ticker which double-ticks)
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      ScrollTrigger.scrollerProxy(document.documentElement, undefined as any)
      ScrollTrigger.refresh()
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}