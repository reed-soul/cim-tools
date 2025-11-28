import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  // 主题模式
  const themeMode = ref<ThemeMode>('auto')

  // 当前实际使用的主题
  const currentTheme = ref<'light' | 'dark'>('light')

  // 是否正在切换主题
  const isTransitioning = ref(false)

  // 计算属性：是否为暗夜主题
  const isDark = computed(() => currentTheme.value === 'dark')

  // 计算属性：是否为自动模式
  const isAuto = computed(() => themeMode.value === 'auto')

  // 初始化主题
  const initializeTheme = () => {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      themeMode.value = savedTheme
    }

    // 根据系统偏好设置初始主题
    updateCurrentTheme()

    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    }
  }

  // 更新当前主题
  const updateCurrentTheme = () => {
    const html = document.documentElement

    if (themeMode.value === 'auto') {
      // 自动模式：根据系统偏好
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
    } else {
      // 手动模式
      currentTheme.value = themeMode.value
    }

    // 应用主题到DOM
    applyTheme()
  }

  // 应用主题到DOM
  const applyTheme = () => {
    const html = document.documentElement
    isTransitioning.value = true

    // 添加过渡类
    html.classList.add('theme-transition')

    // 移除之前的主题类
    html.classList.remove('light', 'dark')

    // 添加当前主题类
    html.classList.add(currentTheme.value)

    // 移除过渡类
    setTimeout(() => {
      html.classList.remove('theme-transition')
      isTransitioning.value = false
    }, 300)
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
    updateCurrentTheme()
  }

  // 切换主题
  const toggleTheme = () => {
    const newMode = themeMode.value === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }

  // 切换到明亮主题
  const setLightTheme = () => setThemeMode('light')

  // 切换到暗夜主题
  const setDarkTheme = () => setThemeMode('dark')

  // 切换到自动主题
  const setAutoTheme = () => setThemeMode('auto')

  // 处理系统主题变化
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (themeMode.value === 'auto') {
      currentTheme.value = e.matches ? 'dark' : 'light'
      applyTheme()
    }
  }

  // 获取主题图标
  const getThemeIcon = () => {
    switch (themeMode.value) {
      case 'light':
        return 'Sunny'
      case 'dark':
        return 'Moon'
      case 'auto':
        return 'Monitor'
      default:
        return 'Sunny'
    }
  }

  // 获取主题描述
  const getThemeDescription = () => {
    switch (themeMode.value) {
      case 'light':
        return '浅色主题'
      case 'dark':
        return '深色主题'
      case 'auto':
        return '跟随系统'
      default:
        return '浅色主题'
    }
  }

  // 监听主题模式变化
  watch(themeMode, () => {
    updateCurrentTheme()
  })

  return {
    // 状态
    themeMode,
    currentTheme,
    isTransitioning,

    // 计算属性
    isDark,
    isAuto,

    // 方法
    initializeTheme,
    setThemeMode,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setAutoTheme,

    // 工具方法
    getThemeIcon,
    getThemeDescription,
  }
})

