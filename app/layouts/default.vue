<script setup lang="ts">
useHead({
  script: [
    { src: 'https://www.googletagmanager.com/gtag/js?id=G-129F9CCJ37', async: true },
    {
      innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-129F9CCJ37');`
    }
  ]
})
</script>

<template>
  <div>
    <SiteHeader />
    <main class="site-main">
      <slot />
    </main>
    <SiteFooter />
    <FloatingBook />
    <MobileBottomNav />
  </div>
</template>
