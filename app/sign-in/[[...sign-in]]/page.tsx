import Link from "next/link"
import { PrivyAuthProvider } from "@/components/privy-auth-provider"
import { PrivySignInCard } from "@/components/privy-sign-in-card"

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F0F0F] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#AAFF00]">Member Access</p>
          <h1 className="mb-4 text-4xl font-semibold">Sign in is not configured</h1>
          <p className="mb-8 text-sm text-white/70">
            Set `NEXT_PUBLIC_PRIVY_APP_ID` in your deployment environment before using Privy login.
          </p>
          <Link href="/" className="inline-flex rounded-full bg-[#AAFF00] px-5 py-3 font-semibold text-black transition hover:bg-[#98e600]">
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <PrivyAuthProvider>
      <PrivySignInCard />
    </PrivyAuthProvider>
  )
}
