<script setup lang="ts">
const route = useRoute()

useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div class="editor-shell">
    <header class="border-b border-default bg-default">
      <UContainer class="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <NuxtLink
          :to="`/${route.params.code}`"
          class="py-2 font-semibold text-highlighted"
        >
          Aubade Counselling
        </NuxtLink>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            :to="`/${route.params.code}`"
            color="neutral"
            variant="ghost"
            class="min-h-11"
            icon="i-lucide-file-text"
            label="Articles"
          />
          <UButton
            :to="`/${route.params.code}/analytics`"
            color="neutral"
            variant="ghost"
            class="min-h-11"
            icon="i-lucide-chart-line"
            label="Analytics"
          />
          <UButton
            to="/blog"
            color="neutral"
            variant="ghost"
            class="min-h-11"
            label="View blog"
            trailing-icon="i-lucide-external-link"
          />
        </div>
      </UContainer>
    </header>
    <main>
      <UContainer class="max-w-none py-8 sm:px-8 sm:py-12 lg:px-12">
        <slot />
      </UContainer>
    </main>
  </div>
</template>

<style scoped>
/* Hallmark · shape: app screen · theme: Aubade olive · v2.0.0 */
/* Keep the article list and editing actions in one workspace. */
.editor-shell {
  --ui-primary: var(--color-olive-800);
  min-height: 100dvh;
  background: var(--ui-bg-muted);
  color: var(--ui-text);
  font-family: var(--font-body);
}

:global(.dark .editor-shell) {
  --ui-primary: var(--color-olive-300);
}

.editor-shell :deep(a.bg-primary.text-inverted) {
  color: var(--ui-text-inverted);
}

.editor-shell :deep(a:not(.bg-primary):active) {
  text-decoration: underline;
}

.editor-shell :deep(:focus-visible) {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}
</style>
