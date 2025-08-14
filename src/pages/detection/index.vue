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
              <video :src="selectedVideo" controls class="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"></video>
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
            <video ref="cameraVideo" :class="{ 'hidden': !isCameraActive }" class="w-full h-64 object-cover" autoplay
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

          <div class="flex justify-center space-x-4">
            <button v-if="!isCameraActive" @click="startCamera" class="btn btn-primary">
              启动摄像头
            </button>

            <template v-else>
              <button @click="capturePhoto" :disabled="isDetecting" class="btn btn-primary">
                <span v-if="isDetecting" class="loading loading-spinner"></span>
                {{ isDetecting ? '检测中...' : '拍照检测' }}
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
                <p class="text-xs text-gray-400">{{ formatTime(result.timestamp) }}</p>
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
    <div v-if="detectionResult" class="mt-8">
      <DetectionResult :result="detectionResult" @close="clearResult" />
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

          <!-- 投放提示 -->
          <div v-if="selectedResult.tips" class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-semibold mb-2">💡 投放提示</h5>
            <ul class="space-y-1">
              <li v-for="tip in selectedResult.tips" :key="tip" class="text-sm">
                • {{ tip }}
              </li>
            </ul>
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
const selectedVideo = ref('')
const selectedVideoName = ref('')
const isCameraActive = ref(false)
const isDetecting = ref(false)
const detectionResult = ref<DetectionResultItem | null>(null)
const detectionResults = ref<DetectionResultItem[]>([])
const selectedResult = ref<DetectionResultItem | null>(null)
const cameraVideo = ref<HTMLVideoElement | null>(null)
const cameraStream = ref<MediaStream | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

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
    alert('图片大小不能超过 5MB')
    return
  }

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

  const reader = new FileReader()
  reader.onload = (e) => {
    selectedVideo.value = e.target?.result as string
    selectedVideoName.value = file.name
  }
  reader.readAsDataURL(file)
}

const clearVideo = () => {
  selectedVideo.value = ''
  selectedVideoName.value = ''
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
  } catch (error) {
    alert('无法访问摄像头，请检查权限设置')
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  isCameraActive.value = false
}

const capturePhoto = () => {
  if (!cameraVideo.value) return

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = cameraVideo.value.videoWidth
  canvas.height = cameraVideo.value.videoHeight

  context?.drawImage(cameraVideo.value, 0, 0)

  const imageData = canvas.toDataURL('image/jpeg')
  detectImageData(imageData)
}

// 检测功能
const detectImage = () => {
  if (!selectedImage.value) return
  detectImageData(selectedImage.value)
}

const detectVideo = () => {
  if (!selectedVideo.value) return

  isDetecting.value = true

  // 模拟视频检测
  setTimeout(() => {
    const mockResult = generateMockResult()
    detectionResult.value = mockResult
    isDetecting.value = false
  }, 3000)
}

const detectImageData = (imageData: string) => {
  isDetecting.value = true

  // 模拟图片检测
  setTimeout(() => {
    const mockResult = generateMockResult()
    detectionResult.value = mockResult
    isDetecting.value = false
  }, 2000)
}

// 生成模拟检测结果
const generateMockResult = (): DetectionResultItem => {
  const categories = [
    { name: '可回收垃圾', iconComponent: null, color: 'text-blue-600' },
    { name: '厨余垃圾', iconComponent: Apple, color: 'text-green-600' },
    { name: '有害垃圾', iconComponent: Warning, color: 'text-red-600' },
    { name: '其他垃圾', iconComponent: DeleteFilled, color: 'text-gray-600' }
  ]

  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const confidence = (Math.random() * 20 + 80).toFixed(1) // 80-100%

  return {
    id: Date.now().toString(),
    category: randomCategory.name,
    iconComponent: randomCategory.iconComponent,
    color: randomCategory.color,
    confidence: parseFloat(confidence),
    timestamp: new Date().toISOString(),
    tips: getTipsForCategory(randomCategory.name)
  }
}

// 获取分类提示
const getTipsForCategory = (category: string) => {
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

// 生命周期
onUnmounted(() => {
  stopCamera()
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
}
</style>