<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useCoordinateStore } from '@/stores/coordinate'
import { useI18n } from 'vue-i18n'
import { Location, List, MapLocation, Coordinate, ArrowRight } from '@element-plus/icons-vue'
import Button from '@/components/ui/Button.vue'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const coordinateStore = useCoordinateStore()
const { t } = useI18n()

// 动画状态
const heroVisible = ref(false)
const featuresVisible = ref(false)
const statsVisible = ref(false)

// 统计数据
const stats = ref([
  {
    label: 'coordinates',
    value: '10+',
    description: '支持的坐标系数量'
  },
  {
    label: 'conversions',
    value: '1000+',
    description: '每日转换次数'
  },
  {
    label: 'users',
    value: '500+',
    description: '活跃用户数量'
  },
  {
    label: 'accuracy',
    value: '0.01m',
    description: '转换精度保证'
  }
])

const features = [
  {
    titleKey: 'home.features.singleTransform.title',
    descriptionKey: 'home.features.singleTransform.description',
    icon: Location,
    path: '/single',
    color: 'primary'
  },
  {
    titleKey: 'home.features.batchTransform.title',
    descriptionKey: 'home.features.batchTransform.description',
    icon: List,
    path: '/batch',
    color: 'secondary'
  },
  {
    titleKey: 'home.features.mapVisualization.title',
    descriptionKey: 'home.features.mapVisualization.description',
    icon: MapLocation,
    path: '/single',
    color: 'success'
  },
  {
    titleKey: 'home.features.epsgSupport.title',
    descriptionKey: 'home.features.epsgSupport.description',
    icon: Coordinate,
    path: '/single',
    color: 'warning'
  }
]

const navigateToFeature = (path: string) => {
  router.push(path)
}

const startUsing = () => {
  router.push('/single')
}

// 动画触发
const triggerAnimations = () => {
  setTimeout(() => heroVisible.value = true, 100)
  setTimeout(() => featuresVisible.value = true, 500)
  setTimeout(() => statsVisible.value = true, 800)
}

onMounted(() => {
  coordinateStore.initialize()
  triggerAnimations()
})
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <Container class="py-20">
        <div class="text-center">
          <!-- 背景装饰 -->
          <div class="hero-background">
            <div class="floating-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>

          <!-- 主标题 -->
          <div
            class="hero-content"
            :class="{ 'animate-fade-in': heroVisible }"
          >
            <h1 class="hero-title">
              <span class="title-gradient">{{ t('home.title') }}</span>
            </h1>
            <p class="hero-subtitle">
              {{ t('home.subtitle') }}
            </p>
            <p class="hero-description">
              {{ t('home.description') }}
            </p>

            <!-- 操作按钮 -->
            <div class="hero-actions">
              <Button
                variant="primary"
                size="lg"
                icon="Location"
                @click="startUsing"
              >
                {{ t('home.startUsing') }}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="List"
                @click="navigateToFeature('/batch')"
              >
                {{ t('home.features.batchTransform.title') }}
              </Button>
            </div>
          </div>

          <!-- 可视化演示 -->
          <div class="coordinate-demo">
            <div class="demo-container">
              <div class="coord-point source-point">
                <div class="point-label">WGS84</div>
                <div class="point-value">116.4074, 39.9042</div>
              </div>
              <div class="transform-arrow">
                <ArrowRight class="arrow-icon" />
                <div class="arrow-label">转换</div>
              </div>
              <div class="coord-point target-point">
                <div class="point-label">GCJ02</div>
                <div class="point-value">116.4165, 39.9093</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 统计数据 -->
    <section class="stats-section">
      <Container class="py-16">
        <div
          class="stats-grid"
          :class="{ 'animate-fade-in': statsVisible }"
        >
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-item"
          >
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ t(`home.stats.${stat.label.toLowerCase()}`) }}</div>
            <div class="stat-description">{{ stat.description }}</div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 功能特点 -->
    <section class="features-section">
      <Container class="py-20">
        <div class="section-header">
          <h2 class="section-title">{{ t('home.features.title', '功能特点') }}</h2>
          <p class="section-subtitle">强大的功能，支持各种坐标转换需求</p>
        </div>

        <Grid
          cols="4"
          gap="lg"
          responsive
          class="features-grid"
          :class="{ 'animate-fade-in': featuresVisible }"
        >
          <Card
            v-for="(feature, index) in features"
            :key="index"
            hover
            class="feature-card"
            @click="navigateToFeature(feature.path)"
          >
            <template #header>
              <div class="feature-header">
                <div class="feature-icon">
                  <component :is="feature.icon" class="icon" />
                </div>
              </div>
            </template>

            <div class="feature-content">
              <h3 class="feature-title">{{ t(feature.titleKey) }}</h3>
              <p class="feature-description">{{ t(feature.descriptionKey) }}</p>
              <div class="feature-arrow">
                <ArrowRight class="arrow-icon" />
              </div>
            </div>
          </Card>
        </Grid>
      </Container>
    </section>
    
    <div class="systems-section">
      <h2 class="section-title">支持的坐标系</h2>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="system-card">
            <div class="system-header">
              <div class="system-icon international">
                <el-icon><MapLocation /></el-icon>
              </div>
              <h3>国际坐标系</h3>
            </div>
            <ul class="system-list">
              <li>WGS84 (EPSG:4326)</li>
              <li>Web Mercator (EPSG:3857)</li>
            </ul>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="system-card">
            <div class="system-header">
              <div class="system-icon china">
                <el-icon><Location /></el-icon>
              </div>
              <h3>中国坐标系</h3>
            </div>
            <ul class="system-list">
              <li>GCJ02 - 火星坐标系</li>
              <li>BD09 - 百度坐标系</li>
              <li>CGCS2000 (EPSG:4490)</li>
            </ul>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card class="system-card">
            <div class="system-header">
              <div class="system-icon projection">
                <el-icon><Coordinate /></el-icon>
              </div>
              <h3>投影坐标系</h3>
            </div>
            <ul class="system-list">
              <li>CGCS2000 / 3-degree Gauss-Kruger CM 117E</li>
              <li>支持自定义EPSG代码</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  @apply min-h-screen;
}

/* Hero Section */
.hero-section {
  @apply relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-gray-900 dark:to-secondary-900/20;
}

.hero-background {
  @apply absolute inset-0 pointer-events-none;
}

.floating-shapes {
  @apply absolute inset-0;
}

.shape {
  @apply absolute rounded-full opacity-10 animate-pulse-soft;
}

.shape-1 {
  @apply w-32 h-32 bg-primary-400 top-20 left-20;
  animation-delay: 0s;
}

.shape-2 {
  @apply w-24 h-24 bg-secondary-400 top-40 right-32;
  animation-delay: 2s;
}

.shape-3 {
  @apply w-20 h-20 bg-primary-300 bottom-32 left-1/3;
  animation-delay: 4s;
}

.hero-content {
  @apply relative z-10 max-w-4xl mx-auto text-center;
}

.hero-title {
  @apply text-5xl md:text-6xl font-bold mb-6;
}

.title-gradient {
  @apply bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent;
}

.hero-subtitle {
  @apply text-2xl md:text-3xl text-text-secondary-light dark:text-text-secondary-dark mb-8 font-light;
}

.hero-description {
  @apply text-lg text-text-secondary-light dark:text-text-secondary-dark mb-12 max-w-2xl mx-auto leading-relaxed;
}

.hero-actions {
  @apply flex flex-col sm:flex-row gap-4 justify-center mb-16;
}

/* 坐标演示 */
.coordinate-demo {
  @apply mt-16;
}

.demo-container {
  @apply flex items-center justify-center gap-8 max-w-2xl mx-auto;
}

.coord-point {
  @apply flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-soft border border-gray-200 dark:border-gray-700 min-w-48;
}

.source-point {
  @apply border-primary-200 dark:border-primary-800;
}

.target-point {
  @apply border-secondary-200 dark:border-secondary-800;
}

.point-label {
  @apply text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2;
}

.point-value {
  @apply text-sm font-mono text-text-primary-light dark:text-text-primary-dark;
}

.transform-arrow {
  @apply flex flex-col items-center;
}

.arrow-icon {
  @apply w-8 h-8 text-primary-500 mb-2;
}

.arrow-label {
  @apply text-sm text-text-secondary-light dark:text-text-secondary-dark;
}

/* 统计数据 */
.stats-section {
  @apply bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-8 text-center;
}

.stat-item {
  @apply p-6;
}

.stat-value {
  @apply text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2;
}

.stat-label {
  @apply text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-1;
}

.stat-description {
  @apply text-sm text-text-secondary-light dark:text-text-secondary-dark;
}

/* 功能特点 */
.features-section {
  @apply bg-gray-50 dark:bg-gray-900;
}

.section-header {
  @apply text-center mb-16;
}

.section-title {
  @apply text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4;
}

.section-subtitle {
  @apply text-lg text-text-secondary-light dark:text-text-secondary-dark;
}

.features-grid {
  @apply max-w-6xl mx-auto;
}

.feature-card {
  @apply cursor-pointer transition-all duration-300 h-full;
}

.feature-header {
  @apply flex justify-center pb-4;
}

.feature-icon {
  @apply w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center mb-4;
}

.icon {
  @apply w-8 h-8 text-primary-600 dark:text-primary-400;
}

.feature-content {
  @apply text-center;
}

.feature-title {
  @apply text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-3;
}

.feature-description {
  @apply text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4;
}

.feature-arrow {
  @apply flex justify-center;
}

.arrow-icon {
  @apply w-5 h-5 text-primary-500 transition-transform duration-200;
}

.feature-card:hover .arrow-icon {
  @apply transform translate-x-1;
}

/* 动画 */
.animate-fade-in {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-title {
    @apply text-4xl;
  }

  .hero-subtitle {
    @apply text-xl;
  }

  .demo-container {
    @apply flex-col gap-4;
  }

  .transform-arrow {
    @apply flex-row;
  }

  .arrow-icon {
    @apply w-6 h-6 mb-0 mr-2;
  }

  .stats-grid {
    @apply grid-cols-2 gap-4;
  }

  .features-grid {
    @apply grid-cols-1 sm:grid-cols-2;
  }
}
</style>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100%;
}

.hero-section {
  position: relative;
  min-height: 80vh;
  background: linear-gradient(135deg, #409eff 0%, #36cfc9 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  padding: 0 20px;
  text-align: center;
  z-index: 2;
}

.hero-text {
  margin-bottom: 40px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.title-highlight {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  position: relative;
  display: inline-block;
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 20px;
  opacity: 0.9;
}

.hero-description {
  font-size: 18px;
  max-width: 800px;
  line-height: 1.6;
  opacity: 0.8;
}

.hero-visual {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0.1;
}

.coordinate-visual {
  display: flex;
  align-items: center;
  gap: 30px;
}

.coord-point {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.coord-point.source {
  background-color: rgba(255, 255, 255, 0.6);
}

.coord-point.target {
  background-color: rgba(255, 255, 255, 0.9);
}

.coord-arrow {
  width: 60px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  position: relative;
  overflow: hidden;
}

.coord-arrow::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 12px solid rgba(255, 255, 255, 0.7);
  transform: rotate(45deg);
  transform-origin: right top;
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.action-btn {
  padding: 16px 32px;
  font-size: 18px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary {
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
}

.action-btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-icon {
  margin-right: 8px;
}

.features-section {
  padding: 80px 20px;
  background-color: #f8f9fa;
}

.section-title {
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 50px;
  color: #303133;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #36cfc9);
  border-radius: 3px;
}

.feature-card {
  height: 100%;
  padding: 30px;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  text-align: center;
  margin-bottom: 20px;
  color: #409eff;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
  color: #303133;
}

.feature-description {
  font-size: 16px;
  color: #606266;
  line-height: 1.6;
  text-align: center;
}

.systems-section {
  padding: 60px 20px 80px;
  background-color: #ffffff;
}

.system-card {
  height: 100%;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  overflow: hidden;
}

.system-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.system-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
}

.system-icon.international {
  background: linear-gradient(135deg, #409eff, #36cfc9);
}

.system-icon.china {
  background: linear-gradient(135deg, #e6a23c, #f56c6c);
}

.system-icon.projection {
  background: linear-gradient(135deg, #67c23a, #8e44ad);
}

.system-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.system-list {
  list-style: none;
  padding: 0;
}

.system-list li {
  font-size: 16px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
}

.system-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #409eff;
  font-weight: bold;
}

.content-section {
  padding: 40px 20px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 42px;
  }
  
  .hero-subtitle {
    font-size: 22px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .hero-content {
    padding: 0 15px;
  }
  
  .action-btn {
    padding: 14px 24px;
    font-size: 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
}
</style>
