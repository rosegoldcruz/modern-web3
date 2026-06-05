import { BackofficeProvider } from '@/components/backoffice/BackofficeProvider'
import { BackofficeLayout } from '@/components/backoffice/BackofficeLayout'
import { LandingDashboardLanding } from '@/components/backoffice/LandingDashboardLanding'

export const dynamic = 'force-dynamic'

export default function LearnDashboardPage() {
  return (
    <BackofficeProvider>
      <BackofficeLayout>
        <LandingDashboardLanding />
      </BackofficeLayout>
    </BackofficeProvider>
  )
}
