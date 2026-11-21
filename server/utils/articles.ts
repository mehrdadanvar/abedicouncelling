import { db } from 'hub:db'
import { and, count, desc, eq, isNotNull } from 'drizzle-orm'
import { createError } from 'nuxt/server'
import { articles } from '../db/schema'
import { articlesPerPage } from '../../shared/types/article'
import type { ArticleCard, ArticleContent, EditorArticle } from '../../shared/types/article'

const displayDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
})

const publicationDate = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'short',
  timeZone: 'America/Vancouver'
})

function toArticleCard(slug: string, isoDate: string, content: ArticleContent): ArticleCard {
  return {
    slug,
    path: `/blog/${slug}`,
    title: content.title,
    excerpt: content.excerpt || content.summary,
    image: content.coverImage,
    imageAlt: content.coverImageAlt,
    isoDate,
    dateShort: displayDate.format(new Date(isoDate)).toUpperCase()
  }
}

export async function listPublishedArticles(page: number) {
  const published = isNotNull(articles.publishedOn)
  const [[totalRow], rows] = await db.batch([
    db.select({ total: count() }).from(articles).where(published),
    db.select({
      slug: articles.slug,
      date: articles.publishedOn,
      content: articles.published
    }).from(articles).where(published)
      .orderBy(desc(articles.publishedOn), desc(articles.id))
      .limit(articlesPerPage).offset((page - 1) * articlesPerPage)
  ])
  const total = totalRow?.total ?? 0
  if (page > Math.max(1, Math.ceil(total / articlesPerPage))) {
    throw createError({ status: 404, statusText: 'Article page not found' })
  }
  return { articles: rows.map(row => toArticleCard(row.slug, row.date!, row.content!)), total }
}

export async function getPublishedArticle(slug: string) {
  const [row] = await db.select({
    slug: articles.slug,
    date: articles.publishedOn,
    content: articles.published
  }).from(articles).where(and(eq(articles.slug, slug), isNotNull(articles.publishedOn))).limit(1)

  if (!row?.date || !row.content) {
    throw createError({ status: 404, statusText: 'Article not found' })
  }

  return {
    ...toArticleCard(row.slug, row.date, row.content),
    content: row.content.bodyHtml,
    seoTitle: row.content.seoTitle || row.content.title,
    metaDescription: row.content.metaDescription || row.content.excerpt || row.content.summary
  }
}

type ArticleRow = typeof articles.$inferSelect

function toEditorArticle(row: ArticleRow): EditorArticle {
  return {
    id: row.id,
    slug: row.slug,
    revision: row.revision,
    publishedOn: row.publishedOn,
    hasDraft: row.draft !== null,
    content: (row.draft ?? row.published)!
  }
}

export async function getEditorArticle(id: number) {
  const row = await db.select().from(articles).where(eq(articles.id, id)).get()
  if (!row) {
    throw createError({ status: 404, statusText: 'Article not found' })
  }
  return toEditorArticle(row)
}

export async function listEditorArticles() {
  const rows = await db.select().from(articles).orderBy(desc(articles.id))
  return rows.map(row => ({
    id: row.id,
    slug: row.slug,
    title: (row.draft ?? row.published)!.title,
    hasDraft: row.draft !== null,
    publishedOn: row.publishedOn
  }))
}

function publicationFields(content: ArticleContent, publishedOn: string | null = null) {
  return {
    draft: null,
    published: content,
    publishedOn: publishedOn ?? publicationDate.format(new Date())
  }
}

export async function createArticle(slug: string, content: ArticleContent, publish: boolean) {
  const row = await db.insert(articles).values({
    slug,
    ...(publish ? publicationFields(content) : { draft: content })
  }).onConflictDoNothing({ target: articles.slug }).returning().get()
  if (!row) {
    throw createError({ status: 409, statusText: 'This article URL is already in use.' })
  }
  return toEditorArticle(row)
}

export async function updateArticle(id: number, revision: number, content: ArticleContent, publish: boolean) {
  const current = await getEditorArticle(id)
  const row = await db.update(articles).set({
    ...(publish
      ? publicationFields(content, current.publishedOn)
      : { draft: content }),
    revision: revision + 1
  }).where(and(eq(articles.id, id), eq(articles.revision, revision))).returning().get()
  if (!row) {
    throw createError({ status: 409, statusText: 'This article changed in another tab. Reload it before saving again.' })
  }
  return toEditorArticle(row)
}
