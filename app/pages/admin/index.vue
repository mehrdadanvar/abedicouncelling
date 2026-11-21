<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Articles' })

const route = useRoute()
const { clear, fetch, ready, loggedIn } = useUserSession()
if (!ready.value) {
  await fetch()
}

const { data: articles, status, error, refresh } = await useFetch('/api/admin/articles', {
  immediate: loggedIn.value,
  lazy: true
})

async function signOut() {
  await clear()
  clearNuxtData()
  await navigateTo('/admin', { external: true })
}
</script>

<template>
  <section
    v-if="!loggedIn"
    class="mx-auto max-w-md rounded-lg border border-default bg-default p-6 sm:p-8"
  >
    <h1 class="mb-3 text-2xl font-semibold text-highlighted">
      Sign in to manage articles
    </h1>
    <p class="mb-6 text-muted">
      Use your Google account to open the article dashboard.
    </p>
    <UAlert
      v-if="route.query['sign-in']"
      class="mb-5"
      color="error"
      variant="soft"
      :title="route.query['sign-in'] === 'denied' ? 'This Google account does not have access.' : 'Google sign-in could not finish. Try again.'"
    />
    <UButton
      href="/auth/google"
      external
      icon="i-simple-icons-google"
      label="Sign in with Google"
    />
  </section>

  <section v-else>
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <h1 class="text-2xl font-semibold text-highlighted">
        Articles
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          label="Sign out"
          @click="signOut"
        />
        <UButton
          to="/admin/articles/new"
          icon="i-lucide-plus"
          label="New article"
        />
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      title="The article list could not load."
      :actions="[{ label: 'Try again', onClick: () => refresh() }]"
    />
    <div
      v-else-if="status === 'pending'"
      class="space-y-2"
      aria-busy="true"
      aria-label="Loading articles"
    >
      <USkeleton
        v-for="row in 3"
        :key="row"
        class="h-14 w-full"
      />
    </div>
    <div
      v-else-if="!articles?.length"
      class="rounded-lg border border-default bg-default p-6"
    >
      No articles yet. Choose New article to start writing.
    </div>
    <ul
      v-else
      class="divide-y divide-default overflow-hidden rounded-lg border border-default bg-default"
    >
      <li
        v-for="item in articles"
        :key="item.id"
        class="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-3 sm:px-5"
      >
        <NuxtLink
          :to="`/admin/articles/${item.id}`"
          class="py-2 font-medium text-highlighted hover:underline"
        >
          {{ item.title }}
        </NuxtLink>
        <UBadge
          :color="item.hasDraft ? 'neutral' : 'success'"
          variant="soft"
        >
          {{ item.hasDraft ? (item.publishedOn ? 'Unpublished edits' : 'Draft') : 'Published' }}
        </UBadge>
      </li>
    </ul>
  </section>
</template>
