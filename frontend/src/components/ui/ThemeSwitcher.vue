<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      :class="buttonClasses"
      :title="themeStore.getThemeDescription()"
    >
      <component :is="currentIcon" class="h-5 w-5" />
      <span class="sr-only">{{ themeStore.getThemeDescription() }}</span>
    </button>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-xl shadow-hard border border-border-light dark:border-border-dark py-1 z-50"
        @click.stop
      >
        <button
          @click="selectTheme('light')"
          :class="optionClasses(themeStore.themeMode === 'light')"
          class="w-full"
        >
          <Sunny class="h-4 w-4 mr-3" />
          浅色主题
          <Check v-if="themeStore.themeMode === 'light'" class="h-4 w-4 ml-auto" />
        </button>

        <button
          @click="selectTheme('dark')"
          :class="optionClasses(themeStore.themeMode === 'dark')"
          class="w-full"
        >
          <Moon class="h-4 w-4 mr-3" />
          深色主题
          <Check v-if="themeStore.themeMode === 'dark'" class="h-4 w-4 ml-auto" />
        </button>

        <button
          @click="selectTheme('auto')"
          :class="optionClasses(themeStore.themeMode === 'auto')"
          class="w-full"
        >
          <Monitor class="h-4 w-4 mr-3" />
          跟随系统
          <Check v-if="themeStore.themeMode === 'auto'" class="h-4 w-4 ml-auto" />
        </button>
      </div>
    </transition>

    <!-- 点击外部关闭下拉菜单 -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { Sunny, Moon, Monitor, Check } from '@element-plus/icons-vue'

const themeStore = useThemeStore()
const showDropdown = ref(false)

const currentIcon = computed(() => {
  return themeStore.getThemeIcon()
})

const buttonClasses = computed(() => {
  return [
    'inline-flex items-center justify-center w-10 h-10 rounded-xl',
    'bg-surface-light hover:bg-surface-secondary-light dark:bg-surface-dark dark:hover:bg-surface-secondary-dark',
    'border border-border-light dark:border-border-dark',
    'text-text-primary-light dark:text-text-primary-dark',
    'transition-all duration-200 hover:shadow-soft',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'dark:focus:ring-offset-background-dark'
  ].join(' ')
})

const optionClasses = (active: boolean) => {
  const baseClasses = [
    'flex items-center w-full px-4 py-3 text-sm',
    'hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark',
    'transition-colors duration-150'
  ]

  if (active) {
    baseClasses.push('text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20')
  } else {
    baseClasses.push('text-text-primary-light dark:text-text-primary-dark')
  }

  return baseClasses.join(' ')
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const selectTheme = (theme: 'light' | 'dark' | 'auto') => {
  themeStore.setThemeMode(theme)
  closeDropdown()
}

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

