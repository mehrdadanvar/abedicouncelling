<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', robots: 'noindex, nofollow' })
useSeoMeta({ title: 'Articles' })

const route = useRoute()
const code = computed(() => String(route.params.code))
const email = ref('')
const password = ref('')
const canSignIn = ref(false)
const signingIn = ref(false)
const loginError = ref('')
onMounted(() => {
  canSignIn.value = true
})
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
  await navigateTo(`/${code.value}`, { external: true })
}

async function signIn() {
  signingIn.value = true
  loginError.value = ''
  try {
    await $fetch('/api/auth/local', {
      method: 'POST',
      headers: { 'x-cms-request': '1' },
      body: { code: code.value, email: email.value, password: password.value }
    })
    await navigateTo(`/${code.value}`, { external: true })
  } catch {
    loginError.value = 'Check your email and password, then try again.'
  } finally {
    signingIn.value = false
    password.value = ''
  }
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
    <form
      class="space-y-4"
      method="post"
      @submit.prevent="signIn"
    >
      <UFormField
        label="Email"
        name="email"
      >
        <UInput
          v-model="email"
          type="email"
          autocomplete="username"
          class="w-full"
          :disabled="!canSignIn"
          required
        />
      </UFormField>
      <UFormField
        label="Password"
        name="password"
      >
        <UInput
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="w-full"
          :disabled="!canSignIn"
          required
        />
      </UFormField>
      <UAlert
        v-if="loginError"
        color="error"
        variant="soft"
        :title="loginError"
      />
      <UButton
        type="submit"
        label="Sign in"
        :disabled="!canSignIn"
        :loading="signingIn"
      />
    </form>
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
          :to="`/${code}/articles/new`"
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
          :to="`/${code}/articles/${item.id}`"
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
