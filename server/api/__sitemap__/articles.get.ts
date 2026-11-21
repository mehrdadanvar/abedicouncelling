import { defineSitemapEventHandler } from '#sitemap/server'
import { db } from 'hub:db'
import { isNotNull } from 'drizzle-orm'
import { articles } from '../../db/schema'

export default defineSitemapEventHandler(async () => {
  const posts = await db.select({ slug: articles.slug }).from(articles).where(isNotNull(articles.publishedOn))
  return posts.map(({ slug }) => ({ loc: `/blog/${slug}` }))
})
