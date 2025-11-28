<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useCoordinateStore } from '@/stores/coordinate'
import { useI18n } from 'vue-i18n'
import { House, Location, List, InfoFilled, Coordinate } from '@element-plus/icons-vue'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

const router = useRouter()
const coordinateStore = useCoordinateStore()
const { t } = useI18n()

const menuItems = [
  { path: '/', nameKey: 'navigation.home', icon: House },
  { path: '/single', nameKey: 'navigation.singleTransform', icon: Location },
  { path: '/batch', nameKey: 'navigation.batchTransform', icon: List },
  { path: '/about', nameKey: 'navigation.about', icon: InfoFilled }
]

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  coordinateStore.initialize()
})
</script>

<template>
  <div class="app-container">
    <!-- 现代化顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <!-- Logo区域 -->
        <div class="logo-container">
          <div class="logo-icon">
            <el-icon class="text-primary-500"><Coordinate /></el-icon>
          </div>
          <div class="logo-text">
            <h1 class="text-text-primary-light dark:text-text-primary-dark">
              {{ t('navigation.logoTitle') }}
            </h1>
            <p class="logo-subtitle text-text-secondary-light dark:text-text-secondary-dark">
              {{ t('navigation.logoSubtitle') }}
            </p>
          </div>
        </div>

        <!-- 右侧工具栏 -->
        <div class="header-actions">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>

    <div class="main-container">
      <!-- 现代化侧边栏 -->
      <aside class="app-aside">
        <nav class="nav-container">
          <div class="nav-header">
            <span class="nav-title text-text-primary-light dark:text-text-primary-dark">
              导航菜单
            </span>
          </div>

          <div class="nav-menu">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              active-class="nav-item-active"
            >
              <component :is="item.icon" class="nav-icon" />
              <span class="nav-text">{{ t(item.nameKey) }}</span>
              <div class="nav-indicator"></div>
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="app-main">
        <RouterView v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  @apply h-screen w-full flex flex-col bg-background-light dark:bg-background-dark;
}

.app-header {
  @apply bg-gradient-to-r from-primary-500 to-secondary-500 shadow-soft z-50 h-16 flex items-center;
}

.header-content {
  @apply flex items-center justify-between px-6 h-full w-full max-w-7xl mx-auto;
}

.logo-container {
  @apply flex items-center space-x-4;
}

.logo-icon {
  @apply w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl transition-all duration-200 hover:bg-white/30;
}

.logo-text h1 {
  @apply text-xl font-bold m-0 leading-tight;
}

.logo-subtitle {
  @apply text-sm opacity-80 m-0 mt-1;
}

.header-actions {
  @apply flex items-center space-x-2;
}

.main-container {
  @apply flex-1 w-full flex overflow-hidden;
}

.app-aside {
  @apply w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark shadow-soft;
}

.nav-container {
  @apply h-full flex flex-col;
}

.nav-header {
  @apply px-6 py-4 border-b border-border-secondary-light dark:border-border-secondary-dark;
}

.nav-title {
  @apply text-sm font-semibold uppercase tracking-wide;
}

.nav-menu {
  @apply flex-1 px-3 py-4 space-y-1;
}

.nav-item {
  @apply flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative;
  @apply text-text-secondary-light dark:text-text-secondary-dark;
  @apply hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark;
  @apply hover:text-text-primary-light dark:hover:text-text-primary-dark;
}

.nav-item-active {
  @apply bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
}

.nav-icon {
  @apply w-5 h-5 mr-3 transition-colors duration-200;
}

.nav-item-active .nav-icon {
  @apply text-primary-500;
}

.nav-text {
  @apply flex-1;
}

  .nav-indicator {
    @apply absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r transition-all duration-200 opacity-0;
  }

  .nav-item:hover .nav-indicator,
  .nav-item-active .nav-indicator {
    @apply opacity-100;
  }

.app-main {
  @apply flex-1 bg-background-secondary-light dark:bg-background-secondary-dark overflow-y-auto;
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.page-enter-from {
  @apply opacity-0 transform translate-x-4;
}

.page-leave-to {
  @apply opacity-0 transform -translate-x-4;
}

/* 滚动条样式 */
.app-main::-webkit-scrollbar {
  @apply w-2;
}

.app-main::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.app-main::-webkit-scrollbar-thumb {
  @apply bg-border-light dark:bg-border-dark rounded-full;
}

.app-main::-webkit-scrollbar-thumb:hover {
  @apply bg-border-secondary-light dark:bg-border-secondary-dark;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .app-aside {
    @apply w-20;
  }

  .nav-header {
    @apply px-3;
  }

  .nav-title {
    @apply text-xs;
  }

  .nav-menu {
    @apply px-2;
  }

  .nav-item {
    @apply px-2 justify-center;
  }

  .nav-text {
    @apply hidden;
  }

  .nav-icon {
    @apply mr-0;
  }
}

@media (max-width: 768px) {
  .header-content {
    @apply px-4;
  }

  .logo-text h1 {
    @apply text-lg;
  }

  .logo-subtitle {
    @apply hidden;
  }
}
</style>
