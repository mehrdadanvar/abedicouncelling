<script setup lang="ts">
import { posts } from '~/data/posts'

const columns = [[posts[0]!, posts[3]!], [posts[1]!, posts[4]!], [posts[2]!, posts[5]!]]

useSeoMeta({
  title: 'Blog - aubade counselling',
  description: 'aubade counsellingAUBADE BLOG',
  ogTitle: 'Blog - aubade counselling',
  ogDescription: 'aubade counsellingAUBADE BLOG',
  ogImage: '/images/post-fearful.webp',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <section class="blog-index">
    <div class="site-wrap--wide">
      <div class="blog-index__head">
        <div class="eyebrow eyebrow--sarabun">
          AUBADE COUNSELLING
        </div>
        <h2>AUBADE BLOG</h2>
      </div>

      <div class="blog-index__grid blog-index__grid--desktop">
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="blog-index__col"
        >
          <BlogCard
            v-for="post in column"
            :key="post.slug"
            :post="post"
          />
        </div>
      </div>

      <div class="blog-index__list">
        <BlogCard
          v-for="post in posts"
          :key="`mobile-${post.slug}`"
          :post="post"
        />
      </div>
    </div>
  </section>
</template>
