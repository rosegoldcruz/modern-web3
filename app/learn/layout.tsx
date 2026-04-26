import { PrivyAuthProvider } from '@/components/privy-auth-provider'
import type { ReactNode } from 'react'

export default function LearnLayout({ children }: { children: ReactNode }) {
  return <PrivyAuthProvider>{children}</PrivyAuthProvider>
}
