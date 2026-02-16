'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AnimatedTorus() {
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.4
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.6
      torusRef.current.rotation.z = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <mesh ref={torusRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial
        color="#4ecdc4"
        roughness={0.1}
        metalness={0.9}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}
