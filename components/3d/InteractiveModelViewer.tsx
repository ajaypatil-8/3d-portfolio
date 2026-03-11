'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { PresentationControls, Text } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  scale?: number
  theme?: 'dark' | 'light'
}


const TEAL   = '#4ecdc4'
const CORAL  = '#ff6b6b'
const PURPLE = '#a855f7'
const GOLD   = '#fbbf24'


function GridFloor({ theme }: { theme: 'dark' | 'light' }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    side:        THREE.FrontSide,
    depthWrite:  false,
    uniforms: {
      uColor:  { value: new THREE.Color(theme === 'light' ? '#6366f1' : '#4ecdc4') },
      uTime:   { value: 0 },
      uDark:   { value: theme === 'dark' ? 1.0 : 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2  vUv;
      uniform vec3  uColor;
      uniform float uTime;
      uniform float uDark;

      void main() {
        // Grid lines
        vec2  g    = abs(fract(vUv * 14.0 - 0.5) - 0.5) / fwidth(vUv * 14.0);
        float line = min(g.x, g.y);
        float grid = 1.0 - min(line, 1.0);

        // Radial fade
        float dist  = length(vUv - 0.5);
        float fade  = 1.0 - smoothstep(0.25, 0.52, dist);

        // Outward pulse wave
        float wave  = 0.5 + 0.5 * sin(dist * 18.0 - uTime * 2.2);
        float pulse = smoothstep(0.45, 0.55, wave) * 0.45;

        float alpha = (grid * 0.55 + pulse) * fade * mix(0.55, 1.0, uDark);
        gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

  useFrame(({ clock }) => {
    if (mat.uniforms) mat.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]}>
      <planeGeometry args={[12, 12, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}


function HoloScreen({ hovered, theme }: { hovered: boolean; theme: 'dark' | 'light' }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    side:        THREE.FrontSide,
    uniforms: {
      uTime:    { value: 0 },
      uColorA:  { value: new THREE.Color(TEAL) },
      uColorB:  { value: new THREE.Color(PURPLE) },
      uHovered: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv    = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3  uColorA;
      uniform vec3  uColorB;
      uniform float uHovered;
      varying vec2  vUv;
      varying vec3  vNormal;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        // Scanlines
        float scan = step(0.5, fract(vUv.y * 28.0 + uTime * 0.6));
        float scanAlpha = mix(0.65, 1.0, scan);

        // Horizontal code bars (simulated code lines)
        float barY  = fract(vUv.y * 9.0 - uTime * 0.12);
        float barX  = step(rand(vec2(floor(vUv.y * 9.0), 1.0)) * 0.5 + 0.1, vUv.x);
        float barX2 = step(rand(vec2(floor(vUv.y * 9.0), 2.0)) * 0.3 + 0.45, vUv.x);
        float bar   = step(0.85, 1.0 - barY) * (barX - barX2) * 0.6;

        // Typing cursor
        float cursorX = rand(vec2(floor(uTime * 0.4), 0.0)) * 0.7 + 0.05;
        float cursorY = rand(vec2(floor(uTime * 0.4), 1.0));
        float cursorLine = floor(cursorY * 9.0) / 9.0;
        float cursor = step(0.0, vUv.x - cursorX) * step(vUv.x - cursorX, 0.035)
                     * step(0.0, vUv.y - cursorLine) * step(vUv.y - cursorLine, 0.09)
                     * step(0.0, fract(uTime * 1.8) - 0.0) * step(fract(uTime * 1.8), 0.55);

        // Rim glow on hovered
        float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));

        // Color mix
        float t   = vUv.y * 0.6 + vUv.x * 0.2 + sin(uTime * 0.5) * 0.1;
        vec3 col  = mix(uColorA, uColorB, clamp(t, 0.0, 1.0));
        col       = mix(col, vec3(1.0), cursor * 0.9);
        col       = mix(col, vec3(0.9, 1.0, 0.8), bar);

        float alpha = scanAlpha * 0.2 + bar * 0.55 + cursor * 0.85
                    + pow(rim, 2.0) * mix(0.25, 0.55, uHovered)
                    + 0.08;

        gl_FragColor = vec4(col, clamp(alpha * mix(0.85, 1.0, uHovered), 0.0, 1.0));
      }
    `,
  }), [])

  useFrame(({ clock }) => {
    if (!mat.uniforms) return
    mat.uniforms.uTime.value    = clock.getElapsedTime()
    mat.uniforms.uHovered.value = THREE.MathUtils.lerp(
      mat.uniforms.uHovered.value,
      hovered ? 1.0 : 0.0,
      0.08
    )
    if (theme === 'light') {
      mat.uniforms.uColorA.value.set('#0e9488')
      mat.uniforms.uColorB.value.set('#7c3aed')
    } else {
      mat.uniforms.uColorA.value.set(TEAL)
      mat.uniforms.uColorB.value.set(PURPLE)
    }
  })

  return (
    // Placed inside the screen bezel — same rotation as lid
    <mesh position={[0, 0.64, -0.488]} rotation={[-Math.PI * 0.08, 0, 0]}>
      <planeGeometry args={[1.58, 1.03]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}


function OrbitRing({
  radius, speed, color, tiltX, tiltZ, opacity,
}: {
  radius: number; speed: number; color: string; tiltX: number; tiltZ: number; opacity: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * speed
  })

  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, 0.018, 8, 80]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}


function TechOrbit({
  label, color, radius, speed, phase, height,
}: {
  label: string; color: string; radius: number; speed: number; phase: number; height: number
}) {
  const ref     = useRef<THREE.Group>(null)
  const dotRef  = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime()
    const ang = t * speed + phase
    if (ref.current) {
      ref.current.position.x = Math.cos(ang) * radius
      ref.current.position.z = Math.sin(ang) * radius
      ref.current.position.y = height + Math.sin(t * 0.6 + phase) * 0.12
      ref.current.rotation.y = -ang
    }
    if (matRef.current) {
      matRef.current.opacity = 0.75 + Math.sin(t * 1.8 + phase) * 0.15
    }
    if (dotRef.current) {
      const s = 1.0 + Math.sin(t * 2.5 + phase) * 0.2
      dotRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={ref}>
      {/* Glowing dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.85} depthWrite={false} />
      </mesh>
      {/* Label */}
      <Text
        position={[0.14, 0, 0]}
        fontSize={0.095}
        color={color}
        anchorX="left"
        anchorY="middle"
        fillOpacity={0.9}
        font={undefined}
      >
        {label}
      </Text>
    </group>
  )
}



function LaptopModel({ theme, hovered, onHover }: {
  theme: 'dark' | 'light'
  hovered: boolean
  onHover: (v: boolean) => void
}) {
  const group  = useRef<THREE.Group>(null)
  const gemRef = useRef<THREE.Mesh>(null)

  const bodyColor   = theme === 'light' ? '#374151' : '#1e293b'
  const lidColor    = theme === 'light' ? '#374151' : '#1e293b'
  const kbdColor    = theme === 'light' ? '#4b5563' : '#334155'
  const screenColor = theme === 'light' ? '#1e293b' : '#0f172a'
  const speakerColor = theme === 'light' ? '#6b7280' : '#475569'

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    // Gentle float
    group.current.position.y = Math.sin(t * 0.7) * 0.055
    // Subtle tilt response to hover
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      hovered ? -0.05 : 0,
      0.04
    )
    // Gem pulsing
    if (gemRef.current) {
      const mat = gemRef.current.material as THREE.MeshPhongMaterial
      mat.emissiveIntensity = 0.5 + Math.sin(t * 2.2) * 0.3
    }
  })

  return (
    <group
      ref={group}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >

      <mesh position={[0, -0.14, 0.08]}>
        <boxGeometry args={[1.85, 0.075, 1.22]} />
        <meshPhongMaterial color={bodyColor} shininess={140} specular="#4b5563" />
      </mesh>


      <mesh position={[0, -0.10, 0.04]}>
        <boxGeometry args={[1.65, 0.012, 1.02]} />
        <meshPhongMaterial color={kbdColor} shininess={50} />
      </mesh>


      {[-0.28, -0.12, 0.04, 0.18].map((z, ri) => (
        <mesh key={ri} position={[0, -0.093, z]}>
          <boxGeometry args={[1.5, 0.008, 0.08]} />
          <meshPhongMaterial color={kbdColor} shininess={80} />
        </mesh>
      ))}

      <mesh position={[0, -0.094, 0.35]}>
        <boxGeometry args={[0.52, 0.008, 0.34]} />
        <meshPhongMaterial color={kbdColor} shininess={220} specular="#94a3b8" />
      </mesh>
      {/* Trackpad click line */}
      <mesh position={[0, -0.089, 0.49]}>
        <boxGeometry args={[0.5, 0.004, 0.006]} />
        <meshPhongMaterial color={speakerColor} />
      </mesh>

      {/* ── Hinge ── */}
      <mesh position={[0, -0.088, -0.52]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.85, 0.055, 0.055]} />
        <meshPhongMaterial color={bodyColor} shininess={180} specular="#64748b" />
      </mesh>

      {/* ── Speaker grilles (left & right) ── */}
      {[-0.82, 0.82].map((x, i) => (
        <mesh key={i} position={[x, -0.10, 0.52]}>
          <boxGeometry args={[0.15, 0.01, 0.06]} />
          <meshPhongMaterial color={speakerColor} shininess={60} />
        </mesh>
      ))}

      <mesh position={[0, 0.62, -0.50]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[1.85, 1.22, 0.055]} />
        <meshPhongMaterial color={lidColor} shininess={180} specular="#475569" />
      </mesh>

      {/* ── Bezel (inner screen frame) ── */}
      <mesh position={[0, 0.635, -0.478]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[1.72, 1.10, 0.008]} />
        <meshPhongMaterial color={screenColor} shininess={280} />
      </mesh>

      {/* ── Holographic screen content (shader) ── */}
      <HoloScreen hovered={hovered} theme={theme} />

      {/* ── Webcam notch ── */}
      <mesh position={[0, 1.21, -0.488]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshPhongMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.6} />
      </mesh>


      <mesh
        ref={gemRef}
        position={[0, 0.63, -0.53]}
        rotation={[Math.PI * 0.92, 0, 0]}
      >
        <octahedronGeometry args={[0.11, 0]} />
        <meshPhongMaterial
          color={hovered ? CORAL : TEAL}
          emissive={hovered ? CORAL : TEAL}
          emissiveIntensity={0.55}
          shininess={320}
          transparent
          opacity={0.9}
        />
      </mesh>


      <mesh position={[0, -0.115, 0.615]}>
        <boxGeometry args={[1.82, 0.022, 0.03]} />
        <meshPhongMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.55} />
      </mesh>

      {/* ── USB-C port indicators (side ports) ── */}
      {[-0.92, 0.92].map((x, i) => (
        <mesh key={i} position={[x, -0.125, -0.1]}>
          <boxGeometry args={[0.02, 0.028, 0.065]} />
          <meshBasicMaterial color={i === 0 ? TEAL : PURPLE} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}



function HoverParticles({ active }: { active: boolean }) {
  const ref    = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const velRef = useRef<Float32Array | null>(null)
  const posRef = useRef<Float32Array | null>(null)

  const COUNT = 30

  const { pos, vel } = useMemo(() => {
    const p = new Float32Array(COUNT * 3)
    const v = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 0.2
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.2
      v[i * 3]     = (Math.random() - 0.5) * 0.04
      v[i * 3 + 1] = Math.random() * 0.03 + 0.01
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.03
    }
    posRef.current = p.slice()
    velRef.current = v
    return { pos: p, vel: v }
  }, [])

  useFrame(() => {
    if (!ref.current || !ref.current.geometry || !posRef.current || !velRef.current) return
    if (!active) {

      for (let i = 0; i < COUNT; i++) {
        posRef.current[i * 3]     = (Math.random() - 0.5) * 0.2
        posRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.2
        posRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.2
      }
      if (matRef.current) matRef.current.opacity = 0
      return
    }
    for (let i = 0; i < COUNT; i++) {
      posRef.current[i * 3]     += velRef.current[i * 3]
      posRef.current[i * 3 + 1] += velRef.current[i * 3 + 1]
      posRef.current[i * 3 + 2] += velRef.current[i * 3 + 2]
      velRef.current[i * 3 + 1] -= 0.0006    
    }
    const attr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute
    attr.array.set(posRef.current)
    attr.needsUpdate = true
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, active ? 0.8 : 0, 0.1)
    }
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} color={TEAL} size={0.05} transparent opacity={0} depthWrite={false} />
    </points>
  )
}



const TECH_TAGS = [
  { label: 'Java',        color: CORAL,  radius: 2.3, speed:  0.28, phase: 0.0, height:  0.2  },
  { label: 'Spring Boot', color: '#4ade80', radius: 2.5, speed: -0.22, phase: 1.1, height:  0.5  },
  { label: 'React',       color: '#60a5fa', radius: 2.4, speed:  0.32, phase: 2.2, height: -0.2  },
  { label: 'Next.js',     color: TEAL,   radius: 2.2, speed: -0.26, phase: 3.3, height:  0.8  },
  { label: 'Docker',      color: '#3b82f6', radius: 2.6, speed:  0.20, phase: 4.4, height: -0.5  },
  { label: 'PostgreSQL',  color: PURPLE, radius: 2.3, speed: -0.30, phase: 5.5, height:  0.0  },
  { label: 'Kafka',       color: GOLD,   radius: 2.5, speed:  0.24, phase: 0.8, height: -0.8  },
]


export default function InteractiveModelViewer({ scale = 1, theme = 'dark' }: Props) {
  const [hovered, setHovered] = useState(false)

  const ambientIntensity = theme === 'light' ? 1.4 : 0.5
  const dirIntensity     = theme === 'light' ? 0.5 : 1.4

  return (
    <>

      <ambientLight  intensity={ambientIntensity} />
      <directionalLight position={[ 4,  8,  4]} intensity={dirIntensity} color="#ffffff" />
      <directionalLight position={[-4,  2, -3]} intensity={0.5}          color="#8b5cf6" />
      <pointLight       position={[ 0,  4,  2]} intensity={1.0}           color={TEAL}   distance={9}  />
      <pointLight       position={[ 2,  0,  3]} intensity={0.6}           color={CORAL}  distance={6}  />
      <pointLight       position={[-2, -1,  2]} intensity={0.4}           color={PURPLE} distance={5}  />

      {/* ── Orbit rings around the laptop ── */}
      <OrbitRing radius={1.55} speed={ 0.25} color={TEAL}   tiltX={Math.PI * 0.22} tiltZ={0}              opacity={theme === 'light' ? 0.35 : 0.55} />
      <OrbitRing radius={1.80} speed={-0.18} color={PURPLE} tiltX={Math.PI * 0.12} tiltZ={Math.PI * 0.08} opacity={theme === 'light' ? 0.25 : 0.40} />
      <OrbitRing radius={2.05} speed={ 0.12} color={CORAL}  tiltX={Math.PI * 0.30} tiltZ={Math.PI * 0.15} opacity={theme === 'light' ? 0.18 : 0.30} />


      <PresentationControls
        global
        config={{ mass: 1, tension: 280 }}
        snap={{ mass: 2, tension: 400 }}
        rotation={[0.12, 0.3, 0]}
        polar={[-Math.PI / 5, Math.PI / 5]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
      >
        <group scale={scale}>
          <LaptopModel theme={theme} hovered={hovered} onHover={setHovered} />
          <HoverParticles active={hovered} />
        </group>
      </PresentationControls>

      {/* ── Floating tech tags ── */}
      {TECH_TAGS.map(t => (
        <TechOrbit key={t.label} {...t} />
      ))}

      {/* ── Grid floor ── */}
      <GridFloor theme={theme} />
    </>
  )
}