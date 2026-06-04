import type { ReactNode } from 'react'
import { PrivyAuthProvider } from '@/components/privy-auth-provider'
import { BackofficeProvider } from '@/components/backoffice/BackofficeProvider'
import { BackofficeLayout } from '@/components/backoffice/BackofficeLayout'

export const dynamic = 'force-dynamic'

export default function LearnVaultLayout({ children }: { children: ReactNode }) {
  return (
    <PrivyAuthProvider>
      <BackofficeProvider>
        <BackofficeLayout>{children}</BackofficeLayout>
      </BackofficeProvider>
    </PrivyAuthProvider>
  )
}
