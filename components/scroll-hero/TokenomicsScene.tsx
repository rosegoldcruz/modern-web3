"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import type { Group } from "three";
import { AirdropModel } from "./AirdropModel";
import { CoinModel } from "./CoinModel";

type Pose = readonly [number, number, number, number, number, number, number];

const POSES: readonly (readonly Pose[])[] = [
  [[7.2, 1.5, 1.8, -0.2, -0.4, 0.28, 2.4], [-7.8, -4.6, -1.8, -0.35, 0.25, -0.38, 3.8], [8.7, -2.7, -3.2, -0.1, 0.7, 0.2, 1.0]],
  [[-6.9, 3.7, -0.9, -0.4, 0.8, -0.42, 3.2], [7.7, -2.8, -2.1, -0.1, -0.55, 0.2, 1.5], [-7.8, -5.5, 1.2, -0.4, 0.2, -0.2, 2.0]],
  [[-6.1, -3.2, -0.5, -0.35, 0.3, -0.28, 1.9], [7.5, 3.2, -2.0, -0.1, -0.6, 0.18, 1.35], [4.4, -5.0, 1.8, -0.35, 0.5, 0.35, 3.0]],
  [[6.8, 2.8, 1.9, -0.28, -0.45, 0.35, 3.0], [-8.0, 1.4, -2.6, -0.2, 0.4, -0.18, 1.4], [7.9, -4.5, -1.0, -0.45, -0.1, 0.55, 2.15]],
  [[-7.5, 0.4, -1.0, -0.3, 0.35, -0.32, 2.0], [6.6, -4.1, 2.2, -0.4, -0.5, 0.42, 3.25], [8.1, 4.9, -2.5, -0.2, 0.6, 0.2, 1.25]],
  [[7.3, 3.3, 1.6, -0.25, -0.4, 0.3, 2.8], [-6.9, -4.7, -2.2, -0.3, 0.2, -0.4, 3.1], [-8.2, 3.8, -3.2, -0.15, 0.65, 0.2, 1.1]],
] as const;

const MOBILE_POSES: readonly Pose[] = [
  [0.8, 1.2, 1.4, -0.28, -0.35, 0.24, 1.45],
  [-0.75, 1.1, 1.2, -0.35, 0.55, -0.28, 1.38],
  [0.65, 1.3, 1.35, -0.3, 0.2, 0.32, 1.42],
  [-0.7, 1.15, 1.5, -0.3, -0.45, -0.25, 1.48],
  [0.75, 1.1, 1.3, -0.35, 0.4, 0.3, 1.4],
  [-0.6, 1.25, 1.45, -0.28, -0.3, -0.2, 1.45],
] as const;

function AnimatedCoin({
  index,
  activeIndex,
  mobile = false,
  silver,
}: {
  index: number;
  activeIndex: number;
  mobile?: boolean;
  silver?: boolean;
}) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    const current = group.current;
    if (!current) return;

    const [x, y, z, rx, ry, rz, scale] = mobile ? MOBILE_POSES[activeIndex] : POSES[activeIndex][index];
    current.position.x = THREE.MathUtils.damp(current.position.x, x, 4.5, delta);
    current.position.y = THREE.MathUtils.damp(current.position.y, y, 4.5, delta);
    current.position.z = THREE.MathUtils.damp(current.position.z, z, 4.5, delta);
    current.rotation.x = THREE.MathUtils.damp(current.rotation.x, rx, 4.2, delta);
    current.rotation.y = THREE.MathUtils.damp(current.rotation.y, ry, 4.2, delta);
    current.rotation.z = THREE.MathUtils.damp(current.rotation.z, rz, 4.2, delta) + delta * 0.15;
    const nextScale = THREE.MathUtils.damp(current.scale.x, scale, 4.5, delta);
    current.scale.setScalar(nextScale);
  });

  const initial = mobile ? MOBILE_POSES[0] : POSES[0][index];
  return (
    <group
      ref={group}
      position={[initial[0], initial[1], initial[2]]}
      rotation={[initial[3], initial[4], initial[5]]}
      scale={initial[6]}
    >
      <CoinModel silver={silver} />
    </group>
  );
}

function AirdropAccent({ activeIndex }: { activeIndex: number }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const current = group.current;
    if (!current) return;
    const side = activeIndex % 2 === 0 ? -1 : 1;
    current.position.x = THREE.MathUtils.damp(current.position.x, side * 9.4, 2.8, delta);
    current.position.y = THREE.MathUtils.damp(current.position.y, 4.6 - activeIndex * 0.22, 2.8, delta);
    current.rotation.y += delta * 0.18;
    current.rotation.z = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
  });

  return (
    <group ref={group} position={[-9.4, 4.6, -4.4]} rotation={[-0.25, 0.45, 0]} scale={0.78}>
      <AirdropModel />
    </group>
  );
}

export default function TokenomicsScene({
  active,
  activeIndex,
  mobile,
}: {
  active: boolean;
  activeIndex: number;
  mobile: boolean;
}) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 3.5, 8], zoom: 65, near: -100, far: 100 }}
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight intensity={3.1} position={[4, 7, 8]} />
      <directionalLight intensity={1.1} position={[-5, 2, 4]} color="#dce8ff" />
      <Suspense fallback={null}>
        <AnimatedCoin index={0} activeIndex={activeIndex} mobile={mobile} />
        {mobile ? null : <AnimatedCoin index={1} activeIndex={activeIndex} silver />}
        {mobile ? null : <AnimatedCoin index={2} activeIndex={activeIndex} />}
        {mobile ? null : <AirdropAccent activeIndex={activeIndex} />}
      </Suspense>
    </Canvas>
  );
}
