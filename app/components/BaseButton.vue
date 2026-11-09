<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    variant?: 'olive' | 'white' | 'light' | 'peach'
    external?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    to: undefined,
    variant: 'olive',
    external: false,
    type: 'button'
  }
)

const variantClass = computed(() => {
  if (props.variant === 'white') return 'site-btn--white'
  if (props.variant === 'light') return 'site-btn--light'
  if (props.variant === 'peach') return 'site-btn--peach'
  return ''
})

const isExternal = computed(() => props.external || (props.to?.startsWith('http') ?? false))
</script>

<template>
  <UButton
    :to="to"
    :type="to ? undefined : type"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener' : undefined"
    color="neutral"
    variant="solid"
    class="site-btn"
    :class="variantClass"
  >
    <slot />
  </UButton>
</template>
