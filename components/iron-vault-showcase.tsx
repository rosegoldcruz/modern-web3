'use client'

import { FloatingContactPhone } from '@/components/floating-contact-phone'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function IronVaultShowcase() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-16 px-6 lg:flex-row lg:gap-28">
        {/* Phone on the left */}
        <div className="flex w-full shrink-0 justify-center lg:w-auto">
          <FloatingContactPhone reducedMotion={reducedMotion} />
        </div>

        {/* Text on the right */}
        <div className="max-w-2xl text-center lg:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The System That Builds Wealth
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg sm:leading-8">
            Iron Vault is a financial education ecosystem built for the people who were never taught how wealth actually works. Through a structured learning platform covering real estate, digital assets, and passive income strategies, Iron Vault transforms everyday people into informed participants in the new economy.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg sm:leading-8">
            As members learn, they earn — with community-driven royalty positions, token utility, and a long-term roadmap toward a real-world asset-backed stablecoin.
          </p>
          <p className="mt-4 text-base font-medium leading-relaxed text-white/90 sm:text-lg sm:leading-8">
            This isn&apos;t a pitch. It&apos;s a system. And the people who get in early don&apos;t just profit — they help build it.
          </p>
        </div>
      </div>
    </section>
  )
}
