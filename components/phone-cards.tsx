"use client"

import LazyVideo from "./lazy-video"

function PhoneCard({
  title = "",
  sub = "",
  tone = "iron vault",
  videoSrc,
}: {
  title?: string
  sub?: string
  tone?: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        <LazyVideo
          src={videoSrc ?? "/videos/hero-default.mp4"}
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
              {tone}
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
    sub: "Understand how money, real estate, and digital assets actually work.",
    tone: "foundation",
    videoSrc: "/videos/hero-education.mp4",
  },
  {
    title: "Liquidity",
    sub: "See how blockchain changes access to traditionally locked systems.",
    tone: "access",
    videoSrc: "/videos/hero-liquidity.mp4",
  },
  {
    title: "Transparency",
    sub: "No guesswork. No hidden mechanics. Just how it actually works.",
    tone: "clarity",
    videoSrc: "/videos/hero-transparency.mp4",
  },
  {
    title: "Global Access",
    sub: "Learn and participate in emerging financial systems from anywhere.",
    tone: "reach",
    videoSrc: "/videos/hero-global-access.mp4",
  },
]

export function PhoneCards() {
  return (
    <div className="container mx-auto px-4 pb-14">
      {/* Section header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          How the System Starts
        </h2>
        <p className="mt-3 text-base text-neutral-400 sm:text-lg">
          Four pillars that take you from confusion to clarity before participation.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
        {phoneData.map((card) => (
          <div key={card.title}>
            <PhoneCard
              title={card.title}
              sub={card.sub}
              tone={card.tone}
              videoSrc={card.videoSrc}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
