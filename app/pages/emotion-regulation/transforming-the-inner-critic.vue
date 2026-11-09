<script setup lang="ts">
import { postBySlug } from '~/data/posts'

const post = postBySlug('inner-critic')!
</script>

<template>
  <BlogPostPage :post="post" />
</template>
