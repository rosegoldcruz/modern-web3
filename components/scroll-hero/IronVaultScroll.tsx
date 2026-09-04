"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SceneGate } from "./SceneGate";
import { SiteSections } from "./SiteSections";
import { TokenomicsScroll } from "./TokenomicsScroll";
import { OVERVIEW_COPY } from "./data";
import styles from "./scrollHero.module.css";
import type { HeroHopAnchors } from "./HeroScene";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "]);

export function IronVaultScroll({ showHeader = true }: { showHeader?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hopAnchorsRef = useRef<HeroHopAnchors>([]);
  const heroInvalidateRef = useRef<(() => void) | null>(null);
  const launchAssetsEnabledRef = useRef(false);
  const overviewRef = useRef<HTMLElement>(null);
  const heroProgress = useRef(0);
  const [heroSceneEnabled, setHeroSceneEnabled] = useState(true);
  const [heroSceneReady, setHeroSceneReady] = useState(false);
  const [launchAssetsEnabled, setLaunchAssetsEnabled] = useState(false);
  const words = OVERVIEW_COPY.split(" ");
  const handleCoinReady = useCallback(() => setHeroSceneReady(true), []);

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
          squashTimes: number[],
        ) => {
          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end,
              pin: heroFrame,
              scrub: 1.65,
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

          const landingNodes = hopAnchorsRef.current;
          squashAnchorIndexes.forEach((anchorIndex, landingIndex) => {
            const letter = landingNodes[anchorIndex];
            if (!letter) return;

            // Each successive landing compresses harder (V < I < M).
            const s = 1 + landingIndex * 0.35;
            heroTimeline.to(
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
              squashTimes[landingIndex] - 0.018,
            );
          });

          return heroTimeline;
        };

        media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          const heroTimeline = setupHeroTimeline("+=380%", -15, [1, 2, 3], [0.3, 0.6, 0.91]);
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
            heroTimeline.kill();
            wordTimeline.kill();
          };
        });

        media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
          const heroTimeline = setupHeroTimeline("+=330%", -5, [4, 3], [0.36, 0.68]);

          return () => {
            heroTimeline.kill();
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
                <span ref={(node) => { hopAnchorsRef.current[3] = node; }} className={styles.heroLandingLetter} data-hop-target="M">M</span>
                <span>e</span><span>e</span><span>t</span>
              </span>{" "}
              <span className={styles.heroWord} aria-hidden="true">
                <span ref={(node) => { hopAnchorsRef.current[2] = node; }} className={styles.heroLandingLetter} data-hop-target="I">I</span>
                <span>r</span><span>o</span>
                <span ref={(node) => { hopAnchorsRef.current[4] = node; }} className={styles.heroLandingLetter} data-hop-target="mobile-n">n</span>
              </span>{" "}
              <span className={styles.heroWord} aria-hidden="true">
                <span ref={(node) => { hopAnchorsRef.current[1] = node; }} className={styles.heroLandingLetter} data-hop-target="V">V</span>
                <span>a</span><span>u</span><span>l</span>
                <span ref={(node) => { hopAnchorsRef.current[0] = node; }} className={styles.heroLandingLetter} data-hop-target="T">t</span>
              </span>
            </h1>
            <Image
              className={`${styles.heroCoinFallback} ${heroSceneReady ? styles.heroCoinFallbackHidden : ""}`}
              src="/animate/ivsol_coin_LIVE.fallback.png"
              alt=""
              width={1024}
              height={1024}
              priority
              sizes="(max-width: 767px) 72vw, 240px"
              aria-hidden="true"
            />
            {heroSceneEnabled ? (
              <SceneGate className={styles.heroCanvas}>
                {(active) => (
                  <HeroScene
                    active={active}
                    progress={heroProgress}
                    anchors={hopAnchorsRef}
                    invalidateRef={heroInvalidateRef}
                    launchAssetsEnabled={launchAssetsEnabled}
                    onCoinReady={handleCoinReady}
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
