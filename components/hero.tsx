"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

const SpinningCoin = dynamic(() => import("@/components/spinning-coin"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent" />
    </div>
  ),
})

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid min-h-[70vh] grid-cols-1 items-center gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12">
          {/* Left — text */}
          <div className="flex flex-col items-start justify-center">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-lime-300/80">
              Iron Vault
            </p>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Real Estate.</span>
              <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">
                Tokenized.
              </span>
              <span className="block">Understood.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-400 sm:text-lg">
              An education-first entry point into understanding how real-world assets
              can be structured, represented, and integrated into decentralized systems.
            </p>

            <Button
              asChild
              className="mt-8 rounded-lg border border-yellow-600 bg-neutral-950 px-8 py-3 text-base font-semibold text-yellow-500 hover:bg-yellow-600/10 hover:text-yellow-400 transition-all"
            >
              <a href="tel:8883682502">Call Us Today</a>
            </Button>
          </div>

          {/* Right — 3D coin */}
          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg" style={{ background: 'transparent' }}>
            <SpinningCoin />
          </div>
        </div>
      </div>
    </section>
  )
}
