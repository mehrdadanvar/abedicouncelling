<script setup lang="ts">
import type { PublicArticle } from '#shared/types/article'

const props = defineProps<{ post: PublicArticle }>()

useSeoMeta({
  title: props.post.seoTitle,
  description: props.post.metaDescription,
  ogImage: props.post.image,
  ogType: 'article',
  articlePublishedTime: props.post.isoDate,
  twitterCard: 'summary_large_image'
})

useSchemaOrg([defineArticle({
  '@type': 'BlogPosting',
  'headline': props.post.title,
  'description': props.post.metaDescription,
  'image': props.post.image || undefined,
  'datePublished': props.post.isoDate,
  'author': { '@id': 'https://aubadecounselling.com/#nazanin-zarei' },
  'publisher': { '@id': 'https://aubadecounselling.com/#organization' },
  'inLanguage': 'en-CA'
})])
</script>

<template>
  <article>
    <div class="post-main">
      <div class="post-hero">
        <div>
          <h1>{{ post.title }}</h1>
          <p class="post-hero__byline">
            By Nazanin
          </p>
        </div>
        <img
          v-if="post.image"
          :src="post.image"
          :alt="post.imageAlt"
          class="post-hero__image"
          width="1024"
          height="683"
          fetchpriority="high"
        >
      </div>

      <FlowerDivider />

      <div class="post-body">
        <div
          class="post-body__inner"
          v-html="post.content"
        />
      </div>
    </div>
  </article>
</template>
