"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

type CoinModelProps = {
  silver?: boolean;
};

export function CoinModel({ silver = false }: CoinModelProps) {
  const { scene } = useGLTF("/models/coin.web.glb", "/draco/");

  const model = useMemo(() => {
    // The source coin contains a skinned mesh, so a regular Object3D clone
    // leaves its skeleton bound to the original scene. SkeletonUtils keeps
    // each rendered instance independent and preserves the authored pose.
    const clone = cloneSkeleton(scene);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (!silver) return;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const silverMaterials = materials.map((material) => {
        const next = material.clone();
        if (next instanceof THREE.MeshStandardMaterial) {
          next.color.set("#d6e0ed");
          next.metalness = 0.96;
          next.roughness = 0.34;
          next.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <map_fragment>",
              `#include <map_fragment>
              float ivSilverLuma = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
              diffuseColor.rgb = vec3(ivSilverLuma) * vec3(0.82, 0.9, 1.0);`,
            );
          };
          next.customProgramCacheKey = () => "iron-vault-silver-v1";
          next.needsUpdate = true;
        }
        return next;
      });

      child.material = Array.isArray(child.material) ? silverMaterials : silverMaterials[0];
    });

    return clone;
  }, [scene, silver]);

  return <primitive object={model} />;
}

useGLTF.preload("/models/coin.web.glb", "/draco/");
