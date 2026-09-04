import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { IRON_VAULT_ROUTES } from "@/lib/iron-vault-routes"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[var(--iv-paper)] px-4 py-8 text-[var(--iv-ink)]">
      <div className="mx-auto flex w-full max-w-5xl justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)]">
        <section>
          <p className="iv-section-label">Member Access</p>
          <h1 className="mb-4 font-[var(--font-inter-tight)] text-5xl font-semibold leading-none text-[var(--iv-ink)] sm:text-6xl">Sign in to Iron Vault</h1>
          <p className="max-w-md text-sm leading-6 text-[var(--iv-ink-2)]">
            Continue with your Iron Vault account. Existing members are matched to their current access, role, and academy data after sign-in.
          </p>
          <Link href="/" className="iv-inline-link mt-8">
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
