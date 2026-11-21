import { createError, defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'

export function isEditorEmail(email?: string) {
  const allowed = useRuntimeConfig().cms.editorEmail.trim().toLowerCase()
  return Boolean(allowed && allowed === email?.trim().toLowerCase())
}

async function requireEditor(event: RequestEvent) {
  const session = await requireUserSession(event)
  if (!isEditorEmail(session.user.email)) {
    throw createError({ status: 403, statusText: 'This account does not have editor access.' })
  }
}

export function defineEditorHandler<T>(handler: (event: RequestEvent) => T) {
  return defineEventHandler(async (event) => {
    event.res.headers.set('Cache-Control', 'private, no-store')
    await requireEditor(event)
    // Browsers need a successful CORS preflight to send this header cross-origin.
    if (event.req.method !== 'GET' && event.req.headers.get('x-cms-request') !== '1') {
      throw createError({ status: 403, statusText: 'Invalid editor request.' })
    }
    return handler(event)
  })
}

declare module '#auth-utils' {
  interface User {
    email: string
  }
}
