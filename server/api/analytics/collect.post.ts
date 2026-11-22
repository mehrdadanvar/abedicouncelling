import { createError, defineEventHandler, setResponseStatus } from 'nuxt/server'
import { z } from 'zod'
import type { RequestEvent } from 'nuxt/server'
import { analyticsClickKinds, isPublicAnalyticsPath } from '../../../shared/types/analytics'
import { readBoundedBody } from '../../utils/bounded-body'
import {
  analyticsIngestAllowed,
  analyticsVisitorIp,
  normalizeAnalyticsReferrer,
  pruneAnalyticsEvents,
  recordAnalyticsEvent
} from '../../utils/analytics'

// The collector only accepts a first-party browser beacon. Every request
// must look like a same-origin POST made by this site's own script.
function originHost(origin: string) {
  try {
    return new URL(origin).host.toLowerCase()
  } catch {
    return ''
  }
}

function eventHeaders(event: RequestEvent) {
  const headers = event.req.headers
  const value = (name: string) => headers.get(name)?.toLowerCase() ?? ''
  return { host: value('host'), origin: value('origin'), dnt: value('dnt'), gpc: value('sec-gpc') }
}

function assertSameOrigin(event: RequestEvent) {
  const { host, origin } = eventHeaders(event)
  const sameSiteHeader = event.req.headers.get('x-analytics-request') === '1'
  const sameSiteFetch = event.req.headers.get('sec-fetch-site')?.toLowerCase() === 'same-origin'
  const sameSiteOrigin = Boolean(origin)
    && origin !== 'null'
    && originHost(origin) === host
    && Boolean(host)

  if (!sameSiteHeader || (!sameSiteOrigin && !sameSiteFetch)) {
    throw createError({ status: 403, statusText: 'Analytics requests must come from this site.' })
  }
}

const collectInput = z.union([
  z.object({
    type: z.literal('view'),
    path: z.string().max(200),
    referrer: z.string().max(2000).optional()
  }),
  z.object({
    type: z.literal('click'),
    path: z.string().max(200),
    kind: z.enum(analyticsClickKinds)
  })
])

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 204)
  event.res.headers.set('cache-control', 'no-store')

  assertSameOrigin(event)

  // Visitor opt-outs are honoured before anything is read or written.
  const { dnt, gpc } = eventHeaders(event)
  if (dnt === '1' || dnt === 'yes' || gpc === '1') {
    return ''
  }

  if (event.req.method !== 'POST' || !analyticsIngestAllowed(event)) {
    return ''
  }

  const body = await readBoundedBody(event, 2048)
  const parsed = collectInput.safeParse(await body.json().catch(() => null))
  if (!parsed.success) return ''

  const input = parsed.data
  if (!isPublicAnalyticsPath(input.path)) return ''

  // At most one event per request: ingestion stays bounded, and errors never
  // leak back to the page. Retention pruning piggybacks on accepted writes.
  await recordAnalyticsEvent(
    input.type === 'view'
      ? {
          type: 'view',
          path: input.path,
          referrer: input.referrer === undefined ? undefined : normalizeAnalyticsReferrer(input.referrer, eventHeaders(event).host || null)
        }
      : { type: 'click', path: input.path, kind: input.kind },
    input.type === 'view' ? analyticsVisitorIp(event) : null
  ).catch(() => {})
  pruneAnalyticsEvents().catch(() => {})

  return ''
})
