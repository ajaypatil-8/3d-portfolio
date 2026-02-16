'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, PresentationControls, Stage, Grid, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import * as THREE from 'three'

interface ModelViewerProps {
  modelPath?: string
  scale?: number
  autoRotate?: boolean
}

// Placeholder 3D model component (since we can't load external GLTF)
function PlaceholderModel({ scale = 1 }: { scale: number }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group ref={meshRef} scale={scale}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color="#4ecdc4" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.2, 0.26]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Screen glow */}
      <mesh position={[0, 0.2, 0.29]}>
        <planeGeometry args={[0.85, 1.15]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </mesh>

      {/* Base */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#ff6b6b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[0.6, 0, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[-0.6, 0, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffd93d" emissive="#ffd93d" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default function InteractiveModelViewer({
  modelPath,
  scale = 1,
  autoRotate = false,
}: ModelViewerProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 10, 20]} />

      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Stage
          environment="city"
          intensity={0.6}
          shadows={{
            type: 'accumulative',
            color: '#4ecdc4',
            opacity: 0.5,
            blur: 2,
          }}
        >
          <PlaceholderModel scale={scale} />
        </Stage>
      </PresentationControls>

      <Grid
        renderOrder={-1}
        position={[0, -1.5, 0]}
        infiniteGrid
        cellSize={0.6}
        cellThickness={0.6}
        sectionSize={3}
        sectionThickness={1.5}
        sectionColor={[0.5, 0.5, 10]}
        fadeDistance={25}
        fadeStrength={1}
      />
    </>
  )
}
