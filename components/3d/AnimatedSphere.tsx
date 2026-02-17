'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 3), [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:      { value: 0 },
      uColorA:    { value: new THREE.Color('#ff6b6b') },
      uColorB:    { value: new THREE.Color('#a855f7') },
      uFrequency: { value: 2.5 },
      uAmplitude: { value: 0.18 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uFrequency;
      uniform float uAmplitude;
      varying float vDisplace;
      varying vec3  vNormal;

      void main() {
        vNormal = normal;
        float wave = sin(position.x * uFrequency + uTime) *
                     cos(position.y * uFrequency + uTime * 0.7) * uAmplitude;
        vDisplace = wave;
        vec3 displaced = position + normal * wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3  uColorA;
      uniform vec3  uColorB;
      varying float vDisplace;
      varying vec3  vNormal;

      void main() {
        float t   = vDisplace * 4.0 + 0.5;
        vec3  col = mix(uColorA, uColorB, clamp(t, 0.0, 1.0));
        float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        col += vec3(0.15) * pow(rim, 2.5);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (matRef.current)  matRef.current.uniforms.uTime.value = t
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18
      meshRef.current.rotation.x = t * 0.08
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} scale={2.4}>
      <primitive ref={matRef} object={material} attach="material" />
    </mesh>
  )
}