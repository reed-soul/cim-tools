<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useCoordinateStore } from '@/stores/coordinate'
import { Location, List, MapLocation, Coordinate } from '@element-plus/icons-vue'

const router = useRouter()
const coordinateStore = useCoordinateStore()

const features = [
  {
    title: '单点坐标转换',
    description: '支持多种坐标系之间的单点坐标转换，包括WGS84、GCJ02、BD09、CGCS2000等常见坐标系',
    icon: 'Location',
    path: '/single'
  },
  {
    title: '批量坐标转换',
    description: '支持批量坐标转换，可通过文本输入或文件上传方式，支持CSV、TXT、Excel等格式',
    icon: 'List',
    path: '/batch'
  },
  {
    title: '地图可视化',
    description: '在地图上直观展示转换前后的坐标位置，支持多种底图和交互功能',
    icon: 'MapLocation',
    path: '/single'
  },
  {
    title: 'EPSG支持',
    description: '支持各种EPSG代码定义的坐标系，可自定义坐标系转换参数',
    icon: 'Coordinate',
    path: '/single'
  }
]

const navigateToFeature = (path: string) => {
  router.push(path)
}

onMounted(() => {
  coordinateStore.initialize()
})
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-highlight">CIM</span>工具箱
          </h1>
          <p class="hero-subtitle">专业的坐标系转换工具</p>
          <p class="hero-description">
            支持多种坐标系之间的相互转换，包括WGS84、GCJ02、BD09、CGCS2000等常见坐标系，
            以及各种EPSG代码定义的坐标系。提供单点转换和批量转换功能，并配备可视化地图展示。
          </p>
        </div>
        <div class="hero-visual">
          <div class="coordinate-visual">
            <div class="coord-point source"></div>
            <div class="coord-arrow"></div>
            <div class="coord-point target"></div>
          </div>
        </div>
        
        <div class="hero-actions">
          <el-button type="primary" size="large" class="action-btn" @click="navigateToFeature('/single')">
            <el-icon class="btn-icon"><Location /></el-icon>
            开始使用
          </el-button>
          <el-button size="large" class="action-btn secondary" @click="navigateToFeature('/batch')">
            <el-icon class="btn-icon"><List /></el-icon>
            批量转换
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <h2 class="section-title">功能特点</h2>
      <el-row :gutter="30">
        <el-col
          v-for="(feature, index) in features"
          :key="index"
          :xs="24"
          :sm="12"
          :md="6"
        >
          <el-card class="feature-card" @click="navigateToFeature(feature.path)" shadow="hover">
            <div class="feature-icon">
              <el-icon :size="48"><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
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
