import { PrivyAuthProvider } from '@/components/privy-auth-provider'

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <PrivyAuthProvider>{children}</PrivyAuthProvider>
}
