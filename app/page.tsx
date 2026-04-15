import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { PhoneCards } from "@/components/phone-cards"
import { Features } from "@/components/features"
import OrbitingImages from "@/components/orbiting-images"
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
        <PhoneCards />
        <Features />
        <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Flow of Real Estate Into Decentralized Infrastructure
          </h2>
          <OrbitingImages
            images={[
              "/commercial%203.png",
              "/commercial%204.png",
              "/cw.png",
              "/office%201.png",
              "/office%205.png",
              "/office%207.png",
              "/solana.png",
              "/the%20coin.png",
              "/Iron%20Vault%20Shield.png"
            ]}
            shape="ellipse"
            direction="reverse"
            radiusX={600}
            radiusY={110}
            radius={110}
            rotation={-13}
            duration={25}
            itemSize={108}
            fill
            showPath
            paused={false}
            responsive
            className="px-4 md:px-6"
          />
        </section>
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
