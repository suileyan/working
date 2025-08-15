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

            <!-- 清空历史 -->
            <button @click="clearHistory" class="btn btn-outline btn-error">
              <el-icon class="text-error">
                <Delete />
              </el-icon>
              清空历史
            </button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-20">
          <div class="space-y-4">
            <div class="loading loading-spinner loading-lg text-primary"></div>
            <p class="text-base-content/70">正在加载历史记录...</p>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center py-20">
          <div class="space-y-4">
            <div class="text-8xl text-error/30">⚠️</div>
            <h3 class="text-2xl font-bold text-error">加载失败</h3>
            <p class="text-base-content/50">{{ error }}</p>
            <p class="text-sm text-base-content/40 mt-2">请检查网络连接或稍后重试</p>
            <div class="space-x-3">
              <button @click="retryLoad" :disabled="loading" class="btn btn-primary">
                <el-icon class="mr-2" :class="{ 'animate-spin': loading }">
                  <Refresh />
                </el-icon>
                {{ loading ? '重新加载中...' : '重新加载' }}
              </button>
              <button @click="refreshPage" class="btn btn-secondary">
                <el-icon class="mr-2">
                  <Refresh />
                </el-icon>
                刷新页面
              </button>
            </div>
          </div>
        </div>

        <!-- 历史记录列表 -->
        <div v-else-if="filteredHistory.length > 0" class="space-y-4">
          <div v-for="(record, index) in paginatedHistory" :key="record.id"
            class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            v-motion :initial="{ opacity: 0, x: -50 }" :enter="{ opacity: 1, x: 0, transition: { delay: index * 50 } }">
            <div class="flex items-center justify-between">
              <!-- 检测结果信息 -->
              <div class="flex items-center gap-4">
                <div
                  class="rounded-full w-12 h-12 flex items-center justify-center shadow-sm bg-purple-100 text-purple-600">
                  <el-icon class="text-2xl">
                    <TrendCharts />
                  </el-icon>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-purple-600">
                    {{ record.detected_category?.name || getDetectionCategory(record) || '未知分类' }}
                  </h3>
                  <p class="text-sm text-base-content/70">置信度: {{ Math.round((record.confidence || 0) * 100) }}%</p>
                  <p class="text-xs text-base-content/50">{{ formatTime(record.created_at) }}</p>
                  <p class="text-xs text-base-content/40">检测类型: {{ record.detection_type }}</p>
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

            <!-- 检测详情预览 -->
            <div v-if="record.detection_data?.detections?.length > 0" class="mt-4 p-3 bg-base-200 rounded-lg">
              <p class="text-sm text-base-content/80">💡 检测到 {{ record.detection_data.detections.length }} 个对象</p>
              <p class="text-xs text-base-content/60">处理时间: {{ record.detection_data.processing_time }}ms</p>
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
              <div
                class="rounded-full w-16 h-16 flex items-center justify-center shadow-sm bg-purple-100 text-purple-600">
                <el-icon class="text-3xl">
                  <TrendCharts />
                </el-icon>
              </div>
              <div>
                <h4 class="text-2xl font-bold text-purple-600">
                  {{ selectedRecord.detected_category?.name || getDetectionCategory(selectedRecord) || '未知分类' }}
                </h4>
                <p class="text-base-content/70">置信度: {{ Math.round((selectedRecord.confidence || 0) * 100) }}%</p>
                <p class="text-sm text-base-content/50">{{ formatTime(selectedRecord.created_at) }}</p>
                <p class="text-sm text-base-content/50">检测类型: {{ selectedRecord.detection_type }}</p>
              </div>
            </div>

            <!-- 检测详情 -->
            <div v-if="selectedRecord.detection_data" class="bg-base-200 rounded-lg p-4">
              <h5 class="font-semibold mb-2">🔍 检测详情</h5>
              <div class="space-y-2">
                <p class="text-sm">• 处理时间: {{ selectedRecord.detection_data.processing_time }}ms</p>
                <p class="text-sm">• 图片尺寸: {{ selectedRecord.detection_data.image_size?.join(' x ') }}</p>
                <p class="text-sm">• 检测设备: {{ selectedRecord.detection_data.model_info?.device }}</p>
                <p class="text-sm">• 置信度阈值: {{ selectedRecord.detection_data.model_info?.confidence_threshold }}</p>
              </div>
            </div>

            <!-- 检测对象列表 -->
            <div v-if="selectedRecord.detection_data?.detections?.length > 0" class="bg-base-200 rounded-lg p-4">
              <h5 class="font-semibold mb-2">📋 检测对象</h5>
              <div class="space-y-2">
                <div v-for="(detection, index) in selectedRecord.detection_data.detections" :key="index"
                  class="bg-white rounded p-2">
                  <p class="text-sm font-medium">{{ detection.class_name }}</p>
                  <p class="text-xs text-base-content/60">置信度: {{ Math.round(detection.confidence * 100) }}%</p>
                  <p class="text-xs text-base-content/60">类别ID: {{ detection.class_id }}</p>
                </div>
              </div>
            </div>

            <!-- 文件信息 -->
            <div class="bg-base-200 rounded-lg p-4">
              <h5 class="font-semibold mb-2">📁 文件信息</h5>
              <div class="space-y-1">
                <p class="text-sm">• 原始文件: {{ selectedRecord.original_file }}</p>
                <p class="text-sm">• 结果图片: {{ selectedRecord.result_image }}</p>
                <p class="text-sm">• 用户反馈: {{ selectedRecord.user_feedback || '无' }}</p>
                <p class="text-sm">• 是否正确: {{ selectedRecord.is_correct === null ? '未评价' : (selectedRecord.is_correct ?
                  '正确' : '错误') }}</p>
              </div>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete, View, Refresh, TrendCharts, Trophy, Calendar } from '@element-plus/icons-vue'
import { getHistoryRecords, deleteHistoryRecord, clearAllHistoryRecords } from '@/api/common/history'
import type { HistoryRecord as ApiHistoryRecord, HistoryListParams } from '@/api/common/history'

// 响应式数据
const historyRecords = ref<ApiHistoryRecord[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')

const selectedRecord = ref<ApiHistoryRecord | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10
const loading = ref(false)
const error = ref<string | null>(null)

// 辅助函数：从detection_data中获取分类
const getDetectionCategory = (record: ApiHistoryRecord): string => {
  if (record.detected_category?.name) {
    return record.detected_category.name
  }

  if (record.detection_data?.detections?.length > 0) {
    const bestDetection = record.detection_data.detections.reduce((prev, current) =>
      prev.confidence > current.confidence ? prev : current
    )

    const classMapping: Record<string, string> = {
      'jinshuchuju': '可回收垃圾',
      'suliaoyijia': '可回收垃圾',
      'yilaguanhe': '可回收垃圾',
      'zhihe': '可回收垃圾',
      'baozhi': '可回收垃圾',
      'zhiban': '可回收垃圾',
      'suliaoping': '可回收垃圾',
      'yinliaoping': '可回收垃圾',
      'jiuping': '可回收垃圾',
      'chuyu': '厨余垃圾',
      'shuiguo': '厨余垃圾',
      'shucai': '厨余垃圾',
      'dianchi': '有害垃圾',
      'yaoping': '有害垃圾',
      'dengpao': '有害垃圾',
      'qita': '其他垃圾'
    }

    return classMapping[bestDetection.class_name] || '其他垃圾'
  }

  return '未知分类'
}

// 计算属性
const historyStats = computed(() => {
  const total = historyRecords.value.length
  const avgConfidence = total > 0
    ? Math.round(historyRecords.value.reduce((sum, record) => sum + (record.confidence || 0) * 100, 0) / total)
    : 0

  const categoryCount = historyRecords.value.reduce((acc, record) => {
    const category = record.detected_category?.name || getDetectionCategory(record)
    acc[category] = (acc[category] || 0) + 1
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
    filtered = filtered.filter(record => {
      const category = record.detected_category?.name || getDetectionCategory(record)
      const detectedItem = record.detected_item?.name || ''
      return category.toLowerCase().includes(query) || detectedItem.toLowerCase().includes(query)
    })
  }

  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(record => {
      const category = record.detected_category?.name || getDetectionCategory(record)
      return category === selectedCategory.value
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
    new Date(record.created_at).toDateString()
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

const viewDetails = (record: ApiHistoryRecord) => {
  selectedRecord.value = record
}

const shareRecord = (record: ApiHistoryRecord) => {
  const category = record.detected_category?.name || getDetectionCategory(record)
  const confidence = Math.round((record.confidence || 0) * 100)
  const shareText = `我使用智能垃圾分类系统检测了一个物品，结果是：${category}，置信度：${confidence}%。`

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



// API调用方法
const loadHistoryRecords = async () => {
  try {
    loading.value = true
    error.value = null

    const params: HistoryListParams = {
    }

    const response = await getHistoryRecords(params)

    console.log(response);

    // 直接使用API返回的数据
    historyRecords.value = response.data || response

  } catch (err: any) {
    console.error('加载历史记录失败:', err)
    error.value = err.message || '加载历史记录失败，请稍后重试'
    ElMessage.error(err.message || '加载历史记录失败')
  } finally {
    loading.value = false
  }
}

const deleteRecord = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条检测记录吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false,
        distinguishCancelAndClose: true
      }
    )

    // 显示删除中的加载状态
    const loadingMessage = ElMessage({
      message: '正在删除...',
      type: 'info',
      duration: 0
    })

    try {
      await deleteHistoryRecord(id)

      // 从本地数组中移除
      historyRecords.value = historyRecords.value.filter(record => record.id !== id)

      loadingMessage.close()
      ElMessage.success('删除成功')
    } catch (apiError: any) {
      loadingMessage.close()

      // 根据错误类型提供不同的提示
      let errorMessage = '删除失败，请稍后重试'
      if (apiError.message?.includes('404')) {
        errorMessage = '记录不存在或已被删除'
        // 如果记录不存在，也从本地移除
        historyRecords.value = historyRecords.value.filter(record => record.id !== id)
      } else if (apiError.message?.includes('403')) {
        errorMessage = '没有权限删除此记录'
      } else if (apiError.message?.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络后重试'
      }

      console.error('删除记录失败:', apiError)
      ElMessage.error(errorMessage)
    }

  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      console.error('删除操作异常:', error)
      ElMessage.error('操作异常，请稍后重试')
    }
  }
}

const clearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有检测记录吗？此操作将永久删除所有历史记录，无法恢复！',
      '确认清空',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: false,
        distinguishCancelAndClose: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '清空中...'
            done()
          } else {
            done()
          }
        }
      }
    )

    // 显示清空中的加载状态
    const loadingMessage = ElMessage({
      message: '正在清空历史记录...',
      type: 'info',
      duration: 0
    })

    try {
      // 这里需要传入用户ID，实际项目中应该从用户状态中获取
      const userId = 1 // 临时硬编码，实际应该从用户状态获取
      await clearAllHistoryRecords(userId)

      historyRecords.value = []
      currentPage.value = 1
      loadingMessage.close()
      ElMessage.success('所有历史记录已清空')
    } catch (apiError: any) {
      loadingMessage.close()

      // 根据错误类型提供不同的提示
      let errorMessage = '清空失败，请稍后重试'
      if (apiError.message?.includes('403')) {
        errorMessage = '没有权限执行此操作'
      } else if (apiError.message?.includes('404')) {
        errorMessage = '用户不存在'
      } else if (apiError.message?.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络后重试'
      } else if (apiError.message?.includes('服务器')) {
        errorMessage = '服务器繁忙，请稍后重试'
      }

      console.error('清空历史记录失败:', apiError)
      ElMessage.error(errorMessage)
    }

  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      console.error('清空操作异常:', error)
      ElMessage.error('操作异常，请稍后重试')
    }
  }
}

// 重试和刷新方法
const retryLoad = () => {
  loadHistoryRecords()
}

const refreshPage = () => {
  window.location.reload()
}

// 生命周期
onMounted(() => {
  loadHistoryRecords()
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