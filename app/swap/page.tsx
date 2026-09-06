import Link from 'next/link'
import type { Metadata } from 'next'
import { JupiterSwapWidget } from '@/components/wallet/jupiter-swap-widget'

export const metadata: Metadata = {
  title: 'Swap IV-SOL | Iron Vault',
  description: 'Swap supported Solana assets into the verified IV-SOL token through Jupiter.',
}

export default function SwapPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c7a462]">Iron Vault</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Swap IV-SOL</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/docs#token-overview" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/65 hover:text-white">
              Token docs
            </Link>
            <Link href="/" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/65 hover:text-white">
              Iron Vault
            </Link>
          </div>
        </div>

        <div className="mb-5 rounded-xl border border-[#c7a462]/20 bg-[#c7a462]/[0.05] px-4 py-3 text-sm leading-6 text-white/65">
          The output is locked to the official IV-SOL mint. Jupiter supplies the swap interface, wallet connection, routing, slippage handling, MEV protection and transaction delivery. A route only exists when sufficient market liquidity is available.
        </div>

        <JupiterSwapWidget />
      </div>
    </main>
  )
}
