<template>
  <div class="coordinate-display-group">
    <div class="display-row">
      <div class="display-item">
        <span class="display-label">{{ $t('transform.single.longitude') }} (X)</span>
        <el-input
          :model-value="formatCoordinate(longitude)"
          :placeholder="$t('transform.single.longitude')"
          readonly
          class="result-input"
        >
          <template #append>
            <el-button
              @click="copyCoordinate(longitude)"
              class="copy-btn"
              size="small"
            >
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <div class="display-item">
        <span class="display-label">{{ $t('transform.single.latitude') }} (Y)</span>
        <el-input
          :model-value="formatCoordinate(latitude)"
          :placeholder="$t('transform.single.latitude')"
          readonly
          class="result-input"
        >
          <template #append>
            <el-button
              @click="copyCoordinate(latitude)"
              class="copy-btn"
              size="small"
            >
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="action-buttons" v-if="showActions">
      <el-button @click="$emit('showOnMap')" class="action-btn">
        <el-icon class="btn-icon"><MapLocation /></el-icon>
        {{ $t('transform.single.showOnMap') }}
      </el-button>
      <el-button @click="$emit('addToBatch')" class="action-btn secondary">
        <el-icon class="btn-icon"><Plus /></el-icon>
        {{ $t('transform.single.addToBatch') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CopyDocument, MapLocation, Plus } from '@element-plus/icons-vue'

interface Props {
  longitude?: number
  latitude?: number
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

defineEmits<{
  showOnMap: []
  addToBatch: []
}>()

const formatCoordinate = (value?: number): string => {
  if (value === undefined || value === null) return ''
  return value.toFixed(6)
}

const copyCoordinate = async (value?: number) => {
  if (value === undefined || value === null) return

  try {
    await navigator.clipboard.writeText(value.toString())
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    // 降级处理
    const textArea = document.createElement('textarea')
    textArea.value = value.toString()
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('已复制到剪贴板')
  }
}
</script>

<style scoped>
.coordinate-display-group {
  width: 100%;
}

.display-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.display-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.display-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.result-input {
  width: 100%;
}

.copy-btn {
  border: none;
  background: transparent;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  flex: 1;
  max-width: 200px;
}

.btn-icon {
  margin-right: 6px;
}

@media (max-width: 768px) {
  .display-row {
    flex-direction: column;
    gap: 12px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    max-width: none;
  }
}
</style>

