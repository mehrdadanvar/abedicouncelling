<script setup lang="ts">
import { navServices, site } from '~/data/site'

const route = useRoute()
const mobileOpen = ref(false)
const servicesOpen = ref(false)

const isHome = computed(() => route.path === '/')
const isAbout = computed(() => route.path === '/nazanin-zarei')
const isBlog = computed(() => route.path.startsWith('/blog'))

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    servicesOpen.value = false
  }
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    mobileOpen.value = false
    servicesOpen.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <nav
        class="site-nav"
        aria-label="Primary navigation"
      >
        <div class="site-nav__group">
          <NuxtLink
            to="/"
            class="site-nav__link"
            :class="{ 'is-active': isHome }"
          >Aubade</NuxtLink>

          <div
            class="site-nav__item"
            :class="{ 'is-open': servicesOpen }"
            @mouseenter="servicesOpen = true"
            @mouseleave="servicesOpen = false"
          >
            <a
              href="#"
              class="site-nav__link"
              aria-haspopup="true"
              :aria-expanded="servicesOpen"
              @click.prevent="servicesOpen = !servicesOpen"
            >
              Services
              <UIcon
                name="i-lucide-chevron-down"
                class="site-nav__chevron"
                aria-hidden="true"
              />
            </a>
            <div class="site-nav__dropdown">
              <NuxtLink
                v-for="item in navServices"
                :key="item.to"
                :to="item.to"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <NuxtLink
            to="/nazanin-zarei"
            class="site-nav__link"
            :class="{ 'is-active': isAbout }"
          >About Me</NuxtLink>
        </div>

        <div
          class="site-nav__logo-space"
          aria-hidden="true"
        />

        <div class="site-nav__group">
          <NuxtLink
            to="/blog"
            class="site-nav__link"
            :class="{ 'is-active': isBlog }"
          >Blog</NuxtLink>
          <NuxtLink
            to="/#contact"
            class="site-nav__link"
          >Contact Us</NuxtLink>
          <a
            :href="site.booking"
            class="site-nav__link"
            target="_blank"
            rel="noopener"
          >Appointment</a>
        </div>
      </nav>
    </div>

    <div class="mobile-header">
      <NuxtLink
        to="/"
        class="mobile-header__logo"
        aria-label="Aubade Counselling home"
      >
        <img
          src="/images/logo-light.svg"
          alt="Aubade Counselling"
          width="67"
          height="60"
        >
      </NuxtLink>

      <button
        type="button"
        class="mobile-header__bar"
        :class="{ 'is-open': mobileOpen }"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span>Select Page</span>
        <span
          class="mobile-header__hamburger"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        v-show="mobileOpen"
        id="mobile-menu"
        class="mobile-menu"
        aria-label="Mobile navigation"
      >
        <NuxtLink
          to="/"
          :class="{ 'is-active': isHome }"
        >Aubade</NuxtLink>
        <div class="mobile-menu__group">
          <a
            href="#"
            @click.prevent
          >Services</a>
          <NuxtLink
            v-for="item in navServices"
            :key="item.to"
            :to="item.to"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <NuxtLink
          to="/nazanin-zarei"
          :class="{ 'is-active': isAbout }"
        >About Me</NuxtLink>
        <NuxtLink
          to="/blog"
          :class="{ 'is-active': isBlog }"
        >Blog</NuxtLink>
        <NuxtLink to="/#contact">Contact Us</NuxtLink>
        <a
          :href="site.booking"
          target="_blank"
          rel="noopener"
        >Appointment</a>
      </nav>
    </div>
  </header>
</template>
