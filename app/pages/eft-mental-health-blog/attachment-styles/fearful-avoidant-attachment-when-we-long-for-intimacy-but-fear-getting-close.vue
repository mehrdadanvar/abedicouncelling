<script setup lang="ts">
import { postBySlug } from '~/data/posts'

const post = postBySlug('fearful-avoidant')!
</script>

<template>
  <BlogPostPage :post="post" />
</template>
