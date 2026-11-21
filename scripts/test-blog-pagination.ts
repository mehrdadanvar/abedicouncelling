import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createClient } from '@libsql/client'

// Run after bun run build. Start the built server with its own database and port.
const fixture = await mkdtemp(join(tmpdir(), 'aubade-pagination-'))
const url = `file:${join(fixture, 'articles.sqlite')}`
const db = createClient({ url })
const migrations = new URL('../server/db/migrations/sqlite/', import.meta.url)
const content = {
  title: 'Fixture article',
  bodyHtml: '<p>Fixture article.</p>',
  excerpt: 'Fixture article',
  summary: '',
  coverImage: '',
  coverImageAlt: '',
  seoTitle: '',
  metaDescription: ''
}
let server: ReturnType<typeof spawn> | undefined

try {
  for (const filename of (await readdir(migrations)).filter(name => name.endsWith('.sql')).sort()) {
    await db.executeMultiple(await readFile(new URL(filename, migrations), 'utf8'))
  }
  for (let number = 1; number <= 6; number++) {
    await db.execute({
      sql: 'insert into articles (slug, published, published_on) values (?, ?, ?)',
      args: [`post-${number}`, JSON.stringify(content), '2026-11-01']
    })
  }
  await db.execute({
    sql: 'insert into articles (slug, draft) values (?, ?)',
    args: ['private-draft', JSON.stringify(content)]
  })

  server = spawn('node', ['.output/server/index.mjs'], {
    env: { ...process.env, TURSO_DATABASE_URL: '', LIBSQL_URL: url, NITRO_HOST: '127.0.0.1', NITRO_PORT: '0' },
    stdio: ['ignore', 'pipe', 'inherit']
  })
  const origin = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Fixture server did not start')), 10_000)
    server!.once('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    server!.once('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`Fixture server exited with ${code}`))
    })
    server!.stdout!.on('data', (chunk) => {
      const address = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/)?.[0]
      if (address) {
        clearTimeout(timer)
        resolve(address)
      }
    })
  })

  const blog = await (await fetch(origin + '/blog')).text()
  assert.match(blog, /Page 1 of 1/)
  assert.doesNotMatch(blog, /aria-label="Article pages"/)
  assert.equal((await fetch(origin + '/blog?page=2')).status, 404)

  await db.execute({
    sql: 'insert into articles (slug, published, published_on) values (?, ?, ?)',
    args: ['latest-post', JSON.stringify(content), '2026-11-20']
  })
  const first = await (await fetch(origin + '/api/articles')).json()
  const second = await (await fetch(origin + '/api/articles?page=2')).json()
  assert.equal(first.total, 7)
  assert.deepEqual(first.articles.map((article: { slug: string }) => article.slug), [
    'latest-post', 'post-6', 'post-5', 'post-4', 'post-3', 'post-2'
  ])
  assert.deepEqual(second.articles.map((article: { slug: string }) => article.slug), ['post-1'])

  const firstPage = await (await fetch(origin + '/blog')).text()
  const secondPage = await (await fetch(origin + '/blog?page=2')).text()
  assert.match(firstPage, /Page 1 of 2/)
  assert.match(firstPage, /href="\/blog\?page=2"/)
  assert.match(secondPage, /Page 2 of 2/)
  assert.equal((await fetch(origin + '/blog?page=3')).status, 404)
  assert.equal((await fetch(origin + '/blog/private-draft')).status, 404)
  assert.doesNotMatch(await (await fetch(origin + '/sitemap.xml')).text(), /private-draft/)
  console.log('Verified single-page status, newest-first ordering, page two links, and draft privacy.')
} finally {
  if (server && server.exitCode === null && server.pid) {
    const stopped = new Promise(resolve => server!.once('exit', resolve))
    server.kill()
    await stopped
  }
  db.close()
  await rm(fixture, { force: true, recursive: true })
}
