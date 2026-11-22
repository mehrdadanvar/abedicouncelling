import { db } from 'hub:db'
import { and, count, desc, eq, gte, isNotNull, lt, sql } from 'drizzle-orm'
import { isIP } from 'node:net'
import type { RequestEvent } from 'nuxt/server'
import { analyticsEvents, articles } from '../db/schema'
import {
  analyticsEventRetentionDays,
  analyticsIpRetentionDays,
  isPublicAnalyticsPath
} from '../../shared/types/analytics'
import type {
  AnalyticsDailyPoint,
  AnalyticsEventInput,
  AnalyticsIpRow,
  AnalyticsPageRow,
  AnalyticsPeriodDays,
  AnalyticsReferrerRow,
  AnalyticsSeoReport
} from '../../shared/types/analytics'
import { clientIP } from './rate-limit'

// Retention is applied during ingestion at most once an hour: rows older
// than the 30 day window are deleted, and visitor IPs older than their
// shorter window are blanked while their counts stay.
const pruneIntervalMs = 60 * 60 * 1000
let lastPruneAt = 0

const dayMs = 24 * 60 * 60 * 1000

export function analyticsCutoffIso(days: number) {
  return new Date(Date.now() - days * dayMs).toISOString()
}

export async function pruneAnalyticsEvents(force = false) {
  const now = Date.now()
  if (!force && now - lastPruneAt < pruneIntervalMs) return
  lastPruneAt = now
  await db.batch([
    db.delete(analyticsEvents)
      .where(lt(analyticsEvents.createdAt, analyticsCutoffIso(analyticsEventRetentionDays))),
    db.update(analyticsEvents)
      .set({ ip: null })
      .where(and(
        isNotNull(analyticsEvents.ip),
        lt(analyticsEvents.createdAt, analyticsCutoffIso(analyticsIpRetentionDays))
      ))
  ])
}

// Normalises the browser's document.referrer to an external hostname only.
// Empty, internal and unusable values all become `direct` so the dashboard
// never stores full referrer URLs.
export function normalizeAnalyticsReferrer(raw: unknown, host: string | null) {
  if (typeof raw !== 'string' || raw.length > 2000) return 'direct'
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return 'direct'
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'direct'
  const hostname = url.hostname.toLowerCase()
  if (!hostname.includes('.') || /^(10\.|127\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(hostname)) {
    return 'direct'
  }
  if (host && hostname === host.toLowerCase().split(':')[0]) return 'direct'
  return hostname
}

// The visitor address comes from the proxy chain (x-forwarded-for) and is
// validated before it is stored in full. Invalid or missing values stay null.
export function analyticsVisitorIp(event: RequestEvent) {
  const raw = clientIP(event)
  if (!raw || raw === 'unknown') return null
  const value = raw.trim().replace(/^\[(.+)\](?:%\w+)?$/, '$1').replace(/%\w+$/, '').slice(0, 45)
  return isIP(value) ? value.toLowerCase() : null
}

// Sliding window limiter for ingestion. Kept in memory like the sign-in
// limiter; a restart clears it and a restart is the only loss.
const ingestWindowMs = 15 * 60 * 1000
const ingestMaxEvents = 120
const ingestBuckets = new Map<string, number[]>()

function pruneIngestBuckets(now: number) {
  for (const [bucket, times] of ingestBuckets) {
    const recent = times.filter(time => now - time < ingestWindowMs)
    if (recent.length) ingestBuckets.set(bucket, recent)
    else ingestBuckets.delete(bucket)
  }
}

export function analyticsIngestAllowed(event: RequestEvent) {
  const ip = clientIP(event)
  const now = Date.now()
  pruneIngestBuckets(now)
  const times = ingestBuckets.get(ip) ?? []
  if (times.length >= ingestMaxEvents) return false
  ingestBuckets.set(ip, [...times, now])
  return true
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput, ip: string | null) {
  if (!isPublicAnalyticsPath(input.path)) return
  await db.insert(analyticsEvents).values({
    type: input.type,
    path: input.path,
    kind: input.type === 'click' ? input.kind : null,
    referrer: input.type === 'view' ? input.referrer ?? null : null,
    ip,
    createdAt: new Date().toISOString()
  })
}

const day = sql<string>`substr(${analyticsEvents.createdAt}, 1, 10)`

export async function getAnalyticsSummary(days: AnalyticsPeriodDays) {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const cutoff = new Date(today.getTime() - (days - 1) * dayMs).toISOString()
  const ipCutoff = analyticsCutoffIso(analyticsIpRetentionDays)
  const inWindow = gte(analyticsEvents.createdAt, cutoff)
  const views = eq(analyticsEvents.type, 'view')
  const clicks = eq(analyticsEvents.type, 'click')

  const [totalsViews, totalsClicks, bookingClicks, viewDays, clickDays, pageViews, pageClicks, referrers, ipRows] = await db.batch([
    db.select({ total: count() }).from(analyticsEvents).where(and(inWindow, views)),
    db.select({ total: count() }).from(analyticsEvents).where(and(inWindow, clicks)),
    db.select({ total: count() }).from(analyticsEvents).where(and(inWindow, clicks, eq(analyticsEvents.kind, 'booking'))),
    db.select({ date: day, total: count() }).from(analyticsEvents)
      .where(and(inWindow, views)).groupBy(day),
    db.select({ date: day, total: count() }).from(analyticsEvents)
      .where(and(inWindow, clicks)).groupBy(day),
    db.select({ path: analyticsEvents.path, total: count() }).from(analyticsEvents)
      .where(and(inWindow, views)).groupBy(analyticsEvents.path).orderBy(desc(count())),
    db.select({ path: analyticsEvents.path, total: count() }).from(analyticsEvents)
      .where(and(inWindow, clicks)).groupBy(analyticsEvents.path).orderBy(desc(count())),
    db.select({ referrer: analyticsEvents.referrer, total: count() }).from(analyticsEvents)
      .where(and(inWindow, views, isNotNull(analyticsEvents.referrer)))
      .groupBy(analyticsEvents.referrer).orderBy(desc(count())).limit(12),
    db.select({ ip: analyticsEvents.ip, total: count() }).from(analyticsEvents)
      .where(and(gte(analyticsEvents.createdAt, ipCutoff), views, isNotNull(analyticsEvents.ip)))
      .groupBy(analyticsEvents.ip).orderBy(desc(count())).limit(12)
  ])

  const daily = fillAnalyticsDays(days, today, viewDays, clickDays)
  const pages = joinAnalyticsPages(pageViews, pageClicks)

  return {
    days,
    views: Number(totalsViews[0]?.total ?? 0),
    clicks: Number(totalsClicks[0]?.total ?? 0),
    bookingClicks: Number(bookingClicks[0]?.total ?? 0),
    daily,
    pages,
    referrers: referrers.map(row => ({ referrer: row.referrer!, views: Number(row.total) })) satisfies AnalyticsReferrerRow[],
    ips: ipRows.map(row => ({ ip: row.ip!, views: Number(row.total) })) satisfies AnalyticsIpRow[]
  }
}

// Every day in the window appears once, including days without traffic.
function fillAnalyticsDays(
  days: AnalyticsPeriodDays,
  today: Date,
  viewDays: { date: string, total: number }[],
  clickDays: { date: string, total: number }[]
): AnalyticsDailyPoint[] {
  const viewsByDay = new Map(viewDays.map(row => [row.date, Number(row.total)]))
  const clicksByDay = new Map(clickDays.map(row => [row.date, Number(row.total)]))
  const points: AnalyticsDailyPoint[] = []
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date(today.getTime() - offset * dayMs).toISOString().slice(0, 10)
    points.push({ date, views: viewsByDay.get(date) ?? 0, clicks: clicksByDay.get(date) ?? 0 })
  }
  return points
}

function joinAnalyticsPages(
  viewRows: { path: string, total: number }[],
  clickRows: { path: string, total: number }[]
): AnalyticsPageRow[] {
  const pages = new Map<string, AnalyticsPageRow>()
  for (const row of viewRows) {
    pages.set(row.path, { path: row.path, views: Number(row.total), clicks: 0 })
  }
  for (const row of clickRows) {
    const existing = pages.get(row.path)
    if (existing) existing.clicks = Number(row.total)
    else pages.set(row.path, { path: row.path, views: 0, clicks: Number(row.total) })
  }
  return [...pages.values()].sort((a, b) => b.views - a.views || b.clicks - a.clicks)
}

// Actionable SEO checks for published articles: whether the explicit SEO
// fields the editor offers were filled in. Public pages fall back to the
// title, excerpt and cover image, so a check here is a refinement, not an
// error on the live page.
export async function getArticleSeoReport(): Promise<AnalyticsSeoReport> {
  const rows = await db.select({
    id: articles.id,
    slug: articles.slug,
    published: articles.published,
    publishedOn: articles.publishedOn
  }).from(articles).where(isNotNull(articles.publishedOn))

  const checks = rows
    .filter(row => row.published)
    .map(row => ({
      id: row.id,
      slug: row.slug,
      title: row.published!.title,
      publishedOn: row.publishedOn,
      missingSeoTitle: !row.published!.seoTitle,
      missingMetaDescription: !row.published!.metaDescription,
      missingCoverAlt: Boolean(row.published!.coverImage) && !row.published!.coverImageAlt
    }))
    .filter(row => row.missingSeoTitle || row.missingMetaDescription || row.missingCoverAlt)
    .sort((a, b) => (b.publishedOn ?? '').localeCompare(a.publishedOn ?? ''))

  return { checks, sitemapPath: '/sitemap.xml' }
}

export function analyticsPeriod(event: RequestEvent): AnalyticsPeriodDays {
  const raw = new URL(event.req.url ?? '/', 'http://localhost').searchParams.get('days')
  return raw === '30' ? 30 : 7
}
