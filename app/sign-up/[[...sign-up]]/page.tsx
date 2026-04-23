"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"

export default function SignUpPage() {
  const { authenticated, login, ready } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/learn")
    }
  }, [authenticated, ready, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F0F0F] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#AAFF00]">New Member</p>
        <h1 className="mb-4 text-4xl font-semibold">Create your access</h1>
        <p className="mb-8 text-sm text-white/70">
          Sign up with Privy using email or SMS. Your embedded wallet will be created automatically when you log in.
        </p>
        <button
          className="w-full rounded-full bg-[#AAFF00] px-5 py-3 font-semibold text-black transition hover:bg-[#98e600] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={login}
          disabled={!ready}
        >
          {authenticated ? "Already signed in" : "Continue with Privy"}
        </button>
        <Link href="/" className="mt-4 block text-center text-sm text-white/60 transition hover:text-white">
          Back to home
        </Link>
      </div>
    </main>
  )
}
