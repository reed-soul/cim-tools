<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  padded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  centered: false,
  padded: true,
})

const containerClasses = computed(() => {
  const classes = ['mx-auto']

  // 尺寸样式
  switch (props.size) {
    case 'sm':
      classes.push('max-w-2xl')
      break
    case 'md':
      classes.push('max-w-4xl')
      break
    case 'lg':
      classes.push('max-w-6xl')
      break
    case 'xl':
      classes.push('max-w-7xl')
      break
    case 'full':
      classes.push('max-w-full')
      break
  }

  // 居中对齐
  if (props.centered) {
    classes.push('flex justify-center items-center min-h-screen')
  }

  // 内边距
  if (props.padded) {
    classes.push('px-4 sm:px-6 lg:px-8 py-6')
  }

  return classes.join(' ')
})
</script>

