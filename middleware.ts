import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"

export default clerkMiddleware((_auth, request: NextRequest) => {
  const hostname = request.headers.get("host") ?? ""
  const url = request.nextUrl.clone()

  // Route sales.ironvaulttoken.com → /sales (public, no auth)
  if (hostname.startsWith("sales.")) {
    url.pathname = `/sales${url.pathname === "/" ? "" : url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Route docs.ironvaulttoken.com → /docs or /swap (public, no auth)
  if (hostname.startsWith("docs.")) {
    // /swap on docs subdomain should serve /swap directly
    if (url.pathname === "/swap" || url.pathname.startsWith("/swap/")) {
      return NextResponse.rewrite(url)
    }
    // Everything else on docs subdomain should be under /docs
    url.pathname = `/docs${url.pathname === "/" ? "" : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
}
