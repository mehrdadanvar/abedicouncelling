import {
  analyticsBookingHost,
  analyticsOptedOut,
  isPublicAnalyticsPath
} from '#shared/types/analytics'
import type { AnalyticsClickKind, AnalyticsEventInput } from '#shared/types/analytics'

// First-party page view and click counting for the public site. Nothing is
// sent when the visitor opts out with DNT or Global Privacy Control, and the
// payloads carry only the page path and a coarse click kind — never query
// strings, hashes, page text, destination URLs or form values.
export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()
  const pagePath = () => route.path.replace(/\/+$/, '') || '/'

  // Error pages (including 404s for article slugs) are never counted.
  const trackable = () => !nuxtApp.payload.error && isPublicAnalyticsPath(pagePath())

  const optedOut = () => analyticsOptedOut({
    doNotTrack: navigator.doNotTrack ?? (window as typeof window & { doNotTrack?: string | null }).doNotTrack ?? null,
    globalPrivacyControl: (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl ?? null
  })

  const send = (payload: AnalyticsEventInput, keepalive = false) => {
    if (optedOut()) return
    $fetch('/api/analytics/collect', {
      method: 'POST',
      headers: { 'x-analytics-request': '1' },
      body: payload,
      keepalive,
      ignoreResponseError: true
    }).catch(() => {})
  }

  // Only document loads contribute referrers. Send the origin without
  // the external address's path, query or fragment.
  let firstViewOfDocument = true

  nuxtApp.hook('page:finish', () => {
    if (!trackable()) return
    send({
      type: 'view',
      path: pagePath(),
      referrer: firstViewOfDocument
        ? (document.referrer ? new URL(document.referrer).origin : '')
        : undefined
    })
    firstViewOfDocument = false
  })

  let lastClickKey = ''
  let lastClickAt = 0

  function clickKind(anchor: HTMLAnchorElement | null, button: HTMLElement | null): AnalyticsClickKind | null {
    if (anchor) {
      const href = anchor.getAttribute('href')?.trim() ?? ''
      if (/^(mailto:|tel:)/i.test(href)) return 'contact'
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) {
        return url.host === analyticsBookingHost ? 'booking' : 'external'
      }
      return 'internal'
    }
    if (button) return 'button'
    return null
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    if (!trackable()) return

    const target = event.target instanceof Element ? event.target : null
    const anchor = target?.closest<HTMLAnchorElement>('a[href]') ?? null
    const button = anchor ? null : target?.closest<HTMLElement>('button, [role="button"]') ?? null
    const kind = clickKind(anchor, button)
    if (!kind) return

    // Ignore the second click of a double click on the same control.
    const key = `${kind}:${anchor?.href ?? ''}`
    const now = Date.now()
    if (key === lastClickKey && now - lastClickAt < 800) return
    lastClickKey = key
    lastClickAt = now

    send({ type: 'click', path: pagePath(), kind }, true)
  }, { capture: true, passive: true })
})
