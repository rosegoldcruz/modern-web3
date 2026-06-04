import { PositionSummary } from '@/components/backoffice/PositionSummary'
import { VIPGate } from '@/components/gates/VIPGate'

export const dynamic = 'force-dynamic'

export default function BackofficePositionsPage() {
  return (
    <VIPGate>
      <PositionSummary />
    </VIPGate>
  )
}
