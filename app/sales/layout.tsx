import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IVT Internal Sales Handoff",
  description: "Internal sales submission form for IVT Media Group.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function SalesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
