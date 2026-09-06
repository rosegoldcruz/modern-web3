import type { ReactNode } from 'react'
import { PhantomProviders } from '@/components/wallet/phantom-providers'

export default function PhantomCallbackLayout({ children }: { children: ReactNode }) {
  return <PhantomProviders>{children}</PhantomProviders>
}
