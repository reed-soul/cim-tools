<template>
  <div class="about-container">
    <div class="page-header">
      <h1 class="page-title">关于CIM工具箱</h1>
      <p class="page-subtitle">专业的坐标系转换工具</p>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="intro-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon class="header-icon"><InfoFilled /></el-icon>
                项目介绍
              </span>
            </div>
          </template>
          
          <div class="intro-content">
            <p>
              CIM工具箱是一个专业的坐标系转换工具，旨在为GIS、测绘、地理信息等相关领域的从业者提供便捷、高效的坐标转换服务。
              本工具支持多种常见坐标系之间的相互转换，包括国际标准坐标系和中国特有坐标系，满足不同应用场景的需求。
            </p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="tech-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon class="header-icon"><Setting /></el-icon>
                技术架构
              </span>
            </div>
          </template>
          
          <div class="tech-content">
            <div class="tech-section">
              <h3 class="section-title">
                <el-icon class="section-icon"><Monitor /></el-icon>
                前端技术栈
              </h3>
              <ul class="tech-list">
                <li><strong>Vue3</strong> - 渐进式JavaScript框架，组合式API提供更好的逻辑复用</li>
                <li><strong>TypeScript</strong> - 提供类型安全，提高代码质量</li>
                <li><strong>Element Plus</strong> - 基于Vue3的UI组件库，提供丰富的组件</li>
                <li><strong>Vite7</strong> - 现代化的前端构建工具，提供快速的开发体验</li>
                <li><strong>Leaflet</strong> - 轻量级开源地图库，易于集成和定制</li>
                <li><strong>proj4js</strong> - 支持EPSG格式的坐标系转换库，与后端pyproj保持一致</li>
              </ul>
            </div>
            
            <div class="tech-section">
              <h3 class="section-title">
                <el-icon class="section-icon"><Server /></el-icon>
                后端技术栈
              </h3>
              <ul class="tech-list">
                <li><strong>Python</strong> - 简洁高效的编程语言，丰富的科学计算库</li>
                <li><strong>FastAPI</strong> - 现代化的Python Web框架，自动生成API文档</li>
                <li><strong>uv</strong> - 极速的Python包管理工具，替代pip和venv</li>
                <li><strong>pyproj</strong> - 强大的坐标系转换库，支持多种坐标系</li>
                <li><strong>pandas</strong> - 数据处理库，用于批量文件处理</li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="systems-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon class="header-icon"><Coordinate /></el-icon>
                支持的坐标系
              </span>
            </div>
          </template>
          
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8">
              <div class="system-group">
                <h3 class="group-title">
                  <el-icon class="group-icon"><MapLocation /></el-icon>
                  国际坐标系
                </h3>
                <ul class="system-list">
                  <li><strong>WGS84 (EPSG:4326)</strong> - 世界大地坐标系</li>
                  <li><strong>Web Mercator (EPSG:3857)</strong> - Web墨卡托投影</li>
                </ul>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
              <div class="system-group">
                <h3 class="group-title">
                  <el-icon class="group-icon"><Location /></el-icon>
                  中国坐标系
                </h3>
                <ul class="system-list">
                  <li><strong>GCJ02</strong> - 火星坐标系（高德、腾讯地图）</li>
                  <li><strong>BD09</strong> - 百度坐标系</li>
                  <li><strong>CGCS2000 (EPSG:4490)</strong> - 国家2000坐标系</li>
                  <li><strong>CGCS2000 / 3-degree Gauss-Kruger CM 117E (EPSG:4547)</strong></li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="usage-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon class="header-icon"><Operation /></el-icon>
                使用说明
              </span>
            </div>
          </template>
          
          <div class="usage-content">
            <div class="usage-section">
              <h3 class="section-title">
                <el-icon class="section-icon"><List /></el-icon>
                基本使用流程
              </h3>
              <ol class="step-list">
                <li>选择源坐标系和目标坐标系</li>
                <li>输入要转换的坐标（单点或批量）</li>
                <li>点击转换按钮获取结果</li>
                <li>可在地图上查看转换前后的坐标位置</li>
                <li>支持将转换结果导出为CSV等格式</li>
              </ol>
            </div>
            
            <div class="usage-section">
              <h3 class="section-title">
                <el-icon class="section-icon"><QuestionFilled /></el-icon>
                常见问题
              </h3>
              <ul class="faq-list">
                <li>如何选择正确的坐标系？</li>
                <li>转换结果不正确怎么办？</li>
                <li>支持哪些文件格式？</li>
                <li>如何提高批量转换效率？</li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="contact-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon class="header-icon"><Message /></el-icon>
                联系我们
              </span>
            </div>
          </template>
          
          <div class="contact-content">
            <p>如果您在使用过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：</p>
            <div class="contact-list">
              <div class="contact-item">
                <el-icon class="contact-icon"><Message /></el-icon>
                <div class="contact-info">
                  <strong>邮箱：</strong>support@cim-tools.com
                </div>
              </div>
              <div class="contact-item">
                <el-icon class="contact-icon"><Link /></el-icon>
                <div class="contact-info">
                  <strong>GitHub：</strong>https://github.com/your-username/cim-tools
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped>
.about-container {
  padding: 20px;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 20px;
  color: #606266;
  margin-bottom: 20px;
}

.intro-card, .tech-card, .systems-card, .usage-card, .contact-card {
  height: 100%;
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-left: 10px;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
}

.intro-content {
  padding: 20px;
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
}

.tech-content {
  padding: 20px;
}

.tech-section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.section-icon {
  font-size: 20px;
  color: #409eff;
  margin-right: 10px;
}

.tech-list {
  list-style: none;
  padding: 0;
}

.tech-list li {
  padding: 8px 0 8px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  line-height: 1.6;
  color: #606266;
}

.tech-list li:last-child {
  border-bottom: none;
}

.system-group {
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 20px;
}

.group-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.group-icon {
  font-size: 20px;
  color: #409eff;
  margin-right: 10px;
}

.system-list {
  list-style: none;
  padding: 0;
}

.system-list li {
  padding: 8px 0 8px 15px;
  font-size: 15px;
  line-height: 1.6;
  color: #606266;
}

.usage-content {
  padding: 20px;
}

.step-list {
  padding-left: 20px;
}

.step-list li {
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1.6;
  color: #606266;
}

.faq-list {
  padding-left: 20px;
}

.faq-list li {
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1.6;
  color: #606266;
}

.contact-content {
  padding: 20px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.contact-icon {
  font-size: 20px;
  color: #409eff;
  margin-right: 15px;
}

.contact-info {
  font-size: 15px;
  line-height: 1.6;
  color: #606266;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 18px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 16px;
  }
}
</style>
