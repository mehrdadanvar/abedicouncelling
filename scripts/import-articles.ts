import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createClient } from '@libsql/client'
import { or, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import { posts } from '../app/data/posts'
import { articles } from '../server/db/schema'

const url = process.env.LIBSQL_URL
if (!url?.startsWith('file:')) {
  throw new Error('Set LIBSQL_URL to the local SQLite file to import into.')
}

const client = createClient({ url })
const uploadsDir = process.env.NUXT_CMS_UPLOADS_DIR || '.data/uploads'

async function storeLegacyCover(path: string) {
  const bytes = await readFile(new URL(`../public${path}`, import.meta.url))
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 32)
  const name = `${hash.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')}.webp`
  const tempFile = join(uploadsDir, `.${randomUUID()}.tmp`)

  // Publish the complete file before any draft or published article can reference it.
  try {
    await writeFile(tempFile, bytes, { flag: 'wx' })
    await rename(tempFile, join(uploadsDir, name))
  } finally {
    await rm(tempFile, { force: true })
  }

  return `/media/${name}`
}

try {
  const db = drizzle(client)
  await mkdir(uploadsDir, { recursive: true })
  const covers = Object.fromEntries(await Promise.all([...new Set(posts.map(post => post.image))].map(async path => [
    path,
    await storeLegacyCover(path)
  ] as const)))

  const insertArticles = db.insert(articles).values(posts.map(post => ({
    slug: post.slug,
    publishedOn: post.isoDate,
    published: {
      title: post.title,
      bodyHtml: post.content,
      excerpt: post.excerpt,
      summary: post.description,
      coverImage: covers[post.image]!,
      coverImageAlt: post.imageAlt,
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription
    }
  }))).onConflictDoNothing({ target: articles.slug }).returning({ slug: articles.slug })

  const migrateCovers = Object.entries(covers).map(([from, to]) => {
    const draftUsesLegacyCover = sql`json_extract(${articles.draft}, '$.coverImage') = ${from}`
    const publishedUsesLegacyCover = sql`json_extract(${articles.published}, '$.coverImage') = ${from}`
    return db.update(articles).set({
      draft: sql`case when ${draftUsesLegacyCover} then json_set(${articles.draft}, '$.coverImage', ${to}) else ${articles.draft} end`,
      published: sql`case when ${publishedUsesLegacyCover} then json_set(${articles.published}, '$.coverImage', ${to}) else ${articles.published} end`,
      revision: sql`${articles.revision} + 1`
    }).where(or(draftUsesLegacyCover, publishedUsesLegacyCover)).returning({ slug: articles.slug })
  })

  const [inserted, ...updated] = await db.batch([insertArticles, ...migrateCovers])
  console.log(`Imported ${inserted.length} articles. Skipped ${posts.length - inserted.length} existing slugs.`)
  console.log(`Moved legacy covers to runtime storage for ${new Set(updated.flat().map(row => row.slug)).size} existing articles.`)
} finally {
  client.close()
}
