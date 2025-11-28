<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  cols?: number | string
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cols: 1,
  gap: 'md',
  responsive: true,
})

const gridClasses = computed(() => {
  const classes = ['grid']

  // 列数
  if (typeof props.cols === 'number') {
    if (props.responsive) {
      // 响应式列数
      switch (props.cols) {
        case 1:
          classes.push('grid-cols-1')
          break
        case 2:
          classes.push('grid-cols-1 sm:grid-cols-2')
          break
        case 3:
          classes.push('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')
          break
        case 4:
          classes.push('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')
          break
        case 5:
          classes.push('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5')
          break
        case 6:
          classes.push('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6')
          break
        default:
          classes.push(`grid-cols-${props.cols}`)
      }
    } else {
      classes.push(`grid-cols-${props.cols}`)
    }
  } else {
    classes.push(`grid-cols-${props.cols}`)
  }

  // 间距
  switch (props.gap) {
    case 'none':
      classes.push('gap-0')
      break
    case 'sm':
      classes.push('gap-2')
      break
    case 'md':
      classes.push('gap-4')
      break
    case 'lg':
      classes.push('gap-6')
      break
    case 'xl':
      classes.push('gap-8')
      break
  }

  return classes.join(' ')
})
</script>

