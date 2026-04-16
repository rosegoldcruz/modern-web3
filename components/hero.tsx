"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { GraduationCap, Rocket } from "lucide-react"
import LazyVideo from "./lazy-video"

const spring = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[100svh] flex flex-col">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <LazyVideo
          src="/videos/hero.mp4"
          className="h-full w-full object-cover"
          autoplay
          loop
          muted
          playsInline
          aria-label="Iron Vault hero background"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent"
        />
      </div>

      {/* Content column — text near top, CTAs in bottom third */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pt-24 pb-[calc(env(safe-area-inset-bottom)+104px)] sm:px-8 md:pb-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="max-w-xl"
        >
          <h1 className="text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">Learn How</span>
            <span className="block">Money</span>
            <span className="block text-lime-300 drop-shadow-[0_0_24px_rgba(132,204,22,0.45)]">
              Actually Works
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300/90 sm:text-lg">
            Understand real estate, digital assets, and financial systems before making any move.
          </p>
        </motion.div>

        {/* Spacer pushes CTAs toward the bottom third on tall screens */}
        <div className="flex-1 min-h-6" />

        {/* Thumb-zone CTA stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/education"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 text-base font-semibold text-black shadow-[0_10px_30px_rgba(132,204,22,0.35)] active:scale-[0.98] transition-transform"
          >
            <GraduationCap className="h-5 w-5" aria-hidden />
            Start Learning Now
          </Link>

          <Link
            href="#difference"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl border border-yellow-500/60 bg-black/60 px-6 text-base font-semibold text-yellow-400 backdrop-blur-sm active:scale-[0.98] transition-transform"
          >
            <Rocket className="h-5 w-5" aria-hidden />
            Get Early Access
          </Link>
        </motion.div>

        <p className="mt-4 text-center text-xs text-neutral-500 sm:text-left sm:text-sm">
          Takes 2 minutes. Learn first. Decide after.
        </p>
      </div>
    </section>
  )
}
