'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion }           from 'framer-motion'
import { useEffect, useRef, useMemo } from 'react'
import { gsap }             from 'gsap'
import { ScrollToPlugin }   from 'gsap/dist/ScrollToPlugin'
import * as THREE           from 'three'

gsap.registerPlugin(ScrollToPlugin)

// ─── 3D: Orbit rings ─────────────────────────────────────────────
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

function OrbitRings() {
  const r1 = useRef<THREE.Points>(null)
  const r2 = useRef<THREE.Points>(null)
  const r3 = useRef<THREE.Points>(null)
  const ring1 = useMemo(() => makeOrbit(120, 1.6,  Math.PI * 0.18), [])
  const ring2 = useMemo(() => makeOrbit(90,  2.2, -Math.PI * 0.28), [])
  const ring3 = useMemo(() => makeOrbit(70,  2.9,  Math.PI * 0.06), [])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (r1.current) r1.current.rotation.y = t * 0.22
    if (r2.current) r2.current.rotation.y = -t * 0.15
    if (r3.current) r3.current.rotation.y = t * 0.09
  })
  return (
    <group>
      {[
        { ref: r1, pos: ring1, color: '#a78bfa', size: 0.028, opacity: 0.9 },
        { ref: r2, pos: ring2, color: '#4ecdc4', size: 0.022, opacity: 0.7 },
        { ref: r3, pos: ring3, color: '#ff6b6b', size: 0.018, opacity: 0.5 },
      ].map((r, i) => (
        <points key={i} ref={r.ref} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={r.pos} count={r.pos.length / 3} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={r.size} color={r.color} sizeAttenuation transparent opacity={r.opacity} depthWrite={false} />
        </points>
      ))}
    </group>
  )
}

// ─── 3D: Hologram core ───────────────────────────────────────────
function HoloCore() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  // ✅ useMemo = stable object — update directly, NO ref needed
  const holoMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:   { value: 0 },
      uColorA: { value: new THREE.Color('#4ecdc4') },
      uColorB: { value: new THREE.Color('#a855f7') },
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vPos;
      varying vec3 vNormal;
      void main() {
        vPos = position;
        vNormal = normal;
        float b = 1.0 + sin(uTime * 1.2) * 0.03;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position * b, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec3 vPos;
      varying vec3 vNormal;
      void main() {
        float scan = mod(vPos.y * 3.0 + uTime * 1.5, 2.0);
        float band = smoothstep(1.8, 2.0, scan) * 0.5 + 0.15;
        float rim  = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
        float glow = pow(rim, 1.8) * 0.6;
        float t    = vPos.y * 0.5 + 0.5;
        vec3  col  = mix(uColorA, uColorB, clamp(t, 0.0, 1.0));
        gl_FragColor = vec4(col, clamp(band + glow, 0.0, 0.85));
      }
    `,
    transparent: true,
    depthWrite: false,
  }), [])

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#4ecdc4', wireframe: true, transparent: true, opacity: 0.18,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    holoMat.uniforms.uTime.value = t   // ✅ direct — no ref, no crash
    if (outerRef.current) { outerRef.current.rotation.y = t * 0.2; outerRef.current.rotation.x = t * 0.1 }
    if (innerRef.current) { innerRef.current.rotation.y = -t * 0.3; innerRef.current.rotation.z = t * 0.15 }
  })

  return (
    <group>
      <mesh material={holoMat}><icosahedronGeometry args={[1, 2]} /></mesh>
      <mesh ref={outerRef} material={wireMat}><icosahedronGeometry args={[1.15, 1]} /></mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial color="#ff6b6b" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

// ─── 3D: Floating hexagons ────────────────────────────────────────
const HEX = [
  { pos: [-3.2,  1.2, -1.8] as [number,number,number], speed: 0.40, phase: 0.0 },
  { pos: [ 3.1,  1.4, -2.0] as [number,number,number], speed: 0.50, phase: 1.2 },
  { pos: [-2.6, -1.4, -1.5] as [number,number,number], speed: 0.35, phase: 2.4 },
  { pos: [ 2.8, -1.2, -1.6] as [number,number,number], speed: 0.45, phase: 0.8 },
  { pos: [-0.8,  2.2, -2.5] as [number,number,number], speed: 0.30, phase: 1.8 },
  { pos: [ 1.0, -2.3, -2.2] as [number,number,number], speed: 0.55, phase: 3.0 },
]

function FloatingHexagons() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])
  const colors  = useMemo(() => {
    const pal = ['#ff6b6b','#4ecdc4','#a855f7','#ffd93d','#60a5fa','#4ecdc4']
    const arr = new Float32Array(HEX.length * 3)
    const c   = new THREE.Color()
    HEX.forEach((_, i) => { c.set(pal[i % pal.length]); arr[i*3]=c.r; arr[i*3+1]=c.g; arr[i*3+2]=c.b })
    return arr
  }, [])
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
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, HEX.length]} frustumCulled={false}>
      <cylinderGeometry args={[1, 1, 0.15, 6, 1]} />
      <meshBasicMaterial vertexColors wireframe transparent opacity={0.6} />
      <bufferAttribute attach="geometry-attributes-color" array={colors} count={HEX.length} itemSize={3} />
    </instancedMesh>
  )
}

// ─── 3D: Star dust ───────────────────────────────────────────────
function StarDust() {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const arr = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      arr[i*3]   = (Math.random()-0.5)*10
      arr[i*3+1] = (Math.random()-0.5)*8
      arr[i*3+2] = (Math.random()-0.5)*6 - 2
    }
    return arr
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.015 })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={300} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#ffffff" transparent opacity={0.2} depthWrite={false} />
    </points>
  )
}

// ─── HERO SECTION ────────────────────────────────────────────────
export default function Hero() {
  const badgeRef    = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const techRef     = useRef<HTMLParagraphElement>(null)
  const btnRef      = useRef<HTMLDivElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ✅ Set initial state via GSAP only — no inline transform/opacity on elements
    // This way GSAP fully controls the animation with no CSS conflicts
    gsap.set(badgeRef.current,    { opacity: 0, y: 24 })
    gsap.set(titleRef.current,    { opacity: 0, y: 40 })
    gsap.set(subtitleRef.current, { opacity: 0, y: 24 })
    gsap.set(techRef.current,     { opacity: 0, y: 16 })
    gsap.set(btnRef.current,      { opacity: 0, y: 16 })
    gsap.set(statsRef.current,    { opacity: 0, y: 12 })

    const tl = gsap.timeline({ delay: 2.0 })
    tl.to(badgeRef.current,    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(titleRef.current,    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .to(techRef.current,     { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      .to(btnRef.current,      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to(statsRef.current,    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
  }, [])

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) gsap.to(window, { duration: 1, scrollTo: { y: el, offsetY: 72 }, ease: 'power3.inOut' })
  }

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>

      {/* ── Layer 0: 3D Canvas ──────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
          frameloop="always"
          gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, alpha: false }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={55} />
          <OrbitControls
            enableZoom={false} enablePan={false}
            autoRotate autoRotateSpeed={0.3}
            enableDamping dampingFactor={0.05}
            minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.65}
          />
          <StarDust />
          <OrbitRings />
          <HoloCore />
          <FloatingHexagons />
        </Canvas>
      </div>

      {/* ── Layer 1: Dark radial vignette ───────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.92) 100%)'
      }} />

      {/* ── Layer 2: Bottom fade ────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-52 z-10 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent, #0a0a0a)'
      }} />

      {/* ── Layer 3: Top fade for nav ───────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.8), transparent)'
      }} />

      {/* ── Layer 4: TEXT CONTENT — highest z-index ─────────── */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 text-center">

          {/* Badge */}
          <div ref={badgeRef} className="mb-7">
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-white/80 text-sm font-mono">Open to Jobs &amp; Internships</span>
            </span>
          </div>

          {/* Name — no inline transform, GSAP handles it */}
          <h1 ref={titleRef}
            className="font-heading font-bold mb-4"
            style={{
              fontSize: 'clamp(3.2rem, 9vw, 6.5rem)',
              lineHeight: 1.05,
              textShadow: '0 2px 40px rgba(0,0,0,1), 0 0 80px rgba(0,0,0,0.9)',
            }}>
            <span style={{ color: '#ffffff' }}>Ajay </span>
            <span style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Patil</span>
          </h1>

          {/* Role */}
          <p ref={subtitleRef}
            className="font-mono font-semibold mb-3"
            style={{
              fontSize: 'clamp(1rem, 2.8vw, 1.4rem)',
              color: 'rgba(255,255,255,0.85)',
              textShadow: '0 2px 20px rgba(0,0,0,1)',
              letterSpacing: '0.02em',
            }}>
            Full Stack Developer
          </p>

          {/* Tech stack */}
          <p ref={techRef}
            className="mb-9"
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem',
              textShadow: '0 1px 10px rgba(0,0,0,1)',
              letterSpacing: '0.08em',
            }}>
            Java &nbsp;·&nbsp; Spring Boot &nbsp;·&nbsp; React &nbsp;·&nbsp; Next.js &nbsp;·&nbsp; Docker &nbsp;·&nbsp; Cloud
          </p>

          {/* Buttons */}
          <div ref={btnRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => scrollTo('#projects')}
              className="relative px-8 py-4 text-white rounded-full text-base font-bold overflow-hidden cursor-hover"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #a855f7)', boxShadow: '0 0 30px rgba(255,107,107,0.35)' }}
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              <motion.span className="absolute inset-0 bg-white/25"
                initial={{ x: '-100%', skewX: -15 }} whileHover={{ x: '200%' }}
                transition={{ duration: 0.45 }} />
              <span className="relative">View Projects →</span>
            </motion.button>

            <motion.button
              onClick={() => scrollTo('#contact')}
              className="px-8 py-4 rounded-full text-base font-bold cursor-hover"
              style={{
                border: '1.5px solid rgba(255,255,255,0.22)',
                color: '#ffffff',
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255,255,255,0.06)',
              }}
              whileHover={{ scale: 1.06, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.95 }}>
              Hire Me
            </motion.button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex items-center justify-center gap-10 mt-12">
            {[
              { value: '2',   label: 'Projects Built' },
              { value: 'BCA', label: '3rd Year' },
              { value: '8+',  label: 'Technologies' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading font-bold text-2xl" style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontFamily: 'monospace', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layer 5: Scroll indicator ───────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.0 }}>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'monospace' }}>SCROLL</span>
        <motion.div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #ff6b6b, transparent)' }}
          animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>

    </section>
  )
}