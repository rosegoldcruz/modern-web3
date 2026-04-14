import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LogoMarquee } from "@/components/logo-marquee"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://theskitbit.com/#pricing",
    name: "The 3-Step Funnel",
    description: "Iron Vault 3-step ecosystem funnel: Presale Awareness, Tokenomics, and Real Estate Integration",
    url: "https://theskitbit.com/#pricing",
    mainEntity: {
      "@type": "ItemList",
      name: "Iron Vault Ecosystem Phases",
      description: "Education-first approach to tokenized real estate",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Presale Awareness",
          description: "Early supporter onboarding and community-first access",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tokenomics",
          description: "Supply structure, distribution logic, and utility pathways",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Real Estate Integration",
          description: "Real estate-backed frameworks and asset-linked token structures",
        },
      ],
    },
  }

  // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://theskitbit.com/",
    name: "Iron Vault | Real Estate. Tokenized. Understood.",
    description:
      "Iron Vault is an education-first entry point into understanding how real-world assets — specifically real estate — can be structured, represented, and integrated into decentralized financial systems.",
    url: "https://theskitbit.com/",
    mainEntity: {
      "@type": "Organization",
      name: "Iron Vault",
      url: "https://theskitbit.com",
      sameAs: [],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://theskitbit.com/#pricing",
        name: "How It Works",
        url: "https://theskitbit.com/#pricing",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <Features />
        <LogoMarquee />
        <Pricing />
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

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
