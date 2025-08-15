<template>
  <div class="card bg-base-100 shadow-xl border-2 border-success">
    <div class="card-body">
      <!-- 结果标题 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-success flex items-center gap-2">
          <el-icon class="text-success">
            <SuccessFilled />
          </el-icon>
          检测完成
        </h2>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm btn-circle">
          <el-icon>
            <Close />
          </el-icon>
        </button>
      </div>

      <!-- 检测结果主要信息 -->
      <div class="text-center mb-8">
        <div class="text-8xl mb-4" v-motion :initial="{ opacity: 0, scale: 0 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: 200, type: 'spring' } }" :class="result.color">
          <el-icon :size="96">
            <component :is="result.iconComponent" />
          </el-icon>
        </div>

        <h3 class="text-3xl font-bold mb-2" :class="result.color" v-motion :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }">
          {{ result.detected_category || '未知分类' }}
        </h3>

        <div class="flex items-center justify-center gap-2 text-lg" v-motion :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 600 } }">
          <span class="text-base-content/70">置信度:</span>
          <div class="flex items-center gap-2">
            {{ result.confidence }}%
          </div>
        </div>
      </div>

      <!-- 检测详情 -->
      <div class="bg-base-200 rounded-lg p-6 mb-6" v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 800 } }">
        <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
          检测详情
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-base-content/70">记录ID:</span>
            <span>{{ result.record_id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-base-content/70">处理时间:</span>
            <span>{{ result.processing_time?.toFixed(3) }}秒</span>
          </div>
          <div v-if="result.summary" class="flex justify-between">
            <span class="text-base-content/70">检测帧数:</span>
            <span>{{ result.summary.processed_frames }}/{{ result.summary.total_frames }}</span>
          </div>
          <div v-if="result.summary" class="flex justify-between">
            <span class="text-base-content/70">检测对象数:</span>
            <span>{{ result.summary.total_detections }}</span>
          </div>
        </div>
      </div>

      <!-- 检测对象列表 -->
      <div v-if="result.frame_detections && result.frame_detections.length > 0" class="bg-base-200 rounded-lg p-6 mb-6" v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 1000 } }">
        <h4 class="text-lg font-semibold mb-4">检测对象</h4>
        <div class="space-y-3 max-h-40 overflow-y-auto">
          <div v-for="(frame, index) in result.frame_detections.slice(0, 3)" :key="index" class="border-l-4 border-primary pl-3">
            <div class="text-sm text-base-content/70">帧 {{ frame.frame_index }} ({{ frame.timestamp.toFixed(2) }}s)</div>
            <div v-for="detection in frame.detections" :key="detection.id" class="flex justify-between items-center">
              <span class="font-medium">{{ detection.class_name }}</span>
              <span class="text-sm text-primary">{{ (detection.confidence * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <div v-if="result.frame_detections.length > 3" class="text-center text-sm text-base-content/50">
            还有 {{ result.frame_detections.length - 3 }} 帧检测结果...
          </div>
        </div>
      </div>



      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center" v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 1400 } }">
        <button @click="shareResult" class="btn btn-outline">
          📤 分享结果
        </button>
        <button @click="detectAgain" class="btn btn-ghost">
          🔄 再次检测
        </button>
      </div>

      <!-- 检测时间 -->
      <div class="text-center mt-4">
        <p class="text-xs text-base-content/50">
          检测时间: {{ formatTime(result.timestamp) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SuccessFilled, Close } from '@element-plus/icons-vue'

// Props
interface DetectionResult {
  record_id: string
  detected_category: string
  confidence: number
  processing_time: number
  timestamp: string
  iconComponent: any
  color: string
  summary?: {
    total_frames: number
    processed_frames: number
    total_detections: number
  }
  frame_detections?: Array<{
    frame_index: number
    timestamp: number
    detections: Array<{
      id: string
      class_name: string
      confidence: number
      bbox: number[]
    }>
  }>
}

interface Props {
  result: DetectionResult
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()



// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 分享结果
const shareResult = () => {
  const shareText = `我使用智能垃圾分类系统检测了一个物品，结果是：${props.result.category}，置信度：${props.result.confidence}%。一起来保护环境吧！`

  if (navigator.share) {
    navigator.share({
      title: '垃圾分类检测结果',
      text: shareText,
      url: window.location.href
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      alert('结果已复制到剪贴板！')
    })
  }
}

// 再次检测
const detectAgain = () => {
  emit('close')
}
</script>

<style scoped>
.radial-progress {
  --size: 3rem;
  --thickness: 4px;
}

.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
}
</style>