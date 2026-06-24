import { cookies, headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { REDDIT_TRACKING_TYPES, type RedditTrackingType } from "@/lib/reddit/events"
import { getClientIpAddress, MissingRedditCapiEnvError, postRedditConversionEvent } from "@/lib/server/reddit-capi"

type RequestBody = {
  type: RedditTrackingType
  conversionId: string
  eventSourceUrl: string
  metadata?: {
    currency?: string
    value?: number
    itemCount?: number
  }
}

const REDDIT_CLICK_COOKIE = "rdt_cid"

function logRedditConversion(message: string, details: Record<string, unknown>): void {
  console.warn("[reddit-conversion]", message, details)
}

function isValidTrackingType(value: string): value is RedditTrackingType {
  return Object.values(REDDIT_TRACKING_TYPES).includes(value as RedditTrackingType)
}

export async function POST(request: NextRequest) {
  let body: RequestBody

  try {
    body = (await request.json()) as RequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.type || !isValidTrackingType(body.type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
  }

  if (!body.conversionId) {
    return NextResponse.json({ error: "Missing conversionId" }, { status: 400 })
  }

  if (!body.eventSourceUrl) {
    return NextResponse.json({ error: "Missing eventSourceUrl" }, { status: 400 })
  }

  try {
    const headerStore = await headers()
    const cookieStore = await cookies()

    const userAgent = headerStore.get("user-agent") ?? undefined
    const ipAddress = getClientIpAddress(headerStore.get("x-forwarded-for"))
    const clickId = cookieStore.get(REDDIT_CLICK_COOKIE)?.value

    const response = await postRedditConversionEvent({
      type: body.type,
      conversionId: body.conversionId,
      eventSourceUrl: body.eventSourceUrl,
      metadata: body.metadata,
      clickId,
      userAgent,
      ipAddress,
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      logRedditConversion("Reddit CAPI rejected conversion event", {
        redditStatus: response.status,
        redditResponse: payload,
      })

      return NextResponse.json(
        {
          error: "Failed to post conversion event",
          redditStatus: response.status,
          redditResponse: payload,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, redditResponse: payload })
  } catch (error) {
    if (error instanceof MissingRedditCapiEnvError) {
      logRedditConversion("Reddit CAPI disabled because required env is missing", {
        missingEnv: error.envName,
      })

      return new NextResponse(null, { status: 204 })
    }

    const message = error instanceof Error ? error.message : "Failed to post conversion event"
    logRedditConversion("Reddit CAPI conversion event failed", {
      message,
    })

    return NextResponse.json({ error: message }, { status: 502 })
  }
}
