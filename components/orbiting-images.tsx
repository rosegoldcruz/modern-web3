"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react"

import { useReducedMotion } from "@/hooks/use-reduced-motion"
import styles from "./orbiting-images.module.css"

type OrbitShape =
  | "ellipse"
  | "circle"
  | "square"
  | "rectangle"
  | "triangle"
  | "star"
  | "heart"
  | "infinity"
  | "wave"
  | "custom"

interface OrbitingImagesProps {
  images?: string[]
  altPrefix?: string
  shape?: OrbitShape
  customPath?: string
  baseWidth?: number
  radiusX?: number
  radiusY?: number
  radius?: number
  starPoints?: number
  starInnerRatio?: number
  rotation?: number
  duration?: number
  itemSize?: number
  direction?: "normal" | "reverse"
  fill?: boolean
  width?: number | "100%"
  height?: number | "auto"
  className?: string
  showPath?: boolean
  pathColor?: string
  pathWidth?: number
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut"
  paused?: boolean
  centerContent?: ReactNode
  responsive?: boolean
}

interface OrbitItemProps {
  item: ReactNode
  index: number
  totalItems: number
  path: string
  itemSize: number
  rotation: number
  progress: MotionValue<number>
  fill: boolean
}

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`
}

function generateCirclePath(cx: number, cy: number, radius: number): string {
  return generateEllipsePath(cx, cy, radius, radius)
}

function generateSquarePath(cx: number, cy: number, size: number): string {
  const half = size / 2
  return `M ${cx - half} ${cy - half} L ${cx + half} ${cy - half} L ${cx + half} ${cy + half} L ${cx - half} ${cy + half} Z`
}

function generateRectanglePath(cx: number, cy: number, width: number, height: number): string {
  const halfWidth = width / 2
  const halfHeight = height / 2
  return `M ${cx - halfWidth} ${cy - halfHeight} L ${cx + halfWidth} ${cy - halfHeight} L ${cx + halfWidth} ${cy + halfHeight} L ${cx - halfWidth} ${cy + halfHeight} Z`
}

function generateTrianglePath(cx: number, cy: number, size: number): string {
  const triangleHeight = (size * Math.sqrt(3)) / 2
  const halfSize = size / 2
  return `M ${cx} ${cy - triangleHeight / 1.5} L ${cx + halfSize} ${cy + triangleHeight / 3} L ${cx - halfSize} ${cy + triangleHeight / 3} Z`
}

function generateStarPath(cx: number, cy: number, outerRadius: number, innerRadius: number, points: number): string {
  const step = Math.PI / points
  let path = ""

  for (let index = 0; index < 2 * points; index += 1) {
    const currentRadius = index % 2 === 0 ? outerRadius : innerRadius
    const angle = index * step - Math.PI / 2
    const x = cx + currentRadius * Math.cos(angle)
    const y = cy + currentRadius * Math.sin(angle)
    path += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }

  return `${path} Z`
}

function generateHeartPath(cx: number, cy: number, size: number): string {
  const scale = size / 30
  return `M ${cx} ${cy + 12 * scale} C ${cx - 20 * scale} ${cy - 5 * scale}, ${cx - 12 * scale} ${cy - 18 * scale}, ${cx} ${cy - 8 * scale} C ${cx + 12 * scale} ${cy - 18 * scale}, ${cx + 20 * scale} ${cy - 5 * scale}, ${cx} ${cy + 12 * scale}`
}

function generateInfinityPath(cx: number, cy: number, width: number, height: number): string {
  const halfWidth = width / 2
  const halfHeight = height / 2
  return `M ${cx} ${cy} C ${cx + halfWidth * 0.5} ${cy - halfHeight}, ${cx + halfWidth} ${cy - halfHeight}, ${cx + halfWidth} ${cy} C ${cx + halfWidth} ${cy + halfHeight}, ${cx + halfWidth * 0.5} ${cy + halfHeight}, ${cx} ${cy} C ${cx - halfWidth * 0.5} ${cy + halfHeight}, ${cx - halfWidth} ${cy + halfHeight}, ${cx - halfWidth} ${cy} C ${cx - halfWidth} ${cy - halfHeight}, ${cx - halfWidth * 0.5} ${cy - halfHeight}, ${cx} ${cy}`
}

function generateWavePath(cx: number, cy: number, width: number, amplitude: number, waves: number): string {
  const points: string[] = []
  const segments = waves * 20
  const halfWidth = width / 2

  for (let index = 0; index <= segments; index += 1) {
    const x = cx - halfWidth + (width * index) / segments
    const y = cy + Math.sin((index / segments) * waves * 2 * Math.PI) * amplitude
    points.push(index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
  }

  for (let index = segments; index >= 0; index -= 1) {
    const x = cx - halfWidth + (width * index) / segments
    const y = cy - Math.sin((index / segments) * waves * 2 * Math.PI) * amplitude
    points.push(`L ${x} ${y}`)
  }

  return `${points.join(" ")} Z`
}

function getDesignHeight(shape: OrbitShape, radiusX: number, radiusY: number, radius: number, itemSize: number): number {
  switch (shape) {
    case "circle":
    case "square":
    case "triangle":
    case "star":
    case "heart":
      return Math.max(radius * 2 + itemSize * 2 + 140, 420)
    case "rectangle":
    case "infinity":
    case "wave":
      return Math.max(radiusY * 2 + itemSize * 2 + 180, 420)
    case "custom":
      return Math.max(radiusY * 2 + itemSize * 2 + 180, 420)
    case "ellipse":
    default:
      return Math.max(radiusY * 2 + itemSize * 2 + 180, Math.min(radiusX * 0.75, 520))
  }
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill }: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0

  const offsetDistance = useTransform(progress, (value: number) => {
    const normalizedValue = (((value + itemOffset) % 100) + 100) % 100
    return `${normalizedValue}%`
  })

  return (
    <motion.div
      className={styles.orbitItem}
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: "0deg",
        offsetAnchor: "center center",
        offsetDistance,
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  )
}

export default function OrbitingImages({
  images = [],
  altPrefix = "Orbiting image",
  shape = "ellipse",
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = "normal",
  fill = true,
  width = 100,
  height = "auto",
  className = "",
  showPath = false,
  pathColor = "rgba(128, 100, 255, 0.22)",
  pathWidth = 2,
  easing = "linear",
  paused = false,
  centerContent,
  responsive = false,
}: OrbitingImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isInView, setIsInView] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const designHeight = useMemo(() => getDesignHeight(shape, radiusX, radiusY, radius, itemSize), [shape, radiusX, radiusY, radius, itemSize])
  const designCenterX = baseWidth / 2
  const designCenterY = designHeight / 2

  const path = useMemo(() => {
    switch (shape) {
      case "circle":
        return generateCirclePath(designCenterX, designCenterY, radius)
      case "ellipse":
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY)
      case "square":
        return generateSquarePath(designCenterX, designCenterY, radius * 2)
      case "rectangle":
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2)
      case "triangle":
        return generateTrianglePath(designCenterX, designCenterY, radius * 2)
      case "star":
        return generateStarPath(designCenterX, designCenterY, radius, radius * starInnerRatio, starPoints)
      case "heart":
        return generateHeartPath(designCenterX, designCenterY, radius * 2)
      case "infinity":
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2)
      case "wave":
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3)
      case "custom":
        return customPath || generateCirclePath(designCenterX, designCenterY, radius)
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY)
    }
  }, [shape, customPath, designCenterX, designCenterY, radiusX, radiusY, radius, starPoints, starInnerRatio])

  useEffect(() => {
    if (!responsive || !containerRef.current) {
      return
    }

    const updateScale = () => {
      if (!containerRef.current) {
        return
      }

      setScale(containerRef.current.clientWidth / baseWidth)
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [responsive, baseWidth])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const progress = useMotionValue(0)

  useEffect(() => {
    if (paused || prefersReducedMotion || !isInView) {
      return
    }

    const controls = animate(progress, direction === "reverse" ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    })

    return () => controls.stop()
  }, [progress, duration, easing, direction, paused, prefersReducedMotion, isInView])

  const containerWidth = responsive ? "100%" : typeof width === "number" ? width : width
  const containerHeight = responsive ? "auto" : typeof height === "number" ? height : height

  const items = images.map((src, index) => (
    <img
      key={`${src}-${index}`}
      src={src}
      alt={`${altPrefix} ${index + 1}`}
      draggable={false}
      className={styles.orbitImage}
    />
  ))

  return (
    <div
      ref={containerRef}
      className={[styles.orbitContainer, className].filter(Boolean).join(" ")}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? `${baseWidth} / ${designHeight}` : undefined,
      }}
      aria-label="Orbiting gallery"
    >
      <div
        className={responsive ? `${styles.scalingContainer} ${styles.scalingContainerResponsive}` : styles.scalingContainer}
        style={{
          width: responsive ? baseWidth : "100%",
          height: responsive ? designHeight : "100%",
          transform: responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
        }}
      >
        <div className={styles.rotationWrapper} style={{ transform: `rotate(${rotation}deg)` }}>
          {showPath ? (
            <svg width="100%" height="100%" viewBox={`0 0 ${baseWidth} ${designHeight}`} className={styles.pathSvg}>
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / scale} />
            </svg>
          ) : null}

          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
            />
          ))}
        </div>
      </div>

      {centerContent ? <div className={styles.centerContent}>{centerContent}</div> : null}
    </div>
  )
}
