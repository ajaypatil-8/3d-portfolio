'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { theme?: 'dark' | 'light' }

const PALETTE_DARK  = ['#ff6b6b', '#4ecdc4', '#a855f7', '#fbbf24', '#60a5fa', '#34d399']
const PALETTE_LIGHT = ['#dc2626', '#0d9488', '#7c3aed', '#d97706', '#2563eb', '#059669']

/* ─── Floating Icosahedra ─────────────────────────────────────────────────── */
function FloatingGeo({ theme }: { theme: 'dark' | 'light' }) {
  const solidRef = useRef<THREE.InstancedMesh>(null)
  const wireRef  = useRef<THREE.InstancedMesh>(null)
  const dummy    = useMemo(() => new THREE.Object3D(), [])
  const PAL = theme === 'light' ? PALETTE_LIGHT : PALETTE_DARK

  const COUNT = 22
  const data = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    ox: (Math.random() - 0.5) * 16,
    oy: (Math.random() - 0.5) * 10,
    oz: -3 - Math.random() * 4,
    vx: (Math.random() - 0.5) * 0.006,
    vy: (Math.random() - 0.5) * 0.005,
    rx: (Math.random() - 0.5) * 0.55,
    ry: (Math.random() - 0.5) * 0.65,
    phase: Math.random() * Math.PI * 2,
    speed: 0.10 + Math.random() * 0.20,
    size:  0.06 + Math.random() * 0.18,
    wire:  Math.random() > 0.55,
    ci:    i % PAL.length,
  })), [])

  const solidColors = useMemo(() => {
    const a = new Float32Array(COUNT * 3); const c = new THREE.Color()
    data.forEach((d, i) => { c.set(PAL[d.ci]); a[i*3]=c.r; a[i*3+1]=c.g; a[i*3+2]=c.b })
    return a
  }, [theme])

  const solidMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uAlpha: { value: theme === 'light' ? 0.28 : 0.40 } },
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor; varying vec3 vNormal; varying vec3 vView;
      void main() {
        vColor = color; vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0); vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uAlpha;
      varying vec3 vColor; varying vec3 vNormal; varying vec3 vView;
      void main() {
        float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
        float g = pow(rim, 2.2) * 0.88 + 0.08;
        gl_FragColor = vec4(vColor + rim * 0.15, g * uAlpha);
      }`,
    transparent: true, depthWrite: false, vertexColors: true, side: THREE.FrontSide,
  }), [theme])

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    vertexColors: true, wireframe: true, transparent: true,
    opacity: theme === 'light' ? 0.10 : 0.18, depthWrite: false,
  }), [theme])

  useFrame(({ clock }) => {
    if (!solidRef.current || !wireRef.current) return
    const t = clock.getElapsedTime()
    data.forEach((d, i) => {
      const wave = Math.sin(t * d.speed + d.phase)
      dummy.position.set(
        d.ox + Math.sin(t * d.vx * 80 + d.phase) * 1.2,
        d.oy + wave * 0.55,
        d.oz + Math.cos(t * 0.08 + d.phase) * 0.5,
      )
      dummy.rotation.set(t * d.rx * 0.38, t * d.ry * 0.38, t * 0.1)
      dummy.scale.setScalar(d.size * (0.88 + 0.12 * wave))
      dummy.updateMatrix()
      solidRef.current!.setMatrixAt(i, dummy.matrix)
      wireRef.current!.setMatrixAt(i, dummy.matrix)
    })
    solidRef.current.instanceMatrix.needsUpdate = true
    wireRef.current.instanceMatrix.needsUpdate  = true
  })

  return (
    <>
      <instancedMesh ref={solidRef} args={[undefined, solidMat, COUNT]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <bufferAttribute attach="geometry-attributes-color" args={[solidColors, 3]} />
      </instancedMesh>
      <instancedMesh ref={wireRef} args={[undefined, wireMat, COUNT]} frustumCulled={false}>
        <octahedronGeometry args={[1, 1]} />
        <bufferAttribute attach="geometry-attributes-color" args={[solidColors, 3]} />
      </instancedMesh>
    </>
  )
}

/* ─── Background Star Dust ────────────────────────────────────────────────── */
function StarDust({ theme }: { theme: 'dark' | 'light' }) {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const a = new Float32Array(300 * 3)
    for (let i = 0; i < 300; i++) {
      a[i*3]   = (Math.random() - 0.5) * 22
      a[i*3+1] = (Math.random() - 0.5) * 16
      a[i*3+2] = (Math.random() - 0.5) * 8 - 4
    }
    return a
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.006
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.012} color={theme === 'light' ? '#6366f1' : '#c4b5fd'}
        transparent opacity={theme === 'light' ? 0.18 : 0.30} depthWrite={false} sizeAttenuation />
    </points>
  )
}

/* ─── Floating Torus Rings ────────────────────────────────────────────────── */
function TorusRings({ theme }: { theme: 'dark' | 'light' }) {
  const PAL = theme === 'light' ? PALETTE_LIGHT : PALETTE_DARK
  const RINGS = useMemo(() => [
    { pos: [ 6.0,  1.5, -2.5] as [number,number,number], r: 0.52, color: PAL[0], speed: 0.26, phase: 0.0, rx: 1.1, ry: 0.4 },
    { pos: [-5.5, -1.0, -2.0] as [number,number,number], r: 0.44, color: PAL[1], speed: 0.20, phase: 1.8, rx: 0.6, ry: 0.8 },
    { pos: [ 1.2,  4.0, -3.0] as [number,number,number], r: 0.36, color: PAL[2], speed: 0.34, phase: 3.2, rx: 0.3, ry: 1.2 },
    { pos: [-2.0, -3.8, -1.8] as [number,number,number], r: 0.40, color: PAL[3], speed: 0.18, phase: 2.5, rx: 1.5, ry: 0.3 },
    { pos: [ 5.0, -2.0, -2.2] as [number,number,number], r: 0.30, color: PAL[4], speed: 0.30, phase: 4.5, rx: 0.7, ry: 1.0 },
  ], [theme])

  const refs = useRef<(THREE.Mesh | null)[]>([])
  const mats = useMemo(() => RINGS.map(r => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(r.color) }, uTime: { value: 0 }, uOp: { value: theme === 'light' ? 0.35 : 0.68 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; void main() { vN = normalize(normalMatrix * normal); vec4 m = modelViewMatrix * vec4(position, 1.); vV = -m.xyz; gl_Position = projectionMatrix * m; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uOp; varying vec3 vN; varying vec3 vV;
    void main() { float r = 1.-abs(dot(normalize(vN),normalize(vV))); float g = pow(r,2.0)*0.9+0.05; float p = 0.88+0.12*sin(uTime*2.2); gl_FragColor = vec4(uColor, clamp(g*p*uOp,0.,uOp)); }`,
    transparent: true, depthWrite: false, side: THREE.FrontSide,
  })), [theme])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    RINGS.forEach((r, i) => {
      mats[i].uniforms.uTime.value = t
      const m = refs.current[i]; if (!m) return
      m.position.y = r.pos[1] + Math.sin(t * r.speed + r.phase) * 0.32
      m.rotation.x = t * r.rx * 0.15 + r.phase
      m.rotation.y = t * r.ry * 0.20
    })
  })

  return (
    <group>
      {RINGS.map((r, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el }} position={r.pos}>
          <torusGeometry args={[r.r, 0.018, 8, 52]} />
          <primitive object={mats[i]} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

export default function GeometricBackground({ theme = 'dark' }: Props) {
  return (
    <group>
      <StarDust theme={theme} />
      <FloatingGeo theme={theme} />
      <TorusRings theme={theme} />
    </group>
  )
}