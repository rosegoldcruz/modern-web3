"use client"

import Link from "next/link"
import { BookOpen, Coins, Landmark, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BottomNav } from "@/components/bottom-nav"
import { AppverseFooter } from "@/components/appverse-footer"

const modules = [
  {
    id: "01",
    title: "Money & Wealth Basics",
    status: "Ready",
    copy: "Understand money systems, inflation, budgeting, and the asset/liability framework.",
    icon: Landmark,
  },
  {
    id: "02",
    title: "Traditional Finance Systems",
    status: "Ready",
    copy: "Learn how banks, markets, retirement accounts, and credit shape long-term outcomes.",
    icon: Coins,
  },
  {
    id: "03",
    title: "Introduction to Crypto & Blockchain",
    status: "Ready",
    copy: "Master custody, wallets, token evaluation, and blockchain-first risk controls.",
    icon: ShieldCheck,
  },
  {
    id: "04",
    title: "Digital Assets & Modern Wealth",
    status: "Ready",
    copy: "Evaluate stablecoins, token utility, and strategic wealth-building structures.",
    icon: BookOpen,
  },
] as const

export default function LearnComingSoonPage() {
  return (
    <>
      <main className="min-h-[100dvh] overflow-x-clip pb-[calc(env(safe-area-inset-bottom)+88px)] text-white lg:pb-0">
        <SiteHeader />

        <section className="mx-auto w-full max-w-[1200px] px-4 pt-12 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">Learn</p>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Iron Vault Academy
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              The curriculum is now structured for direct access. Start with Module 01 and complete each track in sequence.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-lime-300/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">Curriculum Modules</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {modules.map((module) => {
                const Icon = module.icon
                return (
                  <article
                    key={module.title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5 transition-colors hover:border-lime-300/40"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/30 bg-lime-300/10 text-lime-200">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-lime-300/90">{module.status}</p>
                    </div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">Module {module.id}</p>
                    <h2 className="mb-2 text-lg font-bold tracking-tight text-white">{module.title}</h2>
                    <p className="text-sm leading-relaxed text-white/60">{module.copy}</p>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/how-it-works"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
              >
                View How It Works
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-lime-400 px-6 text-sm font-semibold text-black shadow-[0_0_20px_rgba(163,230,53,0.35)] transition-all hover:scale-[1.02] hover:bg-lime-300"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-4xl rounded-2xl border border-lime-400/25 bg-[rgba(163,230,53,0.05)] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-300">Performance-safe rollout</p>
            <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
              The previous scroll-linked 3D Macbook sequence was removed to reduce scroll jank and GPU spikes. This page now uses lightweight static rendering while your module data is finalized.
            </p>
          </div>
        </section>

        <AppverseFooter />
      </main>
      <BottomNav />
    </>
  )
}
