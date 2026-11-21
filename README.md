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
- `/admin` is the editor dashboard

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

Save draft keeps edits and newly uploaded images private. Publish replaces the live article and updates the blog and sitemap. Choose an article slug before the first save. In the editor, type `/` to choose a block or use the toolbar to format text, edit links, and insert images. Published posts generate `BlogPosting` structured data from the article, author profile, and publication dates.

### Local dashboard preview

Use `LIBSQL_URL=file:.data/cms.sqlite` in your local `.env` so Nuxt opens the imported database. This workspace has a development login for `info@aubadecounselling.com`. Its generated password and hash are in `.data/local-editor-password.txt` and `.data/local-editor.hash`. Start the development app on loopback with `bun run dev --host localhost --port 3000` and sign in at `http://localhost:3000/admin`. Production uses Google sign-in.

### Coolify deployment

Deploy as a Nuxt server application. Set the build command to `bun run build` and the start command to `bun run start`. Mount a persistent volume at `/data` and set:

- `LIBSQL_URL=file:/data/cms.sqlite`
- `NUXT_CMS_UPLOADS_DIR=/data/uploads`
- `NUXT_CMS_EDITOR_EMAIL`, `NUXT_APP_SECRET`, `NUXT_OAUTH_GOOGLE_CLIENT_ID`, and `NUXT_OAUTH_GOOGLE_CLIENT_SECRET` as runtime variables

From the project checkout with the volume mounted and both storage variables set, run `bun run db:migrate` before serving traffic for a new database or schema update. Run `bun run db:import-articles` to load the legacy articles and migrate their covers. Run the import on existing deployments once to update previously imported covers. The volume must be writable by the app. Back up the SQLite database and upload files to storage outside the VPS.

### Google sign-in

1. Create or select Aubade's Google Cloud project. In [Google Auth Platform](https://console.cloud.google.com/auth/overview), complete Branding and use External under Audience if the editor uses a separate Google account. You can start in Testing and add her Google account under Test users.
2. Under Clients, create an OAuth client of type **Web application**. Add `https://aubadecounselling.com/auth/google` under **Authorized redirect URIs**. For local development, also add `http://localhost:3000/auth/google`. Use the exact scheme, hostname, port, and path the browser will use.
3. In Coolify's application environment, set `NUXT_OAUTH_GOOGLE_CLIENT_ID` and `NUXT_OAUTH_GOOGLE_CLIENT_SECRET` from the client. Set `NUXT_CMS_EDITOR_EMAIL` to the exact email she uses to sign in. Generate `NUXT_APP_SECRET` once with `openssl rand -base64 32` and keep the same value across deploys. For local development, put these settings in `.env` using `.env.example` as a guide.
4. Redeploy with those runtime variables, then visit `https://aubadecounselling.com/admin` and select **Sign in with Google**. If Google reports `redirect_uri_mismatch`, compare its `redirect_uri` with the registered value. Set `NUXT_OAUTH_GOOGLE_REDIRECT_URL` to the registered HTTPS callback if the reverse proxy is causing Nuxt to infer the wrong URL.

## Styling

Public site styles live in `app/assets/css/main.css`. Nuxt UI uses the Aubade olive palette in `app/app.config.ts`. Fonts (Marcellus, Belleza, Sarabun, Open Sans, Inter) are downloaded and self-hosted at build time by Nuxt Fonts.

## Images

All images from the original site are stored in `public/images` with descriptive names and converted to WebP (`cwebp -q 85`) to keep the static build small.
