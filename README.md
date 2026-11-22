# Aubade Counselling

A Nuxt 4 + Nuxt UI port of [aubadecounselling.com](https://aubadecounselling.com/), with a built-in article editor and a SQLite database.

## Stack

- Nuxt 4
- Nuxt UI 4
- Tailwind CSS 4
- Bun package manager

## Commands

```bash
bun install
bun run dev        # local development
bun run build      # build the Nuxt server and prerender service pages
bun run start      # run the production build
bun run typecheck
bun run lint
```

## Pages

Nuxt prerenders the service pages and About page. It renders the homepage and blog from published SQLite articles at request time:

- `/`
- `/individual-counselling`
- `/couples-counselling`
- `/family-counselling`
- `/cvap-counselling`
- `/icbc-counselling`
- `/about`
- `/blog` lists the six newest published articles. When more are available, pagination uses URLs such as `/blog?page=2`.
- `/blog/<slug>` renders a published article
- The editor dashboard lives at a hidden five-digit URL (`/<ADMIN_PATH_CODE>`), including an analytics page at `/<ADMIN_PATH_CODE>/analytics`

Old URLs from the WordPress site and renamed routes return 301 redirects from `app/data/redirects.ts`.

## SEO

- `@nuxtjs/seo` generates the sitemap, robots.txt, canonical URLs, Open Graph tags and schema.org JSON-LD. Site identity lives in `nuxt.config.ts`.
- `@nuxt/fonts` self-hosts the Google Fonts used by the design.
- Page titles are short. The module appends `| Aubade Counselling`.
- Service pages use `app/data/services.ts` for meta descriptions. Articles use their published SEO fields.

## Content

- `app/data/site.ts`: navigation, home page copy, footer contact details
- `app/data/services.ts`: five service pages, approaches, FAQs
- `app/data/posts.ts`: source for importing the six legacy posts

### Article database

NuxtHub uses SQLite for the article CMS. The `articles` table holds a unique slug, an editable draft, a published copy, and the original publication date. A draft can exist on its own or alongside a published copy. Both copies hold the title, HTML body, card excerpt, short summary, cover image path and alt text, SEO title, and meta description. The public URL is derived from the slug, and display dates can be formatted from the stored `YYYY-MM-DD` date.

Create a local database and import the six existing articles:

```bash
mkdir -p .data
export LIBSQL_URL="file:$PWD/.data/cms.sqlite"
bun run db:migrate
bun run db:import-articles
```

The importer adds missing slugs as published articles and copies the six bundled source covers to `NUXT_CMS_UPLOADS_DIR` (`.data/uploads` locally). It updates draft and published copies that still point to those bundled covers and preserves other edits and replacement images. You can run it again to restore missing legacy cover files.

Article covers are served from `/media/`. New uploads and migrated covers use the same storage directory, so publishing with a new image takes effect without a rebuild. The original bundled files remain available as the source for the import.

## Analytics

The public site counts first-party, aggregate traffic in one SQLite table (`analytics_events`) next to `articles`. No cookies, sessions, fingerprints, page text, destination URLs or form values are stored, and visitors who send Do Not Track or Global Privacy Control are never recorded.

What is collected:

- **Page views** — one row per successful view of a public page (`/`, `/about`, `/blog`, `/blog/<slug>` and the five service pages). Query strings, hashes and the hidden dashboard are excluded. Client-side navigation counts once per view; the first view of a document also records where the visitor came from.
- **Referrers** — reduced to the external hostname only (`www.google.com`); same-site links and unusable values count as `direct`.
- **Clicks** — clicks on links and buttons per source page, grouped into kinds: `internal`, `external`, `booking` (the Jane App booking CTA), `contact` (mailto/tel) and `button`. No destination URLs are stored.
- **Visitor addresses** — the proxy-derived IP (`x-forwarded-for`) after validation. Full addresses are shown only as a totals list on the authenticated analytics page, never combined with the pages a visitor opened, and they are removed after **7 days**. Page, referrer and click counts stay for the full **30 days**.

Requests are accepted only from a same-origin POST made by the site's own script (`Origin`/`Sec-Fetch-Site` plus an `x-analytics-request` header), with a bounded 2 KB payload, one event per request, an in-memory rate limit, and only known public paths. Retention runs during ingestion at most once an hour: rows older than 30 days are deleted and IP addresses older than 7 days are blanked. No extra dependencies are used.

The dashboard at `/<ADMIN_PATH_CODE>/analytics` (protected like the rest of the dashboard, `noindex`/`no-store`) shows:

- Totals and a daily traffic chart for the last 7 or 30 days
- Views and clicks per page, including booking CTA clicks
- Referrer hostname breakdown
- Visitor addresses (recent 7 days, counts only)
- An article SEO section listing published articles whose explicit SEO title, meta description or cover alt text are missing, with direct links to the editor, plus a link to the public sitemap. These checks only look at the explicit fields in the editor; published pages fall back to the title, excerpt and cover image, so an empty field is a refinement, not a broken page. No search ranking or impression data is shown.

### Analytics database migration

The table is added by an incremental migration (`0003_analytics-events.sql`). It does not touch the `articles` table and does not reinitialize the database. On the deployment volume (and locally, with `LIBSQL_URL` set to the existing database):

```bash
export LIBSQL_URL="file:/data/cms.sqlite"   # the existing volume, mounted and writable
bun run db:migrate
```

Run it once before serving traffic after deploying this change; re-running is safe, migrations that are already applied are skipped.

Save draft keeps edits and newly uploaded images private. Publish replaces the live article and updates the blog and sitemap. Choose an article slug before the first save. In the editor, type `/` to choose a block or use the toolbar to format text, edit links, and insert images. Published posts generate `BlogPosting` structured data from the article, author profile, and publication dates.

### Local dashboard preview

Use `LIBSQL_URL=file:.data/cms.sqlite` in your local `.env` so Nuxt opens the imported database. Local development keeps `ADMIN_EMAIL`, `ADMIN_PASS`, and `ADMIN_PATH_CODE` in `.env`. Start the development app on loopback with `bun run dev --host localhost --port 3000` and open `http://localhost:3000/<ADMIN_PATH_CODE>` with that code.

### Coolify deployment

Deploy as a Nuxt server application. Set the build command to `bun run build` and the start command to `bun run start`. Mount a persistent volume at `/data` and set:

- `LIBSQL_URL=file:/data/cms.sqlite`
- `NUXT_CMS_UPLOADS_DIR=/data/uploads`
- `ADMIN_EMAIL`, `ADMIN_PASS`, `ADMIN_PATH_CODE`, and `NUXT_APP_SECRET` as runtime variables

From the project checkout with the volume mounted and both storage variables set, run `bun run db:migrate` before serving traffic for a new database or schema update. Run `bun run db:import-articles` to load the legacy articles and migrate their covers. Run the import on existing deployments once to update previously imported covers. The volume must be writable by the app. Back up the SQLite database and upload files to storage outside the VPS.

### Dashboard access

The editor dashboard is not linked anywhere on the public site. Choose its address once: a five-digit code in `ADMIN_PATH_CODE`, kept out of the repository, the sitemap, and robots.txt. The dashboard is then served at `https://aubadecounselling.com/<ADMIN_PATH_CODE>`, including its article editor under the same prefix.

Sign in with the email from `ADMIN_EMAIL` and the password from `ADMIN_PASS`. After five failed attempts from one address, sign-in and code checks pause for 15 minutes. The old `/admin` address, wrong codes, and the removed `/auth/google` route all answer with a plain 404, and the dashboard sends `noindex` and `no-store` headers so it stays out of search results and caches.

1. Generate the five-digit code with a password manager or Node.js (for example `node -e "console.log(String(crypto.randomInt(0, 100000)).padStart(5, '0'))"`) and `NUXT_APP_SECRET` once with `openssl rand -base64 32`.
2. In Coolify's application environment, set `ADMIN_PATH_CODE`, `ADMIN_PASS`, `ADMIN_EMAIL` (the editor identity stored in the session), and `NUXT_APP_SECRET`. Keep the same values across deploys so sessions survive restarts.
3. Redeploy, then open `https://aubadecounselling.com/<ADMIN_PATH_CODE>`, enter `ADMIN_PASS`, and manage articles.

## Styling

Public site styles live in `app/assets/css/main.css`. Nuxt UI uses the Aubade olive palette in `app/app.config.ts`. Fonts (Marcellus, Belleza, Sarabun, Open Sans, Inter) are downloaded and self-hosted at build time by Nuxt Fonts.

## Images

All images from the original site are stored in `public/images` with descriptive names and converted to WebP (`cwebp -q 85`) to keep the static build small.
