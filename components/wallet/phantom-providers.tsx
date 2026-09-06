'use client'

import type { ReactNode } from 'react'
import { AddressType } from '@phantom/browser-sdk'
import { PhantomProvider, darkTheme } from '@phantom/react-sdk'

export function PhantomProviders({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PHANTOM_APP_ID

  if (!appId) return <>{children}</>

  const redirectUrl = typeof window === 'undefined'
    ? undefined
    : `${window.location.origin}/auth/callback`

  return (
    <PhantomProvider
      config={{
        providers: ['google', 'apple', 'injected'],
        appId,
        addressTypes: [AddressType.solana],
        ...(redirectUrl ? { authOptions: { redirectUrl } } : {}),
      }}
      theme={darkTheme}
      appName="Iron Vault"
    >
      {children}
    </PhantomProvider>
  )
}
