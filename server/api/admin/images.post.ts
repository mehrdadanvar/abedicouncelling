import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { createError, useRuntimeConfig } from 'nuxt/server'

const maxImageBytes = 8 * 1024 * 1024

export default defineEditorHandler(async (event) => {
  const body = await readBoundedBody(event, maxImageBytes + 16_384)
  const form = await body.formData().catch(() => {
    throw createError({ status: 400, statusText: 'Choose an image to upload.' })
  })
  const file = form.get('image')
  if (!(file instanceof Blob) || !file.size || file.size > maxImageBytes) {
    throw createError({ status: 422, statusText: 'Choose an image smaller than 8 MB.' })
  }

  const source = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 32_000_000 })
  const metadata = await source.metadata().catch(() => null)
  if (!metadata || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
    throw createError({ status: 422, statusText: 'Choose a JPEG, PNG, or WebP image.' })
  }
  const image = await source.rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84 }).toBuffer().catch(() => {
      throw createError({ status: 422, statusText: 'This image could not be read. Choose another file.' })
    })

  const dir = useRuntimeConfig().cms.uploadsDir
  const name = `${randomUUID()}.webp`
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, name), image, { flag: 'wx' })
  return { path: `/media/${name}` }
})
