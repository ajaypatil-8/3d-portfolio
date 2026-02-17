'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Reduced from 50 → 24 points, no connecting bars on every 3rd point
export default function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  const tick = useRef(0)

  const helixPoints = 24
  const radius = 1
  const height = 4

  useFrame((state) => {
    tick.current++
    if (tick.current % 2 !== 0) return
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: helixPoints }).map((_, i) => {
        const t  = (i / helixPoints) * Math.PI * 4
        const x1 = Math.cos(t) * radius
        const y  = (i / helixPoints) * height - height / 2
        const z1 = Math.sin(t) * radius
        const x2 = Math.cos(t + Math.PI) * radius
        const z2 = Math.sin(t + Math.PI) * radius

        return (
          <group key={i}>
            <mesh position={[x1, y, z1]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            <mesh position={[x2, y, z2]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#4ecdc4" />
            </mesh>
            {i % 4 === 0 && (
              <mesh position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}>
                <cylinderGeometry args={[0.025, 0.025, radius * 2, 6]} />
                <meshStandardMaterial color="#a855f7" />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}
