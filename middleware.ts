import { NextResponse, type NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const url = request.nextUrl.clone()

  // Route sales.ironvaulttoken.com → /sales (public, no auth)
  if (hostname.startsWith("sales.")) {
    url.pathname = `/sales${url.pathname === "/" ? "" : url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
