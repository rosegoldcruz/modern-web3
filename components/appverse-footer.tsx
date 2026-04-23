"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Real estate. Tokenized. Understood. The entry point into decentralized real-world asset finance.",
  copyright: "© 2025 — Commonwealth Ventures LLC",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("skitbit-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-lime-400 px-6 py-2 text-sm font-medium text-black shadow-[0_0_20px_rgba(163,230,53,0.35)] hover:bg-lime-300"
          >
            <a href="tel:8883682502">
              Call Us Today
            </a>
          </Button>
        </div>
      </div>

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-lime-300">POSITION BEFORE THE NARRATIVE SPREADS</p>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                The people who understand systems early accumulate before demand spikes.
              </h3>
              <p className="mt-2 max-w-prose text-sm text-neutral-400">
                Early participants shape the direction of the ecosystem. Understand the system. Join the community. Be first to access each phase.
              </p>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[380px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black">
                  {/* Lazy-loaded video fills the screen */}
                  <LazyVideo
                    src="/videos/footer.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    aria-label="Iron Vault preview"
                  />
                  {/* On-screen content */}
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-lime-300">Real Estate Meets DeFi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Image src="/logos/the%20coin.png" alt="Iron Vault coin" width={32} height={32} className="h-8 w-8 object-contain" />
                <span className="text-xl font-semibold text-lime-300">Iron Vault</span>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Navigation</h5>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {["Home", "How It Works", "Community", "Phases", "Education", "Whitepaper"].map((item) => (
                    <li key={item}>
                      <Link href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-lime-300">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <Link href="/privacy" className="transition-colors hover:text-lime-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-lime-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
