"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SceneGate } from "./SceneGate";
import { SiteSections } from "./SiteSections";
import { TokenomicsScroll } from "./TokenomicsScroll";
import { OVERVIEW_COPY } from "./data";
import styles from "./scrollHero.module.css";
import type { HeroHopAnchors, HeroImpactDriver } from "./HeroScene";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "]);

export function IronVaultScroll({ showHeader = true }: { showHeader?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const vaultTRef = useRef<HTMLSpanElement>(null);
  const vaultVRef = useRef<HTMLSpanElement>(null);
  const ironIRef = useRef<HTMLSpanElement>(null);
  const meetMRef = useRef<HTMLSpanElement>(null);
  const mobileNRef = useRef<HTMLSpanElement>(null);
  const hopAnchorsRef = useRef<HeroHopAnchors>([]);
  const heroImpactRef = useRef<HeroImpactDriver | null>(null);
  const heroInvalidateRef = useRef<(() => void) | null>(null);
  const launchAssetsEnabledRef = useRef(false);
  const overviewRef = useRef<HTMLElement>(null);
  const heroProgress = useRef(0);
  const [heroSceneEnabled, setHeroSceneEnabled] = useState(true);
  const [launchAssetsEnabled, setLaunchAssetsEnabled] = useState(false);
  const words = OVERVIEW_COPY.split(" ");

  useEffect(() => {
    const enableScene = () => setHeroSceneEnabled(true);
    const enableSceneFromKeyboard = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) enableScene();
    };

    window.addEventListener("wheel", enableScene, { passive: true, once: true });
    window.addEventListener("touchmove", enableScene, { passive: true, once: true });
    window.addEventListener("scroll", enableScene, { passive: true, once: true });
    window.addEventListener("keydown", enableSceneFromKeyboard);

    return () => {
      window.removeEventListener("wheel", enableScene);
      window.removeEventListener("touchmove", enableScene);
      window.removeEventListener("scroll", enableScene);
      window.removeEventListener("keydown", enableSceneFromKeyboard);
    };
  }, []);

  useEffect(() => {
    hopAnchorsRef.current[0] = vaultTRef.current;
    hopAnchorsRef.current[1] = vaultVRef.current;
    hopAnchorsRef.current[2] = ironIRef.current;
    hopAnchorsRef.current[3] = meetMRef.current;
    hopAnchorsRef.current[4] = mobileNRef.current;
  });

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    void import("@/app/motion/gsap").then(({ gsap }) => {
      const root = rootRef.current;
      const hero = heroRef.current;
      const heroFrame = heroFrameRef.current;
      const headline = headlineRef.current;
      const overview = overviewRef.current;
      if (!root || !hero || !heroFrame || !headline || !overview) return;

      const context = gsap.context(() => {
        const media = gsap.matchMedia();

        const setupHeroTimeline = (
          end: string,
          headlineShift: number,
          squashAnchorIndexes: number[],
        ) => {
          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end,
              pin: heroFrame,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          heroTimeline.eventCallback("onUpdate", () => {
            heroProgress.current = heroTimeline.progress();
            if (heroProgress.current >= 0.55 && !launchAssetsEnabledRef.current) {
              launchAssetsEnabledRef.current = true;
              setLaunchAssetsEnabled(true);
            }
            heroInvalidateRef.current?.();
          });
          heroTimeline.to(headline, { xPercent: headlineShift, ease: "none" }, 0);
          heroTimeline.to(headline, { yPercent: -150, ease: "none" }, 0.91);

          // Letter impacts are NOT on the scrubbed timeline: the rendered coin (HeroScene) scrubs these when it actually makes contact.
          const landingNodes = hopAnchorsRef.current;
          const impactProxies = squashAnchorIndexes.map(() => ({ c: 0 }));
          const impactTimelines = squashAnchorIndexes.map((anchorIndex, landingIndex) => {
            const letter = landingNodes[anchorIndex];
            if (!letter) return null;

            // Each successive landing compresses harder (V < I < M).
            const s = 1 + landingIndex * 0.35;
            const impact = gsap.timeline({ paused: true });
            impact.to(
              letter,
              {
                keyframes: [
                  { y: 14 * s, scaleX: 1 + 0.08 * s, scaleY: 1 - 0.24 * s, duration: 0.026, ease: "power3.in" },
                  { y: -9 * s, scaleX: 1 - 0.04 * s, scaleY: 1 + 0.09 * s, duration: 0.035, ease: "power3.out" },
                  { y: 3 * s, scaleX: 1 + 0.02 * s, scaleY: 1 - 0.03 * s, duration: 0.026, ease: "power2.inOut" },
                  { y: 0, scaleX: 1, scaleY: 1, duration: 0.03, ease: "back.out(2.4)" },
                ],
                transformOrigin: "50% 100%",
              },
              0,
            );
            impact.to(
              impactProxies[landingIndex],
              {
                keyframes: [
                  { c: 1, duration: 0.026, ease: "power3.in" },
                  { c: -0.45, duration: 0.035, ease: "power3.out" },
                  { c: 0.12, duration: 0.026, ease: "power2.inOut" },
                  { c: 0, duration: 0.03, ease: "back.out(2.4)" },
                ],
              },
              0,
            );
            return impact;
          });

          heroImpactRef.current = {
            set: (landingIndex, level) => {
              const impact = impactTimelines[landingIndex];
              if (!impact) return 0;
              impact.progress(level);
              return impactProxies[landingIndex].c;
            },
          };

          return () => {
            heroImpactRef.current = null;
            impactTimelines.forEach((impact) => impact?.kill());
            heroTimeline.kill();
          };
        };

        media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          const killHero = setupHeroTimeline("+=380%", -15, [1, 2, 3]);
          const wordNodes = gsap.utils.toArray<HTMLElement>(`.${styles.overviewWord}`);
          const wordTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: overview,
              start: "top 72%",
              end: "bottom 34%",
              scrub: true,
            },
          });
          wordTimeline.to(wordNodes, { color: "#111111", stagger: 0.065, ease: "none" });

          return () => {
            killHero();
            wordTimeline.kill();
          };
        });

        media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
          const killHero = setupHeroTimeline("+=330%", -5, [4, 3]);

          return () => {
            killHero();
          };
        });

        media.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(`.${styles.overviewWord}`, { color: "#111111" });
        });

        cleanup = () => media.revert();
      }, root);

      const previousCleanup = cleanup;
      cleanup = () => {
        previousCleanup?.();
        context.revert();
      };
    });

    return () => cleanup?.();
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      {showHeader ? (
        <header className={styles.header}>
          <Link className={styles.brand} href="/" aria-label="Iron Vault home">
            <Image src="/favicon.svg" alt="" width={28} height={28} />
            <span>IRON VAULT</span>
          </Link>
          <nav className={styles.nav} aria-label="Animate page">
            <a href="#ecosystem">Ecosystem</a>
            <a href="#academy">Academy</a>
            <a href="#technology">Technology</a>
            <a href="#partners">Partners</a>
            <a href="#tokenomics">Tokenomics</a>
          </nav>
          <Link className={styles.enterButton} href="/sign-in">Enter Vault</Link>
        </header>
      ) : null}

      <main>
        <section ref={heroRef} className={styles.hero} aria-labelledby="meet-iron-vault">
          <div ref={heroFrameRef} className={styles.heroFrame}>
            <h1
              ref={headlineRef}
              id="meet-iron-vault"
              className={styles.heroHeadline}
              aria-label="Meet Iron Vault"
            >
              <span className={styles.heroWord} aria-hidden="true">
                <span ref={meetMRef} id="meetM" className={styles.heroLandingLetter} data-hop-target="M">M</span>
                <span>e</span><span>e</span><span>t</span>
              </span>{" "}
              <span className={styles.heroWord} aria-hidden="true">
                <span ref={ironIRef} id="ironI" className={styles.heroLandingLetter} data-hop-target="I">I</span>
                <span>r</span><span>o</span>
                <span ref={mobileNRef} className={styles.heroLandingLetter} data-hop-target="mobile-n">n</span>
              </span>{" "}
              <span className={styles.heroWord} aria-hidden="true">
                <span ref={vaultVRef} id="vaultV" className={styles.heroLandingLetter} data-hop-target="V">V</span>
                <span>a</span><span>u</span><span>l</span>
                <span ref={vaultTRef} id="vaultT" className={styles.heroLandingLetter} data-hop-target="T">t</span>
              </span>
            </h1>
            {heroSceneEnabled ? (
              <SceneGate className={styles.heroCanvas}>
                {(active) => (
                  <HeroScene
                    active={active}
                    progress={heroProgress}
                    anchors={hopAnchorsRef}
                    impact={heroImpactRef}
                    invalidateRef={heroInvalidateRef}
                    launchAssetsEnabled={launchAssetsEnabled}
                    onCoinReady={() => undefined}
                  />
                )}
              </SceneGate>
            ) : null}
            <div className={styles.heroRule} aria-hidden="true" />
          </div>
        </section>

        <section ref={overviewRef} id="overview" className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title" className={styles.srOnly}>Iron Vault overview</h2>
          <p className={styles.overviewCopy}>
            {words.map((word, index) => (
              <span className={styles.overviewWord} key={`${word}-${index}`}>{word}{index < words.length - 1 ? " " : ""}</span>
            ))}
          </p>
        </section>

        <SiteSections />

        <TokenomicsScroll />
      </main>
    </div>
  );
}
