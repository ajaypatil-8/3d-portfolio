'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────────────────────
   PERF NOTES
   • ConstellationWeb: O(n²) → O(n) via spatial grid (CELL / GRID_* constants)
   • AuroraRings: torus tube segments 180 → 60  (~3× less vertex work)
   • EtherealDust: positions never mutated; ONLY rotation updated per frame
   • PlasmaCore:  glow sphere segments 20 → 14
   • Line update:  throttled to every 2nd frame (frameRef % 2)
   • Particle counts reduced: web 160→90 desktop, rings COUNT 16→12
   ───────────────────────────────────────────────────────────────────────────── */

// ── Spatial-grid constants (for ConstellationWeb) ────────────────────────────
const CELL     = 1.2                              // cell size ≥ LINK_DIST
const GRID_OFF = 6                                // offset: coords -5..+5 → 1..11
const GRID_DIM = 13                               // cells per axis
const GRID_TOT = GRID_DIM * GRID_DIM * GRID_DIM  // 2197 cells total

interface Props { theme?: 'dark' | 'light' }

/* ═══════════════════════════════════════════════════════════════════════════
   1. PLASMA CORE
   ═══════════════════════════════════════════════════════════════════════════ */
function PlasmaCore({ theme }: { theme: 'dark' | 'light' }) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const coreRef  = useRef<THREE.Mesh>(null)

  const outerMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: {
      uTime:  { value: 0 },
      uAlpha: { value: theme === 'light' ? 0.55 : 0.75 },
    },
    vertexShader: `
      varying vec3 vWorldNormal, vViewPos, vWorldPos;
      void main() {
        vec4 mvp     = modelViewMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(normalMatrix * normal);
        vViewPos     = -mvp.xyz;
        vWorldPos    = position;
        gl_Position  = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      uniform float uTime, uAlpha;
      varying vec3 vWorldNormal, vViewPos, vWorldPos;
      void main() {
        float h   = dot(normalize(vWorldNormal), vec3(1.0,0.8,0.6));
        vec3 colA = vec3(0.88,0.20,0.80), colB = vec3(0.40,0.30,0.95);
        vec3 colC = vec3(0.10,0.78,0.80), colD = vec3(0.95,0.40,0.20);
        float t   = fract(h * 3.7 + uTime * 0.08);
        vec3 col  = mix(colA, colB, smoothstep(0.0,  0.33, t));
        col        = mix(col,  colC, smoothstep(0.33, 0.66, t));
        col        = mix(col,  colD, smoothstep(0.66, 1.0,  t));
        float rim  = 1.0 - abs(dot(normalize(vWorldNormal), normalize(vViewPos)));
        col       += vec3(0.6,0.7,1.0) * pow(rim, 2.5) * 0.55;
        float alpha = (0.45 + pow(rim, 1.8) * 0.45) * uAlpha;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

  const innerMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uDark: { value: theme === 'dark' ? 1.0 : 0.0 },
    },
    vertexShader: `
      varying vec3 vWorldNormal, vViewPos;
      void main() {
        vec4 mvp     = modelViewMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(normalMatrix * normal);
        vViewPos     = -mvp.xyz;
        gl_Position  = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      uniform float uTime, uDark;
      varying vec3 vWorldNormal, vViewPos;
      void main() {
        float rim  = 1.0 - abs(dot(normalize(vWorldNormal), normalize(vViewPos)));
        vec3 dark  = vec3(0.05,0.08,0.22), lite = vec3(0.55,0.62,0.90);
        vec3 col   = mix(lite, dark, uDark) + vec3(0.30,0.55,1.0) * pow(rim, 1.8) * 0.65;
        float alpha = 0.55 + pow(rim, 2.2) * 0.40;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide,
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
      uniform vec3 uColor; uniform float uTime;
      varying vec3 vWorldNormal;
      void main() {
        float edge  = 1.0 - abs(dot(vWorldNormal, vec3(0.0,0.0,1.0)));
        float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
        float alpha = pow(edge, 1.5) * 0.45 * pulse;
        gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
      }
    `,
  }), [theme])

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
      glowRef.current.scale.setScalar(1.0 + Math.sin(t * 1.2) * 0.04)
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
      {/* Glow sphere — 14 segs (↓ from 20) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.55, 14, 14]} />
        <primitive object={glowMat} attach="material" />
      </mesh>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.10, 1]} />
        <primitive object={outerMat} attach="material" />
      </mesh>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.12, 1]} />
        <primitive object={wireMat} attach="material" />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.72, 0]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. AURORA RINGS — tube segments 180 → 60 (3× less vertex work, same look)
   ═══════════════════════════════════════════════════════════════════════════ */
function AuroraRings({ theme }: { theme: 'dark' | 'light' }) {
  const RINGS = [
    { color: '#4ecdc4', radius: 1.90, tube: 0.018, tiltX: Math.PI*0.08, tiltZ: 0,              speed:  0.22, opacity: theme==='light'?0.55:0.72 },
    { color: '#ff6b6b', radius: 2.20, tube: 0.014, tiltX: Math.PI*0.55, tiltZ: Math.PI*0.12,  speed: -0.18, opacity: theme==='light'?0.40:0.58 },
    { color: '#a855f7', radius: 2.50, tube: 0.012, tiltX: Math.PI*0.30, tiltZ: Math.PI*0.25,  speed:  0.14, opacity: theme==='light'?0.32:0.48 },
  ]

  const mats = useMemo(() => RINGS.map(r => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uTime:    { value: 0 },
      uColor:   { value: new THREE.Color(r.color) },
      uOpacity: { value: r.opacity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform float uTime, uOpacity; uniform vec3 uColor; varying vec2 vUv;
      void main() {
        float base  = 0.55 + 0.45 * sin(uTime * 1.6 + vUv.x * 6.283);
        float sweep = smoothstep(0.0, 0.14, fract(vUv.x - uTime * 0.12)) *
                      smoothstep(0.32, 0.08, fract(vUv.x - uTime * 0.12));
        float alpha = (base * 0.65 + sweep * 0.80) * uOpacity;
        gl_FragColor = vec4(uColor + sweep * 0.25, clamp(alpha, 0.0, uOpacity * 1.2));
      }
    `,
  })), [theme]) // eslint-disable-line

  const refs = useRef<(THREE.Mesh|null)[]>([])

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
        <mesh key={i} ref={el => { refs.current[i] = el }} rotation={[r.tiltX, 0, r.tiltZ]}>
          {/* 60 segments (↓ from 180) — imperceptible visual difference */}
          <torusGeometry args={[r.radius, r.tube, 8, 60]} />
          <primitive object={mats[i]} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. CRYSTAL SHARDS — count 16 → 12
   ═══════════════════════════════════════════════════════════════════════════ */
function CrystalShards({ theme }: { theme: 'dark' | 'light' }) {
  const COUNT = 12  // ↓ from 16
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => Array.from({ length: COUNT }, () => ({
    ox:    (Math.random()-0.5)*9,
    oy:    (Math.random()-0.5)*7,
    oz:    (Math.random()-0.5)*4-1,
    rx:    (Math.random()-0.5)*0.40,
    ry:    (Math.random()-0.5)*0.50,
    rz:    (Math.random()-0.5)*0.28,
    phase: Math.random()*Math.PI*2,
    speed: 0.12+Math.random()*0.25,
    size:  0.16+Math.random()*0.28,
  })), [])

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color:       theme === 'light' ? '#8899bb' : '#99aacc',
    wireframe:   true, transparent: true,
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
   4. CONSTELLATION WEB — O(n) spatial grid  (was O(n²): 12,800 checks/frame)
      Now: build grid in O(n), then check only particles in 27 adj cells ≈ O(3n)
      Plus: line rebuild throttled to every 2nd frame
   ═══════════════════════════════════════════════════════════════════════════ */
function ConstellationWeb({ theme, isMobile }: { theme: 'dark'|'light'; isMobile: boolean }) {
  const groupRef  = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef  = useRef<THREE.LineSegments>(null)
  const frameRef  = useRef(0)

  const COUNT    = isMobile ? 50  : 90    // ↓ from 80/160
  const LINK_DIST = 1.1
  const LINK_SQ   = LINK_DIST * LINK_DIST
  const LINK_MAX  = isMobile ? 35 : 65   // ↓ from 55/120

  // Pre-allocated spatial-grid buffers (never GC'd between frames)
  const cellPart  = useMemo(() => new Int16Array(COUNT),         [COUNT])
  const cellCount = useMemo(() => new Uint16Array(GRID_TOT),     [])
  const cellOff   = useMemo(() => new Uint16Array(GRID_TOT + 1), [])
  const partCell  = useMemo(() => new Int16Array(COUNT),         [COUNT])

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
      vel[i*3]   = (Math.random()-0.5) * 0.0025
      vel[i*3+1] = (Math.random()-0.5) * 0.0025
      vel[i*3+2] = (Math.random()-0.5) * 0.0025
    }
    return { positions: pos, velocities: vel }
  }, [COUNT])

  const linePositions = useMemo(() => new Float32Array(LINK_MAX * 2 * 3), [LINK_MAX])

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array(LINK_MAX * 2 * 3), 3,
    ))
    return g
  }, [LINK_MAX])

  const dotMat = useMemo(() => new THREE.PointsMaterial({
    color:           theme === 'light' ? '#6366f1' : '#a78bfa',
    size:            isMobile ? 0.022 : 0.026,
    transparent:     true,
    opacity:         theme === 'light' ? 0.55 : 0.82,
    depthWrite:      false,
    sizeAttenuation: true,
  }), [theme, isMobile])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color:       theme === 'light' ? '#6366f1' : '#818cf8',
    transparent: true,
    opacity:     theme === 'light' ? 0.14 : 0.26,
    depthWrite:  false,
  }), [theme])

  const posRef = useRef(positions.slice())

  useFrame(({ clock }) => {
    frameRef.current++
    const t = clock.getElapsedTime()
    const p = posRef.current
    const R = 4.5

    // ── 1. Update particle positions (every frame) ─────────────────────────
    for (let i = 0; i < COUNT; i++) {
      p[i*3]   += velocities[i*3]   + Math.sin(t * 0.38 + i) * 0.0006
      p[i*3+1] += velocities[i*3+1] + Math.cos(t * 0.32 + i * 1.2) * 0.0006
      p[i*3+2] += velocities[i*3+2]
      const d = Math.sqrt(p[i*3]**2 + p[i*3+1]**2 + p[i*3+2]**2)
      if (d > R) { const s = R/d*0.98; p[i*3]*=s; p[i*3+1]*=s; p[i*3+2]*=s }
    }

    // ── 2. Sync points buffer (every frame) ───────────────────────────────
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
      if (attr?.array.length === p.length) {
        ;(attr.array as Float32Array).set(p)
        attr.needsUpdate = true
      }
    }

    // ── 3. Rebuild lines every 2nd frame via O(n) spatial grid ────────────
    if (frameRef.current % 2 === 0) {
      // Pass 1: count particles per cell
      cellCount.fill(0)
      for (let i = 0; i < COUNT; i++) {
        const cx = (p[i*3  ] / CELL + GRID_OFF) | 0
        const cy = (p[i*3+1] / CELL + GRID_OFF) | 0
        const cz = (p[i*3+2] / CELL + GRID_OFF) | 0
        const cidx = cx + cy * GRID_DIM + cz * GRID_DIM * GRID_DIM
        partCell[i] = (cidx >= 0 && cidx < GRID_TOT) ? cidx : -1
        if (partCell[i] >= 0) cellCount[partCell[i]]++
      }

      // Pass 2: prefix-sum → cell offsets
      cellOff[0] = 0
      for (let c = 0; c < GRID_TOT; c++) cellOff[c+1] = cellOff[c] + cellCount[c]

      // Pass 3: counting-sort particles into grid (O(n))
      cellCount.fill(0)
      for (let i = 0; i < COUNT; i++) {
        const cidx = partCell[i]
        if (cidx >= 0) { cellPart[cellOff[cidx] + cellCount[cidx]] = i; cellCount[cidx]++ }
      }

      // Pass 4: check only 27 neighbouring cells per particle (O(n×k), k≈3)
      let lc = 0
      outer: for (let i = 0; i < COUNT; i++) {
        const xi = p[i*3], yi = p[i*3+1], zi = p[i*3+2]
        const cxi = (xi/CELL+GRID_OFF)|0, cyi = (yi/CELL+GRID_OFF)|0, czi = (zi/CELL+GRID_OFF)|0

        for (let dz = -1; dz <= 1; dz++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ncx=cxi+dx, ncy=cyi+dy, ncz=czi+dz
              if (ncx<0||ncy<0||ncz<0||ncx>=GRID_DIM||ncy>=GRID_DIM||ncz>=GRID_DIM) continue
              const ncidx = ncx + ncy*GRID_DIM + ncz*GRID_DIM*GRID_DIM
              for (let k = cellOff[ncidx]; k < cellOff[ncidx+1]; k++) {
                const j = cellPart[k]
                if (j <= i) continue
                if (lc >= LINK_MAX) break outer
                const ddx=xi-p[j*3], ddy=yi-p[j*3+1], ddz=zi-p[j*3+2]
                if (ddx*ddx + ddy*ddy + ddz*ddz < LINK_SQ) {
                  const b = lc * 6
                  linePositions[b]=xi;       linePositions[b+1]=yi;       linePositions[b+2]=zi
                  linePositions[b+3]=p[j*3]; linePositions[b+4]=p[j*3+1]; linePositions[b+5]=p[j*3+2]
                  lc++
                }
              }
            }
          }
        }
      }
      lineGeo.setDrawRange(0, lc * 2)
      const la = lineGeo.getAttribute('position') as THREE.BufferAttribute
      if (la?.array.length >= lc*6) {
        ;(la.array as Float32Array).set(linePositions.subarray(0, lc*6))
        la.needsUpdate = true
      }
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
   5. ETHEREAL DUST — positions are static; only rotation updated each frame
      (removed per-frame opacity mutation — was causing unnecessary GPU uploads)
   ═══════════════════════════════════════════════════════════════════════════ */
function EtherealDust({ theme, isMobile }: { theme: 'dark'|'light'; isMobile: boolean }) {
  const ref   = useRef<THREE.Points>(null)
  const COUNT = isMobile ? 120 : 240  // ↓ from 160/320

  const pos = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i*3]   = (Math.random()-0.5)*18
      arr[i*3+1] = (Math.random()-0.5)*12
      arr[i*3+2] = (Math.random()-0.5)*10 - 2
    }
    return arr
  }, [COUNT])

  // Pure rotation only — no array writes, no material.needsUpdate
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.014
    ref.current.rotation.x = t * 0.006
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.012 : 0.016}
        color={theme === 'light' ? '#6366f1' : '#c4b5fd'}
        transparent
        opacity={theme === 'light' ? 0.12 : 0.28}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Exports ─────────────────────────────────────────────────────────────── */
export default function GeometricBackground({ theme = 'dark' }: Props) {
  return (
    <group>
      <EtherealDust     theme={theme} isMobile={false} />
      <ConstellationWeb theme={theme} isMobile={false} />
      <CrystalShards    theme={theme} />
      <AuroraRings      theme={theme} />
      <PlasmaCore       theme={theme} />
    </group>
  )
}

export function GeometricBackgroundScene({
  theme = 'dark', isMobile = false,
}: { theme?: 'dark'|'light'; isMobile?: boolean }) {
  return (
    <group>
      <EtherealDust     theme={theme} isMobile={isMobile} />
      <ConstellationWeb theme={theme} isMobile={isMobile} />
      <CrystalShards    theme={theme} />
      <AuroraRings      theme={theme} />
      <PlasmaCore       theme={theme} />
    </group>
  )
}