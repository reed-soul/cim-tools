<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      :class="buttonClasses"
      :title="$t('language.switchLanguage')"
    >
      <component :is="currentIcon" class="h-5 w-5" />
      <span class="sr-only">{{ $t('language.switchLanguage') }}</span>
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
        class="absolute right-0 mt-2 w-32 bg-surface-light dark:bg-surface-dark rounded-xl shadow-hard border border-border-light dark:border-border-dark py-1 z-50"
        @click.stop
      >
        <button
          @click="selectLanguage('zh')"
          :class="optionClasses(currentLanguage === 'zh')"
          class="w-full"
        >
          <span class="mr-3">🇨🇳</span>
          中文
          <Check v-if="currentLanguage === 'zh'" class="h-4 w-4 ml-auto" />
        </button>

        <button
          @click="selectLanguage('en')"
          :class="optionClasses(currentLanguage === 'en')"
          class="w-full"
        >
          <span class="mr-3">🇺🇸</span>
          English
          <Check v-if="currentLanguage === 'en'" class="h-4 w-4 ml-auto" />
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from '@element-plus/icons-vue'

const { locale } = useI18n()
const showDropdown = ref(false)

const currentLanguage = computed(() => locale.value)

const currentIcon = computed(() => {
  return currentLanguage.value === 'zh' ? 'ChatDotRound' : 'ChatLineRound'
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

const selectLanguage = (lang: 'zh' | 'en') => {
  locale.value = lang
  localStorage.setItem('language', lang)
  closeDropdown()
}

// 初始化语言设置
const initLanguage = () => {
  const savedLanguage = localStorage.getItem('language') as 'zh' | 'en'
  if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
    locale.value = savedLanguage
  }
}

initLanguage()
</script>

