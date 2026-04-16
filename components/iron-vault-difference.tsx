"use client"

import { GraduationCap, Building2, Workflow, Users } from "lucide-react"

const cards = [
  {
    label: "EDUCATION FIRST",
    title: "Education Before Participation",
    body: "We teach the mechanics before we introduce the token. Real estate, tokenization, decentralized infrastructure \u2014 explained in plain English.",
    accent: "No hype. No confusion. No pressure.",
    icon: GraduationCap,
    span: "md:col-span-7",
    border: "border-lime-400/30",
    accentColor: "text-lime-300",
    iconBg: "bg-lime-400/10",
  },
  {
    label: "ASSET-BACKED",
    title: "Real Assets, Real Value",
    body: "Every token is tied to real\u2011world property. Verified acquisitions, transparent reporting, and on\u2011chain representation.",
    accent: "This is infrastructure, not speculation.",
    icon: Building2,
    span: "md:col-span-5",
    border: "border-white/10",
    accentColor: "text-white/60",
    iconBg: "bg-white/5",
  },
  {
    label: "AUTOMATED",
    title: "Automated Revenue Flow",
    body: "Income moves through smart contracts, not spreadsheets. Rental yield, distributions, and reporting \u2014 automated and auditable.",
    accent: "No middlemen. No manual processes.",
    icon: Workflow,
    span: "md:col-span-5",
    border: "border-white/10",
    accentColor: "text-white/60",
    iconBg: "bg-white/5",
  },
  {
    label: "GOVERNANCE",
    title: "Community\u2011Driven Governance",
    body: "Ownership comes with a voice. Weighted voting, transparent proposals, and a governance model designed for long\u2011term stability.",
    accent: "Not short\u2011term hype.",
    icon: Users,
    span: "md:col-span-7",
    border: "border-lime-400/30",
    accentColor: "text-lime-300",
    iconBg: "bg-lime-400/10",
  },
]

export function IronVaultDifference() {
  return (
    <section id="difference" className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">
        The Iron Vault Difference
      </p>
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Built Different. By Design.
      </h2>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
        Real estate meets decentralized infrastructure &mdash; responsibly, transparently, and built for understanding.
      </p>

      <div className="grid gap-5 md:grid-cols-12">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`${card.span} group rounded-2xl border ${card.border} bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.06] sm:p-8`}
            >
              <div className={`mb-4 inline-flex rounded-xl ${card.iconBg} p-3`}>
                <Icon className={`h-6 w-6 ${card.accentColor}`} />
              </div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {card.label}
              </p>
              <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl">
                {card.title}
              </h3>
              <p className="mb-3 text-base leading-relaxed text-white/55 sm:text-lg">
                {card.body}
              </p>
              <p className={`text-sm font-medium ${card.accentColor}`}>
                {card.accent}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
