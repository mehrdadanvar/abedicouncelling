import { defineSitemapEventHandler } from '#sitemap/server'
import { db } from 'hub:db'
import { isNotNull } from 'drizzle-orm'
import { articles } from '../../db/schema'

export default defineSitemapEventHandler(async () => {
  const posts = await db.select({
    slug: articles.slug,
    publishedOn: articles.publishedOn,
    modifiedAt: articles.modifiedAt
  }).from(articles).where(isNotNull(articles.publishedOn))
  return posts.map(({ slug, publishedOn, modifiedAt }) => ({
    loc: `/blog/${slug}`,
    lastmod: modifiedAt ?? publishedOn ?? undefined
  }))
})
