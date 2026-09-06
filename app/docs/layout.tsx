import type { ReactNode } from 'react'
import { PhantomProviders } from '@/components/wallet/phantom-providers'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <PhantomProviders>{children}</PhantomProviders>
}
