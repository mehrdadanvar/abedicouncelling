// Shapes shared by the analytics collector (browser), the ingest endpoint
// (server) and the dashboard. Only aggregate counts leave the database; no
// query strings, hashes, page text, destination URLs or raw headers are kept.

// Public page paths that analytics counts. Keep in sync with the service
// routes in app/data/services.ts and the pages under app/pages.
export const analyticsServicePaths = [
  '/individual-counselling',
  '/couples-counselling',
  '/family-counselling',
  '/cvap-counselling',
  '/icbc-counselling'
] as const

export const analyticsStaticPaths = ['/', '/about', '/blog'] as const

export const analyticsSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const analyticsMaxSlugLength = 120

export function isPublicAnalyticsPath(path: string) {
  if (path.includes('?') || path.includes('#') || path.length > 200) return false
  if ((analyticsStaticPaths as readonly string[]).includes(path)) return true
  if ((analyticsServicePaths as readonly string[]).includes(path)) return true
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length)
    return slug.length >= 1
      && slug.length <= analyticsMaxSlugLength
      && analyticsSlugPattern.test(slug)
  }
  return false
}

// The external booking service the CTAs point at. Keep in sync with
// site.booking in app/data/site.ts.
export const analyticsBookingHost = 'aubadecounselling.janeapp.com'

export const analyticsClickKinds = ['internal', 'external', 'booking', 'contact', 'button'] as const
export type AnalyticsClickKind = typeof analyticsClickKinds[number]

// Visitor privacy opt-outs honoured before anything is sent or stored.
export function analyticsOptedOut(clientState: { doNotTrack?: string | null, globalPrivacyControl?: boolean | null }) {
  return clientState.doNotTrack === '1' || clientState.doNotTrack === 'yes' || clientState.globalPrivacyControl === true
}

export interface AnalyticsViewEvent {
  type: 'view'
  path: string
  referrer?: string
}

export interface AnalyticsClickEvent {
  type: 'click'
  path: string
  kind: AnalyticsClickKind
}

export type AnalyticsEventInput = AnalyticsViewEvent | AnalyticsClickEvent

// How long data stays in the single analytics_events table.
export const analyticsEventRetentionDays = 30
// Visitor IPs are kept for a shorter window, then removed while the page,
// referrer and click counts stay for the full 30 days.
export const analyticsIpRetentionDays = 7

export type AnalyticsPeriodDays = 7 | 30

export interface AnalyticsDailyPoint {
  date: string
  views: number
  clicks: number
}

export interface AnalyticsPageRow {
  path: string
  views: number
  clicks: number
}

export interface AnalyticsReferrerRow {
  referrer: string
  views: number
}

// Aggregate view counts per visitor IP. IPs are only ever shown in this
// overall breakdown, never paired with the pages a visitor opened.
export interface AnalyticsIpRow {
  ip: string
  views: number
}

export interface AnalyticsArticleSeoCheck {
  id: number
  slug: string
  title: string
  publishedOn: string | null
  missingSeoTitle: boolean
  missingMetaDescription: boolean
  missingCoverAlt: boolean
}

export interface AnalyticsSeoReport {
  checks: AnalyticsArticleSeoCheck[]
  sitemapPath: string
}

export interface AnalyticsSummary {
  days: AnalyticsPeriodDays
  views: number
  clicks: number
  bookingClicks: number
  daily: AnalyticsDailyPoint[]
  pages: AnalyticsPageRow[]
  referrers: AnalyticsReferrerRow[]
  ips: AnalyticsIpRow[]
  seo: AnalyticsSeoReport
}
