"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ComponentType, type ReactNode } from 'react'
import {
  LayoutDashboard,
  Network,
  Trophy,
  LifeBuoy,
  UserCircle2,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react'
import { useBackofficeAuth } from '@/hooks/useBackofficeAuth'
import { cn } from '@/lib/utils'

type BackofficeLayoutProps = {
  children: ReactNode
}

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/learn/dashboard', label: 'Academy', icon: GraduationCap },
  { href: '/learn/backoffice', label: 'Overview', icon: LayoutDashboard },
  { href: '/learn/backoffice/network', label: 'Network', icon: Network },
  { href: '/learn/backoffice/positions', label: 'Position Matrix', icon: Trophy },
  { href: '/learn/backoffice/status', label: 'Status Desk', icon: LifeBuoy },
  { href: '/learn/backoffice/account', label: 'Account', icon: UserCircle2 },
]

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/learn/dashboard' && pathname.startsWith(`${item.href}/`))

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive
                ? 'bg-lime-300/15 text-lime-200 border border-lime-300/30'
                : 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent',
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function BackofficeLayout({ children }: BackofficeLayoutProps) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { profile } = useBackofficeAuth()

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgba(170,255,0,0.10),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(123,47,190,0.12),transparent_30%),linear-gradient(180deg,#050507_0%,#0a0b0f_100%)]" />

      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
        <div className="flex h-full w-full flex-col p-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Iron Vault</p>
            <h1 className="mt-2 text-lg font-semibold text-zinc-100">User Backoffice</h1>
          </div>
          <NavLinks pathname={pathname} />
          <div className="mt-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">Current tier</p>
            <p className="text-sm text-zinc-100">{profile?.current_tier ?? 'MEMBER'}</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur">
          <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 text-zinc-200 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="hidden lg:block">
              <p className="text-sm text-zinc-200">{profile?.email ?? 'No email on file'}</p>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <span className="rounded-md border border-zinc-700 px-2.5 py-1 text-zinc-200">
                {profile?.role ?? 'MEMBER'}
              </span>
              <span className="rounded-md border border-lime-300/30 bg-lime-300/10 px-2.5 py-1 text-lime-200">
                XP {profile?.vault_xp?.toLocaleString() ?? '0'}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation overlay"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] border-r border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-lime-300">Iron Vault</p>
                <p className="mt-2 text-lg font-semibold">Backoffice</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 text-zinc-200"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm">
              <p className="text-zinc-100">{profile?.email ?? 'No email on file'}</p>
              <p className="mt-1 text-zinc-400">{profile?.role ?? 'MEMBER'} · {profile?.current_tier ?? 'MEMBER'}</p>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
