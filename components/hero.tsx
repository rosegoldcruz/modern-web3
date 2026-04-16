import Link from "next/link"
import { Button } from "@/components/ui/button"
import LazyVideo from "./lazy-video"

export function Hero() {
  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden">
      {/* Content */}
      <div className="container relative z-10 mx-auto flex min-h-[85vh] items-center px-4">
        <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:justify-between">
          {/* Left text */}
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

          {/* Right — spinning coin video */}
          <div className="relative hidden w-full max-w-[400px] lg:block">
            <div className="absolute inset-0 rounded-full bg-[rgba(255,215,0,0.1)] blur-3xl" aria-hidden="true" />
            <LazyVideo
              src="/videos/hero.mp4"
              className="relative z-10 h-auto w-full mix-blend-screen"
              autoplay={true}
              loop={true}
              muted={true}
              playsInline={true}
              aria-label="Iron Vault spinning coin"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
