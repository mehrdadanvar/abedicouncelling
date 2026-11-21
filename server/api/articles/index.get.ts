import { createError, defineEventHandler, getQuery } from 'nuxt/server'

export default defineEventHandler((event) => {
  const page = Number(getQuery(event).page ?? 1)
  if (!Number.isSafeInteger(page) || page < 1 || page > 1_000_000) {
    throw createError({ status: 404, statusText: 'Article page not found' })
  }
  return listPublishedArticles(page)
})
