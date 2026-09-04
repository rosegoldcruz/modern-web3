import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { IRON_VAULT_ROUTES } from "@/lib/iron-vault-routes"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[var(--iv-paper)] px-4 py-8 text-[var(--iv-ink)]">
      <div className="mx-auto flex w-full max-w-5xl justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)]">
        <section>
          <p className="iv-section-label">New Member</p>
          <h1 className="mb-4 font-[var(--font-inter-tight)] text-5xl font-semibold leading-none text-[var(--iv-ink)] sm:text-6xl">Create your access</h1>
          <p className="max-w-md text-sm leading-6 text-[var(--iv-ink-2)]">
            Create a Clerk-backed Iron Vault account. Access and rewards remain controlled by the Iron Vault member database.
          </p>
          <Link href="/" className="iv-inline-link mt-8">
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
