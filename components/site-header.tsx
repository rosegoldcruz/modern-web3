"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu, Briefcase, Tag, HelpCircle, FileText, Info } from "lucide-react"

export function SiteHeader() {
  const links = [
    { href: "/", label: "Home", icon: Briefcase },
    { href: "#pricing", label: "How It Works", icon: Tag },
    { href: "faq", label: "FAQ", icon: HelpCircle },
    { href: "#blog", label: "Education", icon: FileText },
    { href: "About", label: "About", icon: Info },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex min-h-20 items-center justify-between gap-6 px-6 py-3 liquid-glass-header rounded-[2rem]">
          {/* Brand Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/pwcw-logo.webp"
              alt="Commonwealth Ventures LLC logo"
              width={188}
              height={44}
              className="h-auto w-[156px] shrink-0 object-contain lg:w-[188px]"
              priority
            />
            <div className="hidden min-w-0 flex-col md:flex">
              <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-lime-300/85 lg:text-[11px]">
                Presents the Iron Vault token
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-5 text-sm text-gray-300 lg:flex xl:gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-purple-300 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex">
            <Button
              asChild
              className="bg-lime-400 text-black font-medium rounded-lg px-6 py-2.5
                         hover:bg-lime-300 hover:shadow-md hover:scale-[1.02]
                         transition-all"
            >
              <Link href="tel:8883682502">Call Us Today</Link>
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-700 bg-gray-900/80 text-gray-200 hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="liquid-glass border-gray-800 p-0 w-64 flex flex-col"
              >
                {/* Brand Header */}
                <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-4">
                  <Image
                    src="/pwcw-logo.webp"
                    alt="Commonwealth Ventures LLC logo"
                    width={160}
                    height={38}
                    className="h-auto w-[140px] object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-lime-300/85">
                      Presents Iron Vault
                    </span>
                    <span className="text-xs text-white/60">The Commonwealth Ventures token product</span>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-200">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 hover:text-purple-300 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-gray-400">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-gray-800 p-4">
                  <Button
                    asChild
                    className="w-full bg-lime-400 text-black font-medium rounded-lg px-6 py-2.5
                               hover:bg-lime-300 hover:shadow-md hover:scale-[1.02]
                               transition-all"
                  >
                    <Link href="tel:8883682502">Call Us Today</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
