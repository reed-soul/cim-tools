<template>
  <div class="map-viewer">
    <div
      ref="mapContainer"
      class="map-container"
      :style="{ height: height }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  longitude?: number
  latitude?: number
  zoom?: number
  height?: string
  showMarker?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 13,
  height: '400px',
  showMarker: true,
})

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let marker: L.Marker | null = null

const initMap = () => {
  if (!mapContainer.value) return

  // 初始化地图
  map = L.map(mapContainer.value).setView([props.latitude || 39.9042, props.longitude || 116.4074], props.zoom!)

  // 添加OpenStreetMap图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // 添加标记
  if (props.showMarker && props.latitude && props.longitude) {
    addMarker(props.latitude, props.longitude)
  }
}

const addMarker = (lat: number, lng: number) => {
  if (!map) return

  // 移除现有标记
  if (marker) {
    map.removeLayer(marker)
  }

  // 添加新标记
  marker = L.marker([lat, lng]).addTo(map)

  // 居中显示
  map.setView([lat, lng], props.zoom!)
}

const updateMarker = (lat: number, lng: number) => {
  if (props.showMarker) {
    addMarker(lat, lng)
  }
}

// 监听坐标变化
watch([() => props.latitude, () => props.longitude], ([newLat, newLng]) => {
  if (newLat && newLng) {
    updateMarker(newLat, newLng)
  }
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// 暴露方法给父组件
defineExpose({
  addMarker,
  updateMarker,
})
</script>

<style scoped>
.map-viewer {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  border-radius: 8px;
}
</style>

