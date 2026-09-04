"use client"

import Image from "next/image"
import Link from "next/link"
import type { CSSProperties, ReactNode, RefObject } from "react"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Database,
  FileCheck2,
  Fingerprint,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Network,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react"
import { IRON_VAULT_ROUTES } from "@/lib/iron-vault-routes"
import { HeroScene } from "@/components/scroll-hero/HeroScene"

const MINT_ADDRESS = "DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV"
const TREASURY_ADDRESS = "523vdNYYi44e762Qd7eU6HQGULQsRbsZLYp9g69weAr5"

const tokenFacts = [
  ["Ticker", "IV-SOL"],
  ["Blockchain", "Solana"],
  ["Token Standard", "Token-2022"],
  ["Supply", "250,000,000,000"],
  ["Decimals", "6"],
] as const

const academyAreas = [
  "blockchain",
  "digital finance",
  "artificial intelligence",
  "software development",
  "cybersecurity",
  "compliance",
  "emerging technologies",
] as const

const ecosystemRows = [
  {
    number: "01",
    title: "Vaulted Academy",
    body: "Structured education designed to build knowledge and practical capability.",
    href: "#academy",
  },
  {
    number: "02",
    title: "IV-SOL",
    body: "The native digital token operating within the Iron Vault ecosystem.",
    href: "#iv-sol",
    gold: true,
  },
  {
    number: "03",
    title: "Community",
    body: "A network of learners, contributors, and builders participating in the broader ecosystem.",
    href: "#partners",
  },
] as const

const infrastructureLabels = [
  { label: "Identity", icon: Fingerprint },
  { label: "Access", icon: LockKeyhole },
  { label: "Curriculum", icon: BookOpen },
  { label: "Progress", icon: TrendingUp },
  { label: "Assessments", icon: FileCheck2 },
  { label: "Administration", icon: LayoutDashboard },
] as const

const partnerTracks = [
  "Educational collaboration",
  "Technology integration",
  "Curriculum and content",
  "Community programs",
] as const

const tokenAccordion = [
  {
    title: "Quantity",
    value: "250 Billion Tokens",
    color: "#635BFF",
  },
  {
    title: "Purpose",
    value: "Education, participation, recognition, access, community activity, and ecosystem utility within Iron Vault.",
    color: "#d4a017",
  },
  {
    title: "Decimals",
    value: "6",
    color: "#33a56d",
  },
  {
    title: "Contract Address",
    value: "Mint and treasury addresses for IV-SOL.",
    color: "#635BFF",
    addresses: true,
  },
  {
    title: "Ticker",
    value: "IV-SOL",
    color: "#f07a22",
  },
  {
    title: "Standard",
    value: "Solana Token-2022",
    color: "#ad8b45",
  },
] as const

function AddressCopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="iv-copy-button"
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  )
}

type Vec2 = { x: number; y: number }

const IMPACTS = {
  takeoff: {
    down: 8,
    scaleX: 1.035,
    scaleY: 0.86,
    rebound: -4,
    reboundScaleY: 1.035,
  },
  normal: {
    down: 14,
    scaleX: 1.06,
    scaleY: 0.78,
    rebound: -7,
    reboundScaleY: 1.055,
  },
  heavy: {
    down: 21,
    scaleX: 1.09,
    scaleY: 0.7,
    rebound: -11,
    reboundScaleY: 1.1,
  },
  launch: {
    down: 28,
    scaleX: 1.13,
    scaleY: 0.61,
    rebound: -16,
    reboundScaleY: 1.15,
  },
} as const

const ARC_HEIGHTS = {
  hop1: 0.23,
  hop2: 0.19,
  hop3: 0.21,
}

type CoinMotionState = {
  progress: number
  point: Vec2
  rotationY: number
  scaleX: number
  scaleY: number
  shadowScale: number
  shadowOpacity: number
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function easeInOutCubic(t: number) {
  const p = clamp01(t)
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

function easeInCubic(t: number) {
  const p = clamp01(t)
  return p * p * p
}

function ballisticHop(from: Vec2, to: Vec2, t: number, arcHeight: number, viewportHeight: number) {
  const p = clamp01(t)
  const travel = easeInOutCubic(p)
  const arc = 4 * p * (1 - p)
  return {
    x: from.x + (to.x - from.x) * travel,
    y: from.y + (to.y - from.y) * travel - arc * arcHeight * viewportHeight,
  }
}

function getPoint(rectRef: RefObject<HTMLElement | null>): Vec2 | null {
  if (!rectRef.current) return null
  const rect = rectRef.current.getBoundingClientRect()
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.54,
  }
}

function normalizeToContainer(point: Vec2, containerRect: DOMRect) {
  return {
    x: point.x - containerRect.left,
    y: point.y - containerRect.top,
  }
}

function applyCoinDeformation(letterEl: HTMLElement | null, cfg: (typeof IMPACTS)[keyof typeof IMPACTS], localProgress: number) {
  if (!letterEl) return
  const impact = clamp01(localProgress / 0.45)
  if (impact <= 0.5) {
    const p = clamp01(impact / 0.5)
    const y = cfg.down * p
    const scaleY = 1 - (1 - cfg.scaleY) * p
    const scaleX = 1 + (cfg.scaleX - 1) * p
    letterEl.style.transform = `translateY(${y.toFixed(2)}px) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`
    return
  }

  const p = clamp01((impact - 0.5) / 0.5)
  const y = cfg.down + (cfg.rebound - cfg.down) * p
  const scaleY = cfg.scaleY + (cfg.reboundScaleY - cfg.scaleY) * p
  const scaleX = cfg.scaleX + (1 - cfg.scaleX) * p
  letterEl.style.transform = `translateY(${y.toFixed(2)}px) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`
}

function heroProgressAtScroll(heroRect: DOMRect | null, totalHeight: number) {
  if (!heroRect) return 0
  const end = heroRect.top + totalHeight - window.innerHeight
  const progress = (-heroRect.top) / Math.max(1, end - heroRect.top)
  return clamp01(progress)
}

function HeroSequence() {
  const heroRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const headlineRef = useRef<HTMLHeadingElement | null>(null)
  const meetMRef = useRef<HTMLSpanElement | null>(null)
  const ironIRef = useRef<HTMLSpanElement | null>(null)
  const vaultVRef = useRef<HTMLSpanElement | null>(null)
  const vaultTRef = useRef<HTMLSpanElement | null>(null)
  const heroSceneFallbackRef = useRef<HTMLDivElement>(null)
  const tickRef = useRef<number>(0)
  const heroProgressRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const isCoinReadyRef = useRef(false)
  const [isCoinReady, setIsCoinReady] = useState(false)
  const [isHeroSceneActive, setIsHeroSceneActive] = useState(true)
  const coinScaleRef = useRef(1)
  const spinVelocityRef = useRef(0)
  const spinRef = useRef(0)
  const coinStateRef = useRef<CoinMotionState>({
    progress: 0,
    point: { x: 0, y: 0 },
    rotationY: 0,
    scaleX: 1,
    scaleY: 1,
    shadowScale: 1,
    shadowOpacity: 0.24,
  })
  const handleCoinReady = () => {
    isCoinReadyRef.current = true
    setIsCoinReady(true)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = media.matches
    setIsHeroSceneActive(!media.matches)

    const cleanupMedia = () => {
      reducedMotionRef.current = media.matches
      setIsHeroSceneActive(!media.matches)
    }
    media.addEventListener("change", cleanupMedia)
    const handleScroll = () => {
      if (!heroRef.current || !frameRef.current || reducedMotionRef.current) return
      const heroRect = heroRef.current.getBoundingClientRect()
      const frameRect = frameRef.current.getBoundingClientRect()
      const mRect = getPoint(meetMRef)
      const iRect = getPoint(ironIRef)
      const vRect = getPoint(vaultVRef)
      const tRect = getPoint(vaultTRef)
      if (!mRect || !iRect || !vRect || !tRect) return

      const progress = heroProgressAtScroll(heroRect, heroRect.height)
      heroProgressRef.current = progress
      const headlineShift = -15 * clamp01(progress)
      const headlineY = progress >= 0.92 ? -150 * clamp01((progress - 0.92) / 0.08) : 0
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate(${headlineShift.toFixed(2)}%, ${headlineY.toFixed(2)}%)`
      }

      const viewportWidth = Math.max(260, window.innerWidth)
      const viewportHeight = Math.max(240, window.innerHeight)
      const toT = normalizeToContainer(tRect, frameRect)
      const toV = normalizeToContainer(vRect, frameRect)
      const toI = normalizeToContainer(iRect, frameRect)
      const toM = normalizeToContainer(mRect, frameRect)

      // Keep each target continuously alive based on moving headline.
      let rotationY = 0
      let localYScale = 1
      let localXScale = 1
      let shadowScale = 1
      let shadowOpacity = 0.28
      let hopApex = 0
      let coinPoint = { x: toT.x, y: toT.y }

      if (progress <= 0.08) {
        const takeoffP = clamp01(progress / 0.08)
        applyCoinDeformation(vaultTRef.current, IMPACTS.takeoff, takeoffP)
        coinPoint = { x: toT.x, y: toT.y + 1 }
      } else if (progress <= 0.27) {
        const hopProgress = (progress - 0.08) / 0.19
        hopApex = 4 * hopProgress * (1 - hopProgress)
        coinPoint = ballisticHop(toT, toV, hopProgress, ARC_HEIGHTS.hop1, viewportHeight)
        rotationY = 3.1 * hopProgress + spinRef.current
      } else if (progress <= 0.33) {
        const impactP = (progress - 0.27) / 0.06
        applyCoinDeformation(vaultVRef.current, IMPACTS.normal, impactP * 1.4)
        const settle = clamp01(impactP)
        coinPoint = {
          x: toV.x,
          y: toV.y + IMPACTS.normal.down * (1 - Math.min(1, settle)) + IMPACTS.normal.rebound * Math.max(0, settle - 0.5) * 2,
        }
      } else if (progress <= 0.53) {
        const hopProgress = (progress - 0.33) / 0.20
        hopApex = 4 * hopProgress * (1 - hopProgress)
        coinPoint = ballisticHop(toV, toI, hopProgress, ARC_HEIGHTS.hop2, viewportHeight)
        rotationY = 5.5 * hopProgress + spinRef.current
      } else if (progress <= 0.60) {
        const reboundP = (progress - 0.53) / 0.07
        applyCoinDeformation(ironIRef.current, IMPACTS.heavy, reboundP * 1.35)
        coinPoint = {
          x: toI.x,
          y: toI.y + IMPACTS.normal.rebound * reboundP + (IMPACTS.heavy.down * (1 - reboundP)),
        }
      } else if (progress <= 0.80) {
        const hopProgress = (progress - 0.60) / 0.20
        hopApex = 4 * hopProgress * (1 - hopProgress)
        coinPoint = ballisticHop(toI, toM, hopProgress, ARC_HEIGHTS.hop3, viewportHeight)
        rotationY = 8.7 * hopProgress + spinRef.current
      } else if (progress <= 0.88) {
        const mHoldP = (progress - 0.80) / 0.08
        applyCoinDeformation(meetMRef.current, IMPACTS.launch, mHoldP * 1.7)
        localYScale = 0.98 + Math.min(0.06, mHoldP) * 0.8
        localXScale = 1.01 - mHoldP * 0.02
        coinPoint = {
          x: toM.x,
          y: toM.y + IMPACTS.launch.down * (1 - clamp01(mHoldP)),
        }
      } else {
        const exitP = clamp01((progress - 0.88) / 0.12)
        const acceleration = easeInCubic(exitP)
        const leftX = toM.x - viewportWidth * (0.18 * exitP + 1.05 * acceleration)
        const arcY = Math.sin(clamp01(exitP * 1.4) * Math.PI) * viewportHeight * 0.24
        const upY = viewportHeight * 0.1 * acceleration
        coinPoint = {
          x: leftX,
          y: toM.y - arcY - upY,
        }
        rotationY = spinRef.current + 12.7 * exitP
        localXScale = 0.96 + exitP * 0.09
        localYScale = 1.05 - exitP * 0.08
      }

      const spinImpulse = spinRef.current * 0.96
      coinScaleRef.current += (1 - coinScaleRef.current) * 0.12
      spinRef.current = spinImpulse

      const yScale = localYScale * coinScaleRef.current
      const xScale = localXScale * (2 - coinScaleRef.current * 0.98)

      if (progress > 0.27 && progress <= 0.33 && spinVelocityRef.current <= 0.4) spinVelocityRef.current = 0.4
      if (progress > 0.53 && progress <= 0.60 && spinVelocityRef.current <= 0.7) spinVelocityRef.current = 0.7
      if (progress > 0.80 && progress <= 0.88 && spinVelocityRef.current <= 1.0) spinVelocityRef.current = 1
      if (progress >= 0.88 && spinVelocityRef.current <= 1.5) spinVelocityRef.current = 1.5

      if (progress <= 0.88) {
        spinRef.current += spinVelocityRef.current * 0.006
      } else {
        spinRef.current += spinVelocityRef.current * 0.01
      }
      spinVelocityRef.current *= Math.pow(0.96, 4)

      if (progress <= 0.33) {
        applyCoinDeformation(vaultVRef.current, IMPACTS.normal, clamp01((progress - 0.27) / 0.06))
      }
      if (progress <= 0.60) {
        applyCoinDeformation(ironIRef.current, IMPACTS.heavy, clamp01((progress - 0.53) / 0.07))
      }
      if (progress <= 0.88) {
        applyCoinDeformation(meetMRef.current, IMPACTS.launch, clamp01((progress - 0.8) / 0.08))
      }

      if (hopApex > 0) {
        shadowScale = 1.22 - hopApex * 0.5
        shadowOpacity = 0.42 - hopApex * 0.26
      } else if (progress <= 0.08) {
        shadowScale = 1.16
        shadowOpacity = 0.42
      } else if (progress <= 0.33) {
        shadowScale = 1.18
        shadowOpacity = 0.46
      } else if (progress <= 0.53) {
        shadowScale = 1.22
        shadowOpacity = 0.42
      } else if (progress <= 0.60) {
        shadowScale = 1.24
        shadowOpacity = 0.5
      } else if (progress <= 0.88) {
        shadowScale = 1.32
        shadowOpacity = 0.54
      } else {
        shadowScale = 0.36
        shadowOpacity = 0
      }

      coinStateRef.current = {
        progress,
        point: coinPoint,
        rotationY,
        scaleX: xScale,
        scaleY: yScale,
        shadowScale,
        shadowOpacity,
      }

      if (heroSceneFallbackRef.current) {
        heroSceneFallbackRef.current.style.opacity = isCoinReadyRef.current ? "0" : "1"
        heroSceneFallbackRef.current.style.transform = `translate3d(${coinPoint.x.toFixed(2)}px, ${coinPoint.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${xScale.toFixed(4)}, ${yScale.toFixed(4)})`
        heroSceneFallbackRef.current.style.visibility = isCoinReadyRef.current ? "hidden" : "visible"
      }
    }

    const rafLoop = () => {
      if (!reducedMotionRef.current) {
        handleScroll()
        tickRef.current = window.requestAnimationFrame(rafLoop)
      }
    }
    const onResize = () => {
      handleScroll()
    }

    const finalizeReducedMotion = () => {
      if (!heroRef.current || !frameRef.current) return
      const frameRect = frameRef.current.getBoundingClientRect()
      const tRect = getPoint(vaultTRef)
      if (!tRect) return
      const toT = normalizeToContainer(tRect, frameRect)
      coinStateRef.current = {
        progress: 0,
        point: { x: toT.x, y: toT.y + 1 },
        rotationY: 0,
        scaleX: 1,
        scaleY: 1,
        shadowScale: 1,
        shadowOpacity: 0.2,
      }
      if (headlineRef.current) {
        headlineRef.current.style.transform = "none"
      }
      if (heroSceneFallbackRef.current) {
        heroSceneFallbackRef.current.style.transform = `translate3d(${toT.x.toFixed(2)}px, ${(toT.y + 1).toFixed(2)}px, 0) translate(-50%, -50%)`
        heroSceneFallbackRef.current.style.opacity = isCoinReadyRef.current ? "0" : "1"
      }
    }

    if (reducedMotionRef.current) {
      finalizeReducedMotion()
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", onResize)
      document.fonts?.ready?.then(() => {
        if (!reducedMotionRef.current) handleScroll()
      })
      tickRef.current = window.requestAnimationFrame(rafLoop)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", onResize)
      media.removeEventListener("change", cleanupMedia)
      window.cancelAnimationFrame(tickRef.current)
      tickRef.current = 0
    }
  }, [])

  return (
    <section ref={heroRef} className="iv-home-hero iv-hero-sequence">
      <div ref={frameRef} className="iv-shell iv-hero-frame">
        <h1
          ref={headlineRef}
          id="meet-iron-vault"
          className="iv-hero-title heroHeadline"
          aria-label="Meet Iron Vault"
        >
          <span className="heroWord" aria-hidden="true">
            <span ref={meetMRef} className="heroLandingLetter" data-hop-target="meet-m">
              M
            </span>
            <span>e</span>
            <span>e</span>
            <span>t</span>
          </span>

          <span className="heroWord" aria-hidden="true">
            <span> </span>
          </span>

          <span className="heroWord" aria-hidden="true">
            <span ref={ironIRef} className="heroLandingLetter" data-hop-target="iron-i">
              I
            </span>
            <span>r</span>
            <span>o</span>
            <span>n</span>
          </span>

          <span className="heroWord" aria-hidden="true">
            <span> </span>
          </span>

          <span className="heroWord" aria-hidden="true">
            <span ref={vaultVRef} className="heroLandingLetter" data-hop-target="vault-v">
              V
            </span>
            <span>a</span>
            <span>u</span>
            <span>l</span>
            <span ref={vaultTRef} className="heroLandingLetter" data-hop-target="vault-t">
              t
            </span>
          </span>
        </h1>
        <div className="iv-hero-coin-shell">
          <HeroScene
            heroProgressRef={heroProgressRef}
            vaultTRef={vaultTRef}
            vaultVRef={vaultVRef}
            ironIRef={ironIRef}
            meetMRef={meetMRef}
            coinStateRef={coinStateRef}
            isActive={isHeroSceneActive}
            isRendered={isCoinReady}
            onCoinReady={handleCoinReady}
            fallbackRef={heroSceneFallbackRef}
          />
        </div>
        <div className="iv-hero-rule" aria-hidden />
      </div>
    </section>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="iv-section-label">{children}</p>
}

export function IronVaultHome() {
  const [activeTokenRow, setActiveTokenRow] = useState(0)

  useEffect(() => {
    const scrollToHash = () => {
      const rawHash = window.location.hash.slice(1)
      if (!rawHash) return

      const target = document.getElementById(decodeURIComponent(rawHash))
      if (!target) return

      const nav = document.querySelector<HTMLElement>(".iv-nav")
      const offset = (nav?.getBoundingClientRect().height ?? 88) + 24
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" })
    }

    const frame = window.requestAnimationFrame(scrollToHash)
    const timers = [window.setTimeout(scrollToHash, 250), window.setTimeout(scrollToHash, 900)]
    window.addEventListener("hashchange", scrollToHash)

    return () => {
      window.cancelAnimationFrame(frame)
      timers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener("hashchange", scrollToHash)
    }
  }, [])

  return (
    <main className="iv-home-shell">
      <HeroSequence />

      <section id="about" className="iv-section iv-overview-section" aria-labelledby="iron-vault-overview">
        <div className="iv-shell iv-overview-grid">
          <div>
            <SectionLabel>Iron Vault</SectionLabel>
            <h2 id="iron-vault-overview" className="iv-editorial-heading">
              An education-first digital ecosystem.
            </h2>
          </div>
          <div className="iv-overview-copy">
            <p>
              Iron Vault is an education-first digital ecosystem built to help people understand, navigate, and participate in the digital economy with greater capability.
            </p>
            <p>
              Vaulted Academy develops practical knowledge across emerging financial and technological systems. IV-SOL operates within that broader ecosystem as its native digital token.
            </p>
            <p className="iv-callout-copy">Iron Vault is not just a token. It is education, infrastructure, access, and community moving through one connected system.</p>
          </div>
        </div>
      </section>

      <section id="iv-sol" className="iv-section iv-token-primer" aria-labelledby="iv-sol-heading">
        <div className="iv-shell">
          <div className="iv-token-primer-grid">
            <div>
              <SectionLabel>IV-SOL</SectionLabel>
              <h2 id="iv-sol-heading" className="iv-editorial-heading">
                Native to Iron Vault. Built on Solana.
              </h2>
              <p className="iv-section-copy">
                IV-SOL is the native digital token of the Iron Vault ecosystem, built on Solana using the Token-2022 Program.
              </p>
            </div>
            <div className="iv-token-fact-panel">
              {tokenFacts.map(([label, value]) => (
                <div key={label} className="iv-fact-row">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
              <div className="iv-address-panel">
                <div>
                  <span>Mint</span>
                  <code>{MINT_ADDRESS}</code>
                  <AddressCopyButton text={MINT_ADDRESS} label="Copy mint" />
                </div>
                <div>
                  <span>Treasury</span>
                  <code>{TREASURY_ADDRESS}</code>
                  <AddressCopyButton text={TREASURY_ADDRESS} label="Copy treasury" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="academy" className="iv-section iv-academy-section" aria-labelledby="academy-heading">
        <div className="iv-shell">
          <div className="iv-split-lead">
            <div className="iv-spec-copy">
              <SectionLabel>Vaulted Academy</SectionLabel>
              <h2 id="academy-heading" className="iv-editorial-heading">
                BUILD CAPABILITY FOR THE DIGITAL ECONOMY.
              </h2>
              <p className="iv-section-copy">
                Vaulted Academy is a continuously expanding education platform for practical learning across blockchain, digital finance, artificial intelligence, software development, cybersecurity, compliance, and emerging technologies.
              </p>
              <div className="iv-action-row">
                <Link className="iv-primary-action" href={IRON_VAULT_ROUTES.module0}>
                  BEGIN THE FREE ORIENTATION
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Link>
                <Link className="iv-inline-link" href="/sign-in">
                  SIGN IN
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Link>
                <Link className="iv-inline-link" href={IRON_VAULT_ROUTES.academyHome}>
                  EXPLORE VAULTED ACADEMY
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="iv-spec-art iv-academy-art">
              <Image
                src="/animate/spec/academy-modules.png"
                alt="Vaulted Academy learning areas arranged as connected modules"
                width={1536}
                height={1024}
                sizes="(max-width: 767px) 100vw, 56vw"
              />
            </div>
          </div>

          <div className="iv-learning-rail" aria-label="Vaulted Academy flow">
            {[
              { title: "Learn", body: "Build practical knowledge", icon: BookOpen },
              { title: "Verify", body: "Demonstrate understanding", icon: ShieldCheck },
              { title: "Progress", body: "Advance your expertise", icon: TrendingUp },
              { title: "Contribute", body: "Make an impact", icon: UsersRound },
            ].map(({ title, body, icon: Icon }, index) => (
              <div key={title} className={index === 0 ? "is-active" : undefined}>
                <span>
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <p>
                  <strong>{title}</strong>
                  <small>{body}</small>
                </p>
              </div>
            ))}
          </div>

          <div className="iv-academy-preview">
            <div>
              <h3>A LIVING EDUCATION PLATFORM.</h3>
              <p>
                Structured paths, applied projects, assessment, and member progress are designed to grow as the Academy expands.
              </p>
            </div>
            <div className="iv-area-grid" aria-label="Public Academy areas">
              {academyAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ecosystem" className="iv-section iv-ecosystem-section" aria-labelledby="ecosystem-heading">
        <div className="iv-shell">
          <div className="iv-ecosystem-lead">
            <div className="iv-spec-copy">
              <SectionLabel>Ecosystem</SectionLabel>
              <h2 id="ecosystem-heading" className="iv-editorial-heading">
                Education before speculation.
              </h2>
              <p className="iv-section-copy">
                Iron Vault connects Vaulted Academy, IV-SOL, and a community built for capable participation in the digital economy.
              </p>
            </div>
            <div className="iv-ecosystem-visual">
              <Image
                src="/animate/spec/ecosystem-stack.png"
                alt="Exploded view of the Iron Vault ecosystem: education, IV-SOL, and community"
                width={1122}
                height={1402}
                sizes="(max-width: 767px) 90vw, 40vw"
              />
            </div>
          </div>
          <div className="iv-ecosystem-rows">
            {ecosystemRows.map((row) => (
              <Link key={row.title} href={row.href} className="iv-ecosystem-row" data-gold={"gold" in row && row.gold ? "true" : undefined}>
                <span>{row.number}</span>
                <strong>{row.title}</strong>
                <p>{row.body}</p>
                <ArrowUpRight aria-hidden className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="system" className="iv-section iv-technology-section" aria-labelledby="technology-heading">
        <div className="iv-shell">
          <div className="iv-split-lead">
            <div className="iv-spec-copy">
              <SectionLabel>Technology</SectionLabel>
              <h2 id="technology-heading" className="iv-editorial-heading">
                INFRASTRUCTURE FOR MEASURABLE PARTICIPATION.
              </h2>
              <p className="iv-section-copy">
                Iron Vault uses identity, access, curriculum, progress, assessments, and administration systems to support measurable learning and participation.
              </p>
              <div className="iv-infra-label-grid">
                {infrastructureLabels.map(({ label, icon: Icon }) => (
                  <span key={label}>
                    <Icon aria-hidden className="h-4 w-4" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="iv-spec-art iv-technology-art">
              <Image
                src="/animate/spec/technology-stack.png"
                alt="Layered Iron Vault infrastructure architecture"
                width={1536}
                height={1024}
                sizes="(max-width: 767px) 100vw, 58vw"
              />
            </div>
          </div>
          <div className="iv-architecture-strip">
            <div>
              <Network aria-hidden className="h-5 w-5" />
              <span>API Gateway</span>
            </div>
            <ArrowRight aria-hidden className="h-4 w-4" />
            <div>
              <Database aria-hidden className="h-5 w-5" />
              <span>Core Services</span>
            </div>
            <ArrowRight aria-hidden className="h-4 w-4" />
            <div>
              <FileCheck2 aria-hidden className="h-5 w-5" />
              <span>Learning Records</span>
            </div>
          </div>
        </div>
      </section>

      <section id="partners" className="iv-section iv-participation-section" aria-labelledby="participation-heading">
        <div className="iv-shell">
          <div className="iv-split-lead">
            <div className="iv-spec-copy">
              <SectionLabel>Participation</SectionLabel>
              <h2 id="participation-heading" className="iv-editorial-heading">
                BUILD THE NEXT ECONOMY WITH CAPABLE PEOPLE.
              </h2>
              <p className="iv-section-copy">
                Iron Vault is developing education, technology, community, and digital infrastructure for long-term participation in the digital economy.
              </p>
            </div>
            <div className="iv-spec-art iv-partner-art">
              <Image
                src="/animate/spec/partner-stack.png"
                alt="Modular partner infrastructure shown as an exploded hardware stack"
                width={1024}
                height={1536}
                sizes="(max-width: 767px) 82vw, 38vw"
              />
            </div>
          </div>
          <div className="iv-partner-tracks">
            {partnerTracks.map((track, index) => (
              <a key={track} href="#contact">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{track}</strong>
                <ArrowRight aria-hidden className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="token" className="iv-tokenomics-section" aria-labelledby="tokenomics-heading">
        <div className="iv-tokenomics-word" aria-hidden>
          <span>Tokenomics</span>
          <span>Tokenomics</span>
          <span>Tokenomics</span>
        </div>
        <Image
          src="/animate/ivsol_coin_LIVE.fallback.png"
          alt=""
          width={1024}
          height={1024}
          sizes="(max-width: 767px) 50vw, 320px"
          className="iv-tokenomics-coin iv-tokenomics-coin-a"
        />
        <Image
          src="/animate/ivsol_coin_LIVE.fallback.png"
          alt=""
          width={1024}
          height={1024}
          sizes="(max-width: 767px) 42vw, 260px"
          className="iv-tokenomics-coin iv-tokenomics-coin-b"
        />
        <div className="iv-shell iv-tokenomics-inner">
          <div className="iv-tokenomics-intro">
            <SectionLabel>Tokenomics</SectionLabel>
            <h2 id="tokenomics-heading" className="iv-editorial-heading">
              A fixed supply. A transparent framework.
            </h2>
          </div>
          <div className="iv-token-accordion">
            {tokenAccordion.map((item, index) => {
              const open = activeTokenRow === index
              return (
                <div key={item.title} className="iv-token-row" style={{ "--row-color": item.color } as CSSProperties} data-open={open ? "true" : "false"}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`tokenomics-${index}`}
                    onClick={() => setActiveTokenRow(open ? -1 : index)}
                  >
                    <span>{index + 1}</span>
                    <strong>{item.title}</strong>
                    <ArrowUpRight aria-hidden className="h-4 w-4" />
                  </button>
                  <div id={`tokenomics-${index}`} hidden={!open}>
                    <div className="iv-token-row-content">
                      <p>{item.value}</p>
                      {"addresses" in item && item.addresses ? (
                        <div className="iv-address-panel">
                          <div>
                            <span>Mint</span>
                            <code>{MINT_ADDRESS}</code>
                            <AddressCopyButton text={MINT_ADDRESS} label="Copy mint" />
                          </div>
                          <div>
                            <span>Treasury</span>
                            <code>{TREASURY_ADDRESS}</code>
                            <AddressCopyButton text={TREASURY_ADDRESS} label="Copy treasury" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="enroll" className="iv-section iv-enroll-section" aria-labelledby="enroll-heading">
        <div id="contact" className="iv-shell iv-enroll-panel">
          <div>
            <SectionLabel>Enrollment</SectionLabel>
            <h2 id="enroll-heading" className="iv-editorial-heading">
              Begin with orientation. Continue with capability.
            </h2>
            <p className="iv-section-copy">
              Start with the free Iron Vault orientation, then sign in to continue through Vaulted Academy and the broader member ecosystem.
            </p>
          </div>
          <div className="iv-enroll-actions">
            <Link className="iv-primary-action" href={IRON_VAULT_ROUTES.module0}>
              <GraduationCap aria-hidden className="h-4 w-4" />
              BEGIN THE FREE ORIENTATION
            </Link>
            <Link className="iv-secondary-action" href="/sign-in">
              SIGN IN
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
