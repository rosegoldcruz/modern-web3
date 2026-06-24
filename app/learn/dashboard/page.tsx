"use client"

import { useEffect } from "react"
import { trackRedditEvent } from "@/lib/reddit/client"
import { createRedditConversionId, REDDIT_TRACKING_TYPES } from "@/lib/reddit/events"

const MEMBER_DASHBOARD_URL = "https://member.ironvaulttoken.com/dashboard"

export default function LearnDashboardPage() {
  useEffect(() => {
    let cancelled = false

    async function trackPurchaseIfApplicable() {
      const query = new URLSearchParams(window.location.search)
      const payment = query.get("payment")
      const conversionIdFromQuery = query.get("reddit_conversion_id")

      if (payment === "success") {
        const conversionId = conversionIdFromQuery || createRedditConversionId()
        await trackRedditEvent({
          type: REDDIT_TRACKING_TYPES.PURCHASE,
          conversionId,
          eventSourceUrl: window.location.href,
        })
      }

      if (!cancelled) {
        window.location.replace(MEMBER_DASHBOARD_URL)
      }
    }

    void trackPurchaseIfApplicable()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
