<template>
  <div class="single-transform">
    <div class="page-header">
      <h1 class="page-title">单点坐标转换</h1>
      <p class="page-description">支持多种坐标系之间的单点坐标转换，包括WGS84、GCJ02、BD09、CGCS2000等常见坐标系</p>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="transform-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">坐标转换</span>
              <el-tag type="info" size="small">单点模式</el-tag>
            </div>
          </template>
          
          <el-form :model="form" label-width="120px" class="transform-form">
            <el-form-item label="源坐标系">
              <el-select 
                v-model="sourceCrs" 
                placeholder="选择源坐标系" 
                class="full-width coordinate-select"
                popper-class="coordinate-select-dropdown"
                filterable
              >
                <el-option-group
                  v-for="group in groupedSystems"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="system in group.options"
                    :key="system.code"
                    :label="`${system.name} (${system.code})`"
                    :value="system.code"
                  >
                    <div class="option-content">
                      <div class="option-header">
                        <span class="option-name">{{ system.name }}</span>
                        <span class="option-code">({{ system.code }})</span>
                      </div>
                      <span class="option-desc">{{ system.description }}</span>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            
            <el-form-item label="目标坐标系">
              <el-select 
                v-model="targetCrs" 
                placeholder="选择目标坐标系" 
                class="full-width coordinate-select"
                popper-class="coordinate-select-dropdown"
                filterable
              >
                <el-option-group
                  v-for="group in groupedSystems"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="system in group.options"
                    :key="system.code"
                    :label="`${system.name} (${system.code})`"
                    :value="system.code"
                  >
                    <div class="option-content">
                      <div class="option-header">
                        <span class="option-name">{{ system.name }}</span>
                        <span class="option-code">({{ system.code }})</span>
                      </div>
                      <span class="option-desc">{{ system.description }}</span>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            
            <el-form-item label="源坐标">
              <div class="coordinate-input">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <div class="input-group">
                      <span class="input-label">经度/X</span>
                      <el-input-number
                        v-model="sourceCoordinate[0]"
                        placeholder="经度"
                        class="coordinate-input"
                        :precision="6"
                        controls-position="right"
                      />
                    </div>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <div class="input-group">
                      <span class="input-label">纬度/Y</span>
                      <el-input-number
                        v-model="sourceCoordinate[1]"
                        placeholder="纬度"
                        class="coordinate-input"
                        :precision="6"
                        controls-position="right"
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            
            <el-form-item class="form-actions">
              <el-button type="primary" size="large" @click="handleTransform" :loading="isLoading" class="transform-btn">
                <el-icon class="btn-icon"><Refresh /></el-icon>
                转换
              </el-button>
              <el-button size="large" @click="handleReset" class="reset-btn">
                <el-icon class="btn-icon"><RefreshRight /></el-icon>
                重置
              </el-button>
            </el-form-item>
          </el-form>
          
          <el-divider class="divider">
            <div class="divider-text">转换结果</div>
          </el-divider>
          
          <div v-if="error" class="error-message">
            <el-alert
              title="转换错误"
              type="error"
              :description="error"
              show-icon
              :closable="false"
            />
          </div>
          
          <div v-if="hasResult" class="result-section">
            <div class="result-header">
              <el-icon class="result-icon"><SuccessFilled /></el-icon>
              <span class="result-title">转换成功</span>
            </div>
            
            <div class="coordinate-result">
              <el-row :gutter="10">
                <el-col :span="11">
                  <div class="result-group">
                    <span class="result-label">经度/X</span>
                    <el-input
                      :model-value="targetCoordinate && targetCoordinate[0]"
                      placeholder="经度/X"
                      readonly
                      class="result-input"
                    >
                      <template #append>
                        <el-button @click="copyToClipboard(targetCoordinate && targetCoordinate[0])" class="copy-btn">
                          <el-icon><CopyDocument /></el-icon>
                        </el-button>
                      </template>
                    </el-input>
                  </div>
                </el-col>
                <el-col :span="11" :offset="2">
                  <div class="result-group">
                    <span class="result-label">纬度/Y</span>
                    <el-input
                      :model-value="targetCoordinate && targetCoordinate[1]"
                      placeholder="纬度/Y"
                      readonly
                      class="result-input"
                    >
                      <template #append>
                        <el-button @click="copyToClipboard(targetCoordinate && targetCoordinate[1])" class="copy-btn">
                          <el-icon><CopyDocument /></el-icon>
                        </el-button>
                      </template>
                    </el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <div class="result-actions">
              <el-button @click="showOnMap" class="action-btn">
                <el-icon class="btn-icon"><MapLocation /></el-icon>
                在地图上显示
              </el-button>
              <el-button @click="addToBatch" class="action-btn secondary">
                <el-icon class="btn-icon"><Plus /></el-icon>
                添加到批量转换
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">使用说明</span>
            </div>
          </template>
          
          <div class="info-content">
            <div class="info-section">
              <h3 class="info-title">
                <el-icon><InfoFilled /></el-icon>
                坐标系说明
              </h3>
              <ul class="info-list">
                <li><strong>WGS84</strong>：世界大地坐标系，GPS使用的坐标系</li>
                <li><strong>GCJ02</strong>：火星坐标系，高德、腾讯地图使用</li>
                <li><strong>BD09</strong>：百度坐标系，百度地图使用</li>
                <li><strong>CGCS2000</strong>：国家2000坐标系，中国官方坐标系</li>
              </ul>
            </div>
            
            <div class="info-section">
              <h3 class="info-title">
                <el-icon><QuestionFilled /></el-icon>
                常见问题
              </h3>
              <ul class="info-list">
                <li>如何选择正确的坐标系？</li>
                <li>转换结果不正确怎么办？</li>
                <li>支持哪些文件格式？</li>
              </ul>
            </div>
            
            <div class="info-section">
              <h3 class="info-title">
                <el-icon><Operation /></el-icon>
                操作提示
              </h3>
              <ul class="info-list">
                <li>点击转换按钮执行坐标转换</li>
                <li>点击复制按钮快速复制结果</li>
                <li>点击地图按钮在地图上查看位置</li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 地图对话框 -->
    <el-dialog v-model="mapVisible" title="坐标位置" width="80%" class="map-dialog">
      <div id="map-container" class="map-container"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { CopyDocument, Refresh, RefreshRight, SuccessFilled, MapLocation, Plus, InfoFilled, QuestionFilled, Operation } from '@element-plus/icons-vue'
import { useCoordinateStore } from '@/stores/coordinate'
import { searchCoordinateSystems } from '@/utils/coordinate'
import L from 'leaflet'

const coordinateStore = useCoordinateStore()

// 使用 storeToRefs 解构响应式状态
const {
  sourceCoordinate,
  sourceCrs,
  targetCrs,
  targetCoordinate,
  isLoading,
  error,
  supportedSystems,
  groupedSystems,
  hasResult
} = storeToRefs(coordinateStore)

// 方法直接从 store 实例获取
const {
  transformSingle,
  setSourceCoordinate,
  setSourceCrs,
  setTargetCrs,
  addBatchCoordinate,
  resetResults
} = coordinateStore

// 本地状态
const mapVisible = ref(false)
const map = ref<any>(null)
const sourceSearchQuery = ref('')
const targetSearchQuery = ref('')
const filteredSourceSystems = ref(supportedSystems.value)
const filteredTargetSystems = ref(supportedSystems.value)

// 表单数据
const form = computed(() => ({
  sourceCoordinate: sourceCoordinate.value,
  sourceCrs: sourceCrs.value,
  targetCrs: targetCrs.value
}))

// 过滤源坐标系
const filterSourceSystems = (query: string) => {
  if (!query || !supportedSystems.value) {
    filteredSourceSystems.value = supportedSystems.value || []
    return
  }
  
  const lowerQuery = query.toLowerCase()
  filteredSourceSystems.value = supportedSystems.value.filter(system => 
    system.code.toLowerCase().includes(lowerQuery) || 
    system.name.toLowerCase().includes(lowerQuery) || 
    system.description.toLowerCase().includes(lowerQuery)
  )
}

// 过滤目标坐标系
const filterTargetSystems = (query: string) => {
  if (!query || !supportedSystems.value) {
    filteredTargetSystems.value = supportedSystems.value || []
    return
  }
  
  const lowerQuery = query.toLowerCase()
  filteredTargetSystems.value = supportedSystems.value.filter(system => 
    system.code.toLowerCase().includes(lowerQuery) || 
    system.name.toLowerCase().includes(lowerQuery) || 
    system.description.toLowerCase().includes(lowerQuery)
  )
}

// 初始化
onMounted(() => {
  coordinateStore.initialize()
  // 确保在初始化后设置过滤后的系统
  setTimeout(() => {
    filteredSourceSystems.value = supportedSystems.value
    filteredTargetSystems.value = supportedSystems.value
  }, 100)
})

// 处理转换
const handleTransform = async () => {
  // 验证输入
  if (!sourceCoordinate.value || sourceCoordinate.value.length !== 2) {
    ElMessage.warning('请输入有效的源坐标')
    return
  }
  
  if (!sourceCrs.value || !targetCrs.value) {
    ElMessage.warning('请选择源坐标系和目标坐标系')
    return
  }
  
  if (sourceCrs.value === targetCrs.value) {
    ElMessage.warning('源坐标系和目标坐标系不能相同')
    return
  }
  
  try {
    await coordinateStore.transformSingle()
    
    if (hasResult.value) {
      ElMessage.success('坐标转换成功')
    } else if (error.value) {
      ElMessage.error(error.value)
    }
  } catch (err) {
    console.error('坐标转换错误:', err)
    ElMessage.error('转换失败：' + (err instanceof Error ? err.message : String(err)))
  }
}

// 重置
const handleReset = () => {
  resetResults()
}

// 复制到剪贴板
const copyToClipboard = (value: number | null | undefined) => {
  if (value !== null && value !== undefined) {
    navigator.clipboard.writeText(value.toString())
      .then(() => {
        ElMessage.success('已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.error('复制失败')
      })
  }
}

// 在地图上显示
const showOnMap = async () => {
  if (!targetCoordinate.value) return
  
  mapVisible.value = true
  await nextTick()
  
  if (!map.value) {
    // 初始化地图
    map.value = L.map('map-container').setView([sourceCoordinate.value[1], sourceCoordinate.value[0]], 10)
    
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value)
  }
  
  // 清除现有标记
  map.value.eachLayer((layer: any) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer)
    }
  })
  
  // 添加源坐标标记
  L.marker([sourceCoordinate.value[1], sourceCoordinate.value[0]])
    .addTo(map.value)
    .bindPopup(`源坐标 (${sourceCrs.value})<br>${sourceCoordinate.value[0]}, ${sourceCoordinate.value[1]}`)
    .openPopup()
  
  // 添加目标坐标标记
  if (targetCoordinate.value) {
    L.marker([targetCoordinate.value[1], targetCoordinate.value[0]])
      .addTo(map.value)
      .bindPopup(`目标坐标 (${targetCrs.value})<br>${targetCoordinate.value[0]}, ${targetCoordinate.value[1]}`)
  }
}

// 添加到批量转换
const addToBatch = () => {
  if (targetCoordinate.value) {
    addBatchCoordinate(targetCoordinate.value)
    ElMessage.success('已添加到批量转换列表')
  }
}
</script>

<style scoped>
.single-transform {
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

.page-description {
  font-size: 18px;
  color: #606266;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.transform-card, .info-card {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.transform-form {
  margin-top: 20px;
}

.full-width {
  width: 100%;
  max-width: 100%;
}

/* 限制下拉框弹出层宽度 */
.coordinate-select {
  width: 100%;
  max-width: 100%;
}

/* 确保输入框不会超出容器 */
.transform-form .el-form-item {
  max-width: 100%;
}

.transform-form .el-select {
  max-width: 100%;
}

/* 使用 popper-class 控制下拉框宽度 */
:deep(.coordinate-select-dropdown) {
  max-width: 600px !important;
  width: auto !important;
}

:deep(.coordinate-select-dropdown .el-select-dropdown__wrap) {
  max-width: 600px !important;
}

/* 全局下拉框宽度限制（备用方案） */
:deep(.el-select-dropdown) {
  max-width: 600px !important;
  width: auto !important;
}

:deep(.el-select-dropdown__wrap) {
  max-width: 600px !important;
}

/* 分组标签样式 */
:deep(.el-select-group__title) {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-select-group__wrap:not(:last-of-type)) {
  border-bottom: 1px solid #e4e7ed;
}

.option-content {
  display: flex;
  flex-direction: column;
}

.option-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.option-name {
  font-weight: 600;
  color: #303133;
}

.option-code {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.option-desc {
  font-size: 12px;
  color: #909399;
  display: block;
  line-height: 1.4;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coordinate-input {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.coordinate-input {
  width: 100%;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.transform-btn {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff, #36cfc9);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.transform-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(64, 158, 255, 0.3);
}

.reset-btn {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #f0f0f0;
  border: 1px solid #dcdfe6;
  color: #606266;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.btn-icon {
  margin-right: 8px;
}

.divider {
  margin: 30px 0;
}

.divider-text {
  position: relative;
  padding: 0 20px;
  background-color: #f5f7fa;
  color: #409eff;
  font-weight: 500;
  text-align: center;
}

.divider-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #e4e7ed;
}

.error-message {
  margin: 20px 0;
}

.result-section {
  margin-top: 20px;
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.result-icon {
  font-size: 20px;
  color: #409eff;
  margin-right: 10px;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.coordinate-result {
  margin-bottom: 30px;
}

.result-group {
  display: flex;
  flex-direction: column;
}

.result-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.result-input {
  width: 100%;
}

.copy-btn {
  background-color: #f0f0f0;
  border: none;
  color: #606266;
  border-radius: 0 4px 0 0;
}

.copy-btn:hover {
  background-color: #e6e6e6;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.secondary {
  background-color: #f0f0f0;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.action-btn.secondary:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.info-content {
  padding: 20px 0;
}

.info-section {
  margin-bottom: 30px;
}

.info-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.info-title .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-list li {
  padding: 8px 0 8px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.info-list li:last-child {
  border-bottom: none;
}

.map-dialog {
  border-radius: 12px;
}

.map-container {
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-description {
    font-size: 16px;
  }
  
  .transform-btn, .reset-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
