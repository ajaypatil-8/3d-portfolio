'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────────────────────
   SHADER SAFETY RULES (applied throughout this file):
   1. Never declare  attribute vec3 color  — Three.js reserves that name.
      Use  aColor  for any custom per-vertex / per-instance colour attribute.
   2. Never set  vertexColors: true  on a ShaderMaterial — it injects the
      reserved declaration and causes a GLSL redefinition compile error.
   3. All uniforms are updated via  mesh.material  ref in useFrame, never
      from a closed-over useMemo value (avoids stale-closure bugs).
   ───────────────────────────────────────────────────────────────────────────── */

interface Props { theme?: 'dark' | 'light' }

/* ═══════════════════════════════════════════════════════════════════════════
   1. PLASMA CORE — the big central glowing crystal (matches image 2 center)
   ═══════════════════════════════════════════════════════════════════════════ */
function PlasmaCore({ theme }: { theme: 'dark' | 'light' }) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const coreRef  = useRef<THREE.Mesh>(null)

  /* Outer icosahedron — multicolour faces via ShaderMaterial, NO aColor attribute needed */
  const outerMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    side:        THREE.FrontSide,
    uniforms: {
      uTime:  { value: 0 },
      uAlpha: { value: theme === 'light' ? 0.55 : 0.75 },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vViewPos;
      varying vec3 vWorldPos;
      void main() {
        vec4 mvp = modelViewMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(normalMatrix * normal);
        vViewPos     = -mvp.xyz;
        vWorldPos    = position;
        gl_Position  = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uAlpha;
      varying vec3  vWorldNormal;
      varying vec3  vViewPos;
      varying vec3  vWorldPos;
      void main() {
        /* Face colour from world-position hash */
        float h    = dot(normalize(vWorldNormal), vec3(1.0, 0.8, 0.6));
        vec3  colA = vec3(0.88, 0.20, 0.80);   /* pink   */
        vec3  colB = vec3(0.40, 0.30, 0.95);   /* indigo */
        vec3  colC = vec3(0.10, 0.78, 0.80);   /* teal   */
        vec3  colD = vec3(0.95, 0.40, 0.20);   /* coral  */
        float t    = fract(h * 3.7 + uTime * 0.08);
        vec3  col  = mix(colA, colB, smoothstep(0.0, 0.33, t));
        col        = mix(col,  colC, smoothstep(0.33, 0.66, t));
        col        = mix(col,  colD, smoothstep(0.66, 1.0,  t));
        /* Rim fresnel */
        float rim  = 1.0 - abs(dot(normalize(vWorldNormal), normalize(vViewPos)));
        col       += vec3(0.6, 0.7, 1.0) * pow(rim, 2.5) * 0.55;
        float alpha = (0.45 + pow(rim, 1.8) * 0.45) * uAlpha;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

  /* Inner solid core */
  const innerMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    uniforms: {
      uTime:  { value: 0 },
      uDark:  { value: theme === 'dark' ? 1.0 : 0.0 },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vViewPos;
      void main() {
        vec4 mvp = modelViewMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(normalMatrix * normal);
        vViewPos     = -mvp.xyz;
        gl_Position  = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uDark;
      varying vec3  vWorldNormal;
      varying vec3  vViewPos;
      void main() {
        float rim  = 1.0 - abs(dot(normalize(vWorldNormal), normalize(vViewPos)));
        vec3  dark = vec3(0.05, 0.08, 0.22);
        vec3  lite = vec3(0.55, 0.62, 0.90);
        vec3  col  = mix(lite, dark, uDark);
        col       += vec3(0.30, 0.55, 1.0) * pow(rim, 1.8) * 0.65;
        float alpha = 0.55 + pow(rim, 2.2) * 0.40;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

  /* Glow halo — simple BackSide sphere */
  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    side:        THREE.BackSide,
    uniforms: {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(theme === 'light' ? '#aab8e8' : '#4455cc') },
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      void main() {
        vWorldNormal = normalize(normalMatrix * normal);
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3  uColor;
      uniform float uTime;
      varying vec3  vWorldNormal;
      void main() {
        float edge  = 1.0 - abs(dot(vWorldNormal, vec3(0.0, 0.0, 1.0)));
        float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
        float alpha = pow(edge, 1.5) * 0.45 * pulse;
        gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

  /* Wireframe shell over the gem */
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color:       theme === 'light' ? '#8899cc' : '#6677bb',
    wireframe:   true,
    transparent: true,
    opacity:     theme === 'light' ? 0.22 : 0.35,
    depthWrite:  false,
  }), [theme])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.22
      outerRef.current.rotation.x = t * 0.14
      const m = outerRef.current.material as THREE.ShaderMaterial
      if (m?.uniforms?.uTime) m.uniforms.uTime.value = t
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.18
      innerRef.current.rotation.z =  t * 0.10
      const m = innerRef.current.material as THREE.ShaderMaterial
      if (m?.uniforms?.uTime) m.uniforms.uTime.value = t
    }
    if (glowRef.current) {
      const s = 1.0 + Math.sin(t * 1.2) * 0.04
      glowRef.current.scale.setScalar(s)
      const m = glowRef.current.material as THREE.ShaderMaterial
      if (m?.uniforms?.uTime) m.uniforms.uTime.value = t
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.30
      coreRef.current.rotation.x = t * 0.20
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.55, 20, 20]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Outer icosahedron — colourful */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.10, 1]} />
        <primitive object={outerMat} attach="material" />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.12, 1]} />
        <primitive object={wireMat} attach="material" />
      </mesh>

      {/* Inner dense core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.72, 0]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. AURORA RINGS — 3 large orbit rings (teal, pink, purple) from image 2
   ═══════════════════════════════════════════════════════════════════════════ */
function AuroraRings({ theme }: { theme: 'dark' | 'light' }) {
  const RINGS = [
    { color: '#4ecdc4', radius: 1.90, tube: 0.018, tiltX: Math.PI * 0.08, tiltZ: 0,              speed:  0.22, opacity: theme === 'light' ? 0.55 : 0.72 },
    { color: '#ff6b6b', radius: 2.20, tube: 0.014, tiltX: Math.PI * 0.55, tiltZ: Math.PI * 0.12, speed: -0.18, opacity: theme === 'light' ? 0.40 : 0.58 },
    { color: '#a855f7', radius: 2.50, tube: 0.012, tiltX: Math.PI * 0.30, tiltZ: Math.PI * 0.25, speed:  0.14, opacity: theme === 'light' ? 0.32 : 0.48 },
  ]

  /* One ShaderMaterial per ring — sweep animation, no custom attributes */
  const mats = useMemo(() => RINGS.map(r => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    uniforms: {
      uTime:    { value: 0 },
      uColor:   { value: new THREE.Color(r.color) },
      uOpacity: { value: r.opacity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime, uOpacity;
      uniform vec3  uColor;
      varying vec2  vUv;
      void main() {
        float base  = 0.55 + 0.45 * sin(uTime * 1.6 + vUv.x * 6.283);
        float sweep = smoothstep(0.0, 0.14, fract(vUv.x - uTime * 0.12)) *
                      smoothstep(0.32, 0.08, fract(vUv.x - uTime * 0.12));
        float alpha = (base * 0.65 + sweep * 0.80) * uOpacity;
        gl_FragColor = vec4(uColor + sweep * 0.25, clamp(alpha, 0.0, uOpacity * 1.2));
      }
    `,
  })), [theme]) // eslint-disable-line

  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    RINGS.forEach((r, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      mesh.rotation.y = t * r.speed
      const m = mesh.material as THREE.ShaderMaterial
      if (m?.uniforms?.uTime) m.uniforms.uTime.value = t
    })
  })

  return (
    <group>
      {RINGS.map((r, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el }}
          rotation={[r.tiltX, 0, r.tiltZ]}
        >
          <torusGeometry args={[r.radius, r.tube, 8, 180]} />
          <primitive object={mats[i]} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. CRYSTAL SHARDS — small floating wireframe octahedra (the little gray
      shapes visible all around in image 2)
   ═══════════════════════════════════════════════════════════════════════════ */
function CrystalShards({ theme }: { theme: 'dark' | 'light' }) {
  const COUNT = 16
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    ox:    (Math.random() - 0.5) * 9,
    oy:    (Math.random() - 0.5) * 7,
    oz:    (Math.random() - 0.5) * 4 - 1,
    rx:    (Math.random() - 0.5) * 0.40,
    ry:    (Math.random() - 0.5) * 0.50,
    rz:    (Math.random() - 0.5) * 0.28,
    phase: Math.random() * Math.PI * 2,
    speed: 0.12 + Math.random() * 0.25,
    size:  0.16 + Math.random() * 0.28,
  })), [])

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color:       theme === 'light' ? '#8899bb' : '#99aacc',
    wireframe:   true,
    transparent: true,
    opacity:     theme === 'light' ? 0.35 : 0.50,
    depthWrite:  false,
  }), [theme])

  const meshRef = useRef<THREE.InstancedMesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    data.forEach((d, i) => {
      const wave = Math.sin(t * d.speed + d.phase)
      dummy.position.set(
        d.ox + Math.sin(t * d.rx * 0.6 + d.phase) * 0.8,
        d.oy + wave * 0.5,
        d.oz + Math.cos(t * d.rz * 0.4 + d.phase) * 0.5,
      )
      dummy.rotation.set(t * d.rx * 0.5, t * d.ry * 0.5, t * d.rz * 0.4)
      dummy.scale.setScalar(d.size * (0.85 + 0.15 * wave))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, mat, COUNT]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CONSTELLATION WEB — drifting dots + connecting lines (the network
      of lines visible behind/around the crystal in image 2)

   FIX: Float32Array.set is guarded with a length check every frame.
        linePositions are capped strictly at LINK_MAX before writing.
   ═══════════════════════════════════════════════════════════════════════════ */
function ConstellationWeb({ theme, isMobile }: { theme: 'dark' | 'light'; isMobile: boolean }) {
  const groupRef  = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef  = useRef<THREE.LineSegments>(null)

  const COUNT     = isMobile ? 80 : 160
  const LINK_DIST = 1.15
  const LINK_MAX  = isMobile ? 55 : 120

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    const R   = 4.5
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = R * (0.40 + Math.random() * 0.60)
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.70
      pos[i*3+2] = r * Math.cos(phi) - 0.5
      vel[i*3]   = (Math.random() - 0.5) * 0.0025
      vel[i*3+1] = (Math.random() - 0.5) * 0.0025
      vel[i*3+2] = (Math.random() - 0.5) * 0.0025
    }
    return { positions: pos, velocities: vel }
  }, [COUNT])

  /* linePositions: scratch buffer we write to each frame */
  const linePositions = useMemo(() => new Float32Array(LINK_MAX * 2 * 3), [LINK_MAX])

  /* lineGeo: owns a SEPARATE Float32Array of exactly the right capacity */
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array(LINK_MAX * 2 * 3), 3,
    ))
    return g
  }, [LINK_MAX])

  const dotMat = useMemo(() => new THREE.PointsMaterial({
    color: theme === 'light' ? '#6366f1' : '#a78bfa',
    size: isMobile ? 0.022 : 0.026,
    transparent: true,
    opacity: theme === 'light' ? 0.55 : 0.82,
    depthWrite: false, sizeAttenuation: true,
  }), [theme, isMobile])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: theme === 'light' ? '#6366f1' : '#818cf8',
    transparent: true,
    opacity: theme === 'light' ? 0.14 : 0.26,
    depthWrite: false,
  }), [theme])

  const posRef = useRef(positions.slice())

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = posRef.current
    const v = velocities
    const R = 4.5

    for (let i = 0; i < COUNT; i++) {
      p[i*3]   += v[i*3]   + Math.sin(t * 0.38 + i) * 0.0006
      p[i*3+1] += v[i*3+1] + Math.cos(t * 0.32 + i * 1.2) * 0.0006
      p[i*3+2] += v[i*3+2]
      const d = Math.sqrt(p[i*3]**2 + p[i*3+1]**2 + p[i*3+2]**2)
      if (d > R) { p[i*3] *= R/d*0.98; p[i*3+1] *= R/d*0.98; p[i*3+2] *= R/d*0.98 }
    }

    /* Points — guarded set */
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
      if (attr?.array && attr.array.length === p.length) {
        ;(attr.array as Float32Array).set(p)
        attr.needsUpdate = true
      }
    }

    /* Lines — strictly capped, then guarded set */
    let lc = 0
    outer: for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (lc >= LINK_MAX) break outer
        const dx = p[i*3]-p[j*3], dy = p[i*3+1]-p[j*3+1], dz = p[i*3+2]-p[j*3+2]
        if (dx*dx + dy*dy + dz*dz < LINK_DIST * LINK_DIST) {
          const b = lc * 6
          linePositions[b]   = p[i*3];   linePositions[b+1] = p[i*3+1]; linePositions[b+2] = p[i*3+2]
          linePositions[b+3] = p[j*3];   linePositions[b+4] = p[j*3+1]; linePositions[b+5] = p[j*3+2]
          lc++
        }
      }
    }
    lineGeo.setDrawRange(0, lc * 2)
    const la = lineGeo.getAttribute('position') as THREE.BufferAttribute
    if (la?.array && la.array.length >= lc * 6) {
      ;(la.array as Float32Array).set(linePositions.subarray(0, lc * 6))
      la.needsUpdate = true
    }

    if (groupRef.current) groupRef.current.rotation.y = t * 0.030
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} frustumCulled={false} material={dotMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
      </points>
      <lineSegments ref={linesRef} frustumCulled={false} geometry={lineGeo} material={lineMat} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. ETHEREAL DUST — soft floating particles, background layer
   ═══════════════════════════════════════════════════════════════════════════ */
function EtherealDust({ theme, isMobile }: { theme: 'dark' | 'light'; isMobile: boolean }) {
  const ref    = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const COUNT  = isMobile ? 160 : 320

  /* Positions built once — never mutated in useFrame */
  const pos = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 18
      arr[i*3+1] = (Math.random() - 0.5) * 12
      arr[i*3+2] = (Math.random() - 0.5) * 10 - 2
    }
    return arr
  }, [COUNT])

  /* Only rotation + opacity mutated each frame — no .set() calls */
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.y = t * 0.014
      ref.current.rotation.x = t * 0.006
    }
    if (matRef.current) {
      matRef.current.opacity = (theme === 'light' ? 0.12 : 0.28) + Math.sin(t * 0.5) * 0.04
    }
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={isMobile ? 0.012 : 0.016}
        color={theme === 'light' ? '#6366f1' : '#c4b5fd'}
        transparent opacity={0.25}
        depthWrite={false} sizeAttenuation
      />
    </points>
  )
}

/* ─── Export ─────────────────────────────────────────────────────────────── */
export default function GeometricBackground({ theme = 'dark' }: Props) {
  return (
    <group>
      <EtherealDust      theme={theme} isMobile={false} />
      <ConstellationWeb  theme={theme} isMobile={false} />
      <CrystalShards     theme={theme} />
      <AuroraRings       theme={theme} />
      <PlasmaCore        theme={theme} />
    </group>
  )
}

/* Named export for Hero to use with isMobile flag */
export function GeometricBackgroundScene({
  theme = 'dark', isMobile = false,
}: { theme?: 'dark' | 'light'; isMobile?: boolean }) {
  return (
    <group>
      <EtherealDust      theme={theme} isMobile={isMobile} />
      <ConstellationWeb  theme={theme} isMobile={isMobile} />
      <CrystalShards     theme={theme} />
      <AuroraRings       theme={theme} />
      <PlasmaCore        theme={theme} />
    </group>
  )
}