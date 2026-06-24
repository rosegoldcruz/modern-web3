"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { createRedditConversionId, REDDIT_TRACKING_TYPES } from "@/lib/reddit/events"
import { trackRedditEvent } from "@/lib/reddit/client"

const VIEW_CONTENT_ROUTES = new Set(["/", "/learn", "/learn/pay"])

function hasTrackingConsent(): boolean {
  // TODO: Wire this check to a real consent signal if a consent banner is introduced.
  return true
}

export function RedditRouteEvents(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || !hasTrackingConsent()) return

    const search = searchParams.toString()
    const eventSourceUrl = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`

    const pageVisitConversionId = createRedditConversionId()
    void trackRedditEvent({
      type: REDDIT_TRACKING_TYPES.PAGE_VISIT,
      conversionId: pageVisitConversionId,
      eventSourceUrl,
    })

    if (VIEW_CONTENT_ROUTES.has(pathname)) {
      const viewContentConversionId = createRedditConversionId()
      void trackRedditEvent({
        type: REDDIT_TRACKING_TYPES.VIEW_CONTENT,
        conversionId: viewContentConversionId,
        eventSourceUrl,
      })
    }
  }, [pathname, searchParams])

  return null
}
