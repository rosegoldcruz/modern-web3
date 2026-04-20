"use client"

import { motion } from "motion/react"
import { Minus, ExternalLink } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BottomNav } from "@/components/bottom-nav"
import { AppverseFooter } from "@/components/appverse-footer"
import { CopyButton } from "@/components/copy-button"

const spring = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const

const team = [
  {
    name: "Christopher Maxon",
    role: "CEO",
    bio: "21 years in sales, capital formation, and marketing. Christopher leads Iron Vault's vision of making real financial education accessible to everyone who was never taught how the system works.",
    initials: "CM",
  },
  {
    name: "Daniel Cruz",
    role: "Head of Growth & Full Stack Developer",
    bio: "The systems architect behind the Iron Vault platform. Daniel built the infrastructure, designed the learn-to-earn mechanic, and leads everything from the web stack to the on-chain token distribution logic.",
    initials: "DC",
  },
  {
    name: "Mark Hannah",
    role: "Director of Community",
    bio: "Mark owns the member experience — from first contact to founding member. He ensures that everyone who enters the Iron Vault ecosystem feels informed, supported, and part of something being built for the long term.",
    initials: "MH",
  },
]

const values = [
  {
    label: "Education before participation.",
    text: "We built the course before we built the presale. That order was intentional.",
  },
  {
    label: "Transparency over hype.",
    text: "Every risk is disclosed. Every claim is verifiable. We say what we don't know.",
  },
  {
    label: "Real assets, real accountability.",
    text: "Commonwealth Ventures LLC is a registered Arizona entity. We are not anonymous.",
  },
  {
    label: "Built for the long term.",
    text: "We are not optimizing for a token pump. We are building infrastructure that outlasts the cycle.",
  },
]

const TOKEN_ADDRESS = "DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV"

export default function AboutPage() {
  return (
    <>
      <main className="min-h-[100dvh] pb-[calc(env(safe-area-inset-bottom)+88px)] text-white lg:pb-0">
        <SiteHeader />

        {/* Hero */}
        <section className="mx-auto w-full max-w-[1400px] px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">
              About
            </p>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              We built this because nobody else was teaching it right.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              Commonwealth Ventures LLC was founded on a simple observation: the financial systems that build real wealth are deliberately complicated, and the people who most need access to them are the least likely to get a straight explanation. Iron Vault exists to fix that.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-7 bg-lime-300/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">
                The mission
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 sm:p-8">
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Education first. Always.
              </h2>
              <p className="mb-4 text-base leading-relaxed text-white/60 sm:text-lg">
                The Iron Vault Token is not a get-rich-quick scheme. It is the utility layer of a financial education ecosystem being built to last. Before anyone participates in the token, they complete a curriculum that teaches them exactly what they're getting into.
              </p>
              <p className="text-base leading-relaxed text-white/60 sm:text-lg">
                Complete the coursework modules &rarr; receive IV-SOL automatically. It&apos;s that simple.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-7 bg-lime-300/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">
                What we stand for
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)]">
              {values.map((v, i) => (
                <div
                  key={v.label}
                  className={`flex gap-3 px-5 py-5 sm:px-6 ${
                    i === values.length - 1 ? "" : "border-b border-white/10"
                  }`}
                >
                  <Minus className="mt-1.5 h-4 w-4 shrink-0 text-lime-300" aria-hidden />
                  <div>
                    <p className="mb-1 text-base font-semibold text-white sm:text-lg">
                      {v.label}
                    </p>
                    <p className="text-sm leading-relaxed text-white/55 sm:text-base">
                      {v.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-2 flex items-center gap-3">
              <span aria-hidden className="h-px w-7 bg-lime-300/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">
                The team
              </p>
            </div>
            <p className="mb-6 max-w-2xl text-sm text-white/50 sm:text-base">
              Christopher, Daniel, and Mark operate on behalf of Commonwealth Ventures LLC, the Arizona-registered entity behind the Iron Vault ecosystem.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ ...spring, delay: i * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 transition-colors hover:border-lime-400/30 hover:bg-[rgba(255,255,255,0.08)] sm:p-7"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/10 text-sm font-semibold text-lime-300">
                    {member.initials}
                  </div>
                  <p className="text-lg font-bold tracking-tight text-white">{member.name}</p>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-300">
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed text-white/55 sm:text-base">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal & transparency */}
        <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-7 bg-lime-300/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-lime-300">
                Legal &amp; transparency
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)]">
              <EntityRow label="Legal entity" value="Commonwealth Ventures LLC" />
              <EntityRow label="Entity ID" value={<span className="font-mono text-xs">23883142</span>} />
              <EntityRow label="State" value="Arizona, USA" />
              <EntityRow
                label="Status"
                value={<span className="text-lime-300">Active &mdash; In Good Standing</span>}
              />
              <EntityRow
                label="Token contract"
                value={
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/70">DTe8U4…oufjV</span>
                    <CopyButton text={TOKEN_ADDRESS} />
                  </span>
                }
              />
              <EntityRow
                last
                label="Verify on-chain"
                value={
                  <a
                    href={`https://solscan.io/token/${TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-lime-300 hover:text-lime-200"
                  >
                    Solscan <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                }
              />
            </div>
          </div>
        </section>

        <AppverseFooter />
      </main>
      <BottomNav />
    </>
  )
}

function EntityRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6 ${
        last ? "" : "border-b border-white/10"
      }`}
    >
      <span className="text-sm text-white/45">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}
