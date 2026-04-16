import { SiteHeader } from "@/components/site-header"
import { BottomNav } from "@/components/bottom-nav"
import { Hero } from "@/components/hero"
import { IronVaultDifference } from "@/components/iron-vault-difference"
import { IronVaultCTA } from "@/components/iron-vault-cta"
import OrbitingImages from "@/components/orbiting-images"
import { AppverseFooter } from "@/components/appverse-footer"
import { IronVaultShowcase } from "@/components/iron-vault-showcase"
import Script from "next/script"

// Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
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
      <main className="min-h-[100dvh] pb-[calc(env(safe-area-inset-bottom)+88px)] text-white lg:pb-0">
        <SiteHeader />
        <Hero />
        <IronVaultShowcase />
        <IronVaultDifference />
        <section className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Flow of Real Estate Into Decentralized Infrastructure
          </h2>
          <p className="mb-6 text-lg font-medium text-white/80 sm:text-xl">
            How Physical Assets Enter the Blockchain Economy — And Why It Matters
          </p>
          <div className="mb-14 space-y-4 text-base leading-relaxed text-white/65 sm:text-lg sm:leading-8">
            <p>
              Real estate is the world&apos;s most powerful asset class — but it&apos;s been locked behind slow transactions, opaque ownership, and high barriers to entry.
            </p>
            <p>
              Decentralized infrastructure breaks that open.
            </p>
            <p>
              Blockchain enables real ownership, real yield, and real access — without geographic limits, institutional gatekeepers, or outdated financial rails.
            </p>
            <p>
              Physical assets are entering the on-chain economy. How value is created, shared, and scaled will never look the same.
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
        <IronVaultCTA />
        <AppverseFooter />
      </main>
      <BottomNav />

      {/* JSON-LD structured data */}
      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />

      {/* GoHighLevel form embed script */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </>
  )
}
