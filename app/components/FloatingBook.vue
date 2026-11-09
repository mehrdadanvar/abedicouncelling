<script setup lang="ts">
import { site } from '~/data/site'
</script>

<template>
  <div class="floating-book">
    <a
      :href="site.booking"
      target="_blank"
      rel="noopener"
    >Book Appointment</a>
  </div>
</template>
