<template>
  <div class="info-panel">
    <div
      v-for="section in sections"
      :key="section.key"
      class="info-section"
    >
      <h3 class="info-title">
        <el-icon v-if="section.icon">
          <component :is="section.icon" />
        </el-icon>
        {{ section.title }}
      </h3>
      <ul class="info-list">
        <li
          v-for="item in section.items"
          :key="item"
          class="info-item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InfoFilled, QuestionFilled, Operation } from '@element-plus/icons-vue'

interface InfoSection {
  key: string
  title: string
  icon?: any
  items: string[]
}

interface Props {
  type: 'instructions' | 'faq' | 'tips'
}

const props = defineProps<Props>()

const sections = computed<InfoSection[]>(() => {
  switch (props.type) {
    case 'instructions':
      return [
        {
          key: 'systems',
          title: '坐标系说明',
          icon: InfoFilled,
          items: [
            'WGS84：世界大地坐标系，GPS使用的坐标系',
            'GCJ02：火星坐标系，高德、腾讯地图使用',
            'BD09：百度坐标系，百度地图使用',
            'CGCS2000：国家2000坐标系，中国官方坐标系',
          ],
        },
      ]
    case 'faq':
      return [
        {
          key: 'questions',
          title: '常见问题',
          icon: QuestionFilled,
          items: [
            '如何选择正确的坐标系？',
            '转换结果不正确怎么办？',
            '支持哪些文件格式？',
          ],
        },
      ]
    case 'tips':
      return [
        {
          key: 'operations',
          title: '操作提示',
          icon: Operation,
          items: [
            '点击转换按钮执行坐标转换',
            '点击复制按钮快速复制结果',
            '点击地图按钮在地图上查看位置',
          ],
        },
      ]
    default:
      return []
  }
})
</script>

<style scoped>
.info-panel {
  space-y: 24px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  gap: 8px;
}

.info-title .el-icon {
  font-size: 18px;
  color: var(--el-color-primary);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-item {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--el-color-primary);
  font-weight: bold;
}

.info-item strong {
  color: var(--el-text-color-primary);
  font-weight: 600;
}
</style>

