import Link from "next/link"

import IronVaultAcademy from "@/iron-vault-academy-v2"

export default function LearnPage() {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0F0F0F] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#AAFF00]">Privy Setup Required</p>
          <h1 className="mb-4 text-4xl font-semibold">Academy auth is not configured</h1>
          <p className="mb-6 text-sm text-white/70">
            Add `NEXT_PUBLIC_PRIVY_APP_ID` to your deployment environment to enable login, embedded wallets, and access to the academy.
          </p>
          <Link href="/" className="inline-flex rounded-full bg-[#AAFF00] px-5 py-3 font-semibold text-black transition hover:bg-[#98e600]">
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <IronVaultAcademy />
  )
}
