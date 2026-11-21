import { defineEventHandler, getRouterParam } from 'nuxt/server'

export default defineEventHandler(event => getPublishedArticle(getRouterParam(event, 'slug') ?? ''))
