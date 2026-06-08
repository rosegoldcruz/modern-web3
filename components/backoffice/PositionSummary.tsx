"use client"

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useMemo, useState } from 'react'
import { fetchBackofficeJson, type BackofficePositionResponse } from '@/lib/backoffice-client'
import type { UserPosition } from '@/types/backoffice'

type PositionFlag = 'YES' | 'NO' | 'DISCONTINUED'

function StatusBadge({ value }: { value: PositionFlag }) {
  const classes =
    value === 'YES'
      ? 'border-lime-300/40 bg-lime-300/10 text-lime-200'
      : value === 'DISCONTINUED'
        ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
        : 'border-zinc-700 bg-zinc-900 text-zinc-300'

  return <span className={`rounded-md border px-2 py-1 text-xs font-medium ${classes}`}>{value}</span>
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function PositionSummary() {
  const { ready, authenticated, getAccessToken } = usePrivy()
  const [position, setPosition] = useState<UserPosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready || !authenticated) {
      return
    }

    const loadPosition = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = await getAccessToken()
        if (!token) {
          throw new Error('Unauthorized: unable to retrieve access token')
        }

        const payload = await fetchBackofficeJson<BackofficePositionResponse>('/api/backoffice/positions', token)
        setPosition(payload.position)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load position data'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void loadPosition()
  }, [authenticated, getAccessToken, ready])

  const numericCards = useMemo(
    () => [
      { label: 'Investment total', value: position?.investment_total ?? 0 },
      { label: 'Advance amount', value: position?.advance_amount ?? 0 },
      { label: 'Royalty spent', value: position?.royalty_spent ?? 0 },
      { label: 'Token balance', value: position?.token_balance ?? 0 },
      { label: 'Dividends total', value: position?.dividends_total ?? 0 },
    ],
    [position],
  )

  if (loading) {
    return null
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-zinc-950/60 p-6">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <p className="text-sm text-zinc-400">No position data found.</p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Position Matrix</h1>
        <p className="text-sm text-zinc-400">This section reflects your current row from iv_user_positions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {numericCards.map((item) => (
          <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">{item.label}</p>
            <p className="text-2xl font-semibold text-zinc-100">{formatNumber(item.value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Status Flags</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="mb-2 text-sm text-zinc-300">2% Royalty</p>
            <StatusBadge value={position.royalty_2_percent_status} />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="mb-2 text-sm text-zinc-300">1% Royalty</p>
            <StatusBadge value={position.royalty_1_percent_status} />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="mb-2 text-sm text-zinc-300">Ownership Position</p>
            <StatusBadge value={position.ownership_position_status} />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="mb-2 text-sm text-zinc-300">Equity Status</p>
            <StatusBadge value={position.equity_status} />
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="mb-2 text-sm text-zinc-300">Winning Portfolio</p>
            <StatusBadge value={position.winning_portfolio_status} />
          </div>
        </div>
      </div>
    </section>
  )
}
