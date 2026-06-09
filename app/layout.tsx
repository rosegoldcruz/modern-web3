import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Iron Vault | Real Estate. Tokenized. Understood.",
  description:
    "Iron Vault is an education-first entry point into understanding how real-world assets \u2014 specifically real estate \u2014 can be structured, represented, and integrated into decentralized financial systems.",
  generator: "Iron Vault Token",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Font Preload */}
        <link
          rel="preload"
          href="/fonts/Inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />

        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6LV22900R');
          `}
        </Script>
        {/* GoHighLevel External Tracking */}
        <Script
          src="https://link.msgsndr.com/js/external-tracking.js"
          data-tracking-id="tk_1af5c4023eac4b749a18eff1192fe942"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(139,92,246,0.16),transparent_48%),linear-gradient(180deg,#050507_0%,#0a0a0d_100%)]" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
