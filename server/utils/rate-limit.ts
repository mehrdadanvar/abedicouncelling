import { getRequestIP } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'

// In-memory sliding window of failed attempts, one list per bucket and client
// IP. A single-server deployment shares one limiter; a restart clears it.
const windowMs = 15 * 60 * 1000
const maxFailures = 5

const failures = new Map<string, number[]>()

export function clientIP(event: RequestEvent) {
  const forwarded = getRequestIP(event, { xForwardedFor: true }) ?? ''
  return forwarded.split(',')[0]?.trim() || getRequestIP(event) || 'unknown'
}

function key(kind: string, ip: string) {
  return `${kind}:${ip}`
}

function prune(now: number) {
  for (const [bucket, attempts] of failures) {
    const recent = attempts.filter(time => now - time < windowMs)
    if (recent.length) {
      failures.set(bucket, recent)
    } else {
      failures.delete(bucket)
    }
  }
}

export function isThrottled(kind: string, ip: string) {
  prune(Date.now())
  const attempts = failures.get(key(kind, ip))
  return Boolean(attempts && attempts.length >= maxFailures)
}

export function recordFailure(kind: string, ip: string) {
  const bucket = key(kind, ip)
  failures.set(bucket, [...failures.get(bucket) ?? [], Date.now()])
}

export function clearFailures(kind: string, ip: string) {
  failures.delete(key(kind, ip))
}
