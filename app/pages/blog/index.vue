<script setup lang="ts">
import { articlesPerPage } from '#shared/types/article'

definePageMeta({ key: route => `/blog:${route.query.page ?? '1'}` })

const route = useRoute()
const page = Number(route.query.page ?? 1)
if (!Number.isSafeInteger(page) || page < 1 || page > 1_000_000) {
  throw createError({ statusCode: 404, statusMessage: 'Article page not found', fatal: true })
}

const { data, error } = await useFetch('/api/articles', { query: { page } })
if (error.value) {
  throw createError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage, fatal: true })
}

const { url } = useSiteConfig()
useHead({ link: [{ rel: 'canonical', href: new URL(page === 1 ? '/blog' : `/blog?page=${page}`, url).href }] })
useSeoMeta({
  title: page === 1 ? 'Counselling Blog' : `Counselling Blog, Page ${page}`,
  description: 'Articles on attachment, emotion regulation, trauma and healing by Nazanin Zarei, a counsellor in North Vancouver.',
  ogImage: () => data.value?.articles[0]?.image || '/images/home-hero.webp',
  twitterCard: 'summary_large_image'
})

const totalPages = computed(() => Math.ceil((data.value?.total ?? 0) / articlesPerPage))

function pageLink(value: number) {
  return value === 1 ? '/blog' : `/blog?page=${value}`
}
</script>

<template>
  <section class="blog-index">
    <div class="site-wrap--wide">
      <div class="blog-index__head">
        <div class="eyebrow eyebrow--sarabun">
          AUBADE COUNSELLING
        </div>
        <h1>AUBADE BLOG</h1>
      </div>

      <div
        v-if="data?.articles.length"
        class="blog-index__grid"
      >
        <BlogCard
          v-for="post in data.articles"
          :key="post.slug"
          :post="post"
        />
      </div>
      <p v-else>
        No articles have been published yet.
      </p>

      <p
        v-if="data?.articles.length"
        class="blog-index__page-status"
        aria-live="polite"
      >
        Page {{ page }} of {{ totalPages }}
      </p>

      <UPagination
        v-if="data && totalPages > 1"
        as="nav"
        aria-label="Article pages"
        class="mt-6 flex justify-center"
        active-color="neutral"
        active-variant="outline"
        :page="page"
        :total="data.total"
        :items-per-page="articlesPerPage"
        :to="pageLink"
      />
    </div>
  </section>
</template>
