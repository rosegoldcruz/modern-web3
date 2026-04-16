"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="container mx-auto max-w-6xl">
        <div className="liquid-glass-header flex min-h-16 items-center justify-between gap-4 rounded-3xl px-4 py-2 sm:min-h-20 sm:px-6 sm:py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logos/pwcw-logo.webp"
              alt="Commonwealth Ventures LLC"
              width={188}
              height={44}
              className="h-auto w-[132px] shrink-0 object-contain sm:w-[156px] lg:w-[188px]"
              priority
            />
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.26em] text-lime-300/85 md:inline lg:text-[11px]">
              Presents the Iron Vault token
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm text-gray-300 lg:flex">
            <Link href="/" className="transition-colors hover:text-purple-300">Home</Link>
            <Link href="/how-it-works" className="transition-colors hover:text-purple-300">How It Works</Link>
            <Link href="/faq" className="transition-colors hover:text-purple-300">FAQ</Link>
            <Link href="/education" className="transition-colors hover:text-purple-300">Education</Link>
            <Link href="/about" className="transition-colors hover:text-purple-300">About</Link>
          </nav>

          {/* Desktop CTA */}
          <Link
            href="tel:8883682502"
            className="hidden min-h-[44px] items-center gap-2 rounded-xl bg-lime-400 px-5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-lime-300 hover:shadow-md lg:inline-flex"
          >
            Call Us Today
          </Link>

          {/* Mobile: tap-to-call (ergonomically primary action = keep accessible here too) */}
          <Link
            href="tel:8883682502"
            aria-label="Call Iron Vault"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black shadow-[0_6px_16px_rgba(132,204,22,0.35)] lg:hidden"
          >
            <Phone className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
