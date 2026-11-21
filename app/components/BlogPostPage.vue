<script setup lang="ts">
import type { PublicArticle } from '#shared/types/article'

const props = defineProps<{ post: PublicArticle }>()
const { url } = useSiteConfig()
const articleUrl = new URL(props.post.path, url).href
const coverUrl = props.post.image ? new URL(props.post.image, url).href : undefined
const author = useCounsellorSchema()

useSeoMeta({
  title: props.post.seoTitle,
  description: props.post.metaDescription,
  ogImage: coverUrl,
  ogType: 'article',
  articlePublishedTime: props.post.isoDate,
  articleModifiedTime: props.post.modifiedAt ?? undefined,
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  author,
  defineArticle({
    '@type': 'BlogPosting',
    'url': articleUrl,
    'mainEntityOfPage': { '@id': `${articleUrl}#webpage` },
    'headline': props.post.title,
    'description': props.post.metaDescription,
    'image': coverUrl,
    'datePublished': props.post.isoDate,
    'dateModified': props.post.modifiedAt ?? undefined,
    'author': { '@id': new URL('/#nazanin-zarei', url).href },
    'publisher': { '@id': new URL('/#organization', url).href },
    'inLanguage': 'en-CA'
  })
])
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
