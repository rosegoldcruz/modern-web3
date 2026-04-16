import Link from "next/link"
import { Button } from "@/components/ui/button"
import LazyVideo from "./lazy-video"

export function Hero() {
  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden">
      {/* Full-viewport background video */}
      <div className="absolute inset-0 z-0">
        <LazyVideo
          src="/videos/hero.mp4"
          className="h-full w-full object-cover"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          aria-label="Iron Vault hero background"
        />
        {/* Vignette overlay to blend edges */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,1) 100%)',
          }}
        />
        {/* Left edge fade for text readability */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          }}
        />
        {/* Bottom edge fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)',
          }}
        />
        {/* Top edge fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Content — text on left */}
      <div className="container relative z-10 mx-auto flex min-h-[85vh] items-center px-4">
        <div className="flex max-w-xl flex-col items-start justify-center py-20">
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Learn How Money</span>
            <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">
              Actually Works
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
            Understand real estate, digital assets, and financial systems before making any move.
          </p>

          {/* Two CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="rounded-lg bg-lime-400 px-8 py-3 text-base font-semibold text-black hover:bg-lime-300 transition-all"
            >
              <Link href="#blog">🎓 Start Learning Now</Link>
            </Button>

            <Button
              asChild
              className="rounded-lg border border-yellow-600 bg-neutral-950 px-8 py-3 text-base font-semibold text-yellow-500 hover:bg-yellow-600/10 hover:text-yellow-400 transition-all"
            >
              <Link href="#pricing">🪙 Get Early Access</Link>
            </Button>
          </div>

          {/* Closer line */}
          <p className="mt-5 text-sm text-neutral-500">
            Takes 2 minutes. Learn first. Decide after.
          </p>
        </div>
      </div>
    </section>
  )
}
