import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Subdomain / custom-domain routing
 *
 * member.ironvaulttoken.com  →  /learn/member  (unlocked, founding members)
 * All other hosts            →  pass through as normal
 *
 * Vercel setup:
 *   1. Add "member.ironvaulttoken.com" as a custom domain on the Vercel project
 *   2. Point DNS: CNAME member → cname.vercel-dns.com (or the A record Vercel gives you)
 *   3. That's it — this middleware handles the rest automatically
 */

const MEMBER_HOSTS = [
  "member.ironvaulttoken.com",
  // Add preview/staging aliases here if needed:
  // "member-preview.ironvaulttoken.com",
]

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const isMemberDomain = MEMBER_HOSTS.some((h) => hostname === h || hostname.startsWith(h + ":"))

  if (isMemberDomain) {
    const { pathname } = request.nextUrl

    // Already on an internal path — don't loop
    if (pathname.startsWith("/learn/member")) {
      return NextResponse.next()
    }

    // Rewrite the root (and any path) to /learn/member
    const url = request.nextUrl.clone()
    url.pathname = "/learn/member"
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
