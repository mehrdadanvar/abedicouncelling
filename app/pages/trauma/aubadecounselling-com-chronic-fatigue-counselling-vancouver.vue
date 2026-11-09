<script setup lang="ts">
import { postBySlug } from '~/data/posts'

const post = postBySlug('chronic-fatigue')!
</script>

<template>
  <BlogPostPage :post="post" />
</template>
