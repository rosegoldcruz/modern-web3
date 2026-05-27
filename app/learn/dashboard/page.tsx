import IronVaultAcademy from '@/iron-vault-academy-v2'
import { PrivyAuthProvider } from '@/components/privy-auth-provider'

export default function LearnDashboardPage() {
  return (
    <PrivyAuthProvider>
      <IronVaultAcademy />
    </PrivyAuthProvider>
  )
}