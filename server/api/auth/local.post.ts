import { readFile } from 'node:fs/promises'
import { createError, defineEventHandler, getRequestURL } from 'nuxt/server'
import { z } from 'zod'

const editorEmail = 'info@aubadecounselling.com'
const credentials = z.object({ email: z.string().trim().toLowerCase(), password: z.string().max(256) })

export default defineEventHandler(async (event) => {
  if (!import.meta.dev || !['localhost', '127.0.0.1', '[::1]'].includes(getRequestURL(event).hostname)) {
    throw createError({ status: 404, statusText: 'Not found' })
  }

  event.res.headers.set('Cache-Control', 'private, no-store')
  if (event.req.headers.get('x-cms-request') !== '1') {
    throw createError({ status: 403, statusText: 'Invalid editor request' })
  }

  const hash = await readFile('.data/local-editor.hash', 'utf8').catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  const body = await readBoundedBody(event, 4096)
  const input = credentials.safeParse(await body.json().catch(() => null))
  if (!hash || !input.success || input.data.email !== editorEmail || !isEditorEmail(editorEmail) || !await verifyPassword(hash.trim(), input.data.password)) {
    throw createError({ status: 401, statusText: 'Check the local email and password.' })
  }

  await replaceUserSession(event, { user: { email: editorEmail } })
  return { signedIn: true }
})
