'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  theme?: 'dark' | 'light'
  isMobile?: boolean
}

/* ─── GLSL Simplex Noise ──────────────────────────────────────────────────── */
const SNOISE = `
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

/* ─── Plasma Core Orb ─────────────────────────────────────────────────────── */
function PlasmaOrb({ theme }: { theme: 'dark' | 'light' }) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const wireRef  = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)

  const plasmaMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: {
      uTime:   { value: 0 },
      uColorA: { value: new THREE.Color(theme === 'dark' ? '#4ecdc4' : '#0d9488') },
      uColorB: { value: new THREE.Color(theme === 'dark' ? '#a855f7' : '#7c3aed') },
      uColorC: { value: new THREE.Color(theme === 'dark' ? '#ff6b6b' : '#dc2626') },
      uDark:   { value: theme === 'dark' ? 1.0 : 0.55 },
    },
    vertexShader: `
      ${SNOISE}
      uniform float uTime;
      varying vec3 vNormal,vPos; varying float vNoise;
      void main() {
        vPos=position;
        float n=snoise(position*1.8+uTime*0.22)*0.5+snoise(position*3.5+uTime*0.15)*0.25;
        vNoise=n;
        vec3 disp=position+normal*n*0.14;
        vNormal=normalize(normalMatrix*(normal+n*0.15));
        gl_Position=projectionMatrix*modelViewMatrix*vec4(disp,1.0);
      }`,
    fragmentShader: `
      uniform float uTime,uDark; uniform vec3 uColorA,uColorB,uColorC;
      varying vec3 vNormal,vPos; varying float vNoise;
      void main(){
        float rim=1.0-abs(dot(normalize(vNormal),vec3(0.,0.,1.))); rim=pow(rim,1.6);
        float p=sin(vPos.y*3.5+uTime*1.8+vNoise*2.5)*0.5+0.5;
        p+=sin(vPos.x*2.8+uTime*1.3)*0.25+sin(length(vPos.xz)*4.-uTime*2.0)*0.2;
        p=clamp(p/1.95,0.,1.);
        vec3 col=mix(uColorA,uColorB,p);
        col=mix(col,uColorC,pow(rim,2.5)*0.7);
        col=mix(col,vec3(1.),rim*0.25*uDark);
        float alpha=rim*0.85+p*0.4+0.1;
        gl_FragColor=vec4(col,clamp(alpha*mix(0.6,1.0,uDark),0.,1.));
      }`,
  }), [theme])

  const wireMat = useMemo(() => new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,wireframe:true,
    uniforms:{
      uTime:{value:0},
      uColor:{value:new THREE.Color(theme==='dark'?'#4ecdc4':'#0d9488')},
      uAlpha:{value:theme==='dark'?0.26:0.12},
    },
    vertexShader:`${SNOISE} uniform float uTime;varying float vY;
    void main(){float n=snoise(position*2.0+uTime*0.18)*0.08;vec3 d=position+normal*n;vY=d.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(d*1.06,1.0);}`,
    fragmentShader:`uniform vec3 uColor;uniform float uAlpha,uTime;varying float vY;
    void main(){float g=sin(vY*4.+uTime*2.)*0.5+0.5;gl_FragColor=vec4(uColor,uAlpha*(0.6+g*0.4));}`,
  }), [theme])

  const innerMat = useMemo(() => new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,side:THREE.BackSide,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(theme==='dark'?'#a855f7':'#7c3aed')}},
    vertexShader:`uniform float uTime;void main(){float b=1.0+sin(uTime*2.2)*0.06;gl_Position=projectionMatrix*modelViewMatrix*vec4(position*b,1.0);}`,
    fragmentShader:`uniform vec3 uColor;uniform float uTime;void main(){float p=0.4+0.2*sin(uTime*2.2);gl_FragColor=vec4(uColor,p);}`,
  }), [theme])

  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,side:THREE.BackSide,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(theme==='dark'?'#4ecdc4':'#0d9488')}},
    vertexShader:`void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position*1.5,1.0);}`,
    fragmentShader:`uniform vec3 uColor;uniform float uTime;void main(){float p=0.10+0.05*sin(uTime*1.5);gl_FragColor=vec4(uColor,p);}`,
  }), [theme])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    plasmaMat.uniforms.uTime.value = t
    wireMat.uniforms.uTime.value   = t
    innerMat.uniforms.uTime.value  = t
    glowMat.uniforms.uTime.value   = t
    if (meshRef.current)  { meshRef.current.rotation.y  = t*0.14; meshRef.current.rotation.x  = Math.sin(t*0.25)*0.18 }
    if (wireRef.current)  { wireRef.current.rotation.y  = -t*0.09; wireRef.current.rotation.z = t*0.05 }
    if (innerRef.current) { innerRef.current.rotation.y = t*0.22 }
    if (glowRef.current)  { glowRef.current.rotation.y  = t*0.04 }
  })

  return (
    <group>
      <mesh ref={glowRef}><icosahedronGeometry args={[1,2]}/><primitive object={glowMat} attach="material"/></mesh>
      <mesh ref={innerRef}><icosahedronGeometry args={[0.65,1]}/><primitive object={innerMat} attach="material"/></mesh>
      <mesh ref={meshRef}><icosahedronGeometry args={[1,3]}/><primitive object={plasmaMat} attach="material"/></mesh>
      <mesh ref={wireRef}><icosahedronGeometry args={[1,2]}/><primitive object={wireMat} attach="material"/></mesh>
    </group>
  )
}

/* ─── Aurora Rings ────────────────────────────────────────────────────────── */
function AuroraRings({ theme }: { theme: 'dark' | 'light' }) {
  const RINGS = useMemo(() => [
    { r:1.7,  tube:0.022, color:'#4ecdc4', speed: 0.28, tx:Math.PI*0.25, tz:0,            op:theme==='light'?0.50:0.88 },
    { r:2.05, tube:0.016, color:'#a855f7', speed:-0.18, tx:Math.PI*0.12, tz:Math.PI*0.08, op:theme==='light'?0.36:0.68 },
    { r:2.42, tube:0.012, color:'#ff6b6b', speed: 0.11, tx:Math.PI*0.38, tz:Math.PI*0.18, op:theme==='light'?0.26:0.52 },
    { r:2.72, tube:0.009, color:'#fbbf24', speed:-0.07, tx:Math.PI*0.06, tz:Math.PI*0.32, op:theme==='light'?0.18:0.36 },
  ], [theme])

  const refs = useRef<(THREE.Mesh|null)[]>([])
  const mats = useMemo(() => RINGS.map(r => new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(r.color)},uOp:{value:r.op}},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform float uTime,uOp;uniform vec3 uColor;varying vec2 vUv;
    void main(){
      float pulse=0.75+0.25*sin(uTime*2.0+vUv.x*6.28318);
      float sweep=smoothstep(0.0,0.14,fract(vUv.x-uTime*0.12))*smoothstep(0.34,0.10,fract(vUv.x-uTime*0.12));
      float a=(pulse*0.8+sweep*0.5)*uOp;
      gl_FragColor=vec4(uColor+vec3(0.3)*sweep,clamp(a,0.,uOp));
    }`,
  })), [theme])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    RINGS.forEach((r,i) => {
      mats[i].uniforms.uTime.value = t
      const m = refs.current[i]; if (m) m.rotation.y = t*r.speed
    })
  })

  return (
    <group>
      {RINGS.map((r,i) => (
        <mesh key={i} ref={el=>{refs.current[i]=el}} rotation={[r.tx,0,r.tz]}>
          <torusGeometry args={[r.r,r.tube,8,160]}/>
          <primitive object={mats[i]} attach="material"/>
        </mesh>
      ))}
    </group>
  )
}

/* ─── Constellation Dots — FIXED buffer management ───────────────────────── */
function ConstellationDots({ theme, isMobile }: { theme: 'dark' | 'light'; isMobile: boolean }) {
  const groupRef  = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef  = useRef<THREE.LineSegments>(null)

  const COUNT    = isMobile ? 80 : 160
  // Keep LINK_MAX well within buffer — conservative cap
  const LINK_MAX = isMobile ? 60 : 120
  const LINK_D   = 1.10

  // Particle positions (source of truth — live in a ref, NOT state)
  const posData = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    const R   = 3.8
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = R * (0.50 + Math.random() * 0.50)
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.68
      pos[i*3+2] = r * Math.cos(phi) - 0.8
      vel[i*3]   = (Math.random() - 0.5) * 0.0028
      vel[i*3+1] = (Math.random() - 0.5) * 0.0028
      vel[i*3+2] = (Math.random() - 0.5) * 0.0028
    }
    return { pos, vel }
  }, [COUNT])

  // Live positions kept in a ref (avoids closure staleness)
  const livePos = useRef(posData.pos.slice())

  // Line buffer: allocated once, mutated in-place
  // We create it here and pass the SAME reference to the BufferAttribute
  const lineBuf = useMemo(() => new Float32Array(LINK_MAX * 6), [LINK_MAX])

  // Dot geometry — initial positions
  const dotGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    // Use a fresh copy so React Three Fiber owns it
    g.setAttribute('position', new THREE.BufferAttribute(posData.pos.slice(), 3))
    return g
  }, [COUNT])

  // Line geometry — reuse the SAME lineBuf Float32Array
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const attr = new THREE.BufferAttribute(lineBuf, 3)
    attr.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('position', attr)
    g.setDrawRange(0, 0)
    return g
  }, [lineBuf])

  const dotMat  = useMemo(() => new THREE.PointsMaterial({
    color: theme === 'light' ? '#7c3aed' : '#c4b5fd',
    size: isMobile ? 0.024 : 0.030, transparent: true,
    opacity: theme === 'light' ? 0.60 : 0.90,
    depthWrite: false, sizeAttenuation: true,
  }), [theme, isMobile])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: theme === 'light' ? '#6d28d9' : '#818cf8',
    transparent: true, opacity: theme === 'light' ? 0.14 : 0.26, depthWrite: false,
  }), [theme])

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime()
    const p   = livePos.current
    const vel = posData.vel
    const R   = 3.8

    // --- update particle positions ---
    for (let i = 0; i < COUNT; i++) {
      p[i*3]   += vel[i*3]   + Math.sin(t * 0.38 + i) * 0.0007
      p[i*3+1] += vel[i*3+1] + Math.cos(t * 0.33 + i * 1.3) * 0.0007
      p[i*3+2] += vel[i*3+2]
      const d = Math.sqrt(p[i*3]**2 + p[i*3+1]**2 + p[i*3+2]**2)
      if (d > R) { p[i*3] *= R/d*0.98; p[i*3+1] *= R/d*0.98; p[i*3+2] *= R/d*0.98 }
    }

    // --- push to dot geometry ---
    if (pointsRef.current) {
      const attr = dotGeo.getAttribute('position') as THREE.BufferAttribute
      // attr.array is a Float32Array of size COUNT*3; p is also COUNT*3 — safe
      ;(attr.array as Float32Array).set(p)
      attr.needsUpdate = true
    }

    // --- build line segments directly into lineBuf ---
    // lineBuf has LINK_MAX*6 floats; we write at most LINK_MAX segments (lc < LINK_MAX)
    let lc = 0
    outer: for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (lc >= LINK_MAX) break outer   // hard cap — never exceed buffer
        const dx = p[i*3]-p[j*3], dy = p[i*3+1]-p[j*3+1], dz = p[i*3+2]-p[j*3+2]
        if (dx*dx+dy*dy+dz*dz < LINK_D*LINK_D) {
          const base = lc * 6                // 6 floats per segment (2 × xyz)
          lineBuf[base]   = p[i*3];   lineBuf[base+1] = p[i*3+1]; lineBuf[base+2] = p[i*3+2]
          lineBuf[base+3] = p[j*3];   lineBuf[base+4] = p[j*3+1]; lineBuf[base+5] = p[j*3+2]
          lc++
        }
      }
    }

    // Update line geometry — attr.array IS lineBuf, so no .set() needed
    // Just update draw range and flag dirty
    lineGeo.setDrawRange(0, lc * 2)
    const lineAttr = lineGeo.getAttribute('position') as THREE.BufferAttribute
    lineAttr.needsUpdate = true

    if (groupRef.current) groupRef.current.rotation.y = t * 0.038
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} frustumCulled={false} geometry={dotGeo} material={dotMat} />
      <lineSegments ref={linesRef} frustumCulled={false} geometry={lineGeo} material={lineMat} />
    </group>
  )
}

/* ─── Crystal Shards ──────────────────────────────────────────────────────── */
function CrystalShards({ theme }: { theme: 'dark' | 'light' }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  const SHARDS = useMemo(() => [
    { pos:[-3.6, 2.0,-1.4] as [number,number,number], rot:[0.3,0.5,0.1], size:0.20, color:'#4ecdc4', sp:0.30, ph:0.0 },
    { pos:[ 3.4, 1.6,-2.0] as [number,number,number], rot:[0.6,0.2,0.4], size:0.24, color:'#a855f7', sp:0.25, ph:1.3 },
    { pos:[-3.0,-2.1,-1.6] as [number,number,number], rot:[0.1,0.8,0.3], size:0.18, color:'#ff6b6b', sp:0.36, ph:2.6 },
    { pos:[ 3.2,-1.8,-2.2] as [number,number,number], rot:[0.4,0.3,0.7], size:0.22, color:'#fbbf24', sp:0.20, ph:3.9 },
    { pos:[-1.4, 3.2,-2.4] as [number,number,number], rot:[0.7,0.1,0.5], size:0.16, color:'#60a5fa', sp:0.40, ph:0.8 },
    { pos:[ 1.6,-3.0,-2.0] as [number,number,number], rot:[0.2,0.6,0.2], size:0.19, color:'#34d399', sp:0.28, ph:5.1 },
    { pos:[-4.0, 0.4,-2.6] as [number,number,number], rot:[0.5,0.4,0.8], size:0.14, color:'#a855f7', sp:0.33, ph:4.2 },
    { pos:[ 3.8,-0.2,-1.6] as [number,number,number], rot:[0.3,0.7,0.1], size:0.21, color:'#4ecdc4', sp:0.23, ph:2.1 },
  ], [])

  const colors = useMemo(() => {
    const a = new Float32Array(SHARDS.length*3); const c = new THREE.Color()
    SHARDS.forEach((s,i) => { c.set(s.color); a[i*3]=c.r; a[i*3+1]=c.g; a[i*3+2]=c.b })
    return a
  }, [])

  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent:true, depthWrite:false,
    uniforms:{uTime:{value:0}},
    vertexShader:`
      attribute vec3 instanceColor;
      varying vec3 vNormal,vPos,vColor;
      void main(){vNormal=normalize(normalMatrix*normal);vPos=position;vColor=instanceColor;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`
      uniform float uTime;varying vec3 vNormal,vPos,vColor;
      void main(){
        float rim=1.-abs(dot(normalize(vNormal),vec3(0.,0.,1.)));rim=pow(rim,1.4);
        float inner=0.25+0.12*sin(vPos.y*6.+uTime*2.0);
        float alpha=rim*0.88+inner*0.35;
        gl_FragColor=vec4(vColor+vec3(0.22)*rim,clamp(alpha,0.,0.94));
      }`,
  }), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    mat.uniforms.uTime.value = t
    SHARDS.forEach((s,i) => {
      dummy.position.set(s.pos[0]+Math.sin(t*s.sp*0.7+s.ph)*0.24, s.pos[1]+Math.cos(t*s.sp+s.ph)*0.30, s.pos[2])
      dummy.rotation.set(t*s.rot[0]*0.5,t*s.rot[1]*0.5,t*s.rot[2]*0.5)
      dummy.scale.setScalar(s.size*(0.88+0.12*Math.sin(t*s.sp*1.5+s.ph)))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i,dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined,mat,SHARDS.length]} frustumCulled={false}>
      <octahedronGeometry args={[1,0]}/>
      <bufferAttribute attach="geometry-attributes-instanceColor" args={[colors,3]}/>
    </instancedMesh>
  )
}

/* ─── Energy Beams ────────────────────────────────────────────────────────── */
function EnergyBeams({ theme }: { theme: 'dark' | 'light' }) {
  const groupRef = useRef<THREE.Group>(null)

  const BEAMS = useMemo(() => Array.from({length:8},(_,i) => ({
    angle: (i/8)*Math.PI*2,
    color: ['#4ecdc4','#a855f7','#ff6b6b','#4ecdc4','#fbbf24','#a855f7','#60a5fa','#34d399'][i],
    length: 1.6 + Math.random()*1.0,
    phase: Math.random()*Math.PI*2,
  })), [])

  const mats = useMemo(() => BEAMS.map(b => new THREE.ShaderMaterial({
    transparent:true, depthWrite:false,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(b.color)},uOp:{value:theme==='dark'?0.52:0.24}},
    vertexShader:`varying float vY;void main(){vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform vec3 uColor;uniform float uOp,uTime;varying float vY;
    void main(){float fade=1.-clamp(vY/1.8,0.,1.);float pulse=0.65+0.35*sin(uTime*3.0+vY*8.0);gl_FragColor=vec4(uColor,fade*pulse*uOp);}`,
  })), [theme])

  const geos = useMemo(() => BEAMS.map(b => {
    const g = new THREE.CylinderGeometry(0.004,0.001,b.length,4,1,true)
    g.translate(0,b.length/2,0); return g
  }), [BEAMS])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mats.forEach((m,i) => { m.uniforms.uTime.value = t+BEAMS[i].phase })
    if (groupRef.current) groupRef.current.rotation.y = t*0.055
  })

  return (
    <group ref={groupRef}>
      {BEAMS.map((b,i) => (
        <mesh key={i} geometry={geos[i]} material={mats[i]} rotation={[0,b.angle,Math.PI*0.10]} frustumCulled={false}/>
      ))}
    </group>
  )
}

/* ─── Pulsing Dot Ring ────────────────────────────────────────────────────── */
function PulsingDotRing({ theme }: { theme: 'dark' | 'light' }) {
  const ref   = useRef<THREE.Points>(null)
  const COUNT = 60
  const R     = 3.1

  // Build initial ring positions
  const initPos = useMemo(() => {
    const a = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const ang = (i/COUNT)*Math.PI*2
      a[i*3]=Math.cos(ang)*R; a[i*3+1]=0; a[i*3+2]=Math.sin(ang)*R
    }
    return a
  }, [])

  const colors = useMemo(() => {
    const a = new Float32Array(COUNT*3); const c = new THREE.Color()
    const PAL=['#4ecdc4','#a855f7','#ff6b6b','#fbbf24','#60a5fa']
    for (let i=0;i<COUNT;i++){c.set(PAL[i%PAL.length]);a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b}
    return a
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(initPos.slice(), 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('position', posAttr)
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const attr = geo.getAttribute('position') as THREE.BufferAttribute
    const arr  = attr.array as Float32Array
    for (let i=0;i<COUNT;i++){
      const ang  = (i/COUNT)*Math.PI*2 + t*0.18
      const wave = Math.sin(t*1.4+i*0.42)*0.28
      arr[i*3]   = Math.cos(ang)*R
      arr[i*3+1] = wave
      arr[i*3+2] = Math.sin(ang)*R
    }
    attr.needsUpdate = true
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = (theme==='light'?0.50:0.85)+Math.sin(t*0.8)*0.10
  })

  return (
    <points ref={ref} frustumCulled={false} geometry={geo}>
      <pointsMaterial vertexColors size={0.065} transparent opacity={0.85} depthWrite={false} sizeAttenuation/>
    </points>
  )
}

/* ─── Particle Cloud ──────────────────────────────────────────────────────── */
function ParticleCloud({ theme, isMobile }: { theme: 'dark' | 'light'; isMobile: boolean }) {
  const ref   = useRef<THREE.Points>(null)
  const COUNT = isMobile ? 150 : 320

  const pos = useMemo(() => {
    const a = new Float32Array(COUNT*3)
    for (let i=0;i<COUNT;i++){
      a[i*3]  =(Math.random()-0.5)*12
      a[i*3+1]=(Math.random()-0.5)*9
      a[i*3+2]=(Math.random()-0.5)*6-1
    }
    return a
  }, [COUNT])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t*0.016
    ref.current.rotation.x = t*0.007
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = (theme==='light'?0.10:0.22)+Math.sin(t*0.45)*0.05
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos,3]}/></bufferGeometry>
      <pointsMaterial color={theme==='light'?'#4f46e5':'#e2e8f0'}
        size={isMobile?0.015:0.019} transparent opacity={0.22} depthWrite={false} sizeAttenuation/>
    </points>
  )
}

/* ─── Default Export ──────────────────────────────────────────────────────── */
export default function CentralScene({ theme = 'dark', isMobile = false }: Props) {
  return (
    <group>
      <ParticleCloud theme={theme} isMobile={isMobile} />
      <ConstellationDots theme={theme} isMobile={isMobile} />
      <EnergyBeams theme={theme} />
      <AuroraRings theme={theme} />
      <CrystalShards theme={theme} />
      <PulsingDotRing theme={theme} />
      <PlasmaOrb theme={theme} />
    </group>
  )
}