"use client"

import { useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader, Mesh, DoubleSide } from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

function Coin() {
  const meshRef = useRef<Mesh>(null)

  // Load coin face texture
  const texture = useLoader(TextureLoader, "/the%20coin.png")

  // Continuous Y-axis rotation
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6
    }
  })

  const coinRadius = 2.2
  const coinThickness = 0.18

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[coinRadius, coinRadius, coinThickness, 64]} />

      {/* Edge material (index 0) — dark gold */}
      <meshStandardMaterial
        attach="material-0"
        color="#8B6914"
        metalness={0.85}
        roughness={0.25}
      />

      {/* Top face (index 1) — coin texture */}
      <meshStandardMaterial
        attach="material-1"
        map={texture}
        metalness={0.5}
        roughness={0.35}
        side={DoubleSide}
      />

      {/* Bottom face (index 2) — coin texture */}
      <meshStandardMaterial
        attach="material-2"
        map={texture}
        metalness={0.5}
        roughness={0.35}
        side={DoubleSide}
      />
    </mesh>
  )
}

export default function SpinningCoin() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {/* Ambient fill */}
      <ambientLight intensity={0.4} />

      {/* Warm gold key light from front-right */}
      <pointLight
        position={[4, 3, 5]}
        intensity={60}
        color="#FFD700"
        decay={2}
      />

      {/* Subtle fill from left */}
      <pointLight
        position={[-3, 1, 3]}
        intensity={20}
        color="#FFA500"
        decay={2}
      />

      {/* Rim light from behind */}
      <pointLight
        position={[0, 2, -4]}
        intensity={30}
        color="#FFFACD"
        decay={2}
      />

      <Coin />

      {/* Bloom glow */}
      <EffectComposer multisampling={0} stencilBuffer={false}>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={0.6}
        />
      </EffectComposer>
    </Canvas>
  )
}
