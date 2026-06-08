"use client"

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useBackofficeAuth } from '@/hooks/useBackofficeAuth'

type VIPGateProps = {
  children: ReactNode
}

export function VIPGate({ children }: VIPGateProps) {
  const { loading, isVip, isAdmin } = useBackofficeAuth()

  if (loading) {
    return null
  }

  if (isVip || isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-[420px] grid place-items-center rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-semibold text-zinc-100 mb-3">Become VIP to access</h2>
        <p className="text-sm text-zinc-400 mb-6">Upgrade your Iron Vault tier to unlock Position Matrix access.</p>
        <Link
          href="/learn/pay"
          className="inline-flex items-center justify-center rounded-md bg-lime-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-lime-200"
        >
          Upgrade on Payment Page
        </Link>
      </div>
    </div>
  )
}
