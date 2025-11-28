<template>
  <div class="relative">
    <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <slot name="prefix" />
    </div>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @change="$emit('change', $event)"
    >
    <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  error?: boolean
  success?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  error: false,
  success: false,
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  change: [event: Event]
}>()

const inputClasses = computed(() => {
  const classes = [
    'w-full bg-surface-light dark:bg-surface-dark border transition-all duration-200 text-text-primary-light dark:text-text-primary-dark placeholder-text-tertiary-light dark:placeholder-text-tertiary-dark focus:outline-none focus:ring-2'
  ]

  // 尺寸样式
  switch (props.size) {
    case 'sm':
      classes.push('px-3 py-2 text-sm rounded-lg')
      break
    case 'md':
      classes.push('px-4 py-3 text-base rounded-lg')
      break
    case 'lg':
      classes.push('px-5 py-4 text-lg rounded-xl')
      break
  }

  // 变体样式
  switch (props.variant) {
    case 'default':
      classes.push('border-border-light dark:border-border-dark focus:border-primary-500 focus:ring-primary-500')
      break
    case 'filled':
      classes.push('border-transparent bg-surface-secondary-light dark:bg-surface-secondary-dark focus:border-primary-500 focus:ring-primary-500')
      break
    case 'outlined':
      classes.push('border-border-light dark:border-border-dark bg-transparent focus:border-primary-500 focus:ring-primary-500')
      break
  }

  // 状态样式
  if (props.error) {
    classes.push('border-danger-500 focus:border-danger-500 focus:ring-danger-500')
  } else if (props.success) {
    classes.push('border-success-500 focus:border-success-500 focus:ring-success-500')
  }

  // 禁用状态
  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed bg-surface-secondary-light dark:bg-surface-secondary-dark')
  }

  // 只读状态
  if (props.readonly) {
    classes.push('cursor-default bg-surface-secondary-light dark:bg-surface-secondary-dark')
  }

  return classes.join(' ')
})
</script>

