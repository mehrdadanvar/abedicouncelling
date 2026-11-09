# Aubade Counselling

A Nuxt 4 + Nuxt UI port of [aubadecounselling.com](https://aubadecounselling.com/), rebuilt as a fast, fully prerendered static site outside WordPress.

## Stack

- Nuxt 4
- Nuxt UI 4
- Tailwind CSS 4
- Bun package manager

## Commands

```bash
bun install
bun run dev        # local development
bun run generate   # fully prerendered static site in .output/public
bun run preview    # preview the generated build
bun run typecheck
bun run lint
```

## Pages

Every route is prerendered into `.output/public` for SEO:

- `/`
- `/individual-counselling`
- `/couples-counselling`
- `/family-therapy`
- `/cvap-counselling`
- `/icbc-counseling`
- `/nazanin-zarei`
- `/blog`
- all six blog posts

`/about-nazanin` redirects to `/nazanin-zarei`.

## Content

- `app/data/site.ts` — navigation, home page copy, footer contact details
- `app/data/services.ts` — five service pages, approaches, FAQs
- `app/data/posts.ts` — six blog posts

## Styling

All visual styling lives in `app/assets/css/main.css`. Nuxt UI is themed through `app/app.config.ts` with the Aubade olive palette. Fonts (Marcellus, Belleza, Sarabun, Open Sans, Inter) are downloaded and self-hosted at build time by Nuxt Fonts.

## Images

All images from the original site are stored in `public/images` with descriptive names.
