'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 60

interface Props {
  theme?: 'dark' | 'light'
}

export default function GeometricBackground({ theme = 'dark' }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])


  const PALETTE = theme === 'light'
    ? ['#dc2626', '#0e9488', '#7c3aed', '#d97706', '#2563eb']
    : ['#ff6b6b', '#4ecdc4', '#a855f7', '#ffd93d', '#60a5fa']

  const data = useMemo(() => {
    const arr = []
    for (let i = 0; i < COUNT; i++) {
      arr.push({
        ox: (Math.random() - 0.5) * 7,
        oy: (Math.random() - 0.5) * 7,
        oz: (Math.random() - 0.5) * 7,
        ax: (Math.random() - 0.5) * 0.4,
        ay: (Math.random() - 0.5) * 0.4,
        az: (Math.random() - 0.5) * 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        size:  0.08 + Math.random() * 0.14,
      })
    }
    return arr
  }, [])

  const colorAttr = useMemo(() => {
    const colors = new Float32Array(COUNT * 3)
    const c = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      c.set(PALETTE[i % PALETTE.length])
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return colors
  }, [theme])


  const opacity = theme === 'light' ? 0.75 : 0.55

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const d    = data[i]
      const wave = Math.sin(t * d.speed + d.phase)
      const s    = d.size * (0.7 + 0.3 * wave)
      dummy.position.set(
        d.ox + Math.sin(t * d.ax + d.phase) * 0.8,
        d.oy + wave * 0.6,
        d.oz + Math.cos(t * d.az + d.phase) * 0.5,
      )
      dummy.rotation.set(t * d.ax * 0.5, t * d.ay * 0.5, t * d.az * 0.5)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial vertexColors transparent opacity={opacity} />
      <bufferAttribute attach="geometry-attributes-color" array={colorAttr} count={COUNT} itemSize={3} />
    </instancedMesh>
  )
}