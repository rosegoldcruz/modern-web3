"use client"

import type { ReactElement } from "react"
import { Suspense } from "react"
import { RedditClickIdCapture } from "@/components/analytics/reddit-click-id-capture"
import { RedditPixelBase } from "@/components/analytics/reddit-pixel"
import { RedditRouteEvents } from "@/components/analytics/reddit-route-events"

export function RedditTrackingProvider(): ReactElement {
  const isConfigured = Boolean(process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID?.trim())
  if (!isConfigured) return <></>

  return (
    <>
      <RedditPixelBase />
      <Suspense fallback={null}>
        <RedditClickIdCapture />
      </Suspense>
      <Suspense fallback={null}>
        <RedditRouteEvents />
      </Suspense>
    </>
  )
}
