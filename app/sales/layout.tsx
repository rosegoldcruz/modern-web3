import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iron Vault Sales | Get Started Today",
  description:
    "Ready to take the next step with Iron Vault? Fill out the form and our team will reach out to get you started.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
