<template>
  <div class="min-h-full w-full">
    <!-- Page Header -->
    <section class="relative overflow-hidden">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div class="flex items-center gap-4">
          <div class="rounded-full w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
            <el-icon class="text-3xl">
              <MagicStick />
            </el-icon>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">垃圾分类检测</h1>
            <p class="text-gray-500 mt-1 text-sm">上传图片或拍照，智能识别垃圾类别</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 检测统计 -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div v-for="(stat, index) in detectionStats" :key="stat.label"
          class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="text-center">
            <div class="rounded-full w-14 h-14 mx-auto mb-2 flex items-center justify-center shadow-sm"
              :class="stat.color">
              <el-icon class="text-3xl">
                <component :is="stat.iconComponent" />
              </el-icon>
            </div>
            <div class="text-3xl font-bold" :class="stat.color">{{ stat.value }}</div>
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- 检测方式选择 -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div v-for="method in detectionMethods" :key="method.id"
          class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          :class="{ 'ring-2 ring-primary': selectedMethod === method.id }" @click="selectMethod(method.id)" v-motion
          :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { delay: method.delay } }">
          <div class="text-center">
            <div
              class="rounded-full w-14 h-14 mx-auto mb-4 bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
              <el-icon class="text-3xl">
                <component :is="method.iconComponent" />
              </el-icon>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ method.title }}</h3>
            <p class="text-gray-500 text-sm">{{ method.description }}</p>
          </div>
        </div>
      </div>

      <!-- 检测区域 -->
      <div class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm">
        <!-- 图片检测 -->
        <div v-if="selectedMethod === 1" class="space-y-6">
          <h2 class="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <el-icon class="text-primary">
              <Picture />
            </el-icon>
            图片检测
          </h2>

          <!-- 文件上传区域 -->
          <div
            class="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-primary transition-colors"
            @dragover.prevent @drop.prevent="handleFileDrop" @click="$refs.imageInput.click()">
            <div v-if="!selectedImage" class="space-y-4">
              <div class="text-6xl text-gray-300">📁</div>
              <p class="text-lg font-medium">点击或拖拽图片到此处</p>
              <p class="text-sm text-gray-500">支持 JPG、PNG 格式，最大 5MB</p>
            </div>

            <div v-else class="space-y-4">
              <img :src="selectedImage" alt="Selected image" class="max-w-full max-h-64 mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500">{{ selectedImageName }}</p>
              <button @click.stop="clearImage" class="btn btn-outline btn-sm">重新选择</button>
            </div>
          </div>

          <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageSelect">

          <div class="text-center">
            <button @click="detectImage" :disabled="!selectedImage || isDetecting" class="btn btn-primary btn-lg">
              <span v-if="isDetecting" class="loading loading-spinner"></span>
              {{ isDetecting ? '检测中...' : '开始检测' }}
            </button>
          </div>
        </div>

        <!-- 视频检测 -->
        <div v-else-if="selectedMethod === 2" class="space-y-6">
          <h2 class="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <el-icon class="text-primary">
              <VideoCamera />
            </el-icon>
            视频检测
          </h2>

          <!-- 视频上传区域 -->
          <div
            class="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-primary transition-colors"
            @dragover.prevent @drop.prevent="handleVideoDrop" @click="$refs.videoInput.click()">
            <div v-if="!selectedVideo" class="space-y-4">
              <div class="text-6xl text-gray-300">🎬</div>
              <p class="text-lg font-medium">点击或拖拽视频到此处</p>
              <p class="text-sm text-gray-500">支持 MP4、AVI 格式，最大 50MB</p>
            </div>

            <div v-else class="space-y-4">
              <div class="relative mx-auto max-w-2xl">
                <div class="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                  <video :src="selectedVideo" controls class="w-full h-full object-contain"></video>
                </div>
              </div>
              <p class="text-sm text-gray-500">{{ selectedVideoName }}</p>
              <button @click.stop="clearVideo" class="btn btn-outline btn-sm">重新选择</button>
            </div>
          </div>

          <input ref="videoInput" type="file" accept="video/*" class="hidden" @change="handleVideoSelect">

          <div class="text-center">
            <button @click="detectVideo" :disabled="!selectedVideo || isDetecting" class="btn btn-primary btn-lg">
              <span v-if="isDetecting" class="loading loading-spinner"></span>
              {{ isDetecting ? '检测中...' : '开始检测' }}
            </button>
          </div>
        </div>

        <!-- 实时摄像头检测 -->
        <div v-else-if="selectedMethod === 3" class="space-y-6">
          <h2 class="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <el-icon class="text-primary">
              <Camera />
            </el-icon>
            实时摄像头检测
          </h2>

          <!-- 摄像头预览区域 -->
          <div class="bg-black rounded-lg overflow-hidden">
            <video ref="cameraVideo" :class="{ 'hidden': !isCameraActive }" class="w-full h-1/3 object-cover" autoplay
              muted></video>

            <div v-if="!isCameraActive" class="h-64 flex items-center justify-center text-white">
              <div class="text-center space-y-4">
                <div class="text-6xl text-primary">
                  <el-icon :size="72">
                    <Camera />
                  </el-icon>
                </div>
                <p class="text-lg">点击下方按钮启动摄像头</p>
              </div>
            </div>
          </div>

          <!-- WebSocket连接状态指示器 -->
          <div v-if="isCameraActive" class="text-center mb-4">
            <div class="badge" :class="isWebSocketConnected ? 'badge-success' : 'badge-error'">
              {{ isWebSocketConnected ? 'WebSocket已连接' : 'WebSocket未连接' }}
            </div>
          </div>

          <div class="flex justify-center space-x-4">
            <button v-if="!isCameraActive" @click="startCamera" class="btn btn-primary">
              启动摄像头
            </button>

            <template v-else>
              <button @click="capturePhoto" :disabled="isDetecting || isRealtimeDetecting" class="btn btn-primary">
                <span v-if="isDetecting" class="loading loading-spinner"></span>
                {{ isDetecting ? '检测中...' : '拍照检测' }}
              </button>

              <button v-if="!isRealtimeDetecting" @click="startRealtimeDetection" class="btn btn-warning"
                :disabled="!isWebSocketConnected">
                开始实时检测
              </button>

              <button v-else @click="stopRealtimeDetection" class="btn btn-info">
                停止实时检测
              </button>

              <button @click="stopCamera" class="btn btn-outline">
                关闭摄像头
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- 检测结果列表 -->
      <div v-if="detectionResults.length > 0" class="mt-8 space-y-4">
        <div v-for="(result, index) in detectionResults" :key="result.id"
          class="rounded-xl border border-gray-100/60 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
          v-motion :initial="{ opacity: 0, x: -50 }" :enter="{ opacity: 1, x: 0, transition: { delay: index * 50 } }">
          <div class="flex items-center justify-between">
            <!-- 检测结果信息 -->
            <div class="flex items-center gap-4">
              <div class="rounded-full w-12 h-12 flex items-center justify-center shadow-sm" :class="result.color">
                <el-icon class="text-2xl">
                  <component :is="result.icon" />
                </el-icon>
              </div>
              <div>
                <h3 class="text-xl font-bold" :class="result.color">{{ result.category }}</h3>
                <p class="text-sm text-gray-500">置信度: {{ result.confidence }}%</p>
                <p class="text-xs text-gray-400">{{ formatTimeShort(result.timestamp) }}</p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2">
              <button @click="viewDetails(result)" class="btn btn-ghost btn-sm" title="查看详情">
                <el-icon class="text-info">
                  <View />
                </el-icon>
              </button>
              <button @click="deleteResult(result.id)" class="btn btn-ghost btn-sm text-error" title="删除">
                <el-icon class="text-error">
                  <Delete />
                </el-icon>
              </button>
            </div>
          </div>

          <!-- 检测提示预览 -->
          <div v-if="result.tips && result.tips.length > 0" class="mt-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">💡 {{ result.tips[0] }}<span v-if="result.tips.length > 1"
                class="text-gray-400">等 {{ result.tips.length }} 条提示</span></p>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="mt-8 text-center py-20">
        <div class="space-y-4" v-motion :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }">
          <div class="text-8xl text-gray-300">🧪</div>
          <h3 class="text-2xl font-bold text-gray-500">暂无检测结果</h3>
          <p class="text-gray-400">上传图片或拍照，开始垃圾分类检测吧！</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <div class="btn-group">
          <button @click="currentPage--" :disabled="currentPage === 1" class="btn">
            «
          </button>

          <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
            :class="['btn', { 'btn-active': page === currentPage }]">
            {{ page }}
          </button>

          <button @click="currentPage++" :disabled="currentPage === totalPages" class="btn">
            »
          </button>
        </div>
      </div>
    </section>

    <!-- 检测结果 -->
    <div v-if="detectionResult || (isRealtimeDetecting && realtimeResults.length > 0)" class="mt-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4">
          {{ isRealtimeDetecting ? '实时检测结果' : '检测结果' }}
          <span v-if="isRealtimeDetecting" class="ml-2 text-sm text-green-600">(实时更新)</span>
        </h3>

        <!-- 实时检测结果 -->
        <div v-if="isRealtimeDetecting && realtimeResults.length > 0" class="realtime-result">
          <div class="mb-4 flex items-center">
            <span class="realtime-indicator"></span>
            <span class="text-sm text-gray-600">帧ID: {{ frameId }}</span>
            <span class="ml-4 text-sm text-gray-600">最近更新: {{ new Date().toLocaleTimeString() }}</span>
          </div>

          <!-- 实时检测到的物品列表 -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3 flex items-center">
              <span class="realtime-indicator"></span>
              当前检测到的物品：
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(result, index) in realtimeResults.slice(0, 6)" :key="index"
                class="border rounded-lg p-4 hover:shadow-md transition-shadow realtime-result">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-800">{{ result.category }}</span>
                  <span class="text-sm text-green-600 font-semibold">{{ result.confidence }}%</span>
                </div>
                <div class="text-sm text-gray-600">
                  <p>分类: {{ result.category }}</p>
                  <p class="text-xs text-gray-400">{{ formatTime(result.timestamp) }}</p>
                </div>
                <!-- 置信度进度条 -->
                <div class="mt-2">
                  <div class="confidence-bar">
                    <div class="confidence-fill" :style="{ width: result.confidence + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 静态检测结果 -->
        <div v-else-if="detectionResult">
          <DetectionResult :result="detectionResult" @close="clearResult" />
        </div>
      </div>
    </div>

    <!-- 详情模态框 -->
    <div v-if="selectedResult" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">检测详情</h3>

        <div class="space-y-4">
          <!-- 基本信息 -->
          <div class="flex items-center gap-4">
            <div class="rounded-full w-16 h-16 flex items-center justify-center shadow-sm"
              :class="selectedResult.color">
              <el-icon class="text-3xl">
                <component :is="selectedResult.icon" />
              </el-icon>
            </div>
            <div>
              <h4 class="text-2xl font-bold" :class="selectedResult.color">{{ selectedResult.category }}</h4>
              <p class="text-gray-500">置信度: {{ selectedResult.confidence }}%</p>
              <p class="text-sm text-gray-400">{{ formatTime(selectedResult.timestamp) }}</p>
            </div>
          </div>

          <!-- 检测基本信息 -->
          <div class="bg-base-200 rounded-lg p-4">
            <h5 class="font-semibold mb-2">📊 检测信息</h5>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-base-content/70">记录ID:</span>
                <span>{{ selectedResult.record_id }}</span>
              </div>
              <div v-if="selectedResult.processing_time" class="flex justify-between">
                <span class="text-base-content/70">处理时间:</span>
                <span>{{ selectedResult.processing_time.toFixed(3) }}秒</span>
              </div>
              <div v-if="selectedResult.summary" class="flex justify-between">
                <span class="text-base-content/70">检测帧数:</span>
                <span>{{ selectedResult.summary.processed_frames }}/{{ selectedResult.summary.total_frames }}</span>
              </div>
              <div v-if="selectedResult.summary" class="flex justify-between">
                <span class="text-base-content/70">检测对象数:</span>
                <span>{{ selectedResult.summary.total_detections }}</span>
              </div>
            </div>
          </div>

          <!-- 帧检测详情 -->
          <div v-if="selectedResult.frame_detections && selectedResult.frame_detections.length > 0"
            class="bg-blue-50 rounded-lg p-4">
            <h5 class="font-semibold mb-2">🔍 帧检测详情</h5>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div v-for="(frame, index) in selectedResult.frame_detections" :key="index" class="border-l-4 border-primary pl-3">
                <div class="text-sm text-base-content/70 mb-1">帧 {{ frame.frame_index }} ({{ frame.timestamp.toFixed(2) }}s)</div>
                <div v-for="detection in frame.detections" :key="detection.id" class="text-sm mb-1">
                  <div class="flex justify-between items-center">
                    <span class="font-medium">{{ detection.class_name }}</span>
                    <span class="text-blue-600">{{ (detection.confidence * 100).toFixed(1) }}%</span>
                  </div>
                  <div class="text-xs text-gray-500">
                    位置: ({{ Math.round(detection.bbox.x1) }}, {{ Math.round(detection.bbox.y1) }}) -
                    ({{ Math.round(detection.bbox.x2) }}, {{ Math.round(detection.bbox.y2) }})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button @click="selectedResult = null" class="btn">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Picture, VideoCamera, Camera, Apple, Warning, DeleteFilled, MagicStick, UploadFilled, View, Delete } from '@element-plus/icons-vue'
import DetectionResult from 'components/DetectionResult.vue'
import { detectImage as apiDetectImage, detectVideo as apiDetectVideo, base64ToFile, type ImageDetectionResponse, type VideoDetectionResponse } from '@/api/common/detection'
import { ElMessage } from 'element-plus'
import serverConfig from '@/configs'

// 接口定义
interface DetectionMethod {
  id: number
  iconComponent: any
  title: string
  description: string
  delay: number
}

interface DetectionStat {
  label: string
  value: string
  iconComponent: any
  color: string
}

interface DetectionResultItem {
  id: string | number
  category: string
  iconComponent: any
  color: string
  confidence: number
  timestamp: string
  tips: string[]
  // res.json数据结构字段
  success?: boolean
  record_id?: string
  frame_detections?: {
    frame_index: number
    timestamp: number
    detections: {
      id: number
      class_id: number
      class_name: string
      confidence: number
      bbox: {
        x1: number
        y1: number
        x2: number
        y2: number
      }
    }[]
  }[]
  summary?: {
    processed_frames: number
    total_frames: number
    total_detections: number
  }
  processing_time?: number
  detected_category?: string | null
}

// 检测方式数据
const detectionMethods = [
  {
    id: 1,
    iconComponent: Picture,
    title: '图片检测',
    description: '上传垃圾图片进行识别',
    delay: 200
  },
  {
    id: 2,
    iconComponent: VideoCamera,
    title: '视频检测',
    description: '上传垃圾视频进行分析',
    delay: 400
  },
  {
    id: 3,
    iconComponent: Camera,
    title: '实时摄像头',
    description: '使用摄像头实时检测',
    delay: 600
  }
]

// 检测统计数据
const detectionStats = [
  {
    label: '今日检测',
    value: '24',
    iconComponent: MagicStick,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    label: '可回收垃圾',
    value: '12',
    iconComponent: Apple,
    color: 'bg-green-100 text-green-600'
  },
  {
    label: '有害垃圾',
    value: '3',
    iconComponent: Warning,
    color: 'bg-red-100 text-red-600'
  },
  {
    label: '其他垃圾',
    value: '9',
    iconComponent: DeleteFilled,
    color: 'bg-gray-100 text-gray-600'
  }
]

// 响应式数据
const selectedMethod = ref(1)
const selectedImage = ref('')
const selectedImageName = ref('')
const selectedImageFile = ref<File | null>(null)
const selectedVideo = ref('')
const selectedVideoName = ref('')
const selectedVideoFile = ref<File | null>(null)
const isCameraActive = ref(false)
const isDetecting = ref(false)
const detectionResult = ref<DetectionResultItem | null>(null)
const detectionResults = ref<DetectionResultItem[]>([])
const selectedResult = ref<DetectionResultItem | null>(null)
const cameraVideo = ref<HTMLVideoElement | null>(null)
const cameraStream = ref<MediaStream | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

// WebSocket相关数据
const websocket = ref<WebSocket | null>(null)
const isWebSocketConnected = ref(false)
const isRealtimeDetecting = ref(false)
const frameId = ref(0)
const realtimeResults = ref<DetectionResultItem[]>([])
const websocketUrl = "ws://192.168.124.3:8001/ws/rubbish_detection/"

// WebSocket重连相关
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5
const reconnectInterval = ref(1000) // 初始重连间隔1秒
const reconnectTimer = ref<NodeJS.Timeout | null>(null)

// 计算属性
const totalPages = computed(() => Math.ceil(detectionResults.value.length / pageSize.value))
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }

  return pages
})

// 方法选择
const selectMethod = (methodId: number) => {
  selectedMethod.value = methodId
  clearAll()
}

// 清除所有数据
const clearAll = () => {
  clearImage()
  clearVideo()
  stopCamera()
  clearResult()
}

// 图片处理
const handleImageSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processImageFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

const processImageFile = (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  // 保存文件对象
  selectedImageFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImage.value = e.target?.result as string
    selectedImageName.value = file.name
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  selectedImage.value = ''
  selectedImageName.value = ''
  selectedImageFile.value = null
}

// 视频处理
const handleVideoSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processVideoFile(file)
  }
}

const handleVideoDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('video/')) {
    processVideoFile(file)
  }
}

const processVideoFile = (file: File) => {
  if (file.size > 50 * 1024 * 1024) {
    alert('视频大小不能超过 50MB')
    return
  }

  // 保存原始File对象用于API调用
  selectedVideoFile.value = file
  selectedVideoName.value = file.name

  // 创建预览URL用于显示
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedVideo.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearVideo = () => {
  selectedVideo.value = ''
  selectedVideoName.value = ''
  selectedVideoFile.value = null
}

// 摄像头处理
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    cameraStream.value = stream
    if (cameraVideo.value) {
      cameraVideo.value.srcObject = stream
    }
    isCameraActive.value = true

    // 启动摄像头时连接WebSocket
    connectWebSocket()
  } catch (error) {
    console.error('启动摄像头失败:', error)
    alert('无法访问摄像头，请检查权限设置')
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  if (cameraVideo.value) {
    cameraVideo.value.srcObject = null
  }
  isCameraActive.value = false
  isRealtimeDetecting.value = false

  // 停止摄像头时断开WebSocket
  disconnectWebSocket()
}

const capturePhoto = () => {
  if (!cameraVideo.value) return

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return

  canvas.width = cameraVideo.value.videoWidth
  canvas.height = cameraVideo.value.videoHeight
  context.drawImage(cameraVideo.value, 0, 0)

  const imageData = canvas.toDataURL('image/jpeg')
  detectImageData(imageData)
}

// 开始实时检测
const startRealtimeDetection = () => {
  if (!isCameraActive.value || !isWebSocketConnected.value) {
    ElMessage.warning('请先启动摄像头并确保连接正常')
    return
  }

  isRealtimeDetecting.value = true
  ElMessage.success('开始实时检测')

  // 开始定时捕获和发送图像帧
  startFrameCapture()
}

// 停止实时检测
const stopRealtimeDetection = () => {
  isRealtimeDetecting.value = false
  ElMessage.info('已停止实时检测')
}

// 定时捕获图像帧
const startFrameCapture = () => {
  if (!isRealtimeDetecting.value || !cameraVideo.value) {
    return
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return

  canvas.width = cameraVideo.value.videoWidth
  canvas.height = cameraVideo.value.videoHeight
  context.drawImage(cameraVideo.value, 0, 0)

  // 转换为base64并发送到WebSocket
  const imageData = canvas.toDataURL('image/jpeg', 0.8) // 降低质量以减少数据量
  const base64Data = imageData.split(',')[1] // 移除data:image/jpeg;base64,前缀
  sendImageFrameToWebSocket(base64Data)

  // 每500ms捕获一次（2fps）
  if (isRealtimeDetecting.value) {
    setTimeout(startFrameCapture, 500)
  }
}

// 检测功能
const detectImage = async () => {
  if (!selectedImage.value || !selectedImageFile.value) {
    ElMessage.error('请选择图片文件')
    return
  }

  await detectImageFile(selectedImageFile.value)
}

const detectVideo = async () => {
  if (!selectedVideoFile.value) {
    ElMessage.error('请选择视频文件')
    return
  }

  isDetecting.value = true

  try {
    const response: VideoDetectionResponse = await apiDetectVideo(selectedVideoFile.value)

    if (response.success) {
      // 转换视频检测响应为页面显示格式
      const result = convertVideoApiResponseToResult(response)
      detectionResult.value = result

      // 添加到检测结果列表
      detectionResults.value.unshift(result)

      ElMessage.success('视频检测完成！')
    } else {
      ElMessage.error('视频检测失败，请重试')
    }
  } catch (error) {
    console.error('视频检测错误:', error)
    ElMessage.error('视频检测失败，请检查网络连接')
  } finally {
    isDetecting.value = false
  }
}

const detectImageData = async (imageData: string) => {
  // 将base64数据转换为File对象
  const file = base64ToFile(imageData, 'camera-capture.jpg')
  await detectImageFile(file)
}

// 新增：处理文件检测的通用方法
const detectImageFile = async (file: File) => {
  isDetecting.value = true

  try {
    const response: ImageDetectionResponse = await apiDetectImage(file)

    if (response.success) {
      // 转换API响应为页面显示格式
      const result = convertApiResponseToResult(response)
      detectionResult.value = result

      // 添加到检测结果列表
      detectionResults.value.unshift(result)

      ElMessage.success('检测完成！')
    } else {
      ElMessage.error('检测失败，请重试')
    }
  } catch (error) {
    console.error('检测错误:', error)
    ElMessage.error('检测失败，请检查网络连接')
  } finally {
    isDetecting.value = false
  }
}

// 转换视频检测API响应为页面显示格式
const convertVideoApiResponseToResult = (response: VideoDetectionResponse): DetectionResultItem => {
  // 从frame_detections中提取所有检测结果
  const allDetections = response.frame_detections.flatMap(frame =>
    frame.detections.map(detection => ({
      id: Math.random(), // 生成临时ID
      class_id: detection.class_id,
      class_name: detection.class_name,
      confidence: detection.confidence,
      bbox: {
        x1: detection.bbox[0],
        y1: detection.bbox[1],
        x2: detection.bbox[2],
        y2: detection.bbox[3]
      }
    }))
  )

  // 如果detected_category为null，根据summary中的unique_classes推断分类
  let category = response.detected_category
  if (!category && response.summary.unique_classes.length > 0) {
    // 取第一个检测到的类别进行映射
    category = mapClassNameToCategory(response.summary.unique_classes[0])
  }

  const categoryMapping = getCategoryMapping(category)

  // 计算平均置信度
  const avgConfidence = allDetections.length > 0
    ? allDetections.reduce((sum, det) => sum + det.confidence, 0) / allDetections.length
    : 0

  return {
    id: response.record_id || Date.now(),
    category: category as string,
    iconComponent: categoryMapping.iconComponent,
    color: categoryMapping.color,
    confidence: Math.round(avgConfidence * 100),
    timestamp: new Date().toISOString(),
    tips: getTipsForCategory(category),
    record_id: response.record_id,
    detections: allDetections,
    processing_time: response.processing_time,
    original_image: response.original_video, // 视频文件路径
    result_image: null, // 视频检测没有结果图片
    // 视频特有的字段
    frame_detections: response.frame_detections,
    summary: response.summary
  }
}

// 转换API响应为页面显示格式
const convertApiResponseToResult = (response: any): DetectionResultItem => {
  // 处理res.json格式的数据
  let category = response.detected_category
  let confidence = 0
  
  // 如果有frame_detections，从中提取分类和置信度信息
  if (response.frame_detections && response.frame_detections.length > 0) {
    const allDetections = response.frame_detections.flatMap((frame: any) => frame.detections)
    if (allDetections.length > 0) {
      // 取置信度最高的检测结果
      const highestConfidenceDetection = allDetections.reduce((prev: any, current: any) =>
        prev.confidence > current.confidence ? prev : current
      )
      if (!category) {
        category = mapClassNameToCategory(highestConfidenceDetection.class_name)
      }
      confidence = highestConfidenceDetection.confidence
    }
  }

  const categoryMapping = getCategoryMapping(category)

  return {
    id: response.record_id || Date.now(),
    category: category || '未知分类',
    iconComponent: categoryMapping.iconComponent,
    color: categoryMapping.color,
    confidence: Math.round(confidence * 100),
    timestamp: new Date().toISOString(),
    tips: getTipsForCategory(category),
    success: response.success,
    record_id: response.record_id,
    frame_detections: response.frame_detections,
    summary: response.summary,
    processing_time: response.processing_time,
    detected_category: response.detected_category
  }
}

// 将class_name映射到垃圾分类
const mapClassNameToCategory = (className: string): string => {
  const classMapping: Record<string, string> = {
    'suliaoyijia': '可回收垃圾',
    'zhixiang': '可回收垃圾',
    'yilaguanhe': '可回收垃圾',
    'boli': '可回收垃圾',
    'chuyulaiji': '厨余垃圾',
    'guopi': '厨余垃圾',
    'shengfan': '厨余垃圾',
    'youhailaiji': '有害垃圾',
    'dianchi': '有害垃圾',
    'yaoping': '有害垃圾',
    'qitalaiji': '其他垃圾',
    'zhijin': '其他垃圾',
    'yancaitou': '其他垃圾'
  }

  return classMapping[className] || '其他垃圾'
}

// 获取分类对应的图标和颜色
const getCategoryMapping = (category: string | null) => {
  const mappings: Record<string, { iconComponent: any, color: string }> = {
    '可回收垃圾': { iconComponent: Picture, color: 'text-blue-600' },
    '厨余垃圾': { iconComponent: Apple, color: 'text-green-600' },
    '有害垃圾': { iconComponent: Warning, color: 'text-red-600' },
    '其他垃圾': { iconComponent: DeleteFilled, color: 'text-gray-600' }
  }

  return mappings[category || '其他垃圾'] || { iconComponent: DeleteFilled, color: 'text-gray-600' }
}

// 获取分类提示
const getTipsForCategory = (category: string | null) => {
  const tips: Record<string, string[]> = {
    '可回收垃圾': [
      '请清洗干净后投放',
      '塑料瓶请压扁节省空间',
      '纸张请保持干燥'
    ],
    '厨余垃圾': [
      '请沥干水分后投放',
      '大骨头属于其他垃圾',
      '包装袋请取出'
    ],
    '有害垃圾': [
      '请投放到专门的有害垃圾桶',
      '电池请用胶带包裹电极',
      '过期药品请保持原包装'
    ],
    '其他垃圾': [
      '请投放到其他垃圾桶',
      '尽量压缩体积',
      '避免液体渗漏'
    ]
  }

  return tips[category] || []
}

const clearResult = () => {
  detectionResult.value = null
}

// 模拟方法
const openUploadModal = () => {
  // 模拟上传功能
}

const openCameraModal = () => {
  // 模拟摄像头功能
}

const viewDetails = (result: DetectionResultItem) => {
  selectedResult.value = result
}

const deleteResult = (id: string | number) => {
  detectionResults.value = detectionResults.value.filter((r: DetectionResultItem) => r.id !== id)
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

// 格式化时间
const formatTimeShort = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取完整的图片URL
const getFullImageUrl = (imagePath: string) => {
  // 如果已经是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // 拼接服务器地址
  const baseUrl = import.meta.env.VITE_SERVER_PATH || 'http://192.168.124.3:8000'
  return `${baseUrl}${imagePath}`
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('图片加载失败:', img.src)
  // 可以设置默认图片或显示错误提示
  img.style.display = 'none'
}

// WebSocket连接管理
const connectWebSocket = () => {
  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
    return
  }

  try {
    websocket.value = new WebSocket(websocketUrl)

    websocket.value.onopen = () => {
      console.log('WebSocket连接已建立，URL:', websocketUrl)
      console.log('WebSocket readyState:', websocket.value?.readyState)
      isWebSocketConnected.value = true
      reconnectAttempts.value = 0
      ElMessage.success('实时检测连接成功')

      // 清除重连定时器
      if (reconnectTimer.value) {
        clearTimeout(reconnectTimer.value)
        reconnectTimer.value = null
      }
    }

    websocket.value.onmessage = (event) => {
      try {
        console.log(event);

        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (error) {
        console.error('解析WebSocket消息失败:', error)
      }
    }

    websocket.value.onerror = (error) => {
      console.error('WebSocket错误:', error)
      isWebSocketConnected.value = false
      ElMessage.error('实时检测连接出错')
    }

    websocket.value.onclose = (event) => {
      console.log('WebSocket连接已关闭', event.code, event.reason)
      isWebSocketConnected.value = false

      // 如果不是主动关闭且摄像头仍在运行，尝试重连
      if (event.code !== 1000 && isCameraActive.value && reconnectAttempts.value < maxReconnectAttempts) {
        attemptReconnect()
      } else if (reconnectAttempts.value >= maxReconnectAttempts) {
        ElMessage.error('WebSocket重连失败，已达到最大重试次数')
        isRealtimeDetecting.value = false
      } else {
        ElMessage.info('WebSocket连接已断开')
        isRealtimeDetecting.value = false
      }
    }
  } catch (error) {
    console.error('WebSocket连接失败:', error)
    ElMessage.error('无法连接到实时检测服务')
    attemptReconnect()
  }
}

// 尝试重连
const attemptReconnect = () => {
  if (reconnectAttempts.value >= maxReconnectAttempts) {
    ElMessage.error('WebSocket重连失败，已达到最大重试次数')
    return
  }

  reconnectAttempts.value++
  const delay = Math.min(reconnectInterval.value * Math.pow(2, reconnectAttempts.value - 1), 30000) // 指数退避，最大30秒

  ElMessage.warning(`WebSocket连接断开，${delay / 1000}秒后尝试第${reconnectAttempts.value}次重连...`)

  reconnectTimer.value = setTimeout(() => {
    if (isCameraActive.value) {
      console.log(`尝试第${reconnectAttempts.value}次重连WebSocket`)
      connectWebSocket()
    }
  }, delay)
}

const disconnectWebSocket = () => {
  // 清除重连定时器
  if (reconnectTimer.value) {
    clearTimeout(reconnectTimer.value)
    reconnectTimer.value = null
  }

  if (websocket.value) {
    websocket.value.close(1000, '用户主动断开') // 1000表示正常关闭
    websocket.value = null
  }
  isWebSocketConnected.value = false
  reconnectAttempts.value = 0
  isRealtimeDetecting.value = false
}

// WebSocket消息处理
const handleWebSocketMessage = (data: any) => {
  console.log('收到WebSocket消息:', data)
  switch (data.type) {
    case 'detection_result':
      handleRealtimeDetectionResult(data.data)
      break
    case 'error':
      // 处理两种可能的错误消息格式
      const errorMessage = data.data?.message || data.message || '未知错误'
      console.error('WebSocket检测错误:', data)
      ElMessage.error(`检测失败: ${errorMessage}`)
      break
    default:
      console.log('未知WebSocket消息类型:', data.type, '完整消息:', data)
      // 如果是未知消息类型，也显示警告
      ElMessage.warning(`收到未知消息类型: ${data.type}`)
  }
}

// 处理实时检测结果
const handleRealtimeDetectionResult = (resultData: any) => {
  if (resultData.detections && resultData.detections.length > 0) {
    // 转换为页面显示格式
    const result = convertRealtimeResultToDisplayFormat(resultData)

    // 添加到实时结果列表（保持最新的10个结果）
    realtimeResults.value.unshift(result)
    if (realtimeResults.value.length > 10) {
      realtimeResults.value.pop()
    }

    // 也添加到主检测结果列表
    detectionResults.value.unshift(result)
  }
}

// 转换实时检测结果为显示格式
const convertRealtimeResultToDisplayFormat = (resultData: any): DetectionResultItem => {
  // 取置信度最高的检测结果
  const highestConfidenceDetection = resultData.detections.reduce((prev: any, current: any) =>
    prev.confidence > current.confidence ? prev : current
  )

  const category = mapClassNameToCategory(highestConfidenceDetection.class_name)
  const categoryMapping = getCategoryMapping(category)

  return {
    id: resultData.frame_id || Date.now(),
    category: category,
    iconComponent: categoryMapping.iconComponent,
    color: categoryMapping.color,
    confidence: Math.round(highestConfidenceDetection.confidence * 100),
    timestamp: resultData.timestamp || new Date().toISOString(),
    tips: getTipsForCategory(category),
    frame_detections: [{
      frame_index: resultData.frame_id || 0,
      timestamp: resultData.timestamp || 0,
      detections: resultData.detections.map((det: any) => ({
        id: Math.random(),
        class_id: det.class_id,
        class_name: det.class_name,
        confidence: det.confidence,
        bbox: {
          x1: det.bbox[0],
          y1: det.bbox[1],
          x2: det.bbox[2],
          y2: det.bbox[3]
        }
      }))
    }],
    processing_time: resultData.processing_time
  }
}

// 发送图像帧到WebSocket
const sendImageFrameToWebSocket = (imageData: string) => {
  if (!websocket.value || websocket.value.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket未连接，无法发送图像帧')
    return
  }

  frameId.value++
  const message = {
    type: 'image_frame',
    data: {
      image: imageData,
      timestamp: new Date().toISOString(),
      camera_id: 'camera_001',
      frame_id: frameId.value
    }
  }

  console.log('发送WebSocket消息:', {
    type: message.type,
    frame_id: message.data.frame_id,
    timestamp: message.data.timestamp,
    camera_id: message.data.camera_id,
    image_length: message.data.image.length
  })

  try {
    websocket.value.send(JSON.stringify(message))
  } catch (error) {
    console.error('发送WebSocket消息失败:', error)
  }
}

// 生命周期
onUnmounted(() => {
  stopCamera()
  disconnectWebSocket()

  // 清理重连定时器
  if (reconnectTimer.value) {
    clearTimeout(reconnectTimer.value)
    reconnectTimer.value = null
  }
})
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

video {
  background: #000;
  position: relative;
}

/* WebSocket状态指示器样式 */
.websocket-status {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
}

.badge-success {
  background-color: #10b981;
  animation: pulse-green 2s infinite;
}

.badge-error {
  background-color: #ef4444;
  animation: pulse-red 2s infinite;
}

@keyframes pulse-green {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }

  50% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
}

@keyframes pulse-red {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }

  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

/* 实时检测按钮样式 */
.btn-warning {
  background-color: #f59e0b;
  border-color: #f59e0b;
  animation: glow-warning 2s ease-in-out infinite alternate;
}

.btn-info {
  background-color: #06b6d4;
  border-color: #06b6d4;
  animation: pulse-info 1s ease-in-out infinite;
}

@keyframes glow-warning {
  from {
    box-shadow: 0 0 5px #f59e0b;
  }

  to {
    box-shadow: 0 0 20px #f59e0b, 0 0 30px #f59e0b;
  }
}

@keyframes pulse-info {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

/* 实时检测结果样式 */
.realtime-result {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
  animation: slideInFromRight 0.5s ease-out;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.realtime-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  animation: blink 1s infinite;
  margin-right: 0.5rem;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0.3;
  }
}

/* 置信度进度条样式 */
.confidence-bar {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>