<script setup lang="ts">
import { site } from '~/data/site'

const route = useRoute()
const isHome = computed(() => route.path === '/')
const isAbout = computed(() => route.path === '/nazanin-zarei')
</script>

<template>
  <nav
    class="mobile-bottom-nav"
    aria-label="Mobile navigation"
  >
    <NuxtLink
      to="/"
      class="mobile-bottom-nav__link"
      :class="{ 'is-active': isHome }"
      aria-label="Home"
    >
      <span class="mobile-bottom-nav__icon">
        <UIcon
          name="i-lucide-house"
          aria-hidden="true"
        />
      </span>
      <span class="mobile-bottom-nav__label">Home</span>
    </NuxtLink>

    <NuxtLink
      to="/nazanin-zarei"
      class="mobile-bottom-nav__link"
      :class="{ 'is-active': isAbout }"
      aria-label="About Nazanin Zarei"
    >
      <span class="mobile-bottom-nav__icon">
        <UIcon
          name="i-lucide-user-round"
          aria-hidden="true"
        />
      </span>
      <span class="mobile-bottom-nav__label">About</span>
    </NuxtLink>

    <a
      :href="site.booking"
      class="mobile-bottom-nav__link mobile-bottom-nav__link--book"
      target="_blank"
      rel="noopener"
      aria-label="Book an Appointment"
    >
      <span class="mobile-bottom-nav__icon">
        <UIcon
          name="i-lucide-calendar-check-2"
          aria-hidden="true"
        />
      </span>
      <span class="mobile-bottom-nav__label">Book Now</span>
    </a>
  </nav>
</template>
