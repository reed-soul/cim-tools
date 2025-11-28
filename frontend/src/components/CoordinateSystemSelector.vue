<template>
  <el-select
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :placeholder="placeholder"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCoordinateStore } from '@/stores/coordinate'

interface Props {
  modelValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '选择坐标系'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const coordinateStore = useCoordinateStore()
const { groupedSystems } = storeToRefs(coordinateStore)
</script>

<style scoped>
.option-content {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  max-width: 100%;
  overflow: hidden;
}

.option-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  width: 100%;
}

.option-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.option-code {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-left: 8px;
  flex-shrink: 0;
}

.option-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.full-width {
  width: 100%;
}
</style>

<style>
/* 全局样式：限制坐标系选择器下拉框宽度 - 使用最高优先级 */
.coordinate-select-dropdown.el-popper {
  max-width: 450px !important;
  width: 450px !important;
  min-width: 300px !important;
  box-sizing: border-box !important;
}

.coordinate-select-dropdown .el-select-dropdown__wrap {
  max-width: 450px !important;
  width: 450px !important;
  box-sizing: border-box !important;
}

.coordinate-select-dropdown .el-select-dropdown__list {
  max-width: 450px !important;
  width: 450px !important;
  box-sizing: border-box !important;
}

.coordinate-select-dropdown .el-select-group__wrap {
  max-width: 450px !important;
  width: 450px !important;
  box-sizing: border-box !important;
}

.coordinate-select-dropdown .el-select-group {
  max-width: 450px !important;
  width: 450px !important;
  box-sizing: border-box !important;
}

/* 确保选项内容不会超出 */
.coordinate-select-dropdown .el-select-dropdown__item {
  max-width: 100% !important;
  width: 100% !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  box-sizing: border-box !important;
}

/* 确保选项内容区域也有宽度限制 */
.coordinate-select-dropdown .option-content {
  max-width: 100% !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

/* 强制覆盖Element Plus的默认样式 */
.el-select-dropdown.coordinate-select-dropdown {
  max-width: 450px !important;
  width: 450px !important;
}

.el-select-dropdown.coordinate-select-dropdown .el-popper__arrow {
  display: none !important;
}
</style>

