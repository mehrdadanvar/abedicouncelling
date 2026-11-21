<script setup lang="ts">
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/vue-3'
import type { EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'

const props = defineProps<{
  disabled: boolean
  uploadImage: (file: File) => Promise<string>
}>()
const body = defineModel<string>({ required: true })

const extensions = [TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] })]
const blocks = [
  { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-pilcrow' },
  { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
  { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
  { kind: 'heading', level: 4, label: 'Heading 4', icon: 'i-lucide-heading-4' },
  { kind: 'bulletList', label: 'Bulleted list', icon: 'i-lucide-list' },
  { kind: 'orderedList', label: 'Numbered list', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', label: 'Quote', icon: 'i-lucide-quote' },
  { kind: 'horizontalRule', label: 'Divider', icon: 'i-lucide-minus' }
] satisfies EditorSuggestionMenuItem[]

const toolbar: EditorToolbarItem[][] = [
  [
    { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Undo' } },
    { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Redo' } }
  ],
  [
    { icon: 'i-lucide-heading', tooltip: { text: 'Paragraph style' }, items: blocks.slice(0, 4) },
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Bulleted list' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Numbered list' } },
    { kind: 'blockquote', icon: 'i-lucide-quote', tooltip: { text: 'Quote' } },
    { kind: 'horizontalRule', icon: 'i-lucide-minus', tooltip: { text: 'Divider' } }
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Bold' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italic' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Underline' } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Strikethrough' } },
    {
      icon: 'i-lucide-align-left',
      tooltip: { text: 'Alignment' },
      items: [
        { kind: 'textAlign', align: 'left', label: 'Align left', icon: 'i-lucide-align-left' },
        { kind: 'textAlign', align: 'center', label: 'Align center', icon: 'i-lucide-align-center' },
        { kind: 'textAlign', align: 'right', label: 'Align right', icon: 'i-lucide-align-right' }
      ]
    }
  ],
  [{ slot: 'link' }, { slot: 'image' }]
]

const linkOpen = ref(false)
const linkUrl = ref('')
const linkLabel = ref('')
const linkError = ref('')
const imageOpen = ref(false)
const imageFile = shallowRef<File>()
const imageAlt = ref('')
const imageError = ref('')
const insertingImage = ref(false)

function openLink(value: boolean, editor: Editor) {
  linkOpen.value = value
  if (value) {
    linkUrl.value = editor.getAttributes('link').href ?? ''
    linkLabel.value = ''
    linkError.value = ''
  }
}

function applyLink(editor: Editor) {
  const href = linkUrl.value.trim()
  if (!/^(?:https?:\/\/|mailto:|\/(?!\/)|#)\S+$/i.test(href)) {
    linkError.value = 'Enter a website URL or an email link.'
    return
  }

  if (editor.state.selection.empty && !editor.isActive('link')) {
    editor.chain().focus().insertContent({
      type: 'text',
      text: linkLabel.value.trim() || href,
      marks: [{ type: 'link', attrs: { href } }]
    }).run()
  } else {
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
  }
  linkOpen.value = false
}

function removeLink(editor: Editor) {
  editor.chain().focus().extendMarkRange('link').unsetLink().run()
  linkOpen.value = false
}

function openImage(value: boolean, editor: Editor) {
  imageOpen.value = value
  if (value) {
    imageFile.value = undefined
    imageAlt.value = editor.isActive('image') ? editor.getAttributes('image').alt ?? '' : ''
    imageError.value = ''
  }
}

async function insertImage(editor: Editor) {
  const alt = imageAlt.value.trim()
  if (!alt) {
    imageError.value = 'Describe the image before inserting it.'
    return
  }
  if (!imageFile.value && !editor.isActive('image')) {
    imageError.value = 'Choose an image to insert.'
    return
  }
  insertingImage.value = true
  imageError.value = ''
  try {
    if (imageFile.value) {
      const src = await props.uploadImage(imageFile.value)
      if (editor.isActive('image')) {
        editor.chain().focus().updateAttributes('image', { src, alt }).run()
      } else {
        const { $to } = editor.state.selection
        const position = $to.depth ? $to.after(1) : $to.pos
        editor.chain().focus().insertContentAt(position, { type: 'image', attrs: { src, alt } }).run()
      }
    } else {
      editor.chain().focus().updateAttributes('image', { alt }).run()
    }
    imageOpen.value = false
  } catch {
    imageError.value = 'The image could not be uploaded. Choose a JPEG, PNG, or WebP file under 8 MB.'
  } finally {
    insertingImage.value = false
  }
}
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="body"
    content-type="html"
    :editable="!disabled"
    :extensions="extensions"
    :mention="false"
    :starter-kit="{ heading: { levels: [2, 3, 4] }, codeBlock: false, code: false, link: { openOnClick: false } }"
    :editor-props="{ attributes: { 'aria-labelledby': 'article-body-label', 'aria-multiline': 'true', 'role': 'textbox' } }"
    class="article-editor rounded-md border border-default bg-default"
    :ui="{ content: 'min-h-[58vh] px-7 py-6 sm:px-12' }"
    placeholder="Write your article or type / for formatting…"
  >
    <template v-if="editor">
      <UEditorToolbar
        :editor="editor"
        :items="toolbar"
        class="sticky top-0 z-10 flex-wrap rounded-t-md border-b border-default bg-default p-2"
        aria-label="Article formatting"
      >
        <template #link>
          <UPopover
            :open="linkOpen"
            @update:open="openLink($event, editor)"
          >
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              icon="i-lucide-link"
              aria-label="Edit link"
              title="Edit link"
              :disabled="disabled"
            />
            <template #content>
              <div class="w-72 max-w-[calc(100vw-2rem)] space-y-3 p-3">
                <UFormField label="Link URL">
                  <UInput
                    v-model="linkUrl"
                    type="url"
                    class="w-full"
                    @keydown.enter.prevent="applyLink(editor)"
                  />
                </UFormField>
                <UFormField
                  v-if="editor.state.selection.empty && !editor.isActive('link')"
                  label="Link text"
                >
                  <UInput
                    v-model="linkLabel"
                    class="w-full"
                    @keydown.enter.prevent="applyLink(editor)"
                  />
                </UFormField>
                <p
                  v-if="linkError"
                  role="alert"
                  class="text-sm text-error"
                >
                  {{ linkError }}
                </p>
                <div class="flex gap-2">
                  <UButton
                    label="Apply link"
                    @click="applyLink(editor)"
                  />
                  <UButton
                    v-if="editor.isActive('link')"
                    color="neutral"
                    variant="ghost"
                    label="Remove link"
                    @click="removeLink(editor)"
                  />
                </div>
              </div>
            </template>
          </UPopover>
        </template>

        <template #image>
          <UPopover
            :open="imageOpen"
            @update:open="openImage($event, editor)"
          >
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              icon="i-lucide-image"
              :aria-label="editor.isActive('image') ? 'Edit image' : 'Insert image'"
              :title="editor.isActive('image') ? 'Edit image' : 'Insert image'"
              :disabled="disabled"
            />
            <template #content>
              <div class="w-72 max-w-[calc(100vw-2rem)] space-y-3 p-3">
                <UFormField label="Image file">
                  <UInput
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="w-full"
                    :disabled="insertingImage"
                    @change="imageFile = ($event.target as HTMLInputElement).files?.[0]"
                  />
                </UFormField>
                <UFormField label="Image description">
                  <UInput
                    v-model="imageAlt"
                    class="w-full"
                    maxlength="250"
                    :disabled="insertingImage"
                  />
                </UFormField>
                <p
                  v-if="imageError"
                  role="alert"
                  class="text-sm text-error"
                >
                  {{ imageError }}
                </p>
                <UButton
                  :label="editor.isActive('image') ? 'Save image' : 'Insert image'"
                  :loading="insertingImage"
                  @click="insertImage(editor)"
                />
              </div>
            </template>
          </UPopover>
        </template>
      </UEditorToolbar>

      <UEditorSuggestionMenu
        v-if="!disabled"
        :editor="editor"
        :items="blocks"
      />
      <UEditorDragHandle
        v-if="!disabled"
        :editor="editor"
        aria-label="Drag to move block"
      />
    </template>
  </UEditor>
</template>

<style scoped>
.article-editor :deep(.tiptap) {
  font-size: 1rem;
  line-height: 1.7;
}

.article-editor :deep(.tiptap > * + *) {
  margin-block-start: 0.9em;
}

.article-editor :deep(.tiptap img) {
  height: auto;
  max-width: 100%;
}
</style>
