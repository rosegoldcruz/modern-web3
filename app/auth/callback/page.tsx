'use client'

import Link from 'next/link'
import { ConnectBox } from '@phantom/react-sdk'

export default function PhantomAuthCallbackPage() {
  const enabled = Boolean(process.env.NEXT_PUBLIC_PHANTOM_APP_ID)

  return (
    <main className="min-h-screen px-6 py-20 text-white">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#c7a462]">
          Iron Vault × Phantom
        </p>
        <h1 className="font-[var(--font-inter-tight)] text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Secure wallet connection
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">
          Phantom handles wallet authorization. Iron Vault never needs your seed phrase or private key.
        </p>

        <div className="mt-10 w-full">
          {enabled ? (
            <ConnectBox maxWidth="560px" appName="Iron Vault" />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-left">
              <p className="text-sm leading-7 text-white/60">
                Phantom social login becomes active after the production Phantom Portal App ID and verified callback URL are configured. The direct Phantom extension connection remains available in the docs now.
              </p>
              <Link className="mt-5 inline-flex text-sm font-semibold text-[#c7a462] hover:text-[#e6ca92]" href="/docs#phantom-connect">
                Return to Phantom documentation →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
