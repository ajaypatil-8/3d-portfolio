'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'



const SOLID_COUNT     = 28   
const WIRE_COUNT      = 18   
const HELIX_COUNT     = 24   
const SPARK_COUNT     = 60   

interface Props {
  theme?: 'dark' | 'light'
}



function makeRimMaterial(colorHex: string, opacity: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor:   { value: new THREE.Color(colorHex) },
      uOpacity: { value: opacity },
      uTime:    { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPos;
      void main() {
        vNormal  = normalize(normalMatrix * normal);
        vec4 mvp = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvp.xyz;
        gl_Position = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      uniform vec3  uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying vec3  vNormal;
      varying vec3  vViewPos;
      void main() {
        float rim   = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPos)));
        float glow  = pow(rim, 2.2) * 0.85 + 0.12;
        float pulse = 0.92 + 0.08 * sin(uTime * 2.5);
        gl_FragColor = vec4(uColor, clamp(glow * pulse * uOpacity, 0.0, uOpacity));
      }
    `,
    transparent: true,
    depthWrite:  false,
    side:        THREE.FrontSide,
  })
}



function SolidShapes({ theme }: { theme: 'dark' | 'light' }) {
  const meshRef  = useRef<THREE.InstancedMesh>(null)
  const dummy    = useMemo(() => new THREE.Object3D(), [])

  const PALETTE = theme === 'light'
    ? ['#dc2626', '#0e9488', '#7c3aed', '#d97706', '#2563eb', '#059669']
    : ['#ff6b6b', '#4ecdc4', '#a855f7', '#ffd93d', '#60a5fa', '#34d399']


  const data = useMemo(() => Array.from({ length: SOLID_COUNT }, (_, i) => ({
    ox:    (Math.random() - 0.5) * 9,
    oy:    (Math.random() - 0.5) * 7,
    oz:    (Math.random() - 0.5) * 5 - 1,
    rx:    (Math.random() - 0.5) * 0.5,
    ry:    (Math.random() - 0.5) * 0.6,
    rz:    (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.18 + Math.random() * 0.35,
    size:  0.10 + Math.random() * 0.18,
    colorIdx: i % PALETTE.length,
  })), [])

  /* vertex colors */
  const colors = useMemo(() => {
    const arr = new Float32Array(SOLID_COUNT * 3)
    const c   = new THREE.Color()
    data.forEach((d, i) => {
      c.set(PALETTE[d.colorIdx])
      arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b
    })
    return arr
  }, [theme])                                   

  const mat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      theme === 'light' ? 0.55 : 0.45,
      depthWrite:   false,
    })
    return m
  }, [theme])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    data.forEach((d, i) => {
      const wave = Math.sin(t * d.speed + d.phase)
      const s    = d.size * (0.75 + 0.25 * wave)
      dummy.position.set(
        d.ox + Math.sin(t * d.rx * 0.7 + d.phase) * 1.0,
        d.oy + wave * 0.55,
        d.oz + Math.cos(t * d.rz * 0.5 + d.phase) * 0.6,
      )
      dummy.rotation.x = t * d.rx * 0.4
      dummy.rotation.y = t * d.ry * 0.4
      dummy.rotation.z = t * d.rz * 0.3
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, mat, SOLID_COUNT]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <bufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </instancedMesh>
  )
}



function WireShapes({ theme }: { theme: 'dark' | 'light' }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  const WIRE_PALETTE = theme === 'light'
    ? ['#7c3aed', '#0e9488', '#dc2626']
    : ['#a855f7', '#4ecdc4', '#ff6b6b']

  const data = useMemo(() => Array.from({ length: WIRE_COUNT }, (_, i) => ({
    ox:    (Math.random() - 0.5) * 11,
    oy:    (Math.random() - 0.5) * 8,
    oz:    (Math.random() - 0.5) * 4 - 2,
    rx:    (Math.random() - 0.5) * 0.3,
    ry:    (Math.random() - 0.5) * 0.4,
    rz:    (Math.random() - 0.5) * 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.12 + Math.random() * 0.25,
    size:  0.18 + Math.random() * 0.30,
    colorIdx: i % WIRE_PALETTE.length,
  })), [])

  const colors = useMemo(() => {
    const arr = new Float32Array(WIRE_COUNT * 3)
    const c   = new THREE.Color()
    data.forEach((d, i) => {
      c.set(WIRE_PALETTE[d.colorIdx])
      arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b
    })
    return arr
  }, [theme])               

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    vertexColors: true,
    wireframe:    true,
    transparent:  true,
    opacity:      theme === 'light' ? 0.22 : 0.28,
    depthWrite:   false,
  }), [theme])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    data.forEach((d, i) => {
      const wave = Math.sin(t * d.speed + d.phase + 1.2)
      dummy.position.set(
        d.ox + Math.cos(t * d.rx * 0.5 + d.phase) * 1.2,
        d.oy + wave * 0.7,
        d.oz + Math.sin(t * d.rz * 0.4 + d.phase) * 0.8,
      )
      dummy.rotation.x = t * d.rx * 0.5
      dummy.rotation.y = t * d.ry * 0.5 + d.phase
      dummy.rotation.z = t * d.rz * 0.4
      dummy.scale.setScalar(d.size)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, mat, WIRE_COUNT]} frustumCulled={false}>
      <octahedronGeometry args={[1, 1]} />
      <bufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </instancedMesh>
  )
}


function DNAHelix({ theme }: { theme: 'dark' | 'light' }) {
  const ref1 = useRef<THREE.Points>(null)
  const ref2 = useRef<THREE.Points>(null)

  const c1 = theme === 'light' ? '#0e9488' : '#4ecdc4'
  const c2 = theme === 'light' ? '#7c3aed' : '#a855f7'

  const { strand1, strand2 } = useMemo(() => {
    const s1 = new Float32Array(HELIX_COUNT * 3)
    const s2 = new Float32Array(HELIX_COUNT * 3)
    const radius = 0.6
    for (let i = 0; i < HELIX_COUNT; i++) {
      const t  = (i / HELIX_COUNT) * Math.PI * 4   
      const y  = (i / HELIX_COUNT) * 6 - 3
      s1[i * 3]     = Math.cos(t) * radius - 3.5
      s1[i * 3 + 1] = y
      s1[i * 3 + 2] = Math.sin(t) * radius - 1.5

      s2[i * 3]     = Math.cos(t + Math.PI) * radius - 3.5
      s2[i * 3 + 1] = y
      s2[i * 3 + 2] = Math.sin(t + Math.PI) * radius - 1.5
    }
    return { strand1: s1, strand2: s2 }
  }, [])

  const mat1 = useMemo(() => new THREE.PointsMaterial({
    color: c1, size: 0.06, transparent: true, opacity: theme === 'light' ? 0.7 : 0.85, depthWrite: false,
  }), [theme])
  const mat2 = useMemo(() => new THREE.PointsMaterial({
    color: c2, size: 0.06, transparent: true, opacity: theme === 'light' ? 0.7 : 0.85, depthWrite: false,
  }), [theme])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.4
    if (ref1.current) { ref1.current.rotation.y = t; ref1.current.position.y = Math.sin(t * 0.5) * 0.3 }
    if (ref2.current) { ref2.current.rotation.y = t; ref2.current.position.y = Math.sin(t * 0.5) * 0.3 }
  })

  return (
    <group>
      <points ref={ref1} material={mat1} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand1, 3]} />
        </bufferGeometry>
      </points>
      <points ref={ref2} material={mat2} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand2, 3]} />
        </bufferGeometry>
      </points>
    </group>
  )
}



function SparkField({ theme }: { theme: 'dark' | 'light' }) {
  const ref    = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(SPARK_COUNT * 3)
    for (let i = 0; i < SPARK_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.012
    if (matRef.current) {
      matRef.current.opacity = (theme === 'light' ? 0.12 : 0.22) +
        Math.sin(clock.getElapsedTime() * 0.8) * 0.06
    }
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={theme === 'light' ? '#6366f1' : '#e2e8f0'}
        size={0.018}
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </points>
  )
}


function FloatingRings({ theme }: { theme: 'dark' | 'light' }) {
  const RINGS = useMemo(() => [
    { pos: [ 3.8,  1.2, -1.5] as [number,number,number], color: '#4ecdc4', speed: 0.28, phase: 0.0, rx: 1.2, ry: 0.3 },
    { pos: [-3.5, -0.8, -1.8] as [number,number,number], color: '#a855f7', speed: 0.22, phase: 1.6, rx: 0.8, ry: 0.6 },
    { pos: [ 0.5,  2.8, -2.2] as [number,number,number], color: '#ff6b6b', speed: 0.35, phase: 3.1, rx: 0.5, ry: 1.0 },
    { pos: [-1.2, -2.4, -1.2] as [number,number,number], color: '#ffd93d', speed: 0.18, phase: 2.4, rx: 1.5, ry: 0.2 },
  ], [])

  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    RINGS.forEach((r, i) => {
      const m = refs.current[i]
      if (!m) return
      m.position.y = r.pos[1] + Math.sin(t * r.speed + r.phase) * 0.25
      m.rotation.x = t * r.rx * 0.2 + r.phase
      m.rotation.y = t * r.ry * 0.3
    })
  })

  return (
    <group>
      {RINGS.map((r, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el }}
          position={r.pos}
        >
          <torusGeometry args={[0.38, 0.025, 8, 36]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={theme === 'light' ? 0.45 : 0.65}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function GeometricBackground({ theme = 'dark' }: Props) {
  return (
    <group>
      <SparkField    theme={theme} />
      <SolidShapes   theme={theme} />
      <WireShapes    theme={theme} />
      <FloatingRings theme={theme} />
      <DNAHelix      theme={theme} />
    </group>
  )
}