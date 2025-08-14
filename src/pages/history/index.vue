<template>
  <div class="min-h-screen bg-base-100">

    <div class="min-h-full w-full">
      <!-- Page Header -->
      <section class="relative overflow-hidden">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div class="flex items-center gap-4">
            <div
              class="rounded-full w-14 h-14 bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
              <el-icon class="text-3xl">
                <TrendCharts />
              </el-icon>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">检测历史</h1>
              <p class="text-gray-500 mt-1 text-sm">查看您的垃圾分类检测记录和统计数据</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计概览 -->
      <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div v-for="(stat, index) in historyStats" :key="stat.label"
            class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-center">
              <div class="rounded-full w-14 h-14 mx-auto mb-2 flex items-center justify-center shadow-sm"
                :class="stat.color">
                <el-icon class="text-3xl">
                  <component :is="stat.iconComponent" />
                </el-icon>
              </div>
              <div class="text-3xl font-bold" :class="stat.color">{{ stat.value }}</div>
              <div class="text-sm text-base-content/70">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- 筛选和搜索 -->
        <div class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm mb-8">
          <div class="flex flex-col md:flex-row gap-4 items-center">
            <!-- 搜索框 -->
            <div class="form-control flex-1">
              <div class="input-group">
                <input v-model="searchQuery" type="text" placeholder="搜索检测记录..." class="input input-bordered flex-1">
                <button class="btn btn-square">
                  <el-icon class="text-primary">
                    <Search />
                  </el-icon>
                </button>
              </div>
            </div>

            <!-- 分类筛选 -->
            <div class="form-control">
              <select v-model="selectedCategory" class="select select-bordered">
                <option value="">所有分类</option>
                <option value="可回收垃圾">可回收垃圾</option>
                <option value="厨余垃圾">厨余垃圾</option>
                <option value="有害垃圾">有害垃圾</option>
                <option value="其他垃圾">其他垃圾</option>
              </select>
            </div>

            <!-- 时间筛选 -->
            <div class="form-control">
              <select v-model="selectedTimeRange" class="select select-bordered">
                <option value="">所有时间</option>
                <option value="today">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
              </select>
            </div>

            <!-- 清空历史 -->
            <button @click="clearHistory" class="btn btn-outline btn-error">
              <el-icon class="text-error">
                <Delete />
              </el-icon>
              清空历史
            </button>
          </div>
        </div>

        <!-- 历史记录列表 -->
        <div v-if="filteredHistory.length > 0" class="space-y-4">
          <div v-for="(record, index) in paginatedHistory" :key="record.id"
            class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            v-motion :initial="{ opacity: 0, x: -50 }" :enter="{ opacity: 1, x: 0, transition: { delay: index * 50 } }">
            <div class="flex items-center justify-between">
              <!-- 检测结果信息 -->
              <div class="flex items-center gap-4">
                <div class="rounded-full w-12 h-12 flex items-center justify-center shadow-sm" :class="record.color">
                  <el-icon class="text-2xl">
                    <component :is="record.icon" />
                  </el-icon>
                </div>
                <div>
                  <h3 class="text-xl font-bold" :class="record.color">{{ record.category }}</h3>
                  <p class="text-sm text-base-content/70">置信度: {{ record.confidence }}%</p>
                  <p class="text-xs text-base-content/50">{{ formatTime(record.timestamp) }}</p>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-2">
                <button @click="viewDetails(record)" class="btn btn-ghost btn-sm" title="查看详情">
                  <el-icon class="text-info">
                    <View />
                  </el-icon>
                </button>
                <button @click="shareRecord(record)" class="btn btn-ghost btn-sm" title="分享">📤</button>
                <button @click="deleteRecord(record.id)" class="btn btn-ghost btn-sm text-error" title="删除">
                  <el-icon class="text-error">
                    <Delete />
                  </el-icon>
                </button>
              </div>
            </div>

            <!-- 检测提示预览 -->
            <div v-if="record.tips && record.tips.length > 0" class="mt-4 p-3 bg-base-200 rounded-lg">
              <p class="text-sm text-base-content/80">💡 {{ record.tips[0] }}<span v-if="record.tips.length > 1"
                  class="text-base-content/60">等 {{ record.tips.length }} 条提示</span></p>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <div class="space-y-4" v-motion :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }">
            <div class="text-8xl text-base-content/30">📋</div>
            <h3 class="text-2xl font-bold text-base-content/70">暂无检测记录</h3>
            <p class="text-base-content/50">开始您的第一次垃圾分类检测吧！</p>
            <router-link to="/detection" class="btn btn-primary btn-lg">
              开始检测
            </router-link>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <div class="btn-group">
            <button @click="currentPage--" :disabled="currentPage === 1" class="btn">
              «
            </button>

            <button v-for="page in visiblePages" :key="page"
              @click="typeof page === 'number' ? currentPage = page : null" :disabled="typeof page === 'string'"
              :class="['btn', { 'btn-active': page === currentPage }]">
              {{ page }}
            </button>

            <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn">
              »
            </button>
          </div>
        </div>
      </section>

      <!-- 详情模态框 -->
      <div v-if="selectedRecord" class="modal modal-open">
        <div class="modal-box max-w-2xl">
          <h3 class="font-bold text-lg mb-4">检测详情</h3>

          <div class="space-y-4">
            <!-- 基本信息 -->
            <div class="flex items-center gap-4">
              <div class="rounded-full w-16 h-16 flex items-center justify-center shadow-sm"
                :class="selectedRecord.color">
                <el-icon class="text-3xl">
                  <component :is="selectedRecord.icon" />
                </el-icon>
              </div>
              <div>
                <h4 class="text-2xl font-bold" :class="selectedRecord.color">{{ selectedRecord.category }}</h4>
                <p class="text-base-content/70">置信度: {{ selectedRecord.confidence }}%</p>
                <p class="text-sm text-base-content/50">{{ formatTime(selectedRecord.timestamp) }}</p>
              </div>
            </div>

            <!-- 投放提示 -->
            <div v-if="selectedRecord.tips" class="bg-base-200 rounded-lg p-4">
              <h5 class="font-semibold mb-2">💡 投放提示</h5>
              <ul class="space-y-1">
                <li v-for="tip in selectedRecord.tips" :key="tip" class="text-sm">
                  • {{ tip }}
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-action">
            <button @click="selectedRecord = null" class="btn">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Delete, View, Refresh, Apple, Warning, DeleteFilled, TrendCharts, Trophy, Calendar } from '@element-plus/icons-vue'

// 接口定义
interface HistoryRecord {
  id: number
  category: string
  icon: any // Vue组件类型
  color: string
  confidence: number
  timestamp: string
  tips?: string[]
}

// 响应式数据
const historyRecords = ref<HistoryRecord[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTimeRange = ref('')
const selectedRecord = ref<HistoryRecord | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10

// 生成模拟历史数据
const generateMockHistory = (): HistoryRecord[] => {
  const categories = [
    { name: '可回收垃圾', icon: Refresh, color: 'text-blue-600' },
    { name: '厨余垃圾', icon: Apple, color: 'text-green-600' },
    { name: '有害垃圾', icon: Warning, color: 'text-red-600' },
    { name: '其他垃圾', icon: DeleteFilled, color: 'text-gray-600' }
  ]

  const tips: Record<string, string[]> = {
    '可回收垃圾': ['请清洗干净后投放', '塑料瓶请压扁节省空间', '纸张请保持干燥'],
    '厨余垃圾': ['请沥干水分后投放', '大骨头属于其他垃圾', '包装袋请取出'],
    '有害垃圾': ['请投放到专门的有害垃圾桶', '电池请用胶带包裹电极', '过期药品请保持原包装'],
    '其他垃圾': ['请投放到其他垃圾桶', '尽量压缩体积', '避免液体渗漏']
  }

  const records: HistoryRecord[] = []

  for (let i = 0; i < 25; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const confidence = Math.floor(Math.random() * 20 + 80) // 80-100%
    const daysAgo = Math.floor(Math.random() * 30) // 最近30天
    const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

    records.push({
      id: Date.now() + i,
      category: category.name,
      icon: category.icon,
      color: category.color,
      confidence,
      timestamp,
      tips: tips[category.name] || []
    })
  }

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 计算属性
const historyStats = computed(() => {
  const total = historyRecords.value.length
  const avgConfidence = total > 0
    ? Math.round(historyRecords.value.reduce((sum, record) => sum + record.confidence, 0) / total)
    : 0

  const categoryCount = historyRecords.value.reduce((acc, record) => {
    acc[record.category] = (acc[record.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostFrequent = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]

  return [
    {
      iconComponent: TrendCharts,
      value: total,
      label: '总检测次数',
      color: 'text-primary'
    },
    {
      iconComponent: TrendCharts,
      value: `${avgConfidence}%`,
      label: '平均置信度',
      color: 'text-success'
    },
    {
      iconComponent: Trophy,
      value: mostFrequent ? mostFrequent[1] : 0,
      label: '最多分类次数',
      color: 'text-warning'
    },
    {
      iconComponent: Calendar,
      value: getStreakDays(),
      label: '连续检测天数',
      color: 'text-info'
    }
  ]
})

const filteredHistory = computed(() => {
  let filtered = historyRecords.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record =>
      record.category.toLowerCase().includes(query)
    )
  }

  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(record => record.category === selectedCategory.value)
  }

  // 时间筛选
  if (selectedTimeRange.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    filtered = filtered.filter(record => {
      const recordDate = new Date(record.timestamp)

      switch (selectedTimeRange.value) {
        case 'today':
          return recordDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return recordDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          return recordDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredHistory.value.length / itemsPerPage))

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredHistory.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// 方法
const getStreakDays = (): number => {
  if (historyRecords.value.length === 0) return 0

  const dates = [...new Set(historyRecords.value.map(record =>
    new Date(record.timestamp).toDateString()
  ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  const today = new Date().toDateString()

  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - i)

    if (dates[i] === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const viewDetails = (record: HistoryRecord) => {
  selectedRecord.value = record
}

const shareRecord = (record: HistoryRecord) => {
  const shareText = `我使用智能垃圾分类系统检测了一个物品，结果是：${record.category}，置信度：${record.confidence}%。`

  if (navigator.share) {
    navigator.share({
      title: '垃圾分类检测结果',
      text: shareText,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('结果已复制到剪贴板！')
    })
  }
}

const deleteRecord = (id: number) => {
  if (confirm('确定要删除这条记录吗？')) {
    historyRecords.value = historyRecords.value.filter(record => record.id !== id)
    // 同时从localStorage删除
    localStorage.setItem('wasteDetectionHistory', JSON.stringify(historyRecords.value))
  }
}

const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
    historyRecords.value = []
    localStorage.removeItem('wasteDetectionHistory')
    currentPage.value = 1
  }
}

// 生命周期
onMounted(() => {
  // 尝试从localStorage加载历史记录
  const savedHistory = localStorage.getItem('wasteDetectionHistory')
  if (savedHistory) {
    historyRecords.value = JSON.parse(savedHistory)
  } else {
    // 如果没有保存的历史记录，生成模拟数据
    historyRecords.value = generateMockHistory()
  }
})
</script>

<style scoped>
.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.modal-box {
  max-height: 80vh;
  overflow-y: auto;
}
</style>