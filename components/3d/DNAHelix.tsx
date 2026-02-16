'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)

  const helixPoints = 50
  const radius = 1
  const height = 4

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: helixPoints }).map((_, i) => {
        const t = (i / helixPoints) * Math.PI * 4
        const x1 = Math.cos(t) * radius
        const y = (i / helixPoints) * height - height / 2
        const z1 = Math.sin(t) * radius

        const x2 = Math.cos(t + Math.PI) * radius
        const z2 = Math.sin(t + Math.PI) * radius

        return (
          <group key={i}>
            {/* First strand */}
            <mesh position={[x1, y, z1]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>

            {/* Second strand */}
            <mesh position={[x2, y, z2]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#4ecdc4" />
            </mesh>

            {/* Connecting bar */}
            {i % 3 === 0 && (
              <mesh
                position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
                rotation={[0, Math.atan2(z2 - z1, x2 - x1), 0]}
              >
                <cylinderGeometry args={[0.03, 0.03, radius * 2, 8]} />
                <meshStandardMaterial color="#a855f7" />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}
