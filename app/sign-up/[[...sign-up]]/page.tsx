import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { IRON_VAULT_ROUTES } from "@/lib/iron-vault-routes"

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-12">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)]">
        <section className="text-white">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#AAFF00]">New Member</p>
          <h1 className="mb-4 text-4xl font-semibold sm:text-5xl">Create your access</h1>
          <p className="max-w-md text-sm leading-6 text-white/70">
            Create a Clerk-backed Iron Vault account. Access and rewards remain controlled by the Iron Vault member database.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">
            Back to home
          </Link>
        </section>
        <section className="flex justify-center">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl={IRON_VAULT_ROUTES.memberPortal}
          />
        </section>
      </div>
    </main>
  )
}
