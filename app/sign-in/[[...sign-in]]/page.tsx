import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { IRON_VAULT_ROUTES } from "@/lib/iron-vault-routes"

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-12">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)]">
        <section className="text-white">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#AAFF00]">Member Access</p>
          <h1 className="mb-4 text-4xl font-semibold sm:text-5xl">Sign in to Iron Vault</h1>
          <p className="max-w-md text-sm leading-6 text-white/70">
            Continue with your Iron Vault account. Existing members are matched to their current access, role, and academy data after sign-in.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">
            Back to home
          </Link>
        </section>
        <section className="flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl={IRON_VAULT_ROUTES.memberPortal}
          />
        </section>
      </div>
    </main>
  )
}
