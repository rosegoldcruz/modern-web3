import Link from "next/link"

const STEPS = [
  "Choose your education track",
  "Connect or create your wallet",
  "Complete the 6 modules and quizzes",
  "Unlock your IV-SOL education allocation through verified progress",
]

const TIERS = [
  { name: "Module", coursework: "$25 coursework", allocation: "25,000 IV-SOL" },
  { name: "Starter", coursework: "$100 coursework", allocation: "100,000 IV-SOL" },
  { name: "Builder", coursework: "$500 coursework", allocation: "500,000 IV-SOL" },
  { name: "Founder", coursework: "$1,000 coursework", allocation: "1,000,000 IV-SOL" },
]

const MODULES = [
  "6 core modules",
  "Slide-style training inside each module",
  "Quiz at the end of each module",
  "Module completion is what matters for future allocation unlocks",
  "Token distribution after verified completion",
]

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-52 right-[-140px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(123,47,190,0.24),transparent_68%)]" />
        <div className="absolute -bottom-48 left-[-120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(170,255,0,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(123,47,190,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(123,47,190,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.38em] text-[#AAFF00]">Education is the Presale</p>
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-6xl">
            Unlock the Vault Before You Hold the Token
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-7 text-white/75 sm:text-lg">
            Iron Vault Academy teaches the foundation first. Complete modules, understand the system, then unlock your
            IV-SOL education allocation through the paid Learn flow.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/learn/pay"
              className="inline-flex items-center justify-center rounded-full bg-[#AAFF00] px-7 py-3 text-sm font-semibold text-black transition hover:bg-[#BFFF33]"
            >
              Start Learning
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:border-[#7B2FBE] hover:bg-[#7B2FBE]/15"
            >
              See How It Works
            </Link>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-[#0F0F0F]/90 p-4 shadow-[0_20px_90px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#AAFF00]">Dashboard Preview</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Academy Progress Snapshot</h2>
            </div>
            <div className="rounded-full border border-[#7B2FBE]/40 bg-[#7B2FBE]/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#D9B4FF]">
              mockup
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Module Progress</p>
              <p className="mt-4 text-3xl font-semibold">4 / 6</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[66%] rounded-full bg-[#AAFF00]" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">IV-SOL Allocation</p>
              <p className="mt-4 text-3xl font-semibold text-[#AAFF00]">100,000</p>
              <p className="mt-2 text-sm text-white/60">Education allocation tier: Starter</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Module Rewards</p>
              <p className="mt-4 text-3xl font-semibold">4 / 6</p>
              <p className="mt-2 text-sm text-white/60">Based on module completion and quiz pass</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Certificate Status</p>
              <p className="mt-4 text-3xl font-semibold">In Progress</p>
              <p className="mt-2 text-sm text-white/60">Final certificate unlocks after all modules</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Vault Unlock Progress</p>
              <p className="mt-4 text-3xl font-semibold text-[#D9B4FF]">66%</p>
              <p className="mt-2 text-sm text-white/60">Verified progress checkpoint active</p>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#101010] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#AAFF00]">What Iron Vault Academy Is</p>
            <h2 className="mt-3 text-3xl font-semibold">Education-First Access Loop</h2>
            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              Iron Vault Academy is a six-module learning system where coursework comes first. The Learn funnel is
              designed for comprehension, verified progress, and module completion milestones before token distribution
              is considered.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              The IV-SOL education allocation is tied to paid coursework and verified completion flow, not slide-by-slide
              events.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#AAFF00]">How Coursework Works</p>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, index) => (
                <li key={step} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/85">
                  <span className="mr-2 text-[#D9B4FF]">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#AAFF00]">Tier Preview</p>
              <h2 className="mt-2 text-3xl font-semibold">Choose Your Coursework Track</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <Link
                key={tier.name}
                href="/learn/pay"
                className="group rounded-2xl border border-white/10 bg-[#0F0F0F] p-5 transition hover:-translate-y-1 hover:border-[#7B2FBE]/70 hover:shadow-[0_18px_46px_rgba(123,47,190,0.2)]"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[#D9B4FF]">{tier.name}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{tier.coursework}</p>
                <p className="mt-2 text-sm text-[#AAFF00]">{tier.allocation}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/65 group-hover:text-white">Go to Learn Pay</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-[#0E0E0E] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#AAFF00]">Module Structure</p>
          <h2 className="mt-3 text-3xl font-semibold">How the 6-Module Loop Is Structured</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {MODULES.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/85">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-[#AAFF00]/25 bg-[#AAFF00]/6 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#AAFF00]">Ready to begin</p>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              Start with the paid Learn flow to unlock your dashboard and coursework path.
            </p>
            <Link
              href="/learn/pay"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#AAFF00] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#BFFF33]"
            >
              Start Learning
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
