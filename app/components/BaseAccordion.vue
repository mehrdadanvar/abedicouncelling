<script setup lang="ts">
interface AccordionItem {
  title: string
  body: string
  tone?: 'light' | 'green' | 'peach'
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[]
    variant?: 'cards' | 'lines'
    defaultOpen?: number | null
    chevron?: 'down' | 'right'
  }>(),
  {
    variant: 'cards',
    defaultOpen: 0,
    chevron: 'down'
  }
)

const openIndex = ref<number | null>(props.defaultOpen)

const toneClasses = {
  light: '',
  green: 'acc-card--green',
  peach: 'acc-card--peach'
} as const

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div :class="[variant === 'cards' ? 'acc-cards' : 'acc-lines', variant === 'lines' && chevron === 'right' ? 'acc-lines--chevron-right' : '']">
    <div
      v-for="(item, index) in items"
      :key="item.title"
      :class="[
        variant === 'cards' ? 'acc-card' : 'acc-line',
        variant === 'cards' && item.tone ? toneClasses[item.tone] : '',
        { 'is-open': openIndex === index }
      ]"
    >
      <button
        type="button"
        :class="variant === 'cards' ? 'acc-card__trigger' : 'acc-line__trigger'"
        :aria-expanded="openIndex === index"
        @click="toggle(index)"
      >
        <span :class="variant === 'cards' ? 'acc-card__title' : 'acc-line__title'">{{ item.title }}</span>
        <UIcon
          :name="chevron === 'right' ? 'i-lucide-chevron-right' : 'i-lucide-chevron-down'"
          :class="variant === 'cards' ? 'acc-card__chevron' : 'acc-line__chevron'"
          aria-hidden="true"
        />
      </button>
      <div :class="variant === 'cards' ? 'acc-card__content' : 'acc-line__content'">
        <div :class="variant === 'cards' ? 'acc-card__content-inner' : 'acc-line__content-inner'">
          <p>{{ item.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
