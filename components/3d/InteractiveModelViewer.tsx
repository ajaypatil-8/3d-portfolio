'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  scale?: number
  theme?: 'dark' | 'light'
}

function GridFloor({ theme }: { theme: 'dark' | 'light' }) {
  const gridColor = theme === 'light' ? '#9ca3af' : '#1a1a2e'

  const mat = useMemo(() =>
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.FrontSide,
      uniforms: { uColor: { value: new THREE.Color(gridColor) } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        void main() {
          vec2 grid = abs(fract(vUv * 12.0 - 0.5) - 0.5) / fwidth(vUv * 12.0);
          float line = min(grid.x, grid.y);
          float alpha = 1.0 - min(line, 1.0);
          float fade = 1.0 - smoothstep(0.3, 0.5, length(vUv - 0.5));
          gl_FragColor = vec4(uColor, alpha * fade * 0.6);
        }
      `,
    }), [gridColor])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
      <planeGeometry args={[10, 10, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

function PortfolioModel({ theme }: { theme: 'dark' | 'light' }) {
  const group    = useRef<THREE.Group>(null)
  const glowMesh = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const teal   = '#4ecdc4'
  const coral  = '#ff6b6b'
  const purple = '#a855f7'
  // Laptop body adapts to theme
  const dark   = theme === 'light' ? '#374151' : '#111827'
  const kbd    = theme === 'light' ? '#4b5563' : '#1e293b'
  const screen = theme === 'light' ? '#1e293b' : '#0f172a'

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.position.y = Math.sin(t * 0.8) * 0.06
    if (glowMesh.current) {
      const mat = glowMesh.current.material as THREE.MeshPhongMaterial
      mat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2
    }
  })

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh position={[0, -0.15, 0.1]}>
        <boxGeometry args={[1.8, 0.08, 1.2]} />
        <meshPhongMaterial color={dark} shininess={120} specular="#334155" />
      </mesh>
      <mesh position={[0, -0.1, 0.05]}>
        <boxGeometry args={[1.6, 0.01, 1.0]} />
        <meshPhongMaterial color={kbd} shininess={60} />
      </mesh>
      <mesh position={[0, -0.09, -0.5]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[1.82, 0.06, 0.06]} />
        <meshPhongMaterial color={dark} shininess={160} specular="#475569" />
      </mesh>
      <mesh position={[0, 0.62, -0.52]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[1.8, 1.2, 0.06]} />
        <meshPhongMaterial color={dark} shininess={160} specular="#334155" />
      </mesh>
      <mesh ref={glowMesh} position={[0, 0.64, -0.49]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[1.6, 1.05, 0.01]} />
        <meshPhongMaterial color={screen} emissive={teal} emissiveIntensity={0.45} shininess={200} />
      </mesh>
      {[0.3, 0.1, -0.1, -0.25].map((y, i) => (
        <mesh key={i} position={[-0.45 + i * 0.05, 0.64 + y, -0.482]} rotation={[-Math.PI * 0.08, 0, 0]}>
          <boxGeometry args={[0.5 + (i % 2) * 0.3, 0.02, 0.001]} />
          <meshBasicMaterial color={i % 2 === 0 ? coral : purple} />
        </mesh>
      ))}
      <mesh position={[0, -0.1, 0.28]}>
        <boxGeometry args={[0.5, 0.01, 0.35]} />
        <meshPhongMaterial color={kbd} shininess={200} specular="#64748b" />
      </mesh>
      <mesh position={[0, 0.65, -0.55]} rotation={[Math.PI * 0.92, 0, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhongMaterial color={hovered ? coral : teal} emissive={hovered ? coral : teal} emissiveIntensity={0.6} shininess={300} />
      </mesh>
      <mesh position={[0, -0.12, 0.7]}>
        <boxGeometry args={[1.8, 0.03, 0.04]} />
        <meshPhongMaterial color={purple} emissive={purple} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default function InteractiveModelViewer({ scale = 1, theme = 'dark' }: Props) {
  const ambientIntensity = theme === 'light' ? 1.2 : 0.4
  const dirIntensity     = theme === 'light' ? 0.6 : 1.2

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[4, 6, 4]}   intensity={dirIntensity} color="#ffffff" />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#8b5cf6" />
      <pointLight       position={[0, 3, 2]}   intensity={0.8} color="#4ecdc4" distance={8} />
      <PresentationControls
        global
        config={{ mass: 1, tension: 280 }}
        snap={{ mass: 2, tension: 400 }}
        rotation={[0.15, 0.3, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
      >
        <group scale={scale}>
          <PortfolioModel theme={theme} />
        </group>
      </PresentationControls>
      <GridFloor theme={theme} />
    </>
  )
}