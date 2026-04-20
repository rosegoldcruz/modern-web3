import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/how-it-works(.*)", "/faq(.*)", "/about(.*)"])
const isLearnRoute = createRouteMatcher(["/learn(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isLearnRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
