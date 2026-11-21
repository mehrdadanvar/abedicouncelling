<script setup lang="ts">
import type { ArticleContent, EditorArticle } from '#shared/types/article'

definePageMeta({ layout: 'admin', middleware: 'editor', key: route => route.path })
useSeoMeta({ title: 'Edit article' })

const route = useRoute()
const isNew = route.params.id === 'new'
const { data: article, error: loadError } = isNew ? { data: ref<EditorArticle>(), error: ref() } : await useFetch<EditorArticle>(`/api/admin/articles/${encodeURIComponent(String(route.params.id))}`)

if (loadError.value?.statusCode === 401 || loadError.value?.statusCode === 403) {
  await navigateTo('/admin')
}

const content = reactive<ArticleContent>({
  title: '',
  bodyHtml: '',
  excerpt: '',
  summary: '',
  coverImage: '',
  coverImageAlt: '',
  seoTitle: '',
  metaDescription: '',
  ...article.value?.content
})
const slug = ref(article.value?.slug ?? '')
const editedSlug = ref(false)
const saving = ref<'draft' | 'publish' | null>(null)
const uploading = ref(false)
const feedback = ref('')
const issue = ref('')
const editorHeaders = { 'x-cms-request': '1' }
const savedContent = ref(JSON.stringify(content))
const savedSlug = ref(slug.value)
const dirty = computed(() => JSON.stringify(content) !== savedContent.value || slug.value !== savedSlug.value)

if (route.query.saved === 'draft') feedback.value = 'Draft saved.'
if (route.query.saved === 'publish') feedback.value = 'Article published.'

watch(() => content.title, (title) => {
  if (isNew && !editedSlug.value) {
    slug.value = title.normalize('NFKD').replace(/\p{Mark}/gu, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120).replace(/-$/, '')
  }
})

onBeforeRouteLeave(() => {
  if (dirty.value && !window.confirm('Leave without saving your changes?')) {
    return false
  }
})

function messageFor(error: unknown, fallback: string) {
  const result = error as { data?: { statusMessage?: string, statusText?: string }, statusMessage?: string }
  const message = result.data?.statusText ?? result.data?.statusMessage ?? result.statusMessage
  return message && !['Bad Request', 'Internal Server Error', 'Validation Error'].includes(message) ? message : fallback
}

async function storeImage(image: File) {
  uploading.value = true
  try {
    const body = new FormData()
    body.set('image', image)
    const result = await $fetch<{ path: string }>('/api/admin/images', {
      method: 'POST',
      headers: editorHeaders,
      body
    })
    return result.path
  } finally {
    uploading.value = false
  }
}

async function uploadCoverImage(event: Event) {
  const input = event.target as HTMLInputElement
  const image = input.files?.[0]
  if (!image) return
  issue.value = ''
  try {
    content.coverImage = await storeImage(image)
    content.coverImageAlt = ''
  } catch (error) {
    issue.value = messageFor(error, 'The image could not be uploaded. Choose a JPEG, PNG, or WebP file under 8 MB.')
  } finally {
    input.value = ''
  }
}

async function save(publish: boolean) {
  if (saving.value || uploading.value) return
  feedback.value = ''
  issue.value = ''
  if (!content.title.trim()) {
    issue.value = 'Enter an article title.'
    return
  }
  if (isNew && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.value)) {
    issue.value = 'Use lowercase letters, numbers, and hyphens for the article URL.'
    return
  }

  saving.value = publish ? 'publish' : 'draft'
  try {
    const result = isNew
      ? await $fetch<EditorArticle>('/api/admin/articles', {
          method: 'POST',
          headers: editorHeaders,
          body: { slug: slug.value, content, publish }
        })
      : await $fetch<EditorArticle>(`/api/admin/articles/${article.value?.id}`, {
          method: 'PUT',
          headers: editorHeaders,
          body: { revision: article.value?.revision, content, publish }
        })
    article.value = result
    Object.assign(content, result.content)
    await nextTick()
    savedContent.value = JSON.stringify(content)
    savedSlug.value = slug.value
    if (isNew) {
      await navigateTo({ path: `/admin/articles/${result.id}`, query: { saved: saving.value } }, { replace: true })
    }
    feedback.value = publish ? 'Article published.' : 'Draft saved.'
  } catch (error) {
    issue.value = messageFor(error, 'The article could not be saved. Check the fields and try again.')
  } finally {
    saving.value = null
  }
}
</script>

<template>
  <div>
    <UButton
      to="/admin"
      color="neutral"
      variant="ghost"
      icon="i-lucide-arrow-left"
      label="All articles"
      class="mb-4"
    />
    <UAlert
      v-if="loadError"
      color="error"
      variant="soft"
      title="This article could not load."
    />
    <form
      v-else
      @submit.prevent="save(false)"
    >
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ isNew ? 'New article' : 'Edit article' }}
        </h1>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-if="article?.publishedOn"
            :to="`/blog/${article.slug}`"
            target="_blank"
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-external-link"
            label="View live article"
          />
          <UButton
            type="submit"
            color="neutral"
            variant="outline"
            label="Save draft"
            :loading="saving === 'draft'"
            :disabled="uploading || saving === 'publish'"
          />
          <UButton
            type="button"
            label="Publish"
            :loading="saving === 'publish'"
            :disabled="uploading || saving === 'draft'"
            @click="save(true)"
          />
        </div>
      </div>
      <div
        aria-live="polite"
        aria-atomic="true"
      >
        <UAlert
          v-if="issue || feedback"
          class="mb-5"
          :color="issue ? 'error' : 'success'"
          variant="soft"
          :title="issue || feedback"
        />
      </div>

      <fieldset
        class="min-w-0 space-y-5"
        :disabled="Boolean(saving)"
      >
        <div class="min-w-0 space-y-5 rounded-lg border border-default bg-default p-4 sm:p-6">
          <UFormField
            label="Article title"
            name="title"
            required
          >
            <UInput
              v-model="content.title"
              class="w-full"
              size="lg"
              maxlength="220"
            />
          </UFormField>
          <UFormField
            v-if="isNew"
            label="Article URL"
            name="slug"
            description="Set this before the first save. It stays fixed after that."
          >
            <UInput
              v-model="slug"
              class="w-full"
              maxlength="120"
              @update:model-value="editedSlug = true"
            />
          </UFormField>
          <div>
            <h2
              id="article-body-label"
              class="mb-2 text-sm font-medium"
            >
              Article body
            </h2>
            <AdminArticleEditor
              v-model="content.bodyHtml"
              :disabled="Boolean(saving)"
              :upload-image="storeImage"
            />
          </div>
          <UFormField
            label="Blog card excerpt"
            name="excerpt"
          >
            <UTextarea
              v-model="content.excerpt"
              class="w-full"
              :rows="3"
              maxlength="500"
            />
          </UFormField>
        </div>
        <div class="grid min-w-0 gap-6 rounded-lg border border-default bg-default p-4 sm:p-6 lg:grid-cols-2">
          <div class="min-w-0 space-y-3">
            <img
              v-if="content.coverImage"
              :src="content.coverImage"
              :alt="content.coverImageAlt"
              class="aspect-video w-full max-w-md rounded-md object-cover"
            >
            <UFormField
              label="Cover image"
              name="cover"
              description="JPEG, PNG, or WebP up to 8 MB."
            >
              <UInput
                type="file"
                class="w-full"
                accept="image/jpeg,image/png,image/webp"
                :disabled="uploading"
                @change="uploadCoverImage"
              />
            </UFormField>
            <p
              v-if="uploading"
              role="status"
              class="text-sm text-muted"
            >
              Uploading image…
            </p>
            <UFormField
              v-if="content.coverImage"
              label="Image description"
              name="cover-alt"
              description="Describe the image for people who use a screen reader."
              required
            >
              <UInput
                v-model="content.coverImageAlt"
                class="w-full"
                maxlength="250"
              />
            </UFormField>
            <UButton
              v-if="content.coverImage"
              type="button"
              color="neutral"
              variant="ghost"
              label="Remove cover image"
              @click="content.coverImage = ''; content.coverImageAlt = ''"
            />
          </div>
          <div class="min-w-0 space-y-3">
            <h2 class="font-medium text-highlighted">
              Search appearance
            </h2>
            <UFormField
              label="SEO title"
              name="seo-title"
              description="Uses the article title when left blank."
            >
              <UInput
                v-model="content.seoTitle"
                class="w-full"
                maxlength="160"
              />
            </UFormField>
            <UFormField
              label="Meta description"
              name="meta-description"
              description="Uses the blog card excerpt when left blank."
            >
              <UTextarea
                v-model="content.metaDescription"
                class="w-full"
                :rows="3"
                maxlength="320"
              />
            </UFormField>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>
