import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { ArticleContent } from '../../shared/types/article'

export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  draft: text('draft', { mode: 'json' }).$type<ArticleContent>(),
  published: text('published', { mode: 'json' }).$type<ArticleContent>(),
  publishedOn: text('published_on'),
  revision: integer('revision').notNull().default(0)
}, table => [
  check('article_has_content', sql`${table.draft} is not null or ${table.published} is not null`),
  check('article_publication_pair', sql`(${table.published} is null) = (${table.publishedOn} is null)`)
])
