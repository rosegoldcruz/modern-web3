"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { motion } from "motion/react"
import { ShieldCheck, Users, RefreshCw, Rocket, MessageSquare } from "lucide-react"
import { Footer } from "@/components/footer"
import { LandingPlasmaBackground } from "@/components/landing-plasma-background"

const spring = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const

function getFormUrl(): string {
  const url = process.env.NEXT_PUBLIC_GHL_SALES_FORM_URL
  if (!url) {
    throw new Error("Missing required env var: NEXT_PUBLIC_GHL_SALES_FORM_URL")
  }
  return url
}

const WORKFLOW_STEPS = [
  {
    icon: ShieldCheck,
    title: "Sale is submitted",
    description: "Your completed sale information is securely recorded and routed to the appropriate team.",
  },
  {
    icon: Users,
    title: "Customer Success is notified",
    description: "Our onboarding specialists receive an immediate alert with all relevant client details.",
  },
  {
    icon: RefreshCw,
    title: "Contact is updated inside GoHighLevel",
    description: "Client records are synchronized automatically — no manual data entry required.",
  },
  {
    icon: Rocket,
    title: "Onboarding begins",
    description: "The customer enters a structured onboarding sequence tailored to their tier and goals.",
  },
  {
    icon: MessageSquare,
    title: "Customer receives next-step communication",
    description: "A personalized welcome message with clear next steps is delivered within minutes.",
  },
] as const

export default function SalesPage() {
  const [formVisible, setFormVisible] = useState(false)
  const formUrl = getFormUrl()

  useEffect(() => {
    const t = setTimeout(() => setFormVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />

      <LandingPlasmaBackground />

      <div className="relative min-h-screen text-white">

        {/* ========== HERO ========== */}
        <section className="relative px-5 pt-16 pb-8 sm:px-8 sm:pt-24 sm:pb-12">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.05 }}
            >
              {/* Badge */}
              <span className="inline-block rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-400 sm:text-[11px]">
                Internal Operations
              </span>

              <h1 className="mt-5 text-[2.25rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-yellow-400 drop-shadow-[0_0_24px_rgba(250,204,21,0.25)]">
                  Sales Handoff Portal
                </span>
              </h1>

              <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed text-neutral-300/85 sm:text-lg">
                Submit completed sales information for customer success onboarding.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ========== FORM SECTION ========== */}
        <section className="relative px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
              className="liquid-glass rounded-3xl p-5 sm:p-8"
            >
              <div className="mb-6 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-400/75">
                  GoHighLevel — Sales Hand-Off
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Submit Sale Details
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Complete all fields below. This form routes directly to customer success.
                </p>
              </div>

              <div className="relative min-h-100 w-full overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0d]">
                {formVisible ? (
                  <iframe
                    src={formUrl}
                    style={{ width: "100%", height: "2170px", border: "none", borderRadius: "4px" }}
                    id="inline-qpgdvqKFjq0AJlASGq9T"
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Sales Hand-Off Form"
                    data-height="2170"
                    data-layout-iframe-id="inline-qpgdvqKFjq0AJlASGq9T"
                    data-form-id="qpgdvqKFjq0AJlASGq9T"
                    title="Sales Hand-Off Form"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center py-32">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-400/30 border-t-yellow-400" />
                      <p className="text-sm text-neutral-500">Loading form&hellip;</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========== WHAT HAPPENS NEXT ========== */}
        <section className="border-t border-white/6 bg-[#0a0a0d]/60 px-5 py-16 sm:px-8 sm:py-24">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring }}
              className="mb-10 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-400/75">
                Process
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                What Happens Next
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WORKFLOW_STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: index * 0.07 }}
                  className="liquid-glass group rounded-2xl p-5 transition-all hover:border-yellow-500/20"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-xs font-bold text-yellow-400">
                      {index + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-yellow-400/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <Footer />
      </div>
    </>
  )
}
