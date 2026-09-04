"use client"

import { useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from "react"
import { Suspense } from "react"
import { DoubleSide, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Plane, Raycaster, Vector2, Vector3 } from "three"
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js"

type Vec2 = { x: number; y: number }

type CoinMotionState = {
  progress: number
  point: Vec2
  rotationY: number
  scaleX: number
  scaleY: number
  shadowScale: number
  shadowOpacity: number
}

const GLB_PATH = "/animate/ivsol_coin_LIVE.optimized.glb"
const FALLBACK_SRC = "/animate/ivsol_coin_LIVE.fallback.png"
const FRONT_FACE_NAME = "tripo_node_8175b927-0694-410e-825a-46cb097d1866.001"
const REVERSE_FACE_NAME = "IVSOL_Coin_Reverse"
const TAU = Math.PI * 2

const CAMERA_SETTINGS = {
  position: [0, 3.5, 8] as const,
  zoom: 65,
  near: -100,
  far: 100,
}

type HeroSceneProps = {
  heroProgressRef: MutableRefObject<number>
  vaultTRef: RefObject<HTMLSpanElement | null>
  vaultVRef: RefObject<HTMLSpanElement | null>
  ironIRef: RefObject<HTMLSpanElement | null>
  meetMRef: RefObject<HTMLSpanElement | null>
  coinStateRef: MutableRefObject<CoinMotionState>
  isActive: boolean
  isRendered: boolean
  onCoinReady: () => void
  fallbackRef?: RefObject<HTMLDivElement | null>
}

useGLTF.preload(GLB_PATH)

function CoinModel({
  heroProgressRef,
  coinStateRef,
  isActive,
  onCoinReady,
}: {
  heroProgressRef: MutableRefObject<number>
  coinStateRef: MutableRefObject<CoinMotionState>
  isActive: boolean
  onCoinReady: () => void
}) {
  const { scene: gltfScene } = useGLTF(GLB_PATH)
  const { camera, size } = useThree()
  const coinGroup = useRef<Group>(null)
  const shadowRef = useRef<Mesh | null>(null)
  const raycasterRef = useRef(new Raycaster())
  const planeRef = useRef(new Plane(new Vector3(0, 0, 1), 0))
  const rayHitRef = useRef(new Vector3())
  const screenTargetRef = useRef(new Vector2())
  const readyFiredRef = useRef(false)
  const faceRefs = useRef<{ front: Object3D[]; reverse: Object3D[] }>({ front: [], reverse: [] })

  const coinScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(gltfScene)
    const faces = { front: [] as Object3D[], reverse: [] as Object3D[] }

    cloned.traverse((child: Object3D) => {
      if (child.name === FRONT_FACE_NAME) faces.front.push(child)
      if (child.name === REVERSE_FACE_NAME) faces.reverse.push(child)

      if (child instanceof Mesh && child.material) {
        child.castShadow = true
        child.receiveShadow = false
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        for (const material of materials) {
          material.side = DoubleSide
          material.needsUpdate = true
          if (material instanceof MeshStandardMaterial) {
            material.metalness = Math.max(0.4, material.metalness)
            material.roughness = Math.min(0.4, material.roughness)
          }
        }
      }
    })
    faceRefs.current = faces
    return cloned
  }, [gltfScene])

  useEffect(() => {
    if (!readyFiredRef.current) {
      onCoinReady()
      readyFiredRef.current = true
    }
  }, [onCoinReady])

  useFrame(() => {
    if (!coinGroup.current || !isActive) return

    const motion = coinStateRef.current
    const targetPx = Math.max(124, Math.min(268, size.width * 0.22))
    const baseScale = targetPx / (Math.max(1, camera.zoom) || 1)
    const shadowScale = baseScale * 1.25
    const target = motion.point
    const progress = heroProgressRef.current

    const ndcX = (target.x / Math.max(1, size.width)) * 2 - 1
    const ndcY = -(target.y / Math.max(1, size.height)) * 2 + 1
    screenTargetRef.current.set(ndcX, ndcY)

    raycasterRef.current.setFromCamera(screenTargetRef.current, camera)
    const intersects = raycasterRef.current.ray.intersectPlane(planeRef.current, rayHitRef.current)
    if (!intersects) return

    coinGroup.current.position.set(rayHitRef.current.x, rayHitRef.current.y, 0.05 + progress * 0.02)
    coinGroup.current.rotation.set(-0.28, motion.rotationY, 0.01)
    const normalizedRotation = ((motion.rotationY % TAU) + TAU) % TAU
    const showFront = normalizedRotation <= Math.PI / 2 || normalizedRotation >= Math.PI * 1.5
    for (const face of faceRefs.current.front) face.visible = showFront
    for (const face of faceRefs.current.reverse) face.visible = !showFront
    coinGroup.current.scale.set(
      baseScale * motion.scaleX,
      baseScale * motion.scaleY * 1.02,
      baseScale * motion.scaleX,
    )

      if (shadowRef.current) {
      shadowRef.current.position.set(rayHitRef.current.x, rayHitRef.current.y - 0.07, -0.04)
      shadowRef.current.scale.set(shadowScale * motion.shadowScale, shadowScale * 0.7 * motion.shadowScale, 1)
      const meshMaterial = shadowRef.current.material
      if (meshMaterial instanceof MeshStandardMaterial || meshMaterial instanceof MeshBasicMaterial) {
        meshMaterial.opacity = Math.min(0.74, Math.max(0.06, motion.shadowOpacity))
      }
    }
  })

  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight castShadow intensity={3.2} position={[3, 8, 7]} />
      <directionalLight intensity={1.2} position={[-6, 2, 5]} color="#dce8ff" />

      <mesh
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.35, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.56, 96]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.36} depthWrite={false} />
      </mesh>

      <group ref={coinGroup}>
        <primitive object={coinScene} />
      </group>
    </>
  )
}

export function HeroScene({
  heroProgressRef,
  vaultTRef,
  vaultVRef,
  ironIRef,
  meetMRef,
  coinStateRef,
  isActive,
  isRendered,
  onCoinReady,
  fallbackRef,
}: HeroSceneProps) {
  void vaultTRef.current
  void vaultVRef.current
  void ironIRef.current
  void meetMRef.current

  const localFallbackRef = useRef<HTMLDivElement | null>(null)
  const activeFallbackRef = fallbackRef ?? localFallbackRef

  return (
    <div className="iv-hero-r3f-wrap" data-active={isActive ? "true" : "false"}>
      <div className="iv-hero-coin-fallback" ref={activeFallbackRef} aria-hidden data-loaded={isRendered ? "true" : "false"}>
            <img src={FALLBACK_SRC} alt="" />
          </div>

      <Canvas
        className="iv-hero-coin-canvas"
        orthographic
        camera={CAMERA_SETTINGS}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        shadows
      >
        <Suspense fallback={null}>
          <CoinModel heroProgressRef={heroProgressRef} coinStateRef={coinStateRef} isActive={isActive} onCoinReady={onCoinReady} />
        </Suspense>
      </Canvas>
    </div>
  )
}
