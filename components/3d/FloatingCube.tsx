'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingCubeProps {
  position: [number, number, number]
  color: string
  speed?: number
}

export default function FloatingCube({ position, color, speed = 1 }: FloatingCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const tick = useRef(0)

  useFrame((state) => {
    tick.current++
    if (tick.current % 2 !== 0) return
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.25 * speed
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.35 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed * 0.7) * 0.15
    }
  })

  return (
    // Plain box instead of RoundedBox — much lighter
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
    </mesh>
  )
}
