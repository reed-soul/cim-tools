<template>
  <div class="coordinate-input-group">
    <div class="input-row">
      <div class="input-item">
        <span class="input-label">{{ $t('transform.single.longitude') }} (X)</span>
        <el-input-number
          :model-value="longitude"
          @update:modelValue="updateLongitude"
          :placeholder="$t('transform.single.longitude')"
          class="coordinate-input"
          :precision="precision"
          controls-position="right"
          :min="longitudeMin"
          :max="longitudeMax"
        />
      </div>
      <div class="input-item">
        <span class="input-label">{{ $t('transform.single.latitude') }} (Y)</span>
        <el-input-number
          :model-value="latitude"
          @update:modelValue="updateLatitude"
          :placeholder="$t('transform.single.latitude')"
          class="coordinate-input"
          :precision="precision"
          controls-position="right"
          :min="latitudeMin"
          :max="latitudeMax"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  longitude?: number
  latitude?: number
  precision?: number
  longitudeMin?: number
  longitudeMax?: number
  latitudeMin?: number
  latitudeMax?: number
}

const props = withDefaults(defineProps<Props>(), {
  precision: 6,
  longitudeMin: -180,
  longitudeMax: 180,
  latitudeMin: -90,
  latitudeMax: 90,
})

const emit = defineEmits<{
  'update:longitude': [value: number]
  'update:latitude': [value: number]
}>()

const updateLongitude = (value: number) => {
  emit('update:longitude', value)
}

const updateLatitude = (value: number) => {
  emit('update:latitude', value)
}
</script>

<style scoped>
.coordinate-input-group {
  width: 100%;
}

.input-row {
  display: flex;
  gap: 16px;
}

.input-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.coordinate-input {
  width: 100%;
}

@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

