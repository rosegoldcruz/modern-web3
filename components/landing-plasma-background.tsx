"use client"

import { useEffect, useState } from "react"

import Plasma from "@/components/plasma"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function LandingPlasmaBackground() {
  const prefersReducedMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    updateViewport()
    window.addEventListener("resize", updateViewport)

    return () => {
      window.removeEventListener("resize", updateViewport)
    }
  }, [])

  const enablePlasma = isDesktop && !prefersReducedMotion

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_-12%,rgba(139,92,246,0.2),transparent_48%),linear-gradient(180deg,#050507_0%,#0a0a0d_100%)]" />
      {enablePlasma ? (
        <Plasma color="#8b5cf6" speed={0.55} direction="forward" scale={1.3} opacity={0.42} mouseInteractive={false} />
      ) : null}
    </div>
  )
}
