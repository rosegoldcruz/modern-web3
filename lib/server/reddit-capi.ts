import type { RedditTrackingType } from "@/lib/reddit/events"

const REDDIT_CONVERSION_ENDPOINT = "https://ads-api.reddit.com/api/v3/pixels"

export type RedditConversionPayload = {
  type: RedditTrackingType
  conversionId: string
  eventSourceUrl: string
  clickId?: string
  userAgent?: string
  ipAddress?: string
  externalId?: string
  metadata?: {
    currency?: string
    value?: number
    itemCount?: number
  }
  includeTestId?: boolean
  dataProcessingOptions?: {
    country?: string
    region?: string
    modes: string[]
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }

  return value
}

function sanitizeUrl(value: string): string {
  try {
    const url = new URL(value)
    return url.toString()
  } catch {
    return ""
  }
}

export async function postRedditConversionEvent(payload: RedditConversionPayload): Promise<Response> {
  const pixelId = requireEnv("NEXT_PUBLIC_REDDIT_PIXEL_ID")
  const accessToken = requireEnv("REDDIT_CONVERSIONS_ACCESS_TOKEN")

  const eventSourceUrl = sanitizeUrl(payload.eventSourceUrl)
  if (!eventSourceUrl) {
    throw new Error("Invalid event_source_url")
  }

  const eventBody: Record<string, unknown> = {
    event_at: Date.now(),
    action_source: "WEBSITE",
    event_source_url: eventSourceUrl,
    type: {
      tracking_type: payload.type,
    },
    metadata: {
      conversion_id: payload.conversionId,
    },
    user: {},
  }

  const metadata = eventBody.metadata as Record<string, unknown>
  if (payload.metadata?.currency) metadata.currency = payload.metadata.currency
  if (typeof payload.metadata?.value === "number") metadata.value = payload.metadata.value
  if (typeof payload.metadata?.itemCount === "number") metadata.item_count = payload.metadata.itemCount

  const user = eventBody.user as Record<string, unknown>
  if (payload.clickId) user.click_id = payload.clickId
  if (payload.userAgent) user.user_agent = payload.userAgent
  if (payload.ipAddress) user.ip_address = payload.ipAddress
  if (payload.externalId) user.external_id = payload.externalId
  if (payload.dataProcessingOptions) user.data_processing_options = payload.dataProcessingOptions
  if (Object.keys(user).length === 0) {
    delete eventBody.user
  }

  const requestBody: {
    data: {
      test_id?: string
      events: Array<Record<string, unknown>>
    }
  } = {
    data: {
      events: [eventBody],
    },
  }

  if (payload.includeTestId) {
    requestBody.data.test_id = requireEnv("REDDIT_CAPI_TEST_ID")
  }

  return fetch(`${REDDIT_CONVERSION_ENDPOINT}/${pixelId}/conversion_events`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  })
}

export function getClientIpAddress(forwardedFor: string | null): string | undefined {
  if (!forwardedFor) return undefined

  const first = forwardedFor.split(",")[0]?.trim()
  return first || undefined
}

export function getRedditClickIdFromUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url)
    const value = parsed.searchParams.get("rdt_cid")
    return value ?? undefined
  } catch {
    return undefined
  }
}
