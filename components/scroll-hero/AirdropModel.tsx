"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

export function AirdropModel() {
  const { scene } = useGLTF("/models/airdrop.web.glb", "/draco/");
  const model = useMemo(() => cloneSkeleton(scene), [scene]);

  return <primitive object={model} />;
}

useGLTF.preload("/models/airdrop.web.glb", "/draco/");
