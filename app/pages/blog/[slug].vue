<script setup lang="ts">
definePageMeta({ key: route => route.path })

const route = useRoute()
const slug = String(route.params.slug)
const { data: post, error } = await useFetch(`/api/articles/${encodeURIComponent(slug)}`)

if (!post.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage: error.value?.statusMessage ?? 'Article not found',
    fatal: true
  })
}
</script>

<template>
  <BlogPostPage
    v-if="post"
    :post="post"
  />
</template>
