<template>
  <div class="batch-transform">
    <div class="page-header">
      <h1 class="page-title">批量坐标转换</h1>
      <p class="page-description">支持批量坐标转换，可通过文本输入或文件上传方式，支持CSV、TXT、Excel等格式</p>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card class="input-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">输入设置</span>
              <el-tag type="info" size="small">批量模式</el-tag>
            </div>
          </template>
          
          <el-form :model="form" label-width="120px" class="transform-form">
            <el-form-item label="源坐标系">
              <el-select 
                v-model="sourceCrs" 
                placeholder="选择源坐标系" 
                class="full-width"
                filterable
              >
                <el-option
                  v-for="system in supportedSystems"
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
              </el-select>
            </el-form-item>
            
            <el-form-item label="目标坐标系">
              <el-select 
                v-model="targetCrs" 
                placeholder="选择目标坐标系" 
                class="full-width"
                filterable
              >
                <el-option
                  v-for="system in supportedSystems"
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
              </el-select>
            </el-form-item>
            
            <el-form-item label="输入方式">
              <el-radio-group v-model="inputMethod" class="input-method-group">
                <el-radio label="text" class="method-option">
                  <div class="method-content">
                    <el-icon class="method-icon"><EditPen /></el-icon>
                    <span class="method-text">文本输入</span>
                  </div>
                </el-radio>
                <el-radio label="file" class="method-option">
                  <div class="method-content">
                    <el-icon class="method-icon"><Upload /></el-icon>
                    <span class="method-text">文件上传</span>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            
            <!-- 文本输入 -->
            <el-form-item v-if="inputMethod === 'text'" label="坐标数据" class="text-input-item">
              <el-input
                :model-value="coordinateText"
                @update:model-value="(val) => coordinateText = val"
                type="textarea"
                :rows="10"
                placeholder="请输入坐标数据，每行一个坐标，格式：经度,纬度 或 X,Y"
                class="coordinate-textarea"
              />
              <div class="input-tip">
                <p><el-icon class="tip-icon"><InfoFilled /></el-icon> 提示：每行一个坐标，支持逗号、空格或制表符分隔</p>
                <p><el-icon class="tip-icon"><InfoFilled /></el-icon> 示例：116.404,39.915 或 116.404 39.915</p>
              </div>
            </el-form-item>
            
            <!-- 文件上传 -->
            <el-form-item v-if="inputMethod === 'file'" label="选择文件" class="file-input-item">
              <el-upload
                ref="uploadRef"
                :auto-upload="false"
                :on-change="handleFileChange"
                :file-list="fileList"
                :limit="1"
                accept=".csv,.txt,.xlsx,.xls"
                drag
                class="file-upload"
              >
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="upload-text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="upload-tip">
                    <el-icon class="tip-icon"><Document /></el-icon>
                    支持 CSV、TXT、Excel 文件，文件大小不超过 10MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            
            <el-form-item class="form-actions">
              <el-button type="primary" @click="handleTransform" :loading="isLoading" class="transform-btn">
                <el-icon class="btn-icon"><Refresh /></el-icon>
                转换
              </el-button>
              <el-button @click="handleReset" class="reset-btn">
                <el-icon class="btn-icon"><RefreshRight /></el-icon>
                重置
              </el-button>
              <el-button v-if="hasBatchResults" @click="downloadResults" class="download-btn">
                <el-icon class="btn-icon"><Download /></el-icon>
                下载结果
              </el-button>
            </el-form-item>
          </el-form>
          
          <el-divider class="divider">
            <div class="divider-text">转换状态</div>
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
          
          <div v-if="isLoading" class="loading-section">
            <el-skeleton :rows="5" animated />
            <p class="loading-text">正在转换中，请稍候...</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="10">
        <el-card class="result-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">转换结果</span>
              <el-tag v-if="hasBatchResults" type="success" class="result-count">
                {{ batchResults.length }} 条记录
              </el-tag>
            </div>
          </template>
          
          <div v-if="!hasBatchResults && !isLoading" class="empty-result">
            <el-empty description="暂无转换结果" class="empty-icon">
              <template #image>
                <el-icon class="empty-icon"><Box /></el-icon>
              </template>
            </el-empty>
          </div>
          
          <div v-if="hasBatchResults" class="result-table">
            <el-table :data="tableData" height="500" class="data-table">
              <el-table-column prop="index" label="序号" width="60" align="center" />
              <el-table-column label="源坐标" align="center">
                <el-table-column prop="sourceX" label="X/经度" width="120" align="center" />
                <el-table-column prop="sourceY" label="Y/纬度" width="120" align="center" />
              </el-table-column>
              <el-table-column label="目标坐标" align="center">
                <el-table-column prop="targetX" label="X/经度" width="120" align="center" />
                <el-table-column prop="targetY" label="Y/纬度" width="120" align="center" />
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button size="small" @click="showOnMap(scope.row)" class="map-btn">
                    <el-icon><MapLocation /></el-icon>
                    地图
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
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
import { ElMessage } from 'element-plus'
import { UploadFilled, EditPen, Upload, InfoFilled, Document, Download, Box, MapLocation, Refresh, RefreshRight } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { useCoordinateStore } from '@/stores/coordinate'
import { searchCoordinateSystems } from '@/utils/coordinate'
import L from 'leaflet'

// 定义表格行类型
interface TableRow {
  index: number
  sourceX: string
  sourceY: string
  targetX: string
  targetY: string
  sourceCoordinate: [number, number]
  targetCoordinate: [number, number]
}

const coordinateStore = useCoordinateStore()

// 从store中获取状态和方法
const {
  sourceCrs,
  targetCrs,
  batchCoordinates,
  batchResults,
  isLoading,
  error,
  supportedSystems,
  hasBatchResults,
  transformBatch,
  transformFile,
  setSourceCrs,
  setTargetCrs,
  clearBatchCoordinates,
  importBatchCoordinates,
  resetResults
} = coordinateStore

// 本地状态
const inputMethod = ref('text')
const coordinateText = ref('')
const fileList = ref<UploadFile[]>([])
const mapVisible = ref(false)
const map = ref<any>(null)
const uploadRef = ref()
const sourceSearchQuery = ref('')
const targetSearchQuery = ref('')
const filteredSourceSystems = ref(supportedSystems.value)
const filteredTargetSystems = ref(supportedSystems.value)

// 表单数据
const form = computed(() => ({
  sourceCrs: sourceCrs.value,
  targetCrs: targetCrs.value
}))

// 表格数据
const tableData = computed((): TableRow[] => {
  return batchResults.value.map((coord: [number, number], index: number) => ({
    index: index + 1,
    sourceX: batchCoordinates.value[index]?.[0]?.toFixed(6) || '',
    sourceY: batchCoordinates.value[index]?.[1]?.toFixed(6) || '',
    targetX: coord[0]?.toFixed(6) || '',
    targetY: coord[1]?.toFixed(6) || '',
    sourceCoordinate: batchCoordinates.value[index],
    targetCoordinate: coord
  }))
})

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
  if (inputMethod.value === 'text') {
    if (!coordinateText.value.trim()) {
      ElMessage.warning('请输入坐标数据')
      return
    }
    importBatchCoordinates(coordinateText.value)
  }
  
  if (batchCoordinates.value.length === 0) {
    ElMessage.warning('没有要转换的坐标')
    return
  }
  
  await transformBatch()
  if (hasBatchResults.value) {
    ElMessage.success(`成功转换 ${batchResults.value.length} 个坐标`)
  }
}

// 重置
const handleReset = () => {
  coordinateText.value = ''
  fileList.value = []
  clearBatchCoordinates()
  resetResults()
  uploadRef.value?.clearFiles()
}

// 文件变化处理
const handleFileChange = (file: UploadFile) => {
  if (file.raw) {
    handleFileTransform(file.raw)
  }
}

// 文件转换
const handleFileTransform = async (file: File) => {
  try {
    await transformFile(file)
    ElMessage.success(`文件转换成功，共 ${batchResults.value.length} 条记录`)
  } catch (err) {
    ElMessage.error('文件转换失败')
  }
}

// 下载结果
const downloadResults = () => {
  if (!hasBatchResults.value) return
  
  // 创建CSV内容
  let csvContent = '序号,源X,源Y,目标X,目标Y\n'
  tableData.value.forEach((row: TableRow) => {
    csvContent += `${row.index},${row.sourceX},${row.sourceY},${row.targetX},${row.targetY}\n`
  })
  
  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `coordinate_transform_${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('结果已下载')
}

// 在地图上显示
const showOnMap = async (row: TableRow) => {
  mapVisible.value = true
  await nextTick()
  
  if (!map.value) {
    // 初始化地图
    map.value = L.map('map-container').setView([row.sourceCoordinate[1], row.sourceCoordinate[0]], 10)
    
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
  L.marker([row.sourceCoordinate[1], row.sourceCoordinate[0]])
    .addTo(map.value)
    .bindPopup(`源坐标 (${sourceCrs.value})<br>${row.sourceCoordinate[0]}, ${row.sourceCoordinate[1]}`)
    .openPopup()
  
  // 添加目标坐标标记
  L.marker([row.targetCoordinate[1], row.targetCoordinate[0]])
    .addTo(map.value)
    .bindPopup(`目标坐标 (${targetCrs.value})<br>${row.targetCoordinate[0]}, ${row.targetCoordinate[1]}`)
}
</script>

<style scoped>
.batch-transform {
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

.input-card, .result-card {
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

.input-method-group {
  display: flex;
  gap: 20px;
}

.method-option {
  flex: 1;
  padding: 15px;
  border: 2px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-option:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.method-option.is-checked {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.method-content {
  display: flex;
  align-items: center;
}

.method-icon {
  font-size: 20px;
  margin-right: 8px;
  color: #606266;
}

.method-text {
  font-size: 16px;
  font-weight: 500;
}

.text-input-item, .file-input-item {
  margin-bottom: 10px;
}

.coordinate-textarea {
  font-family: 'Courier New', Courier, monospace;
}

.input-tip {
  margin-top: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.tip-icon {
  margin-right: 8px;
  color: #409eff;
}

.file-upload {
  width: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.file-upload:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #606266;
}

.upload-text em {
  color: #409eff;
  font-style: normal;
}

.upload-tip {
  margin-top: 10px;
  font-size: 14px;
  color: #909399;
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

.download-btn {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #67c23a;
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background-color: #5dafab;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(103, 194, 58, 0.3);
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
  color: #67c23a;
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

.loading-section {
  text-align: center;
  padding: 40px 0;
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
  color: #606266;
}

.empty-result {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 64px;
  color: #c0c4cc;
}

.result-table {
  margin-top: 10px;
}

.data-table {
  border-radius: 8px;
  overflow: hidden;
}

.result-count {
  font-size: 14px;
}

.map-btn {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  background-color: #409eff;
  border: none;
  color: white;
}

.map-btn:hover {
  background-color: #337ecc;
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
  
  .transform-btn, .reset-btn, .download-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
