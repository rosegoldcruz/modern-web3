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
        className="pointer-events-none absolute inset-0 h-full w-full object-cover scale-75 origin-center"
        aria-hidden="true"
      >
        <source src="/videos/download%20(7).mp4" type="video/mp4" />
      </video>

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

      {/* Content — left-aligned over the video */}
      <div className="container relative z-10 mx-auto flex min-h-[85vh] items-center px-4">
        <div className="flex max-w-xl flex-col items-start justify-center py-20">
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

          <div className="mt-6 max-w-lg space-y-3 text-base leading-relaxed text-neutral-300 sm:text-lg">
            <p>Most people hear about crypto and real estate and get lost.</p>
            <p>We built Iron Vault to make it make sense.</p>
            <p>
              It shows how real properties can connect to the blockchain —
              and gives you a simple way to learn before you decide to get involved.
            </p>
          </div>

          {/* Two CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="rounded-lg bg-lime-400 px-8 py-3 text-base font-semibold text-black hover:bg-lime-300 transition-all"
            >
              <Link href="#blog">👉 Start Learning</Link>
            </Button>

            <Button
              asChild
              className="rounded-lg border border-yellow-600 bg-neutral-950 px-8 py-3 text-base font-semibold text-yellow-500 hover:bg-yellow-600/10 hover:text-yellow-400 transition-all"
            >
              <Link href="/checkout">👉 Get Early Access</Link>
            </Button>
          </div>

          {/* Closer line */}
          <p className="mt-5 text-sm text-neutral-500">
            Learn how it works. Then decide if it&apos;s for you.
          </p>
        </div>
      </div>
    </section>
  )
}
