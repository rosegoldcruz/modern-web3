"use client"

import Link from 'next/link'
import { ArrowRight, LifeBuoy, Network, Trophy, UserCircle2 } from 'lucide-react'
import { useBackofficeAuth } from '@/hooks/useBackofficeAuth'

const overviewCards = [
  {
    href: '/learn/backoffice/network',
    title: 'Network & Referrals',
    description: 'Capture leads, share your referral link, and track referral activity.',
    icon: Network,
  },
  {
    href: '/learn/backoffice/positions',
    title: 'Position Matrix',
    description: 'Review investment and royalty status fields from your current position row.',
    icon: Trophy,
  },
  {
    href: '/learn/backoffice/status',
    title: 'Status Desk',
    description: 'Submit support tickets and monitor responses from the operations team.',
    icon: LifeBuoy,
  },
  {
    href: '/learn/backoffice/account',
    title: 'Account',
    description: 'See your tier, role, referral code, wallet address, and profile status.',
    icon: UserCircle2,
  },
]

export function BackofficeOverview() {
  const { profile } = useBackofficeAuth()

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-lime-300 mb-2">Overview</p>
        <h1 className="text-3xl font-semibold text-zinc-100 mb-2">Welcome to your Iron Vault Backoffice</h1>
        <p className="text-zinc-400 mb-6 max-w-2xl">
          Your profile is synced directly from your paid account. Use the sections below to manage referrals, positions, and support status.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Email</p>
            <p className="text-sm text-zinc-100 break-all">{profile?.email ?? 'No email on file'}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Role</p>
            <p className="text-sm text-zinc-100">{profile?.role ?? 'MEMBER'}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Tier</p>
            <p className="text-sm text-zinc-100">{profile?.current_tier ?? 'MEMBER'}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Vault XP</p>
            <p className="text-sm text-zinc-100">{profile?.vault_xp?.toLocaleString() ?? '0'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {overviewCards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 transition hover:border-lime-300/30 hover:bg-zinc-900/70"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-lime-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">{card.title}</h2>
              <p className="text-sm text-zinc-400 mb-4">{card.description}</p>
              <span className="inline-flex items-center gap-2 text-sm text-lime-200">
                Open section
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          )
        })}
      </div>

      <div>
        <Link
          href="/learn/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500 hover:text-zinc-100"
        >
          Return to Academy
        </Link>
      </div>
    </section>
  )
}
