import { createError } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'

export async function readBoundedBody(event: RequestEvent, limit: number) {
  const tooLarge = () => createError({ status: 413, statusText: 'The upload is too large.' })
  if (Number(event.req.headers.get('content-length')) > limit) throw tooLarge()

  const reader = event.req.body?.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  if (reader) {
    try {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > limit) {
          await reader.cancel().catch(() => {})
          throw tooLarge()
        }
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
  }

  return new Response(new Uint8Array(Buffer.concat(chunks, size)), {
    headers: { 'content-type': event.req.headers.get('content-type') ?? '' }
  })
}
