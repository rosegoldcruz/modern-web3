"use client"

export function IronVaultCTA() {
  return (
    <section id="join" className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="rounded-2xl border border-lime-400/20 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-10 lg:p-14">
        <div className="mb-8 lg:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-lime-300">
            Early Access
          </p>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Join the Iron Vault Network
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Get early access, education, updates, and the first look at IV&ndash;SOL.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-xl">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/a8XD7fWEoYl8zKnvF9Sw"
            style={{ width: "100%", height: "649px", border: "none", borderRadius: "4px" }}
            id="inline-a8XD7fWEoYl8zKnvF9Sw"
            data-layout='{"id":"INLINE"}'
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="IVT Lead Form"
            data-height="649"
            data-layout-iframe-id="inline-a8XD7fWEoYl8zKnvF9Sw"
            data-form-id="a8XD7fWEoYl8zKnvF9Sw"
            title="IVT Lead Form"
          />
        </div>
      </div>
    </section>
  )
}
