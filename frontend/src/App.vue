<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useCoordinateStore } from '@/stores/coordinate'
import { House, Location, List, InfoFilled, Coordinate } from '@element-plus/icons-vue'

const router = useRouter()
const coordinateStore = useCoordinateStore()

const menuItems = [
  { path: '/', name: '首页', icon: 'House' },
  { path: '/single', name: '单点转换', icon: 'Location' },
  { path: '/batch', name: '批量转换', icon: 'List' },
  { path: '/about', name: '关于', icon: 'InfoFilled' }
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
    <header class="app-header">
      <div class="header-content">
        <div class="logo-container">
          <div class="logo-icon">
            <el-icon><Coordinate /></el-icon>
          </div>
          <div class="logo-text">
            <h1>CIM工具箱</h1>
            <p class="logo-subtitle">专业的坐标系转换工具</p>
          </div>
        </div>
      </div>
    </header>
    
    <div class="main-container">
      <aside class="app-aside">
        <el-menu
          :default-active="$route.path"
          class="app-menu"
          @select="navigateTo"
        >
          <el-menu-item index="/" class="menu-item">
            <el-icon class="menu-icon"><House /></el-icon>
            <span class="menu-text">首页</span>
          </el-menu-item>
          <el-menu-item index="/single" class="menu-item">
            <el-icon class="menu-icon"><Location /></el-icon>
            <span class="menu-text">单点转换</span>
          </el-menu-item>
          <el-menu-item index="/batch" class="menu-item">
            <el-icon class="menu-icon"><List /></el-icon>
            <span class="menu-text">批量转换</span>
          </el-menu-item>
          <el-menu-item index="/about" class="menu-item">
            <el-icon class="menu-icon"><InfoFilled /></el-icon>
            <span class="menu-text">关于</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

.app-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #409eff 0%, #36cfc9 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 100%;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 32px;
  margin-right: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-text h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
  margin-top: 5px;
}

.main-container {
  flex: 1;
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
}

.app-aside {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.app-menu {
  border-right: none;
  height: 100%;
  padding: 20px 0;
}

.menu-item {
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #f0f9ff;
}

.menu-item.is-active {
  background-color: #ecf5ff;
  color: #409eff;
}

.menu-icon {
  font-size: 18px;
  margin-right: 10px;
}

.menu-text {
  font-size: 15px;
  font-weight: 500;
}

.app-main {
  flex: 1;
  background-color: #f5f7fa;
  padding: 0;
  overflow-y: auto;
}

/* 限制坐标选择下拉框宽度 */
.coordinate-select-dropdown {
  max-width: 600px !important;
  width: auto !important;
}

.coordinate-select-dropdown .el-select-dropdown__wrap {
  max-width: 600px !important;
}

/* 全局限制所有下拉框的最大宽度（防止过宽） */
.el-select-dropdown {
  max-width: 600px !important;
  width: auto !important;
}

.el-select-dropdown__wrap {
  max-width: 600px !important;
}

</style>
