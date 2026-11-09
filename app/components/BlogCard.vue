<script setup lang="ts">
import type { BlogPost } from '~/data/posts'

defineProps<{
  post: BlogPost
}>()
</script>

<template>
  <article class="blog-card">
    <NuxtLink
      :to="post.path"
      class="blog-card__image-link"
      tabindex="-1"
      aria-hidden="true"
    >
      <img
        :src="post.image"
        :alt="post.imageAlt"
        class="blog-card__image"
        loading="lazy"
      >
    </NuxtLink>
    <h2><NuxtLink :to="post.path">{{ post.title }}</NuxtLink></h2>
    <p class="blog-card__meta">
      BY NAZANIN | {{ post.dateShort }}
    </p>
    <p class="blog-card__excerpt">
      {{ post.excerpt }}
    </p>
    <NuxtLink
      :to="post.path"
      class="blog-card__more"
    >READ MORE</NuxtLink>
  </article>
</template>
