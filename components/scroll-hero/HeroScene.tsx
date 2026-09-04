"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { Group, Mesh, Object3D } from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

export type HeroHopAnchors = Array<HTMLElement | null>;

type HeroSceneProps = {
  active: boolean;
  progress: MutableRefObject<number>;
  anchors: MutableRefObject<HeroHopAnchors>;
  invalidateRef: MutableRefObject<(() => void) | null>;
  launchAssetsEnabled: boolean;
  onCoinReady: () => void;
};

// Anchor indexes: 0 = T (Vault), 1 = V, 2 = I, 3 = M, 4 = n (mobile only)
const LANDING_PROGRESS = [0, 0.3, 0.6, 0.91] as const;
const MOBILE_LANDING_PROGRESS = [0, 0.36, 0.68] as const;
const DESKTOP_ANCHOR_INDEXES = [0, 1, 2, 3] as const;
const MOBILE_ANCHOR_INDEXES = [0, 4, 3] as const;
const COIN_LAUNCH_START = 0.91;
const COIN_LAUNCH_END = 0.96;
const ROCKET_START = 0.94;
const ROCKET_END = 1;
const PAYLOAD_RELEASE = 0.97;
const HOP_DWELL = 0.12;
const DRACO_DECODER_PATH = "/draco/";
const HERO_COIN_MODEL_URL = "/animate/ivsol_coin_LIVE.optimized.glb";
const HERO_COIN_FRONT_NAME = "tripo_node_8175b927-0694-410e-825a-46cb097d1866.001";
const HERO_COIN_REVERSE_NAME = "IVSOL_Coin_Reverse";
const ROCKET_MODEL_URL = "/animate/rocket 3d model.glb";
const AIRDROP_MODEL_URL = "/models/airdrop.web.glb";

function segmentForProgress(progress: number, landingProgress: readonly number[]) {
  for (let index = 0; index < landingProgress.length - 1; index += 1) {
    const start = landingProgress[index];
    const end = landingProgress[index + 1];
    if (progress <= end) {
      return { index, local: THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1) };
    }
  }

  return { index: landingProgress.length - 2, local: 1 };
}

function HeroCoin({
  active,
  progress,
  anchors,
  onCoinReady,
}: Pick<HeroSceneProps, "active" | "progress" | "anchors" | "onCoinReady">) {
  const root = useRef<Group>(null);
  const physics = useRef<Group>(null);
  const coin = useRef<Group>(null);
  const coinModel = useRef<Object3D | null>(null);
  const shadow = useRef<Mesh>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const landingPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.35));
  const landingPoint = useRef(new THREE.Vector3());
  const { camera, gl, viewport } = useThree();

  useFrame((state, delta) => {
    const p = progress.current;
    const mobile = viewport.width < 8;
    const currentRoot = root.current;
    const currentPhysics = physics.current;
    const currentCoin = coin.current;
    if (!currentRoot || !currentPhysics || !currentCoin) return;

    const anchorIndexes = mobile ? MOBILE_ANCHOR_INDEXES : DESKTOP_ANCHOR_INDEXES;
    const landingProgress = mobile ? MOBILE_LANDING_PROGRESS : LANDING_PROGRESS;
    const finalAnchor = anchors.current[anchorIndexes[anchorIndexes.length - 1]];
    const launching = p >= COIN_LAUNCH_START;
    const { index, local } = segmentForProgress(Math.min(p, COIN_LAUNCH_START), landingProgress);
    const from = anchors.current[anchorIndexes[index]];
    const to = launching ? finalAnchor : anchors.current[anchorIndexes[Math.min(index + 1, anchorIndexes.length - 1)]];
    if (!from || !to) return;

    const canvasRect = gl.domElement.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const launchLocal = THREE.MathUtils.clamp((p - COIN_LAUNCH_START) / (COIN_LAUNCH_END - COIN_LAUNCH_START), 0, 1);
    const easedLaunch = THREE.MathUtils.smootherstep(launchLocal, 0, 1);
    const flightLocal = launching ? 1 : THREE.MathUtils.clamp((local - HOP_DWELL) / (1 - HOP_DWELL * 2), 0, 1);
    const eased = launching ? 1 : THREE.MathUtils.smoothstep(flightLocal, 0, 1);
    const screenX = THREE.MathUtils.lerp(
      fromRect.left + fromRect.width * 0.5,
      toRect.left + toRect.width * 0.5,
      eased,
    );
    const screenY = THREE.MathUtils.lerp(fromRect.top + 3, toRect.top + 3, eased);
    const ricochetLift = Math.sin(launchLocal * Math.PI) * canvasRect.height * (mobile ? 0.24 : 0.34);
    const launchedScreenX = THREE.MathUtils.lerp(screenX, canvasRect.left - canvasRect.width * (mobile ? 0.2 : 0.24), easedLaunch);
    const launchedScreenY = THREE.MathUtils.lerp(screenY, screenY - canvasRect.height * (mobile ? 0.24 : 0.36), easedLaunch) - ricochetLift;
    const normalizedX = ((launching ? launchedScreenX : screenX) - canvasRect.left) / canvasRect.width;
    const normalizedY = ((launching ? launchedScreenY : screenY) - canvasRect.top) / canvasRect.height;
    const hop = launching ? Math.sin((1 - launchLocal) * Math.PI * 0.5) * 0.58 : Math.sin(flightLocal * Math.PI);
    const hopHeight = mobile ? 1.25 : 2.15 + Math.min(0.75, Math.abs(toRect.left - fromRect.left) / 360);

    pointer.current.set(normalizedX * 2 - 1, 1 - normalizedY * 2);
    raycaster.current.setFromCamera(pointer.current, camera);
    const intersection = raycaster.current.ray.intersectPlane(landingPlane.current, landingPoint.current);
    if (!intersection) return;
    const targetX = intersection.x;
    const targetY = intersection.y + hop * hopHeight;

    const nextX = THREE.MathUtils.damp(currentRoot.position.x, targetX, 15, delta);
    const nextY = THREE.MathUtils.damp(currentRoot.position.y, targetY, 15, delta);
    currentRoot.position.x = nextX;
    currentRoot.position.y = nextY;
    currentRoot.position.z = 1.35 + hop * 0.8 + easedLaunch * 1.1;

    if (active && (Math.abs(nextX - targetX) > 0.002 || Math.abs(nextY - targetY) > 0.002)) {
      state.invalidate();
    }

    const landingSquash = launching ? Math.exp(-Math.pow(launchLocal / 0.075, 2)) : Math.exp(-Math.pow((flightLocal - 1) / 0.055, 2));
    const takeoffSquash = launching ? Math.exp(-Math.pow((launchLocal - 0.15) / 0.1, 2)) : Math.exp(-Math.pow(flightLocal / 0.06, 2));
    const baseScale = mobile ? 1.7 : 2.2;
    const launchScale = 1 - easedLaunch * 0.2;
    currentPhysics.scale.set(
      baseScale * launchScale * (1 + landingSquash * 0.1 + takeoffSquash * 0.06 - hop * 0.018),
      baseScale * launchScale * (1 - landingSquash * 0.18 - takeoffSquash * 0.11 + hop * 0.045),
      baseScale * launchScale,
    );

    const direction = index % 2 === 0 ? -1 : 1;
    currentCoin.rotation.x = -0.24 + hop * 0.16 + easedLaunch * 1.25;
    currentCoin.rotation.y = 0.1 + (flightLocal + launchLocal * 2.35) * direction * Math.PI * 2;
    currentCoin.rotation.z = -0.08 + hop * direction * 0.18 - easedLaunch * 1.65;

    const currentModel = coinModel.current;
    if (currentModel) {
      const front = currentModel.getObjectByName(HERO_COIN_FRONT_NAME);
      const reverse = currentModel.getObjectByName(HERO_COIN_REVERSE_NAME);
      const frontFacing = Math.cos(currentCoin.rotation.y) >= 0;
      if (front) front.visible = frontFacing;
      if (reverse) reverse.visible = !frontFacing;
    }

    if (shadow.current) {
      shadow.current.visible = !launching || launchLocal < 0.72;
      shadow.current.position.y = -hop * hopHeight;
      shadow.current.scale.set((1 - hop * 0.42) * (1 - easedLaunch * 0.68), 0.18 - hop * 0.06, 1);
      const material = shadow.current.material;
      if (material instanceof THREE.MeshBasicMaterial) material.opacity = 0.13 * (1 - hop * 0.82) * (1 - easedLaunch);
    }
  });

  return (
    <group ref={root} position={[7.5, 2.8, 1.35]}>
      <mesh ref={shadow} position={[0, 0.03, -0.45]} renderOrder={-1}>
        <circleGeometry args={[0.72, 48]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <group ref={physics} scale={2.2}>
        <group ref={coin} rotation={[-0.28, 0.18, -0.12]}>
          <ModelPrimitive url={HERO_COIN_MODEL_URL} modelRef={coinModel} onReady={onCoinReady} />
        </group>
      </group>
    </group>
  );
}

function ModelPrimitive({
  url,
  modelRef,
  onReady,
  draco = false,
}: {
  url: string;
  modelRef?: MutableRefObject<Object3D | null>;
  onReady?: () => void;
  draco?: boolean | string;
}) {
  const { scene } = useGLTF(url, draco);
  const model = useMemo(() => {
    const clone = cloneSkeleton(scene);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    if (modelRef) modelRef.current = model;
    onReady?.();
    return () => {
      if (modelRef?.current === model) modelRef.current = null;
    };
  }, [model, modelRef, onReady]);

  return <primitive object={model} />;
}

useGLTF.preload(HERO_COIN_MODEL_URL, false);
useGLTF.preload(ROCKET_MODEL_URL, false);
useGLTF.preload(AIRDROP_MODEL_URL, DRACO_DECODER_PATH);

function RocketAndPayload({
  active,
  progress,
}: Pick<HeroSceneProps, "active" | "progress">) {
  const rocket = useRef<Group>(null);
  const payload = useRef<Group>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const p = progress.current;
    const mobile = viewport.width < 8;
    const rocketProgress = THREE.MathUtils.clamp((p - ROCKET_START) / (ROCKET_END - ROCKET_START), 0, 1);
    const rocketEase = THREE.MathUtils.smoothstep(rocketProgress, 0, 1);
    const payloadProgress = THREE.MathUtils.clamp((p - PAYLOAD_RELEASE) / (ROCKET_END - PAYLOAD_RELEASE), 0, 1);
    const payloadEase = THREE.MathUtils.smoothstep(payloadProgress, 0, 1);

    const rocketVisible = rocketProgress > 0 && rocketProgress < 1;
    const startX = mobile ? -5.9 : -10.4;
    const endX = mobile ? 5.4 : 8.25;
    const startY = mobile ? 2.4 : -0.35;
    const endY = mobile ? -3.25 : -5.5;
    const zig = Math.sin(rocketProgress * Math.PI * 3.2) * (1 - rocketProgress * 0.18);
    const zag = Math.sin(rocketProgress * Math.PI * 6.4 + 0.75) * 0.22;
    const x = THREE.MathUtils.lerp(startX, endX, rocketEase) + zig * (mobile ? 0.55 : 1.05);
    const y = THREE.MathUtils.lerp(startY, endY, rocketEase) + Math.sin(rocketProgress * Math.PI * 2.1) * (mobile ? 0.55 : 0.95) + zag;
    const z = 2.2;

    if (rocket.current) {
      rocket.current.visible = rocketVisible;
      rocket.current.position.set(x, y, z);
      rocket.current.rotation.set(0.12, 0.02, -0.95 - rocketProgress * 0.22 + Math.cos(rocketProgress * Math.PI * 3.2) * 0.16);
      rocket.current.scale.setScalar(mobile ? 1.2 : 1.86);
    }

    if (payload.current) {
      const released = p >= PAYLOAD_RELEASE;
      payload.current.visible = released;
      if (released) {
        const releaseRocketProgress = THREE.MathUtils.clamp((PAYLOAD_RELEASE - ROCKET_START) / (ROCKET_END - ROCKET_START), 0, 1);
        const releaseEase = THREE.MathUtils.smoothstep(releaseRocketProgress, 0, 1);
        const releaseZig = Math.sin(releaseRocketProgress * Math.PI * 3.2) * (1 - releaseRocketProgress * 0.18);
        const releaseZag = Math.sin(releaseRocketProgress * Math.PI * 6.4 + 0.75) * 0.22;
        const releaseX = THREE.MathUtils.lerp(startX, endX, releaseEase) + releaseZig * (mobile ? 0.55 : 1.05);
        const releaseY = THREE.MathUtils.lerp(startY, endY, releaseEase) + Math.sin(releaseRocketProgress * Math.PI * 2.1) * (mobile ? 0.55 : 0.95) + releaseZag;
        const sway = Math.sin(state.clock.elapsedTime * 1.7 + payloadProgress * Math.PI * 2) * (mobile ? 0.18 : 0.34);
        payload.current.position.x = THREE.MathUtils.damp(payload.current.position.x, releaseX + sway + payloadEase * (mobile ? -0.35 : -0.95), 7, delta);
        payload.current.position.y = THREE.MathUtils.damp(payload.current.position.y, releaseY - payloadEase * (mobile ? 4.0 : 6.35), 7, delta);
        payload.current.position.z = THREE.MathUtils.damp(payload.current.position.z, 1.95, 7, delta);
        payload.current.rotation.x = -0.05 + Math.sin(state.clock.elapsedTime * 1.1) * 0.025;
        payload.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.035;
        payload.current.rotation.z = sway * 0.1;
        payload.current.scale.setScalar((mobile ? 1.35 : 2.25) * (0.64 + payloadEase * 0.36));
      }
    }

    if (active && (rocketVisible || p >= PAYLOAD_RELEASE)) state.invalidate();
  });

  return (
    <>
      <group ref={rocket} visible={false}>
        <group rotation={[0, -Math.PI / 2, 0]}>
          <ModelPrimitive url={ROCKET_MODEL_URL} />
        </group>
      </group>
      <group ref={payload} visible={false} rotation={[-0.05, 0, 0]} scale={0.8}>
        <ModelPrimitive url={AIRDROP_MODEL_URL} draco={DRACO_DECODER_PATH} />
      </group>
    </>
  );
}

function DemandRenderBridge({ invalidateRef }: Pick<HeroSceneProps, "invalidateRef">) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      if (invalidateRef.current === invalidate) invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  return null;
}

export default function HeroScene({
  active,
  progress,
  anchors,
  invalidateRef,
  launchAssetsEnabled,
  onCoinReady,
}: HeroSceneProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 3.5, 8], zoom: 65, near: -100, far: 100 }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <ambientLight intensity={1.6} />
      <directionalLight castShadow intensity={3.2} position={[3, 8, 7]} />
      <directionalLight intensity={1.2} position={[-6, 2, 5]} color="#dce8ff" />
      <DemandRenderBridge invalidateRef={invalidateRef} />
      <Suspense fallback={null}>
        <HeroCoin active={active} progress={progress} anchors={anchors} onCoinReady={onCoinReady} />
      </Suspense>
      {launchAssetsEnabled ? (
        <Suspense fallback={null}>
          <RocketAndPayload active={active} progress={progress} />
        </Suspense>
      ) : null}
    </Canvas>
  );
}
