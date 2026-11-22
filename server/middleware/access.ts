import { createError, defineEventHandler } from 'nuxt/server'

const dashboardPath = /^\/(\d{5})(?:\/|$)/

// Runs before every route handler.
export default defineEventHandler((event) => {
  const { pathname } = new URL(event.req.url ?? '/', 'http://localhost')

  // The editor moved to a hidden /<code> path. Answer the old address with a
  // plain 404 instead of a redirect so nothing points at the new location.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    throw createError({ statusCode: 404, statusText: 'Not Found' })
  }

  const code = dashboardPath.exec(pathname)?.[1]
  if (code) {
    event.res.headers.set('x-robots-tag', 'noindex, nofollow')
    event.res.headers.set('cache-control', 'private, no-store')
    event.res.headers.set('referrer-policy', 'no-referrer')
    requireAdminPath(event, code)
  }
})
