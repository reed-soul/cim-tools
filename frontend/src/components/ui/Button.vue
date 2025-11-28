<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
    <slot v-else-if="$slots.icon && iconPosition === 'left'" name="icon" class="mr-2 h-4 w-4" />
    <span v-if="icon && iconPosition === 'left'" class="mr-2">
      <component :is="icon" class="h-4 w-4" />
    </span>
    <span v-if="$slots.default"><slot /></span>
    <slot v-else-if="$slots.icon && iconPosition === 'right'" name="icon" class="ml-2 h-4 w-4" />
    <span v-if="icon && iconPosition === 'right'" class="ml-2">
      <component :is="icon" class="h-4 w-4" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: any
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  iconPosition: 'left',
  disabled: false,
  loading: false,
  block: false,
  rounded: false,
})

defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const classes = [
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95'
  ]

  // 尺寸样式
  switch (props.size) {
    case 'sm':
      classes.push('px-3 py-1.5 text-sm rounded-lg')
      break
    case 'md':
      classes.push('px-4 py-2 text-base rounded-lg')
      break
    case 'lg':
      classes.push('px-6 py-3 text-lg rounded-xl')
      break
    case 'xl':
      classes.push('px-8 py-4 text-xl rounded-xl')
      break
  }

  // 变体样式
  switch (props.variant) {
    case 'primary':
      classes.push(
        'bg-primary-500 hover:bg-primary-600 text-white shadow-soft hover:shadow-medium focus:ring-primary-500'
      )
      break
    case 'secondary':
      classes.push(
        'bg-surface-light hover:bg-surface-secondary-light dark:bg-surface-dark dark:hover:bg-surface-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark shadow-soft hover:shadow-medium focus:ring-primary-500'
      )
      break
    case 'success':
      classes.push(
        'bg-success-500 hover:bg-success-600 text-white shadow-soft hover:shadow-medium focus:ring-success-500'
      )
      break
    case 'warning':
      classes.push(
        'bg-warning-500 hover:bg-warning-600 text-white shadow-soft hover:shadow-medium focus:ring-warning-500'
      )
      break
    case 'danger':
      classes.push(
        'bg-danger-500 hover:bg-danger-600 text-white shadow-soft hover:shadow-medium focus:ring-danger-500'
      )
      break
    case 'ghost':
      classes.push(
        'bg-transparent hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark text-text-primary-light dark:text-text-primary-dark border border-transparent hover:border-border-light dark:hover:border-border-dark focus:ring-primary-500'
      )
      break
  }

  // 特殊样式
  if (props.block) {
    classes.push('w-full')
  }

  if (props.rounded) {
    classes.push('rounded-full')
  }

  return classes.join(' ')
})
</script>

