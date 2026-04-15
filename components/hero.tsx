import { Button } from "@/components/ui/button"
import Image from "next/image"
import LazyVideo from "./lazy-video"

export function Hero() {
  const buttonNew = (
    <Button asChild className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300">
      <a href="tel:8883682502">
        Call Us Today
      </a>
    </Button>
  )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-2">
            <Image src="/icons/skitbit-white.svg" alt="Iron Vault logo" width={32} height={32} className="h-8 w-8" />
            <p className="text-sm uppercase tracking-[0.25em] text-lime-300/80">IRON VAULT</p>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">REAL ESTATE.</span>
            <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">TOKENIZED.</span>
            <span className="block">UNDERSTOOD.</span>
          </h1>
          <div className="mt-6">{buttonNew}</div>

          {/* Phone grid mimic */}
          <div className="mt-10 grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            {phoneData.map((card) => (
              <div key={card.title}>
                <PhoneCard title={card.title} sub={card.sub} tone={card.tone} gradient={card.gradient} videoSrc={card.videoSrc} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  tone = "calm",
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
  videoSrc,
}: {
  title?: string
  sub?: string
  tone?: string
  gradient?: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        <LazyVideo
          src={
            videoSrc ??
            "/videos/hero-default.mp4"
          }
          className="absolute inset-0 h-full w-full object-cover"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          aria-label={`${title} - ${sub}`}
        />

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-white/90">{title}</div>
            <p className="text-xs text-white/70">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-lime-300">
              {tone === "calm" ? "iron vault" : tone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const phoneData = [
  {
    title: "Education",
    sub: "Understand why tokenized real estate matters.",
    tone: "phase 1",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc: "/videos/hero-education.mp4",
  },
  {
    title: "Liquidity",
    sub: "Access markets once locked to the few.",
    tone: "phase 2",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
    videoSrc: "/videos/hero-liquidity.mp4",
  },
  {
    title: "Transparency",
    sub: "No black boxes. No guessing.",
    tone: "phase 3",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc: "/videos/hero-transparency.mp4",
  },
  {
    title: "Global Access",
    sub: "Own real estate exposure from anywhere.",
    tone: "global",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
    videoSrc: "/videos/hero-global-access.mp4",
  },
]
