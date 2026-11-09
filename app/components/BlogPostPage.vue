<script setup lang="ts">
import type { BlogPost } from '~/data/posts'

const props = defineProps<{ post: BlogPost }>()

useSeoMeta({
  title: props.post.seoTitle,
  description: props.post.description,
  ogTitle: props.post.seoTitle,
  ogDescription: props.post.description,
  ogImage: props.post.image,
  ogType: 'article',
  twitterCard: 'summary_large_image'
})
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
