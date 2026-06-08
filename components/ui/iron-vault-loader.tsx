"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const MIN_VISIBLE_MS = 1200
const EXIT_VISIBLE_MS = 1450

type IronVaultLoaderProps = {
  label?: string
}

export function IronVaultLoader({ label = "SECURE PORTAL ACTIVATING" }: IronVaultLoaderProps) {
  const [readout, setReadout] = useState("28%")

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setReadout("28%"), 200),
      window.setTimeout(() => setReadout("33%"), 400),
      window.setTimeout(() => setReadout("68%"), 650),
      window.setTimeout(() => setReadout("ACCESS GRANTED"), 900),
    ]

    return () => timers.forEach(window.clearTimeout)
  }, [])

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-[#050507]/96 px-6 text-zinc-100 backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(170,255,0,0.12),transparent_28%),radial-gradient(circle_at_50%_58%,rgba(123,47,190,0.16),transparent_34%),linear-gradient(180deg,rgba(5,5,7,0.86),rgba(5,5,7,0.98))]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(170,255,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(123,47,190,0.08)_1px,transparent_1px)] [background-size:76px_76px]" />

      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative h-32 w-32 sm:h-36 sm:w-36">
          <div className="absolute inset-0 rounded-full bg-[#aaff00]/10 blur-2xl iron-vault-loader-glow" />
          <img
            src="/logos/coin.png"
            alt=""
            className="absolute inset-0 h-full w-full object-contain opacity-30 grayscale brightness-[0.34] contrast-125"
            draggable={false}
          />
          <div className="absolute inset-0 overflow-hidden iron-vault-loader-fill">
            <img
              src="/logos/coin.png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_18px_rgba(170,255,0,0.35)]"
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#d8b45d]/30" />
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.32em] text-[#aaff00] sm:text-sm">
          {label}
        </p>
        <p className="mt-3 min-h-6 font-mono text-sm font-bold uppercase tracking-[0.28em] text-[#d8b45d] sm:text-base">
          {readout}
        </p>
      </div>

      <style>{`
        .iron-vault-loader-fill {
          clip-path: inset(100% 0 0 0);
          animation: ironVaultCoinFill 1000ms cubic-bezier(.22,1,.36,1) 120ms forwards;
        }

        .iron-vault-loader-glow {
          animation: ironVaultLoaderGlow 1600ms ease-in-out infinite;
        }

        @keyframes ironVaultCoinFill {
          0% { clip-path: inset(100% 0 0 0); }
          28% { clip-path: inset(72% 0 0 0); }
          33% { clip-path: inset(67% 0 0 0); }
          68% { clip-path: inset(32% 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes ironVaultLoaderGlow {
          0%, 100% { opacity: .42; transform: scale(.92); }
          50% { opacity: .78; transform: scale(1.04); }
        }
      `}</style>
    </div>
  )
}

export function IronVaultRouteLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), EXIT_VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [pathname])

  if (!visible) {
    return null
  }

  return (
    <div className="iron-vault-route-loader-exit">
      <IronVaultLoader />
      <style>{`
        .iron-vault-route-loader-exit {
          animation: ironVaultLoaderExit ${EXIT_VISIBLE_MS}ms ease forwards;
        }

        @keyframes ironVaultLoaderExit {
          0%, 82.75% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  )
}
