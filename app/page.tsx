import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import OrbitingImages from "@/components/orbiting-images"
import { AppverseFooter } from "@/components/appverse-footer"
import { IronVaultShowcase } from "@/components/iron-vault-showcase"
import Script from "next/script"

// âœ… Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://theskitbit.com/",
    name: "Iron Vault | Real Estate. Tokenized. Understood.",
    description:
      "Iron Vault is an education-first entry point into understanding how real-world assets â€” specifically real estate â€” can be structured, represented, and integrated into decentralized financial systems.",
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
          <h2 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Flow of Real Estate Into Decentralized Infrastructure
          </h2>
          <p className="mx-auto mb-4 max-w-3xl text-center text-lg font-medium text-white/80 sm:text-xl">
            How Physical Assets Enter the Blockchain Economy — And Why It Matters
          </p>
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center text-base leading-relaxed text-white/65 sm:text-lg sm:leading-8">
            <p>
              Real estate has always been the world&apos;s most powerful asset class — stable, tangible, and foundational to every economy. But until now, it has lived inside a closed system: slow transactions, opaque ownership structures, limited liquidity, and high barriers to entry.
            </p>
            <p>
              Decentralized infrastructure changes that.
            </p>
            <p>
              For the first time, real estate can move into a blockchain-powered environment where ownership, yield, and access are no longer restricted by geography, institutions, or outdated financial rails.
            </p>
            <p>
              This is the flow of real estate into decentralized infrastructure — and it&apos;s reshaping how value is created, shared, and scaled.
            </p>
          </div>
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
