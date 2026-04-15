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
    sub: "Understand why tokenized real estate matters.",
    tone: "phase 1",
    videoSrc: "/videos/hero-education.mp4",
  },
  {
    title: "Liquidity",
    sub: "Access markets once locked to the few.",
    tone: "phase 2",
    videoSrc: "/videos/hero-liquidity.mp4",
  },
  {
    title: "Transparency",
    sub: "No black boxes. No guessing.",
    tone: "phase 3",
    videoSrc: "/videos/hero-transparency.mp4",
  },
  {
    title: "Global Access",
    sub: "Own real estate exposure from anywhere.",
    tone: "global",
    videoSrc: "/videos/hero-global-access.mp4",
  },
]

export function PhoneCards() {
  return (
    <div className="container mx-auto px-4 pb-14">
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
