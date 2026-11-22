import { defineEventHandler, getQuery } from 'nuxt/server'

// Check the code during client-side navigation, which bypasses Nitro pages.
export default defineEventHandler((event) => {
  event.res.headers.set('Cache-Control', 'private, no-store')

  requireAdminPath(event, getQuery(event).code)
  return { valid: true }
})
