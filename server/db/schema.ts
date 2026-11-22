import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
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

// One flat event log for the whole site. Views and clicks share the table;
// click rows carry a kind and no referrer, view rows may carry a referrer
// hostname. `ip` holds the validated visitor address for a short window and
// is blanked out afterwards, while the counts stay for the full retention.
export const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['view', 'click'] }).notNull(),
  path: text('path').notNull(),
  kind: text('kind', { enum: ['internal', 'external', 'booking', 'contact', 'button'] }),
  referrer: text('referrer'),
  ip: text('ip'),
  createdAt: text('created_at').notNull()
}, table => [
  check('analytics_click_kind', sql`(${table.type} <> 'click') = (${table.kind} is null)`),
  index('analytics_events_created_idx').on(table.createdAt),
  index('analytics_events_page_idx').on(table.type, table.path)
])
