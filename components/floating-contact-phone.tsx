'use client'

import { useState, type FormEvent } from 'react'
import { Wifi, BatteryCharging, Send, Shield, CheckCircle, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'

export function FloatingContactPhone({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative [perspective:1400px]">
      <div
        aria-hidden="true"
        className="absolute -bottom-8 left-1/2 h-14 w-60 -translate-x-1/2 rounded-full bg-[rgba(0,0,0,0.62)] blur-xl"
      />

      <div
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          transform: 'rotateY(-17deg) rotateX(11deg) rotateZ(-1deg)',
        }}
        className="rounded-[32px] bg-[linear-gradient(155deg,#c9a227_0%,#8b7018_48%,#0a1020_100%)] p-[2.5px] shadow-[0_26px_52px_rgba(0,0,0,0.58)]"
      >
        <motion.div
          initial={{ transform: 'translateZ(10px) translateY(-2px)' }}
          animate={{
            transform: reducedMotion
              ? 'translateZ(14px) translateY(-4px)'
              : 'translateZ(22px) translateY(-18px)',
          }}
          transition={{
            repeat: reducedMotion ? 0 : Infinity,
            repeatType: 'mirror',
            duration: 2.2,
            ease: 'easeInOut',
          }}
          className="relative h-[620px] w-[320px] max-w-[85vw] rounded-[30px] border border-white/80 bg-[#090B12] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22),inset_0_0_28px_rgba(11,26,68,0.35)]"
        >
          <PhoneHeaderBar />
          <PhoneContactScreen />
        </motion.div>
      </div>
    </div>
  )
}

function PhoneHeaderBar() {
  return (
    <>
      <div className="absolute left-1/2 top-3 z-10 h-2.5 w-20 -translate-x-1/2 rounded-md bg-[#06070D]" />
      <div className="absolute right-3 top-2.5 z-10 flex items-center gap-1.5 text-white/60">
        <Wifi size={14} />
        <BatteryCharging size={14} />
      </div>
    </>
  )
}

function PhoneContactScreen() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return

    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    try {
      await fetch(
        'https://services.leadconnectorhq.com/hooks/OOxBz4Jalnuam4eNqhvD/webhook-trigger/5cf2907d-c975-465d-99a3-222b524083c4',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.get('name'),
            email: data.get('email'),
            phone: data.get('phone'),
            interest: data.get('interest'),
            message: data.get('message'),
            source: 'iron-vault-phone-form',
          }),
        }
      )
      setStatus('sent')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="relative z-0 h-full w-full overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(160deg,#121629_0%,#0c0f1d_45%,#090b14_100%)] px-4 pb-3 pt-9">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[rgba(201,162,39,0.25)] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[rgba(26,86,232,0.18)] blur-3xl" />

      <div className="relative z-10 flex h-full flex-col rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.78)] p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#FFD700]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFD700]">Early Access</p>
        </div>
        <h3 className="mt-1 text-lg font-bold text-[#E8EDF5]">Join Iron Vault</h3>
        <p className="mt-1 text-xs text-white/60">Reserve your position in the ecosystem.</p>

        {status === 'sent' ? (
          <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
            <CheckCircle size={48} className="mb-4 text-lime-400" />
            <p className="text-lg font-bold text-white">You&apos;re In.</p>
            <p className="mt-2 text-sm text-white/60">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex-1 space-y-1.5" aria-label="Iron Vault early access form">
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Name</span>
              <input
                name="name"
                type="text"
                required
                placeholder="Alex Carter"
                className="h-9 w-full rounded-lg border border-white/20 bg-white/[0.04] px-2.5 text-sm text-[#E8EDF5] placeholder:text-white/45 outline-none focus:border-[#1a56e8]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="alex@example.com"
                className="h-9 w-full rounded-lg border border-white/20 bg-white/[0.04] px-2.5 text-sm text-[#E8EDF5] placeholder:text-white/45 outline-none focus:border-[#1a56e8]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Phone</span>
              <input
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="h-9 w-full rounded-lg border border-white/20 bg-white/[0.04] px-2.5 text-sm text-[#E8EDF5] placeholder:text-white/45 outline-none focus:border-[#1a56e8]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Interest</span>
              <select
                name="interest"
                className="h-9 w-full rounded-lg border border-white/20 bg-white/[0.04] px-2.5 text-sm text-[#E8EDF5] outline-none focus:border-[#1a56e8]"
                defaultValue=""
              >
                <option value="" disabled className="bg-[#0f1220] text-white/60">Select focus area</option>
                <option value="Real Estate" className="bg-[#0f1220]">Real Estate</option>
                <option value="Digital Assets" className="bg-[#0f1220]">Digital Assets</option>
                <option value="Passive Income" className="bg-[#0f1220]">Passive Income</option>
                <option value="Education" className="bg-[#0f1220]">Education</option>
                <option value="Stablecoin / RWA" className="bg-[#0f1220]">Stablecoin / RWA</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Message</span>
              <textarea
                name="message"
                rows={2}
                placeholder="Why are you interested in Iron Vault?"
                className="w-full resize-none rounded-lg border border-white/20 bg-white/[0.04] px-2.5 py-2 text-sm text-[#E8EDF5] placeholder:text-white/45 outline-none focus:border-[#1a56e8]"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#FFD700] px-3 font-semibold text-[#08080A] shadow-[0_6px_20px_rgba(255,215,0,0.35)] transition hover:brightness-105 disabled:opacity-60"
            >
              {status === 'sending' ? (
                <><Loader2 size={14} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={14} /> Reserve My Spot</>
              )}
            </button>
          </form>
        )}
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[11px] text-white/70">
          Limited founding positions available. <span className="font-semibold text-[#FFD700]">Build the future with us.</span>
        </div>
      </div>
    </div>
  )
}
