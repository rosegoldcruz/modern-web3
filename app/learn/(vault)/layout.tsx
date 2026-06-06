import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LearnVaultLayout({ children }: { children: ReactNode }) {
  void children
  redirect('https://member.ironvaulttoken.com/dashboard')
}
