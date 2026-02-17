'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AnimatedTorus() {
  const torusRef = useRef<THREE.Mesh>(null)
  const tick = useRef(0)

  useFrame((state) => {
    tick.current++
    if (tick.current % 2 !== 0) return
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
    }
  })

  return (
    // Reduced tubularSegments 128 → 64 for better perf
    <mesh ref={torusRef}>
      <torusKnotGeometry args={[1, 0.3, 64, 12]} />
      <meshStandardMaterial
        color="#4ecdc4"
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}
