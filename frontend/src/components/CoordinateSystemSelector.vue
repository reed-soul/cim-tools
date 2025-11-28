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
}

.option-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.option-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.option-code {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-left: 8px;
}

.option-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.full-width {
  width: 100%;
}
</style>

