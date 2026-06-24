import { NextRequest, NextResponse } from "next/server"
import { REDDIT_TRACKING_TYPES, createRedditConversionId } from "@/lib/reddit/events"
import { getClientIpAddress, postRedditConversionEvent } from "@/lib/server/reddit-capi"

function isDebugEnabled(): boolean {
  const explicitDebug = process.env.REDDIT_CAPI_DEBUG?.trim().toLowerCase() === "true"
  return process.env.NODE_ENV !== "production" || explicitDebug
}

function getBaseUrl(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (configured) return configured

  const origin = request.nextUrl.origin
  if (origin) return origin

  throw new Error("Missing required env var: NEXT_PUBLIC_BASE_URL")
}

export async function POST(request: NextRequest) {
  if (!isDebugEnabled()) {
    return NextResponse.json({ error: "Debug endpoint disabled in production" }, { status: 403 })
  }

  try {
    const userAgent = request.headers.get("user-agent") ?? undefined
    const ipAddress = getClientIpAddress(request.headers.get("x-forwarded-for"))
    const eventSourceUrl = `${getBaseUrl(request)}/`

    const response = await postRedditConversionEvent({
      type: REDDIT_TRACKING_TYPES.PAGE_VISIT,
      conversionId: createRedditConversionId(),
      eventSourceUrl,
      userAgent,
      ipAddress,
      includeTestId: true,
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Reddit debug event failed",
          redditStatus: response.status,
          redditResponse: payload,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, redditResponse: payload })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reddit debug event failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
