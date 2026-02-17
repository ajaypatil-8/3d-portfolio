'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeRing(count: number, innerR: number, outerR: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2
    const radius = innerR + Math.random() * (outerR - innerR)
    const spread = (Math.random() - 0.5) * 0.8
    pos[i * 3]     = Math.cos(angle) * radius
    pos[i * 3 + 1] = spread
    pos[i * 3 + 2] = Math.sin(angle) * radius
  }
  return pos
}

function makeDust(count: number, spread: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * spread
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread
  }
  return pos
}

export default function Particles() {
  const ringRef = useRef<THREE.Points>(null)
  const dustRef = useRef<THREE.Points>(null)

  const ringPos = useMemo(() => makeRing(200, 1.8, 2.8), [])
  const dustPos = useMemo(() => makeDust(150, 6), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.12
      ringRef.current.rotation.x = 0.35
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = -t * 0.05
    }
  })

  return (
    <group>
      <points ref={ringRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={ringPos} count={ringPos.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#a78bfa" sizeAttenuation transparent opacity={0.85} depthWrite={false} />
      </points>

      <points ref={dustRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={dustPos} count={dustPos.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.022} color="#ffffff" sizeAttenuation transparent opacity={0.3} depthWrite={false} />
      </points>
    </group>
  )
}