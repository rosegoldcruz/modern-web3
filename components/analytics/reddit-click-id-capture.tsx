"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

const REDDIT_CLICK_PARAM = "rdt_cid"
const REDDIT_CLICK_COOKIE = "rdt_cid"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90

function persistClickId(clickId: string): void {
  if (!clickId) return

  const cookie = `${REDDIT_CLICK_COOKIE}=${encodeURIComponent(clickId)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`
  document.cookie = cookie
}

export function RedditClickIdCapture(): null {
  const searchParams = useSearchParams()

  useEffect(() => {
    const clickId = searchParams.get(REDDIT_CLICK_PARAM)
    if (!clickId) return

    persistClickId(clickId)
  }, [searchParams])

  return null
}
