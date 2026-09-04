import type { Object3D } from "three"

declare module "three/examples/jsm/utils/SkeletonUtils.js" {
  export function clone<T extends Object3D>(object: T): T
}
