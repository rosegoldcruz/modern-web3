'use client'

import Script from 'next/script'
import { useCallback, useRef, useState } from 'react'

const IVSOL_MINT = 'DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV'
const SOL_MINT = 'So11111111111111111111111111111111111111112'

type JupiterPlugin = {
  init: (config: Record<string, unknown>) => void
}

declare global {
  interface Window {
    Jupiter?: JupiterPlugin
  }
}

export function JupiterSwapWidget({ compact = false }: { compact?: boolean }) {
  const initialized = useRef(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  const init = useCallback(() => {
    if (initialized.current || !window.Jupiter) return

    try {
      window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'iron-vault-jupiter-swap',
        formProps: {
          initialInputMint: SOL_MINT,
          initialOutputMint: IVSOL_MINT,
          fixedMint: IVSOL_MINT,
          fixedAmount: false,
          swapMode: 'ExactInOrOut',
        },
        onSuccess: ({ txid }: { txid?: string }) => {
          if (txid) console.info('[Iron Vault] Jupiter swap confirmed', txid)
        },
        onSwapError: ({ error }: { error?: unknown }) => {
          console.error('[Iron Vault] Jupiter swap failed', error)
        },
      })
      initialized.current = true
      setReady(true)
    } catch (error) {
      console.error('[Iron Vault] Jupiter plugin initialization failed', error)
      setFailed(true)
    }
  }, [])

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}
      style={{
        ['--jupiter-plugin-primary' as string]: '199, 164, 98',
        ['--jupiter-plugin-background' as string]: '6, 6, 8',
        ['--jupiter-plugin-primaryText' as string]: '244, 244, 245',
        ['--jupiter-plugin-warning' as string]: '245, 158, 11',
        ['--jupiter-plugin-interactive' as string]: '25, 25, 28',
        ['--jupiter-plugin-module' as string]: '13, 13, 16',
      }}
    >
      <Script
        src="https://plugin.jup.ag/plugin-v1.js"
        data-preload
        strategy="afterInteractive"
        onReady={init}
        onError={() => setFailed(true)}
      />

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c7a462]">Jupiter × Iron Vault</p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-white">Swap into IV-SOL</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-white/55">
            IV-SOL is locked as the output token so users cannot accidentally select an impersonator mint.
          </p>
        </div>
        <a
          href={`https://solscan.io/token/${IVSOL_MINT}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-[#c7a462]/50 hover:text-white"
        >
          Verify mint
        </a>
      </div>

      {!ready && !failed ? (
        <div className="mb-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm text-white/45">
          Loading Jupiter swap infrastructure…
        </div>
      ) : null}

      {failed ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 text-sm leading-6 text-amber-100/80">
          Jupiter could not load in this browser session. No transaction was created.
        </div>
      ) : (
        <div id="iron-vault-jupiter-swap" style={{ minHeight: compact ? 560 : 620 }} />
      )}

      <p className="mt-4 text-xs leading-5 text-white/40">
        Swaps are routed by Jupiter. Availability depends on active market liquidity and a valid Jupiter route. Iron Vault does not guarantee liquidity, execution price, or that a route will exist.
      </p>
    </section>
  )
}
