import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');`

const CSS = `
  ${FONTS}
  .lv-root{font-family:'DM Sans',system-ui,sans-serif;}
  .lv-mono{font-family:'Space Mono',ui-monospace,monospace;}
  .lv-display{font-family:'Bebas Neue',sans-serif;letter-spacing:2px;}
  .lv-grid-bg{
    background-image:
      linear-gradient(rgba(123,47,190,0.05) 1px,transparent 1px),
      linear-gradient(90deg,rgba(123,47,190,0.05) 1px,transparent 1px);
    background-size:80px 80px;
  }
  .lv-scanline{
    background:repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px);
  }
  .lv-fade{animation:lvFade 0.7s ease both;}
  @keyframes lvFade{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .lv-blink{animation:lvBlink 1.4s steps(2,start) infinite;}
  @keyframes lvBlink{to{visibility:hidden;}}
  .lv-tier:hover .lv-tier-arrow{transform:translateX(4px);}
`

const TIERS = [
  { code: "T-01", name: "MODULE", price: "$25", allocation: "25,000", clearance: "ENTRY" },
  { code: "T-02", name: "STARTER", price: "$100", allocation: "100,000", clearance: "FOUNDATION" },
  { code: "T-03", name: "BUILDER", price: "$500", allocation: "500,000", clearance: "ACCELERATOR" },
  { code: "T-04", name: "FOUNDER", price: "$1,000", allocation: "1,000,000", clearance: "ELITE" },
]

export default function LearnPage() {
  return (
    <main className="lv-root min-h-screen bg-[#050505] text-white selection:bg-[#AAFF00] selection:text-black">
      <style>{CSS}</style>

      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 lv-grid-bg opacity-60" />
        <div className="absolute inset-0 lv-scanline" />
        <div className="absolute -top-72 right-[-220px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(123,47,190,0.18),transparent_70%)]" />
        <div className="absolute -bottom-72 left-[-200px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(170,255,0,0.07),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <div className="relative z-10">
        <SiteHeader />

        {/* Terminal status bar */}
        <div className="border-b border-white/[0.06] bg-black/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
            <div className="lv-mono flex items-center gap-3 text-[10px] tracking-[0.25em] text-white/40">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#AAFF00] shadow-[0_0_8px_#AAFF00]" />
              <span>IRON_VAULT // ACADEMY_LAYER</span>
            </div>
            <div className="lv-mono text-[10px] tracking-[0.25em] text-white/30">
              STATUS: <span className="text-[#AAFF00]">ONLINE</span>
            </div>
          </div>
        </div>

        {/* HERO — cinematic, sparse */}
        <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-8">
          <div className="lv-fade lv-mono mb-10 inline-flex items-center gap-3 border border-white/10 bg-black/40 px-4 py-2 text-[10px] tracking-[0.35em] text-white/50">
            <span className="h-1.5 w-1.5 bg-[#7B2FBE]" />
            RESTRICTED ACCESS LAYER
          </div>

          <h1 className="lv-display lv-fade text-balance text-[14vw] leading-[0.92] text-white sm:text-[110px] md:text-[140px]">
            EDUCATION
            <br />
            <span className="text-white/30">BEFORE</span>
            <br />
            <span className="text-[#AAFF00]">DISTRIBUTION</span>
          </h1>

          <p className="lv-mono lv-fade mt-12 max-w-md text-[11px] leading-relaxed tracking-[0.18em] text-white/45">
            VERIFIED PROGRESS UNLOCKS ALLOCATION.
            <br />
            NO SHORTCUTS. NO PRE-SALE. NO PROMISES.
          </p>

          <div className="lv-fade mt-14 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/learn/pay"
              className="lv-display group relative inline-flex items-center gap-4 border border-[#AAFF00] bg-[#AAFF00] px-10 py-4 text-base text-black transition hover:bg-[#BFFF33]"
            >
              <span>ENTER VAULT</span>
              <span className="lv-mono text-[10px] tracking-[0.2em]">▸</span>
            </Link>
            <Link
              href="https://member.ironvaulttoken.com/dashboard"
              className="lv-mono inline-flex items-center gap-3 border border-white/15 px-8 py-4 text-[10px] tracking-[0.3em] text-white/60 transition hover:border-white/40 hover:text-white"
            >
              MEMBER LOGIN
            </Link>
            <Link
              href="/how-it-works"
              className="lv-mono inline-flex items-center gap-3 border border-white/15 px-8 py-4 text-[10px] tracking-[0.3em] text-white/60 transition hover:border-white/40 hover:text-white"
            >
              SYSTEM BRIEF
            </Link>
          </div>

          <div className="lv-mono mt-20 flex items-center gap-2 text-[9px] tracking-[0.3em] text-white/25">
            <span className="lv-blink">▌</span>
            <span>AWAITING_OPERATOR_INPUT</span>
          </div>
        </section>

        {/* TERMINAL PREVIEW — operator console, not dashboard */}
        <section className="mx-auto max-w-5xl px-4 pb-32 sm:px-8">
          <div className="lv-mono mb-6 flex items-center justify-between text-[10px] tracking-[0.3em] text-white/30">
            <span>{"// OPERATOR_CONSOLE"}</span>
            <span>VIEW: SAMPLE</span>
          </div>

          <div className="border border-white/10 bg-black/60 backdrop-blur-sm">
            {/* Terminal header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <div className="lv-mono flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/40">
                <span className="h-2 w-2 rounded-full bg-[#7B2FBE]" />
                IV_CONSOLE_v0.1
              </div>
              <div className="lv-mono text-[9px] tracking-[0.25em] text-white/25">
                SESSION: 0x7F2A
              </div>
            </div>

            {/* Console body */}
            <div className="grid divide-y divide-white/[0.05] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="divide-y divide-white/[0.05]">
                <ConsoleRow label="OPERATOR_ID" value="0xA3…F09B" />
                <ConsoleRow label="CLEARANCE" value="STARTER" accent />
                <ConsoleRow label="MODULES_VERIFIED" value="04 / 06" />
                <ConsoleRow label="CHECKPOINT" value="ACTIVE" accent />
              </div>
              <div className="divide-y divide-white/[0.05]">
                <ConsoleRow label="VAULT_ACCESS" value="PARTIAL" />
                <ConsoleRow label="ALLOCATION_TIER" value="100,000 IV-SOL" accent />
                <ConsoleRow label="DISTRIBUTION" value="PENDING_COMPLETION" />
                <ConsoleRow label="SYSTEM_STATUS" value="LOCKED" warn />
              </div>
            </div>

            {/* Console footer */}
            <div className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <div className="lv-mono flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/35">
                <span className="lv-blink text-[#AAFF00]">▌</span>
                <span>EXEC: complete_module --id=05</span>
              </div>
            </div>
          </div>
        </section>

        {/* ACCESS TIERS — classified clearance, not pricing cards */}
        <section className="border-y border-white/[0.06] bg-black/40">
          <div className="mx-auto max-w-6xl px-4 py-28 sm:px-8">
            <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="lv-mono mb-4 text-[10px] tracking-[0.35em] text-white/40">
                  {"// ACCESS_TIERS"}
                </p>
                <h2 className="lv-display text-5xl text-white sm:text-7xl">
                  CLEARANCE PATHS
                </h2>
              </div>
              <p className="lv-mono max-w-xs text-[10px] leading-relaxed tracking-[0.18em] text-white/40">
                EACH TIER GRANTS COURSEWORK ACCESS AND A FIXED IV-SOL ALLOCATION UPON VERIFIED COMPLETION.
              </p>
            </div>

            <div className="border border-white/10">
              {TIERS.map((tier, i) => (
                <Link
                  key={tier.code}
                  href="/learn/pay"
                  className={`lv-tier group grid grid-cols-12 items-center gap-4 px-5 py-6 transition hover:bg-white/[0.03] sm:px-8 sm:py-8 ${
                    i !== TIERS.length - 1 ? "border-b border-white/[0.06]" : ""
                  }`}
                >
                  <div className="lv-mono col-span-2 text-[10px] tracking-[0.25em] text-white/30 sm:col-span-1">
                    {tier.code}
                  </div>
                  <div className="col-span-10 sm:col-span-3">
                    <div className="lv-display text-2xl text-white sm:text-3xl">{tier.name}</div>
                    <div className="lv-mono mt-1 text-[9px] tracking-[0.25em] text-[#7B2FBE]">
                      {tier.clearance}
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <div className="lv-mono text-[9px] tracking-[0.25em] text-white/30">COURSEWORK</div>
                    <div className="lv-display mt-1 text-2xl text-white sm:text-3xl">{tier.price}</div>
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <div className="lv-mono text-[9px] tracking-[0.25em] text-white/30">ALLOCATION</div>
                    <div className="lv-display mt-1 text-2xl text-[#AAFF00] sm:text-3xl">
                      {tier.allocation}
                      <span className="lv-mono ml-2 text-[10px] tracking-[0.2em] text-white/40">IV-SOL</span>
                    </div>
                  </div>
                  <div className="lv-tier-arrow lv-mono col-span-12 mt-2 flex items-center justify-end gap-2 text-[10px] tracking-[0.3em] text-white/30 transition group-hover:text-[#AAFF00] sm:col-span-1 sm:mt-0">
                    <span>REQUEST</span>
                    <span>▸</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PROTOCOL — minimal, terminal style */}
        <section className="mx-auto max-w-5xl px-4 py-28 sm:px-8">
          <p className="lv-mono mb-4 text-[10px] tracking-[0.35em] text-white/40">{"// PROTOCOL"}</p>
          <h2 className="lv-display mb-16 text-5xl text-white sm:text-7xl">
            SIX MODULES.
            <br />
            <span className="text-white/30">ONE PATH.</span>
          </h2>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
            {[
              { n: "01", t: "ACQUIRE", d: "Select clearance tier. Initialize operator profile." },
              { n: "02", t: "VERIFY", d: "Complete coursework. Pass module checkpoints." },
              { n: "03", t: "UNLOCK", d: "IV-SOL allocation distributed after verified completion." },
            ].map((step) => (
              <div key={step.n} className="bg-[#050505] p-8 sm:p-10">
                <div className="lv-mono text-[10px] tracking-[0.3em] text-[#7B2FBE]">STEP_{step.n}</div>
                <div className="lv-display mt-4 text-3xl text-white">{step.t}</div>
                <div className="lv-mono mt-4 text-[10px] leading-relaxed tracking-[0.15em] text-white/45">
                  {step.d}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA — restrained, severe */}
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-4xl px-4 py-32 text-center sm:px-8">
            <p className="lv-mono mb-8 text-[10px] tracking-[0.35em] text-white/40">
              {"// TERMINAL_AWAITING"}
            </p>
            <h2 className="lv-display text-balance text-5xl leading-[0.95] text-white sm:text-7xl">
              THE VAULT OPENS
              <br />
              <span className="text-[#AAFF00]">THROUGH COMPLETION.</span>
            </h2>
            <div className="mt-14">
              <Link
                href="/learn/pay"
                className="lv-display inline-flex items-center gap-4 border border-[#AAFF00] bg-[#AAFF00] px-12 py-5 text-base text-black transition hover:bg-[#BFFF33]"
              >
                <span>BEGIN VERIFICATION</span>
                <span className="lv-mono text-[10px] tracking-[0.2em]">▸</span>
              </Link>
            </div>
            <p className="lv-mono mt-10 text-[9px] tracking-[0.3em] text-white/25">
              NO INVESTMENT. NO RETURNS. COURSEWORK ONLY.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

function ConsoleRow({
  label,
  value,
  accent,
  warn,
}: {
  label: string
  value: string
  accent?: boolean
  warn?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
      <span className="lv-mono text-[10px] tracking-[0.25em] text-white/35">{label}</span>
      <span
        className={`lv-mono text-[11px] tracking-[0.2em] ${
          warn ? "text-[#7B2FBE]" : accent ? "text-[#AAFF00]" : "text-white/85"
        }`}
      >
        {value}
      </span>
    </div>
  )
}

