'use client'

import { useMemo, useState } from 'react'
import { AddressType, BrowserSDK } from '@phantom/browser-sdk'
import { useAccounts, useDisconnect, useModal, usePhantom } from '@phantom/react-sdk'

function shortAddress(value: string) {
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}

function PortalConnectButton({ className = '' }: { className?: string }) {
  const { open } = useModal()
  const { isConnected, isLoading } = usePhantom()
  const accounts = useAccounts()
  const { disconnect, isDisconnecting } = useDisconnect()
  const address = accounts.find((account) => account.addressType === AddressType.solana)?.address

  if (isConnected && address) {
    return (
      <button
        type="button"
        className={`phantom-wallet-button phantom-wallet-connected ${className}`}
        onClick={() => disconnect()}
        disabled={isDisconnecting}
        title={address}
      >
        <span className="phantom-wallet-status" aria-hidden="true" />
        {isDisconnecting ? 'Disconnecting…' : shortAddress(address)}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`phantom-wallet-button ${className}`}
      onClick={open}
      disabled={isLoading}
    >
      <span className="phantom-wallet-mark" aria-hidden="true">P</span>
      {isLoading ? 'Loading wallet…' : 'Connect Phantom'}
    </button>
  )
}

function InjectedConnectButton({ className = '' }: { className?: string }) {
  const [address, setAddress] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sdk = useMemo(
    () => new BrowserSDK({ providers: ['injected'], addressTypes: [AddressType.solana] }),
    [],
  )

  async function connect() {
    setBusy(true)
    setError(null)
    try {
      const result = await sdk.connect({ provider: 'injected' })
      const solana = result.addresses.find((item) => item.addressType === AddressType.solana)
      setAddress(solana?.address ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Phantom connection failed')
    } finally {
      setBusy(false)
    }
  }

  async function disconnect() {
    try {
      await sdk.disconnect()
    } finally {
      setAddress(null)
      setError(null)
    }
  }

  return (
    <span className="phantom-wallet-shell">
      {address ? (
        <button
          type="button"
          className={`phantom-wallet-button phantom-wallet-connected ${className}`}
          onClick={disconnect}
          title={address}
        >
          <span className="phantom-wallet-status" aria-hidden="true" />
          {shortAddress(address)}
        </button>
      ) : (
        <button
          type="button"
          className={`phantom-wallet-button ${className}`}
          onClick={connect}
          disabled={busy}
          title="Connect the Phantom browser extension"
        >
          <span className="phantom-wallet-mark" aria-hidden="true">P</span>
          {busy ? 'Connecting…' : 'Connect Phantom'}
        </button>
      )}
      {error ? <span className="phantom-wallet-error" role="status">{error}</span> : null}
    </span>
  )
}

export function PhantomWalletButton({ className = '' }: { className?: string }) {
  return process.env.NEXT_PUBLIC_PHANTOM_APP_ID
    ? <PortalConnectButton className={className} />
    : <InjectedConnectButton className={className} />
}
