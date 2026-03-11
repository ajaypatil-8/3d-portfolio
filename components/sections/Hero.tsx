'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect, useRef, useMemo, useState, memo, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import * as THREE from 'three'
import { useTheme } from '@/components/providers/ThemeProvider'

gsap.registerPlugin(ScrollToPlugin)

/* ─── helpers ─────────────────────────────────────────────────────────── */

function makeOrbit(count: number, radius: number, tilt: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const x = Math.cos(a) * radius
    const z = Math.sin(a) * radius
    const y = (Math.random() - 0.5) * 0.1
    pos[i * 3]     = x * Math.cos(tilt)
    pos[i * 3 + 1] = x * Math.sin(tilt) + y
    pos[i * 3 + 2] = z
  }
  return pos
}

/* ─── 3-D sub-components (unchanged logic, kept stable) ───────────────── */

function OrbitRings({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme()
  const r1 = useRef<THREE.Points>(null)
  const r2 = useRef<THREE.Points>(null)
  const r3 = useRef<THREE.Points>(null)

  const ring1 = useMemo(() => makeOrbit(isMobile ? 60 : 120, 1.6,  Math.PI * 0.18), [isMobile])
  const ring2 = useMemo(() => makeOrbit(isMobile ? 45 : 90,  2.2, -Math.PI * 0.28), [isMobile])
  const ring3 = useMemo(() => makeOrbit(isMobile ? 35 : 70,  2.9,  Math.PI * 0.06), [isMobile])

  const mat1 = useMemo(() => new THREE.PointsMaterial({ size: isMobile ? 0.025 : 0.028, sizeAttenuation: true, transparent: true, depthWrite: false }), [isMobile])
  const mat2 = useMemo(() => new THREE.PointsMaterial({ size: isMobile ? 0.02  : 0.022, sizeAttenuation: true, transparent: true, depthWrite: false }), [isMobile])
  const mat3 = useMemo(() => new THREE.PointsMaterial({ size: isMobile ? 0.016 : 0.018, sizeAttenuation: true, transparent: true, depthWrite: false }), [isMobile])

  useEffect(() => {
    const light = theme === 'light'
    mat1.color.set(light ? '#7c3aed' : '#a78bfa'); mat1.opacity = light ? 0.6 : 0.9
    mat2.color.set(light ? '#0e9488' : '#4ecdc4'); mat2.opacity = light ? 0.5 : 0.7
    mat3.color.set(light ? '#dc2626' : '#ff6b6b'); mat3.opacity = light ? 0.4 : 0.5
  }, [theme, mat1, mat2, mat3])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (r1.current) r1.current.rotation.y = t * 0.22
    if (r2.current) r2.current.rotation.y = -t * 0.15
    if (r3.current) r3.current.rotation.y = t * 0.09
  })

  return (
    <group>
      <points ref={r1} frustumCulled={false} material={mat1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring1, 3]} />
        </bufferGeometry>
      </points>
      <points ref={r2} frustumCulled={false} material={mat2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring2, 3]} />
        </bufferGeometry>
      </points>
      <points ref={r3} frustumCulled={false} material={mat3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring3, 3]} />
        </bufferGeometry>
      </points>
    </group>
  )
}

function HoloCore() {
  const { theme } = useTheme()
  const outerRef    = useRef<THREE.Mesh>(null)
  const innerRef    = useRef<THREE.Mesh>(null)
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null)

  const holoMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:    { value: 0 },
      uColorA:  { value: new THREE.Color('#4ecdc4') },
      uColorB:  { value: new THREE.Color('#a855f7') },
      uOpacity: { value: 0.85 },
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vPos;
      varying vec3 vNormal;
      void main() {
        vPos    = position;
        vNormal = normal;
        float b = 1.0 + sin(uTime * 1.2) * 0.03;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position * b, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3  uColorA;
      uniform vec3  uColorB;
      uniform float uOpacity;
      varying vec3  vPos;
      varying vec3  vNormal;
      void main() {
        float scan = mod(vPos.y * 3.0 + uTime * 1.5, 2.0);
        float band = smoothstep(1.8, 2.0, scan) * 0.5 + 0.15;
        float rim  = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
        float glow = pow(rim, 1.8) * 0.6;
        float t    = vPos.y * 0.5 + 0.5;
        vec3  col  = mix(uColorA, uColorB, clamp(t, 0.0, 1.0));
        gl_FragColor = vec4(col, clamp((band + glow) * uOpacity, 0.0, uOpacity));
      }
    `,
    transparent: true,
    depthWrite: false,
  }), [])

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#4ecdc4', wireframe: true, transparent: true, opacity: 0.18,
  }), [])

  useEffect(() => {
    const light = theme === 'light'
    holoMat.uniforms.uColorA.value.set(light ? '#0e9488' : '#4ecdc4')
    holoMat.uniforms.uColorB.value.set(light ? '#7c3aed' : '#a855f7')
    holoMat.uniforms.uOpacity.value = light ? 0.28 : 0.85
    wireMat.color.set(light ? '#0e9488' : '#4ecdc4')
    wireMat.opacity = light ? 0.1 : 0.18
    if (innerMatRef.current) {
      innerMatRef.current.color.set(light ? '#dc2626' : '#ff6b6b')
      innerMatRef.current.opacity = light ? 0.1 : 0.35
    }
  }, [theme, holoMat, wireMat])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    holoMat.uniforms.uTime.value = t
    if (outerRef.current) { outerRef.current.rotation.y = t * 0.2; outerRef.current.rotation.x = t * 0.1 }
    if (innerRef.current) { innerRef.current.rotation.y = -t * 0.3; innerRef.current.rotation.z = t * 0.15 }
  })

  return (
    <group>
      <mesh material={holoMat}><icosahedronGeometry args={[1, 2]} /></mesh>
      <mesh ref={outerRef} material={wireMat}><icosahedronGeometry args={[1.15, 1]} /></mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial ref={innerMatRef} color="#ff6b6b" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function FloatingHexagons({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const matRef  = useRef<THREE.MeshBasicMaterial>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  const HEX = useMemo(() => isMobile ? [
    { pos: [-3.2,  1.2, -1.8] as [number,number,number], speed: 0.40, phase: 0.0 },
    { pos: [ 3.1,  1.4, -2.0] as [number,number,number], speed: 0.50, phase: 1.2 },
    { pos: [-0.8,  2.2, -2.5] as [number,number,number], speed: 0.30, phase: 1.8 },
  ] : [
    { pos: [-3.2,  1.2, -1.8] as [number,number,number], speed: 0.40, phase: 0.0 },
    { pos: [ 3.1,  1.4, -2.0] as [number,number,number], speed: 0.50, phase: 1.2 },
    { pos: [-2.6, -1.4, -1.5] as [number,number,number], speed: 0.35, phase: 2.4 },
    { pos: [ 2.8, -1.2, -1.6] as [number,number,number], speed: 0.45, phase: 0.8 },
    { pos: [-0.8,  2.2, -2.5] as [number,number,number], speed: 0.30, phase: 1.8 },
    { pos: [ 1.0, -2.3, -2.2] as [number,number,number], speed: 0.55, phase: 3.0 },
  ], [isMobile])

  useEffect(() => {
    if (matRef.current) matRef.current.opacity = theme === 'light' ? 0.25 : 0.6
  }, [theme])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    HEX.forEach((d, i) => {
      dummy.position.set(d.pos[0], d.pos[1] + Math.sin(t * d.speed + d.phase) * 0.18, d.pos[2])
      dummy.rotation.set(t * d.speed * 0.4, t * d.speed * 0.6, t * d.speed * 0.2)
      dummy.scale.setScalar(0.22)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const colors = useMemo(() => {
    const pal = ['#ff6b6b','#4ecdc4','#a855f7','#ffd93d','#60a5fa','#4ecdc4']
    const arr = new Float32Array(HEX.length * 3)
    const c = new THREE.Color()
    HEX.forEach((_, i) => { c.set(pal[i % pal.length]); arr[i*3]=c.r; arr[i*3+1]=c.g; arr[i*3+2]=c.b })
    return arr
  }, [HEX])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, HEX.length]} frustumCulled={false}>
      <cylinderGeometry args={[1, 1, 0.15, 6, 1]} />
      <meshBasicMaterial ref={matRef} vertexColors wireframe transparent opacity={0.6} />
      <bufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </instancedMesh>
  )
}

function StarDust({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme()
  const ref    = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)

  const pos = useMemo(() => {
    const count = isMobile ? 150 : 300
    const arr   = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random()-0.5)*10
      arr[i*3+1] = (Math.random()-0.5)*8
      arr[i*3+2] = (Math.random()-0.5)*6 - 2
    }
    return arr
  }, [isMobile])

  useEffect(() => {
    if (matRef.current) {
      matRef.current.color.set(theme === 'light' ? '#6366f1' : '#ffffff')
      matRef.current.opacity = theme === 'light' ? 0.12 : 0.2
    }
  }, [theme])

  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.015 })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} size={0.012} color="#ffffff" transparent opacity={0.2} depthWrite={false} />
    </points>
  )
}

/* ─── Scene (memoised) ─────────────────────────────────────────────────── */

const Scene = memo(function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <Canvas
      dpr={isMobile ? 1 : (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1)}
      frameloop="always"
      gl={{ antialias: false, powerPreference: isMobile ? 'low-power' : 'high-performance', stencil: false, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={55} />
      <OrbitControls
        enableZoom={false} enablePan={false}
        autoRotate autoRotateSpeed={isMobile ? 0.2 : 0.3}
        enableDamping dampingFactor={0.05}
        minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.65}
        enabled={!isMobile}
      />
      <StarDust isMobile={isMobile} />
      <OrbitRings isMobile={isMobile} />
      <HoloCore />
      <FloatingHexagons isMobile={isMobile} />
    </Canvas>
  )
})

/* ─── Stats item ───────────────────────────────────────────────────────── */

function StatItem({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      className="text-center relative px-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
    >
      {/* subtle separator between items */}
      {index > 0 && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-6 opacity-20"
          style={{ background: 'linear-gradient(to bottom, transparent, #4ecdc4, transparent)' }}
        />
      )}
      <div
        className="font-heading font-bold text-xl sm:text-2xl tabular-nums"
        style={{
          background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.65rem',
          fontFamily: 'monospace',
          marginTop: 4,
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */

export default function Hero() {
  const { theme } = useTheme()

  const badgeRef    = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const techRef     = useRef<HTMLParagraphElement>(null)
  const btnRef      = useRef<HTMLDivElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  /* debounced resize listener */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(timer); timer = setTimeout(check, 120) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer) }
  }, [])

  /* GSAP entrance — shorter delays feel snappier */
  useEffect(() => {
    const els = [badgeRef.current, titleRef.current, subtitleRef.current, techRef.current, btnRef.current, statsRef.current]
    gsap.set(els, { opacity: 0, y: 24 })          // ← set initial y so the tween actually moves

    const tl = gsap.timeline({ delay: isMobile ? 0.9 : 1.2 })
    tl.to(badgeRef.current,    { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
      .to(titleRef.current,    { opacity: 1, y: 0, duration: 0.70, ease: 'power3.out' }, '-=0.25')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.45')
      .to(techRef.current,     { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.35')
      .to(btnRef.current,      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')
      .to(statsRef.current,    { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25')

    return () => { tl.kill() }
  }, [isMobile])

  const scrollTo = useCallback((id: string) => {
    const el = document.querySelector(id)
    if (el) gsap.to(window, { duration: 1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }, [])

  const bgColor     = theme === 'light' ? '#f5f5f5' : '#0a0a0a'
  const vignetteRgb = theme === 'light' ? '245,245,245' : '10,10,10'

  const vignetteStart  = theme === 'light' ? 0.0  : 0.1
  const vignetteMiddle = theme === 'light' ? 0.65 : 0.55
  const vignetteEnd    = theme === 'light' ? 0.97 : 0.92

  const STATS = [
    { value: '2',   label: 'Projects'  },
    { value: 'BCA', label: '3rd Year'  },
    { value: '8+',  label: 'Tech Stack'},
  ]

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bgColor,
        height:    isMobile ? '100svh' : '100vh',
        minHeight: isMobile ? '100svh' : '100vh',
      }}
    >
      {/* 3-D canvas */}
      <div className="absolute inset-0 z-0">
        <Scene isMobile={isMobile} />
      </div>

      {/* Vignette layers */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 80% at 50% 50%, rgba(${vignetteRgb},${vignetteStart}) 0%, rgba(${vignetteRgb},${vignetteMiddle}) 55%, rgba(${vignetteRgb},${vignetteEnd}) 100%)`,
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-52 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${bgColor})` }} />
      <div className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${bgColor}CC, transparent)` }} />

      {theme === 'light' && (
        <>
          <div className="absolute inset-y-0 left-0 w-48 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-48 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }} />
        </>
      )}

      {/* Main content */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">

          {/* Badge */}
          <div ref={badgeRef} className={isMobile ? 'mb-5' : 'mb-7'}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm"
              style={{
                backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.10)'}`,
                backdropFilter: 'blur(16px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                Open to Jobs &amp; Internships
              </span>
            </span>
          </div>

          {/* Heading */}
          <h1
            ref={titleRef}
            className="font-heading font-bold mb-3 sm:mb-4"
            style={{
              fontSize:   isMobile ? 'clamp(2.8rem, 12vw, 4.5rem)' : 'clamp(3.2rem, 9vw, 6.5rem)',
              lineHeight: 1.05,
              color:      'var(--text-primary)',
            }}
          >
            <span>Ajay </span>
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Patil
            </span>
          </h1>

          {/* Role */}
          <p
            ref={subtitleRef}
            className="font-mono font-semibold mb-2 sm:mb-3"
            style={{
              fontSize:      isMobile ? 'clamp(0.9rem, 4vw, 1.1rem)' : 'clamp(1rem, 2.8vw, 1.4rem)',
              color:         'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            Full Stack Developer
          </p>

          {/* Tech stack line */}
          <p
            ref={techRef}
            className="mb-6 sm:mb-9"
            style={{
              color:         'var(--text-muted)',
              fontSize:      isMobile ? '0.7rem' : '0.85rem',
              letterSpacing: '0.08em',
            }}
          >
            Java · Spring Boot · React · Next.js · Docker · Cloud
          </p>

          {/* CTA buttons */}
          <div
            ref={btnRef}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <motion.button
              onClick={() => scrollTo('#projects')}
              className="relative px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full text-sm sm:text-base font-bold overflow-hidden cursor-hover"
              style={{
                background:  'linear-gradient(135deg, #ff6b6b, #a855f7)',
                boxShadow:   '0 0 30px rgba(255,107,107,0.35)',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {/* shimmer sweep */}
              <motion.span
                className="absolute inset-0 bg-white/25"
                initial={{ x: '-100%', skewX: -15 }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.45 }}
              />
              <span className="relative">View Projects →</span>
            </motion.button>

            <motion.button
              onClick={() => scrollTo('#contact')}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold cursor-hover"
              style={{
                border:          `1.5px solid ${theme === 'light' ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.22)'}`,
                color:           'var(--text-primary)',
                backdropFilter:  'blur(12px)',
                backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Get in Touch
            </motion.button>
          </div>

          {/* Stats row */}
          <div ref={statsRef} className={`flex items-center justify-center ${isMobile ? 'gap-0 mt-8' : 'gap-0 mt-12'}`}>
            {STATS.map((s, i) => (
              <StatItem key={s.label} value={s.value} label={s.label} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0 }}   /* reduced from 4.0 */
        >
          <span style={{ color: 'var(--text-faint)', fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'monospace' }}>
            SCROLL
          </span>
          <motion.div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, #ff6b6b, transparent)' }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  )
}