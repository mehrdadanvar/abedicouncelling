import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { z } from 'zod'
import sanitizeHtml from 'sanitize-html'
import { createError, getRouterParam, useRuntimeConfig } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'

export const uploadedImageName = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.webp$/

const articleContent = z.object({
  title: z.string().trim().min(1, 'Enter an article title.').max(220),
  bodyHtml: z.string().max(200_000),
  excerpt: z.string().trim().max(500),
  summary: z.string().trim().max(700),
  coverImage: z.string().refine((path) => {
    return path === ''
      || /^\/images\/[\w-]+\.(?:webp|jpe?g|png)$/i.test(path)
      || (path.startsWith('/media/') && uploadedImageName.test(path.slice('/media/'.length)))
  }, 'Choose an image from the article editor.'),
  coverImageAlt: z.string().trim().max(250),
  seoTitle: z.string().trim().max(160),
  metaDescription: z.string().trim().max(320)
})

export const createArticleInput = z.object({
  slug: z.string().max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens for the URL.'),
  publish: z.boolean(),
  content: articleContent
})

export const updateArticleInput = createArticleInput.omit({ slug: true }).extend({
  revision: z.number().int().nonnegative()
})

export function articleId(event: RequestEvent) {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isSafeInteger(id) || id < 1) {
    throw createError({ status: 404, statusText: 'Article not found' })
  }
  return id
}

export async function cleanArticleContent(content: z.infer<typeof articleContent>, publish: boolean) {
  const bodyHtml = sanitizeHtml(content.bodyHtml, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'em', 's', 'u', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote', 'hr', 'a'],
    allowedAttributes: { p: ['class'], a: ['href', 'class', 'target', 'rel'], ol: ['start'] },
    allowedClasses: { p: ['post-cta'], a: ['site-btn', 'site-btn--olive'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) }
  })
  if (publish && !sanitizeHtml(bodyHtml, { allowedTags: [] }).replaceAll(/&nbsp;|\s/gi, '')) {
    throw createError({ status: 422, statusText: 'Write the article before publishing.' })
  }
  if (publish && content.coverImage && !content.coverImageAlt) {
    throw createError({ status: 422, statusText: 'Describe the cover image before publishing.' })
  }
  if (publish && content.coverImage.startsWith('/media/')) {
    const name = content.coverImage.slice('/media/'.length)
    await access(join(useRuntimeConfig().cms.uploadsDir, name)).catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') {
        throw createError({ status: 422, statusText: 'Upload the cover image again before publishing.' })
      }
      throw error
    })
  }
  return { ...content, bodyHtml }
}

export async function parseArticleBody<T extends z.ZodType>(event: RequestEvent, schema: T) {
  const body = await readBoundedBody(event, 1_000_000)
  const result = schema.safeParse(await body.json().catch(() => null))
  if (!result.success) {
    throw createError({ status: 422, statusText: 'Check the article fields and try again.' })
  }
  return result.data
}
