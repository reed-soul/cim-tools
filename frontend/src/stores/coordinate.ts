import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { coordinateApi } from '@/services/api'
import { transformCoordinate, transformCoordinates, getSupportedCoordinateSystems, initCoordinateSystems } from '@/utils/coordinate'

// 定义API响应类型
interface TransformResponse {
  result?: [number, number]
  results?: Array<[number, number]>
}

export const useCoordinateStore = defineStore('coordinate', () => {
  // 状态
  const sourceCoordinate = ref<[number, number]>([116.404, 39.915])
  const sourceCrs = ref<string>('EPSG:4326')
  const targetCrs = ref<string>('EPSG:3857')
  const targetCoordinate = ref<[number, number] | null>(null)
  const batchCoordinates = ref<Array<[number, number]>>([])
  const batchResults = ref<Array<[number, number]>>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const supportedSystems = ref<Array<{ code: string; name: string; description: string }>>([])

  // 计算属性
  const hasResult = computed(() => targetCoordinate.value !== null)
  const hasBatchResults = computed(() => batchResults.value.length > 0)

  // 初始化
  function initialize() {
    initCoordinateSystems()
    supportedSystems.value = getSupportedCoordinateSystems()
  }

  // 单点坐标转换
  async function transformSingle() {
    isLoading.value = true
    error.value = null
    
    try {
      // 先尝试前端转换
      const result = transformCoordinate(sourceCoordinate.value, sourceCrs.value, targetCrs.value)
      targetCoordinate.value = result
      
      // 如果需要，也可以调用后端API进行验证
      // const response = await coordinateApi.transformSingle({
      //   coordinate: sourceCoordinate.value,
      //   sourceCrs: sourceCrs.value,
      //   targetCrs: targetCrs.value
      // })
      // if (response.success) {
      //   targetCoordinate.value = response.result
      // }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '坐标转换失败'
      console.error('坐标转换错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 批量坐标转换
  async function transformBatch() {
    if (batchCoordinates.value.length === 0) {
      error.value = '没有要转换的坐标'
      return
    }

    isLoading.value = true
    error.value = null
    
    try {
      // 先尝试前端转换
      const results = transformCoordinates(batchCoordinates.value, sourceCrs.value, targetCrs.value)
      batchResults.value = results
      
      // 如果需要，也可以调用后端API
      // const response = await coordinateApi.transformBatch({
      //   coordinates: batchCoordinates.value,
      //   sourceCrs: sourceCrs.value,
      //   targetCrs: targetCrs.value
      // })
      // if (response.success) {
      //   batchResults.value = response.results
      // }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '批量坐标转换失败'
      console.error('批量坐标转换错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 文件上传转换
  async function transformFile(file: File) {
    isLoading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sourceCrs', sourceCrs.value || '')
      formData.append('targetCrs', targetCrs.value || '')
      
      const response = await coordinateApi.transformFile(formData)
      if (response.success && response.results) {
        batchResults.value = response.results
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : '文件转换失败'
      console.error('文件转换错误:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 重置结果
  function resetResults() {
    targetCoordinate.value = null
    batchResults.value = []
    error.value = null
  }

  // 设置源坐标
  function setSourceCoordinate(coordinate: [number, number]) {
    sourceCoordinate.value = coordinate
    resetResults()
  }

  // 设置源坐标系
  function setSourceCrs(crs: string) {
    sourceCrs.value = crs
    resetResults()
  }

  // 设置目标坐标系
  function setTargetCrs(crs: string) {
    targetCrs.value = crs
    resetResults()
  }

  // 添加批量坐标
  function addBatchCoordinate(coordinate: [number, number]) {
    batchCoordinates.value.push(coordinate)
  }

  // 清空批量坐标
  function clearBatchCoordinates() {
    batchCoordinates.value = []
    resetResults()
  }

  // 从文本导入批量坐标
  function importBatchCoordinates(text: string) {
    try {
      const lines = text.trim().split('\n')
      const coordinates: Array<[number, number]> = []
      
      for (const line of lines) {
        const parts = line.split(/[,\s\t]+/)
        if (parts.length >= 2) {
          const x = parseFloat(parts[0])
          const y = parseFloat(parts[1])
          if (!isNaN(x) && !isNaN(y)) {
            coordinates.push([x, y])
          }
        }
      }
      
      batchCoordinates.value = coordinates
      resetResults()
    } catch (err) {
      error.value = '导入坐标失败'
      console.error('导入坐标错误:', err)
    }
  }

  return {
    // 状态
    sourceCoordinate,
    sourceCrs,
    targetCrs,
    targetCoordinate,
    batchCoordinates,
    batchResults,
    isLoading,
    error,
    supportedSystems,
    
    // 计算属性
    hasResult,
    hasBatchResults,
    
    // 方法
    initialize,
    transformSingle,
    transformBatch,
    transformFile,
    resetResults,
    setSourceCoordinate,
    setSourceCrs,
    setTargetCrs,
    addBatchCoordinate,
    clearBatchCoordinates,
    importBatchCoordinates
  }
})
