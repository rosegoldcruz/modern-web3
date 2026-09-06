import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { IvNav } from "@/app/iv/IvNav";
import styles from "./about.module.css";

const TOKEN_ADDRESS = "DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV";

const companyDetails = [
  { label: "Legal entity", value: "IVT MEDIA GROUP" },
  { label: "Entity ID", value: "2026-001990799", mono: true },
  { label: "Registered", value: "Wyoming, USA" },
] as const;

const ecosystem = [
  {
    number: "01",
    title: "Vaulted Academy",
    body: "Structured education in digital finance, risk, and wealth systems—designed to build knowledge, not hype.",
  },
  {
    number: "02",
    title: "IV-SOL",
    body: "The native digital token operating within the Iron Vault ecosystem.",
  },
  {
    number: "03",
    title: "Community",
    body: "A network of capable learners, contributors, and builders advancing the future of digital economy participation.",
  },
] as const;

const missionPillars = [
  {
    title: "Education",
    body: "Vaulted Academy provides structured learning across blockchain, artificial intelligence, digital finance, software development, cybersecurity, compliance, and emerging technologies.",
  },
  {
    title: "Technology",
    body: "Iron Vault is developing education, technology, and community infrastructure for long-term participation in the digital economy.",
  },
  {
    title: "Community",
    body: "Everyone who enters the Iron Vault ecosystem should feel informed, supported, and part of something being built for the long term.",
  },
] as const;

export const metadata: Metadata = {
  title: "About | Iron Vault",
  description:
    "Learn why Iron Vault puts education first and how IVT Media Group is building for capable participation in the digital economy.",
};

export default function AboutPage() {
  return (
    <div className="iv-root">
      <IvNav />

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={`iv-shell ${styles.heroInner}`}>
            <h1 id="about-title">Built for capability.</h1>
            <p>
              IVT MEDIA GROUP was founded on a simple observation: the financial systems that
              build real wealth are deliberately complicated, and the people who most need access
              to them are the least likely to get a straight explanation. Iron Vault exists to
              fix that.
            </p>
          </div>
        </section>

        <section className={styles.legalSection} aria-labelledby="company-information">
          <div className="iv-shell">
            <div className={styles.sectionHeading}>
              <h2 id="company-information">Company information</h2>
              <p>Public facts, plainly stated and independently verifiable.</p>
            </div>

            <div className={styles.informationGrid}>
              {companyDetails.map((detail) => (
                <div className={styles.informationRow} key={detail.label}>
                  <span>{detail.label}</span>
                  <strong className={"mono" in detail && detail.mono ? styles.mono : undefined}>
                    {detail.value}
                  </strong>
                </div>
              ))}
              <div className={styles.informationRow}>
                <span>Status</span>
                <strong className={styles.status}>
                  <i aria-hidden="true" /> Active — In Good Standing
                </strong>
              </div>
              <div className={styles.informationRow}>
                <span>Token contract</span>
                <strong className={styles.contract}>
                  <code>{TOKEN_ADDRESS}</code>
                  <span className={styles.copyControl}>
                    <CopyButton text={TOKEN_ADDRESS} label="Copy contract address" />
                  </span>
                </strong>
              </div>
              <div className={styles.informationRow}>
                <span>On-chain verification</span>
                <a
                  href={`https://solscan.io/token/${TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Solscan <ExternalLink aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.thesis} aria-labelledby="why-heading">
          <div className={`iv-shell ${styles.split}`}>
            <h2 id="why-heading">Education before speculation.</h2>
            <div className={styles.prose}>
              <p>
                The Iron Vault Token is not a get-rich-quick scheme. It is the utility layer of a
                financial education ecosystem being built to last.
              </p>
              <p>
                We built the course before we built the presale. That order was intentional.
                Before anyone participates in the token, they complete a curriculum that teaches
                them exactly what they&apos;re getting into.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.ecosystemSection} aria-labelledby="ecosystem-heading">
          <div className="iv-shell">
            <div className={styles.sectionHeading}>
              <h2 id="ecosystem-heading">One connected ecosystem.</h2>
              <p>
                Iron Vault connects Vaulted Academy, IV-SOL, and a community built for capable
                participation in the digital economy.
              </p>
            </div>

            <div className={styles.ecosystemRows}>
              {ecosystem.map((item) => (
                <article className={styles.ecosystemRow} key={item.number}>
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.missionSection} aria-labelledby="mission-heading">
          <div className="iv-shell">
            <div className={styles.missionLead}>
              <h2 id="mission-heading">Built for the long term.</h2>
              <p>
                We are not optimizing for a token pump. We are building infrastructure that
                outlasts the cycle—grounded in education, technology, and community.
              </p>
            </div>

            <div className={styles.missionGrid}>
              {missionPillars.map((pillar, index) => (
                <article key={pillar.title}>
                  <span>0{index + 1}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="cta-heading">
          <div className={`iv-shell ${styles.ctaInner}`}>
            <h2 id="cta-heading">Begin with orientation.</h2>
            <p>Build practical knowledge before you decide how to participate.</p>
            <div className={styles.actions}>
              <Link className="iv-btn" href="/academy">
                Explore the Academy <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="iv-btn iv-btn-ghost" href="/sign-in">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="iv-footer">
        <div className="iv-shell">
          <div className="iv-footer-grid">
            <Link className="iv-wordmark" href="/" aria-label="Iron Vault home">
              Iron Vault <em>Vaulted Academy</em>
            </Link>
            <nav aria-label="Footer navigation">
              <Link href="/about">About</Link>
              <Link href="/academy">Academy</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
          </div>
          <div className="iv-footer-sig">
            <span>© 2025 — IVT MEDIA GROUP</span>
            <span className="iv-serif">Education before speculation.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
