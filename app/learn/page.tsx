"use client"

import { motion } from "motion/react"
import { Clock3, Lock, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BottomNav } from "@/components/bottom-nav"
import { AppverseFooter } from "@/components/appverse-footer"
import { MacbookScroll } from "@/components/macbook-scroll"

const modules = [
  {
    title: "Module 01 · Real Estate Fundamentals",
    status: "Coming Soon",
    copy: "Learn how cashflow, equity, and deal structure actually work without industry jargon.",
    icon: Clock3,
  },
  {
    title: "Module 02 · Crypto + Wallet Mastery",
    status: "In Production",
    copy: "Set up wallets safely, understand on-chain transactions, and avoid expensive beginner mistakes.",
    icon: Lock,
  },
  {
    title: "Module 03 · Iron Vault Token Mechanics",
    status: "Finalizing",
    copy: "Understand the IV-SOL utility design, token flow, and how completion ties to distribution.",
    icon: Sparkles,
  },
] as const

const spring = { type: "spring", stiffness: 220, damping: 24, mass: 0.9 } as const

export default function LearnComingSoonPage() {
  return (
    <>
      <main className="min-h-[100dvh] overflow-x-clip pb-[calc(env(safe-area-inset-bottom)+88px)] text-white lg:pb-0">
        <SiteHeader />

        <section className="mx-auto w-full max-w-[1400px] px-4 pt-12 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">Learn</p>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              The Learn Portal is almost here.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              Scroll down to preview what is shipping next. The first learning tracks are being finalized now.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <MacbookScroll
            src="/logos/the coin.png"
            showGradient
            title={
              <span>
                Coming soon: a guided learning experience <br /> for real estate + web3 fundamentals.
              </span>
            }
            badge={
              <div className="rounded-full border border-lime-300/45 bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">
                Learn Beta
              </div>
            }
          />
        </section>

        <section className="mx-auto -mt-20 w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-lime-300/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">Coming Soon Modules</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {modules.map((module, index) => {
                const Icon = module.icon
                return (
                  <motion.article
                    key={module.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ ...spring, delay: index * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/30 bg-lime-300/10 text-lime-200">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-lime-300/90">{module.status}</p>
                    <h2 className="mb-2 text-lg font-bold tracking-tight text-white">{module.title}</h2>
                    <p className="text-sm leading-relaxed text-white/60">{module.copy}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <AppverseFooter />
      </main>
      <BottomNav />
    </>
  )
}
