import { z } from 'zod'
import { createError, defineEventHandler } from 'nuxt/server'

const credentials = z.object({
  code: z.string().regex(/^\d{5}$/),
  email: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(256)
})

export default defineEventHandler(async (event) => {
  event.res.headers.set('Cache-Control', 'private, no-store')
  if (event.req.headers.get('x-cms-request') !== '1') {
    throw createError({ status: 403, statusText: 'Invalid editor request' })
  }

  const admin = adminEnv()
  if (!admin.email || !admin.password || !admin.pathCode) {
    throw createError({ status: 500, statusText: 'Sign-in is not configured.' })
  }

  const ip = clientIP(event)
  if (isThrottled('sign-in', ip)) {
    throw createError({ status: 429, statusText: 'Too many failed attempts. Try again later.' })
  }

  const body = await readBoundedBody(event, 4096)
  const input = credentials.safeParse(await body.json().catch(() => null))
  if (!input.success || !safeEqual(input.data.code, admin.pathCode) || !isAdminEmail(input.data.email) || !safeEqual(input.data.password, admin.password)) {
    recordFailure('sign-in', ip)
    throw createError({ status: 401, statusText: 'Invalid sign-in details.' })
  }

  clearFailures('sign-in', ip)
  await replaceUserSession(event, { user: { email: admin.email } })
  return { signedIn: true }
})
