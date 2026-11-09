<script setup lang="ts">
const route = useRoute()

const title = 'Aubade Counselling - aubade counselling | North Vancouver'
const description = 'You have within you the strength to heal. I’m here to offer compassionate guidance, standing with you every step of the way. With each step, we’ll uncover your strength and move toward a life of peace and renewed hope | North Vancouver'

const canonical = computed(() => `https://aubadecounselling.com${route.path === '/' ? '/' : route.path}`)

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  'name': 'Aubade Counselling',
  description,
  'url': 'https://aubadecounselling.com',
  'telephone': '+1-778-504-2135',
  'email': 'Info@aubadecounselling.com',
  'image': 'https://aubadecounselling.com/images/home-hero.jpg',
  'logo': 'https://aubadecounselling.com/images/logo.svg',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '#400 -145 Chadwick Court',
    'addressLocality': 'North Vancouver',
    'addressRegion': 'BC',
    'postalCode': 'V7M 3K1',
    'addressCountry': 'CA'
  },
  'areaServed': 'North Vancouver',
  'priceRange': '$$',
  'knowsAbout': [
    'Individual Counselling',
    'Couples Counselling',
    'Family Therapy',
    'CVAP Counselling',
    'ICBC Counselling',
    'Emotion-Focused Therapy',
    'S.A.F.E. EMDR',
    'Somatic Therapy',
    'Art Therapy',
    'Gestalt therapy',
    'Attachment theory'
  ]
}

useHead(() => ({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'canonical', href: canonical.value }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(businessSchema)
    }
  ]
}))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://aubadecounselling.com/images/home-hero.jpg',
  ogType: 'website',
  ogUrl: canonical,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <SiteHeader />
    <main class="site-main">
      <NuxtPage />
    </main>
    <SiteFooter />
    <FloatingBook />
    <MobileBottomNav />
  </UApp>
</template>
