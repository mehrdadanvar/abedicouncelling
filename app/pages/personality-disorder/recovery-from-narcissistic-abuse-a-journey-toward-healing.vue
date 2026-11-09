<script setup lang="ts">
import { postBySlug } from '~/data/posts'

const post = postBySlug('narcissistic-abuse')!
</script>

<template>
  <BlogPostPage :post="post" />
</template>
