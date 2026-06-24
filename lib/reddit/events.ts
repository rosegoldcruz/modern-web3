export const REDDIT_TRACKING_TYPES = {
  PAGE_VISIT: "PAGE_VISIT",
  VIEW_CONTENT: "VIEW_CONTENT",
  LEAD: "LEAD",
  SIGN_UP: "SIGN_UP",
  PURCHASE: "PURCHASE",
} as const

export type RedditTrackingType = (typeof REDDIT_TRACKING_TYPES)[keyof typeof REDDIT_TRACKING_TYPES]

// Reddit CAPI v3 uses SCREAMING_SNAKE_CASE tracking_type values, while Pixel uses PascalCase event names.
export const REDDIT_PIXEL_EVENT_NAMES: Record<RedditTrackingType, string> = {
  PAGE_VISIT: "PageVisit",
  VIEW_CONTENT: "ViewContent",
  LEAD: "Lead",
  SIGN_UP: "SignUp",
  PURCHASE: "Purchase",
}

export type RedditTrackMetadata = {
  conversionId: string
  currency?: string
  value?: number
  itemCount?: number
  customEventName?: string
}

export function createRedditConversionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}
