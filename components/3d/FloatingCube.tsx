'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingCubeProps {
  position: [number, number, number]
  color: string
  speed?: number
}

export default function FloatingCube({
  position,
  color,
  speed = 1,
}: FloatingCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3 * speed
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5 * speed
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.2
    }
  })

  return (
    <RoundedBox
      ref={meshRef}
      args={[0.5, 0.5, 0.5]}
      radius={0.05}
      smoothness={4}
      position={position}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        envMapIntensity={1}
      />
    </RoundedBox>
  )
}
