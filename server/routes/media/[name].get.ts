import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { db } from 'hub:db'
import { sql } from 'drizzle-orm'
import { createError, defineEventHandler, getRouterParam, useRuntimeConfig } from 'nuxt/server'
import { articles } from '../../db/schema'

export default defineEventHandler(async (event) => {
  // The same URL may serve a private preview before the article goes live.
  event.res.headers.set('Cache-Control', 'private, no-store')
  const name = getRouterParam(event, 'name') ?? ''
  if (!uploadedImageName.test(name)) {
    throw createError({ status: 404, statusText: 'Image not found' })
  }

  const path = `/media/${name}`
  const published = await db.select({ id: articles.id }).from(articles)
    .where(sql`json_extract(${articles.published}, '$.coverImage') = ${path} or exists (
      select 1 from json_each(${articles.published}, '$.inlineImages') where value = ${path}
    )`).get()

  if (!published) {
    const { user } = await getUserSession(event)
    if (!isAdminEmail(user?.email)) {
      throw createError({ status: 404, statusText: 'Image not found' })
    }
  }

  const image = await readFile(join(useRuntimeConfig().cms.uploadsDir, name)).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      throw createError({ status: 404, statusText: 'Image not found' })
    }
    throw error
  })
  event.res.headers.set('Content-Type', 'image/webp')
  event.res.headers.set('X-Content-Type-Options', 'nosniff')
  return image
})
