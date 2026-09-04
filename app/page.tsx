import { SiteHeader } from "@/components/site-header"
import { IronVaultHome } from "@/components/iron-vault-home"
import Script from "next/script"

// Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://ironvaulttoken.com/",
    name: "Iron Vault | Vaulted Academy",
    description:
      "Iron Vault is an education-first digital ecosystem built around Vaulted Academy, IV-SOL, and practical participation in the digital economy.",
    url: "https://ironvaulttoken.com/",
    mainEntity: {
      "@type": "Organization",
      name: "Iron Vault",
      url: "https://ironvaulttoken.com",
      sameAs: [],
    },
  }

  return (
    <>
      <SiteHeader />
      <IronVaultHome />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
