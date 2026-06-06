import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LearnDashboardPage() {
  redirect('https://member.ironvaulttoken.com/dashboard')
}
