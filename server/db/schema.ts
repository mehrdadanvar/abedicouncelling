import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { ArticleContent } from '../../shared/types/article'

export type StoredArticleContent = ArticleContent & { inlineImages?: string[] }

export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  draft: text('draft', { mode: 'json' }).$type<StoredArticleContent>(),
  published: text('published', { mode: 'json' }).$type<StoredArticleContent>(),
  publishedOn: text('published_on'),
  modifiedAt: text('modified_at'),
  revision: integer('revision').notNull().default(0)
}, table => [
  check('article_has_content', sql`${table.draft} is not null or ${table.published} is not null`),
  check('article_publication_pair', sql`(${table.published} is null) = (${table.publishedOn} is null)`)
])
