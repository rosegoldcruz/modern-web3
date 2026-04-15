import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden">
      {/* Full-bleed coin video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/videos/heroee.mp4" type="video/mp4" />
      </video>

      {/* Radial vignette to blend video edges into background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0.95)_80%,rgba(0,0,0,1)_100%)]" />

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

      {/* Content — left-aligned over the video */}
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
