export const articlesPerPage = 6

export interface ArticleContent {
  title: string
  bodyHtml: string
  excerpt: string
  summary: string
  coverImage: string
  coverImageAlt: string
  seoTitle: string
  metaDescription: string
}

export interface ArticleCard {
  slug: string
  path: string
  title: string
  excerpt: string
  image: string
  imageAlt: string
  isoDate: string
  dateShort: string
}

export interface PublicArticle extends ArticleCard {
  content: string
  seoTitle: string
  metaDescription: string
}

export interface EditorArticle {
  id: number
  slug: string
  revision: number
  publishedOn: string | null
  hasDraft: boolean
  content: ArticleContent
}
