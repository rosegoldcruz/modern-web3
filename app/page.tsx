import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import OrbitingImages from "@/components/orbiting-images"
import { AppverseFooter } from "@/components/appverse-footer"
import { IronVaultShowcase } from "@/components/iron-vault-showcase"
import Script from "next/script"

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
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
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <IronVaultShowcase />
        <Features />
        <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Flow of Real Estate Into Decentralized Infrastructure
          </h2>
          <OrbitingImages
            images={[
              "/images/commercial%203.png",
              "/images/commercial%204.png",
              "/logos/cw.png",
              "/images/office%201.png",
              "/images/office%205.png",
              "/images/office%207.png",
              "/images/solana.png",
              "/logos/the%20coin.png",
              "/images/Iron%20Vault%20Shield.png"
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
        <AppverseFooter />
      </main>

      {/* JSON-LD structured data */}
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
