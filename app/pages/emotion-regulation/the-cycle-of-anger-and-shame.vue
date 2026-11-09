<script setup lang="ts">
import { postBySlug } from '~/data/posts'

const post = postBySlug('anger-shame')!
</script>

<template>
  <BlogPostPage :post="post" />
</template>
