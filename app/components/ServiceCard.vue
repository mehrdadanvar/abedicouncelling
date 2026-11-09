<script setup lang="ts">
defineProps<{
  title: string
  text: string
  image: string
  icon: string
  to: string
  position?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="service-card"
    :style="{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.54) 100%), url(${image})`, backgroundPosition: position || 'center' }"
  >
    <img
      :src="icon"
      alt=""
      class="service-card__icon"
      aria-hidden="true"
    >
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
  </NuxtLink>
</template>
