"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SceneGate } from "./SceneGate";
import { TOKEN_DETAILS, type TokenDetail } from "./data";
import styles from "./scrollHero.module.css";

const TokenomicsScene = dynamic(() => import("./TokenomicsScene"), { ssr: false });

function CopyIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="6.5" y="6.5" width="9" height="9" rx="2" />
      <path d="M13.5 6.5V5A2.5 2.5 0 0 0 11 2.5H5A2.5 2.5 0 0 0 2.5 5v6A2.5 2.5 0 0 0 5 13.5h1.5" />
    </svg>
  );
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button type="button" className={styles.copyButton} onClick={copy} aria-label={`Copy full ${label}`}>
      <CopyIcon />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function TokenValue({ item }: { item: TokenDetail }) {
  const hasAddresses = item.copyValue && item.secondaryCopyValue;

  if (hasAddresses) {
    return (
      <div className={styles.addressStack}>
        <div>
          <span>Mint address</span>
          <code>{item.value}</code>
          <CopyButton label="mint address" value={item.copyValue!} />
        </div>
        <div>
          <span>{item.secondaryLabel}</span>
          <code>{item.secondaryValue}</code>
          <CopyButton label="treasury address" value={item.secondaryCopyValue!} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.valueBlock}>
      <strong>{item.value}</strong>
      {item.secondaryValue ? (
        <small><span>{item.secondaryLabel}</span>{item.secondaryValue}</small>
      ) : null}
    </div>
  );
}

export function TokenomicsScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    void import("@/app/motion/gsap").then(({ gsap, ScrollTrigger }) => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const marquee = marqueeRef.current;
      if (!section || !sticky || !marquee) return;

      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          const stateTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: ({ progress }) => {
              const nextIndex = Math.min(
                TOKEN_DETAILS.length - 1,
                Math.floor(progress * TOKEN_DETAILS.length),
              );
              if (nextIndex === activeIndexRef.current) return;
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
            },
          });

          const drift = gsap.fromTo(
            marquee,
            { xPercent: 0 },
            {
              xPercent: -16,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true },
            },
          );

          return () => {
            stateTrigger.kill();
            drift.kill();
          };
        });

        cleanup = () => media.revert();
      }, section);

      const previousCleanup = cleanup;
      cleanup = () => {
        previousCleanup?.();
        context.revert();
      };
    });

    return () => cleanup?.();
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let contextCleanup: (() => void) | undefined;
    void import("@/app/motion/gsap").then(({ gsap }) => {
      const section = sectionRef.current;
      if (!section) return;

      const context = gsap.context(() => {
        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          const expandedHeight = index === 3 ? 336 : 248;
          gsap.to(row, {
            height: index === activeIndex ? expandedHeight : 60,
            duration: 0.6,
            ease: "power3.out",
            overwrite: true,
          });
        });
      }, section);

      contextCleanup = () => context.revert();
    });

    return () => contextCleanup?.();
  }, [activeIndex, isMobile]);

  const active = TOKEN_DETAILS[activeIndex];
  const canvasInFront = activeIndex === 0 || activeIndex === 3 || activeIndex === 5;

  return (
    <section ref={sectionRef} id="tokenomics" className={styles.tokenomicsSection} aria-labelledby="tokenomics-title">
      <h2 id="tokenomics-title" className={styles.srOnly}>Iron Vault tokenomics</h2>
      <div ref={stickyRef} className={styles.tokenomicsSticky} style={{ "--active-color": active.color, "--active-soft": active.softColor } as React.CSSProperties}>
        <div ref={marqueeRef} className={styles.tokenomicsWord} aria-hidden="true">
          <span>Tokenomics</span><span>Tokenomics</span><span>Tokenomics</span>
        </div>

        <SceneGate className={`${styles.tokenCanvas} ${canvasInFront ? styles.tokenCanvasFront : ""}`}>
          {(inView) => <TokenomicsScene active={inView} activeIndex={activeIndex} mobile={isMobile} />}
        </SceneGate>

        <div className={styles.accordion}>
          {TOKEN_DETAILS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                ref={(node) => { rowRefs.current[index] = node; }}
                className={`${styles.tokenRow} ${isActive ? styles.tokenRowActive : ""}`}
                style={{ "--row-color": item.color, "--row-soft": item.softColor } as React.CSSProperties}
              >
                <button
                  type="button"
                  className={styles.rowHeader}
                  aria-expanded={isActive}
                  aria-controls={`${item.id}-panel`}
                  onClick={() => {
                    activeIndexRef.current = index;
                    setActiveIndex(index);
                  }}
                >
                  <span className={styles.numberChip}>{index + 1}</span>
                  <span className={styles.labelPill}>{item.label}</span>
                  <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true"><path d="m5 12.5 5-5 5 5" /></svg>
                </button>
                <div id={`${item.id}-panel`} className={styles.rowContent} aria-hidden={!isActive}>
                  <TokenValue item={item} />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.scrollHint} aria-hidden="true"><span>Scroll to explore</span><i /></div>
      </div>
    </section>
  );
}
