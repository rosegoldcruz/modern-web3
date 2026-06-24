"use client"

import { REDDIT_PIXEL_EVENT_NAMES, type RedditTrackMetadata, type RedditTrackingType } from "@/lib/reddit/events"

declare global {
  interface Window {
    rdt?: {
      (...args: unknown[]): void
      callQueue?: unknown[]
      sendEvent?: (...args: unknown[]) => void
    }
  }
}

type TrackRedditOptions = {
  type: RedditTrackingType
  conversionId: string
  eventSourceUrl?: string
  metadata?: Omit<RedditTrackMetadata, "conversionId">
  includeCapi?: boolean
}

function hasPixel(): boolean {
  return typeof window !== "undefined" && typeof window.rdt === "function"
}

function isRedditConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID?.trim())
}

export async function trackRedditEvent({
  type,
  conversionId,
  eventSourceUrl,
  metadata,
  includeCapi = true,
}: TrackRedditOptions): Promise<void> {
  if (typeof window === "undefined") return
  if (!isRedditConfigured()) return

  const pixelEventName = REDDIT_PIXEL_EVENT_NAMES[type]

  if (hasPixel()) {
    const pixelPayload: RedditTrackMetadata = {
      conversionId,
      ...metadata,
    }
    window.rdt?.("track", pixelEventName, pixelPayload)
  }

  if (!includeCapi) return

  try {
    await fetch("/api/reddit/conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        conversionId,
        eventSourceUrl: eventSourceUrl ?? window.location.href,
        metadata,
      }),
      keepalive: true,
    })
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[reddit-conversion] Failed to post CAPI event", error instanceof Error ? error.message : error)
    }
  }
}
