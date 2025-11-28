<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  hover?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  hover: false,
  rounded: false,
})

const cardClasses = computed(() => {
  const classes = [
    'bg-surface-light dark:bg-surface-dark border transition-all duration-200'
  ]

  // 变体样式
  switch (props.variant) {
    case 'default':
      classes.push('border-border-secondary-light dark:border-border-secondary-dark shadow-soft')
      break
    case 'elevated':
      classes.push('border-transparent shadow-medium')
      break
    case 'outlined':
      classes.push('border-border-light dark:border-border-dark shadow-none')
      break
    case 'filled':
      classes.push('border-transparent shadow-none bg-surface-secondary-light dark:bg-surface-secondary-dark')
      break
  }

  // 尺寸样式
  switch (props.size) {
    case 'sm':
      classes.push('rounded-lg')
      break
    case 'md':
      classes.push('rounded-xl')
      break
    case 'lg':
      classes.push('rounded-2xl')
      break
  }

  // 圆角覆盖
  if (props.rounded) {
    classes.push('rounded-full')
  }

  // 悬停效果
  if (props.hover) {
    classes.push('hover:shadow-medium hover:-translate-y-1 cursor-pointer')
  }

  return classes.join(' ')
})

const headerClasses = computed(() => {
  const classes = ['px-6 py-4 border-b border-border-secondary-light dark:border-border-secondary-dark']

  switch (props.size) {
    case 'sm':
      classes.push('px-4 py-3')
      break
    case 'md':
      classes.push('px-6 py-4')
      break
    case 'lg':
      classes.push('px-8 py-6')
      break
  }

  return classes.join(' ')
})

const bodyClasses = computed(() => {
  const classes = ['flex-1']

  switch (props.size) {
    case 'sm':
      classes.push('px-4 py-3')
      break
    case 'md':
      classes.push('px-6 py-4')
      break
    case 'lg':
      classes.push('px-8 py-6')
      break
  }

  return classes.join(' ')
})

const footerClasses = computed(() => {
  const classes = ['px-6 py-4 border-t border-border-secondary-light dark:border-border-secondary-dark']

  switch (props.size) {
    case 'sm':
      classes.push('px-4 py-3')
      break
    case 'md':
      classes.push('px-6 py-4')
      break
    case 'lg':
      classes.push('px-8 py-6')
      break
  }

  return classes.join(' ')
})
</script>

