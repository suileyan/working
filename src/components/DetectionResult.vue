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
          {{ result.category }}
        </h3>

        <div class="flex items-center justify-center gap-2 text-lg" v-motion :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 600 } }">
          <span class="text-base-content/70">置信度:</span>
          <div class="flex items-center gap-2">
            <div class="radial-progress text-success" :style="`--value:${result.confidence}`" role="progressbar">
              {{ result.confidence }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 投放提示 -->
      <div class="bg-base-200 rounded-lg p-6 mb-6" v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 800 } }">
        <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <!-- <el-icon class="text-warning"><Lightbulb /></el-icon> -->
          投放提示
        </h4>
        <ul class="space-y-2">
          <li v-for="(tip, index) in result.tips" :key="index" class="flex items-start gap-2">
            <span class="text-primary mt-1">•</span>
            <span class="text-base-content/80">{{ tip }}</span>
          </li>
        </ul>
      </div>

      <!-- 详细分类信息 -->
      <div class="grid md:grid-cols-2 gap-6 mb-6" v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 1000 } }">
        <!-- 分类说明 -->
        <div class="space-y-3">
          <h5 class="font-semibold text-base-content/90">分类说明</h5>
          <p class="text-sm text-base-content/70">{{ getCategoryDescription(result.category) }}</p>
        </div>

        <!-- 常见物品 -->
        <div class="space-y-3">
          <h5 class="font-semibold text-base-content/90">常见物品</h5>
          <div class="flex flex-wrap gap-2">
            <span v-for="item in getCategoryExamples(result.category)" :key="item" class="badge badge-outline badge-sm">
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <!-- 环保贡献 -->
      <div
        class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6"
        v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { delay: 1200 } }">
        <div class="flex items-center gap-3">
          <div class="text-2xl">🌱</div>
          <div>
            <h5 class="font-semibold text-green-700 dark:text-green-300">环保贡献</h5>
            <p class="text-sm text-green-600 dark:text-green-400">{{ getEnvironmentalImpact(result.category) }}</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center" v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 1400 } }">
        <button @click="saveToHistory" class="btn btn-primary">
          💾 保存到历史记录
        </button>
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
  category: string
  iconComponent: any
  color: string
  confidence: number
  timestamp: string
  tips: string[]
}

interface Props {
  result: DetectionResult
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// 获取分类描述
const getCategoryDescription = (category: string) => {
  const descriptions = {
    '可回收垃圾': '指可以再生循环的垃圾，包括纸类、塑料、金属、玻璃等材料制成的包装物、容器等。',
    '厨余垃圾': '指易腐烂的生物质废料，包括食材废料、剩菜剩饭、过期食品、瓜皮果核等。',
    '有害垃圾': '指对人体健康或者自然环境造成直接或者潜在危害的生活废物。',
    '其他垃圾': '指除可回收垃圾、厨余垃圾、有害垃圾之外的其他生活废物。'
  }
  return descriptions[category] || '未知分类'
}

// 获取分类示例
const getCategoryExamples = (category: string) => {
  const examples = {
    '可回收垃圾': ['塑料瓶', '纸张', '金属罐', '玻璃瓶', '旧衣物'],
    '厨余垃圾': ['剩菜剩饭', '果皮', '蛋壳', '茶叶渣', '骨头'],
    '有害垃圾': ['废电池', '废灯管', '过期药品', '油漆', '杀虫剂'],
    '其他垃圾': ['烟蒂', '污染纸张', '破碎陶瓷', '猫砂', '一次性餐具']
  }
  return examples[category] || []
}

// 获取环保影响
const getEnvironmentalImpact = (category: string) => {
  const impacts = {
    '可回收垃圾': '正确分类可回收垃圾，每年可减少约2.3吨碳排放，相当于种植10棵树！',
    '厨余垃圾': '厨余垃圾正确处理可制成有机肥料，减少甲烷排放，保护土壤环境！',
    '有害垃圾': '正确处理有害垃圾可防止土壤和水源污染，保护生态环境安全！',
    '其他垃圾': '减少其他垃圾产生，选择可重复使用的物品，为地球减负！'
  }
  return impacts[category] || '感谢您为环保做出的贡献！'
}

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

// 保存到历史记录
const saveToHistory = () => {
  // 模拟保存到历史记录
  const historyItem = {
    id: Date.now(),
    ...props.result,
    saved: true
  }

  // 从localStorage获取现有历史记录
  const existingHistory = JSON.parse(localStorage.getItem('wasteDetectionHistory') || '[]')
  existingHistory.unshift(historyItem)

  // 限制历史记录数量（最多保存100条）
  if (existingHistory.length > 100) {
    existingHistory.splice(100)
  }

  // 保存到localStorage
  localStorage.setItem('wasteDetectionHistory', JSON.stringify(existingHistory))

  // 显示成功提示
  alert('已保存到历史记录！')
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