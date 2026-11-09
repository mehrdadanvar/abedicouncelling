<script setup lang="ts">
import { postBySlug } from '~/data/posts'

const post = postBySlug('disordered-eating')!
</script>

<template>
  <BlogPostPage :post="post" />
</template>
