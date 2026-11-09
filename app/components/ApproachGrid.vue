<script setup lang="ts">
import { approaches } from '~/data/services'
import { site } from '~/data/site'
</script>

<template>
  <div class="approaches__grid">
    <div
      v-for="approach in approaches"
      :key="approach.title"
      class="approach-card"
    >
      <h3>{{ approach.title }}</h3>
      <p>{{ approach.body }}</p>
      <BaseButton
        :to="site.booking"
        :variant="['S.A.F.E. EMDR', 'Gestalt therapy'].includes(approach.title) ? 'light' : 'olive'"
      >
        Book An Appointment
      </BaseButton>
    </div>
  </div>
</template>
