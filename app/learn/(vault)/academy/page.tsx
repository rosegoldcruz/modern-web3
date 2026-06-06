import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function AcademyPage() {
  redirect('https://member.ironvaulttoken.com/dashboard')
}
