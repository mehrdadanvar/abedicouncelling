import { createHash, timingSafeEqual } from 'node:crypto'
import { createError } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'

// Server-only credentials. They are read from the process environment at
// request time so production never embeds them in the client bundle or
// the runtime config payload, and local development can use .env.
export function adminEnv() {
  return {
    email: (process.env.ADMIN_EMAIL ?? '').trim(),
    password: process.env.ADMIN_PASS ?? '',
    pathCode: (process.env.ADMIN_PATH_CODE ?? '').trim()
  }
}

// Compares two strings without leaking their length or the position of the
// first differing byte. Hashing first normalises both sides to equal length.
export function safeEqual(left: string, right: string) {
  const leftHash = createHash('sha256').update(left).digest()
  const rightHash = createHash('sha256').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

export function requireAdminPath(event: RequestEvent, code: unknown) {
  const configuredCode = adminEnv().pathCode
  if (typeof code !== 'string' || !/^\d{5}$/.test(code) || !configuredCode) {
    throw createError({ status: 404, statusText: 'Not Found' })
  }

  const ip = clientIP(event)
  if (isThrottled('path-code', ip)) {
    throw createError({ status: 404, statusText: 'Not Found' })
  }
  if (!safeEqual(code, configuredCode)) {
    recordFailure('path-code', ip)
    throw createError({ status: 404, statusText: 'Not Found' })
  }
  clearFailures('path-code', ip)
}
