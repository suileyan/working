<template>
  <div class="min-h-screen bg-base-100">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-4" v-motion :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }">
          智能垃圾检测
        </h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto" v-motion :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }">
          选择检测方式，AI将帮您准确识别垃圾分类
        </p>
      </div>
    </div>

    <!-- 检测方式选择 -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div v-for="method in detectionMethods" :key="method.id"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
          :class="{ 'ring-2 ring-primary': selectedMethod === method.id }" @click="selectMethod(method.id)" v-motion
          :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { delay: method.delay } }">
          <div class="card-body text-center">
            <div class="text-5xl mb-4">{{ method.icon }}</div>
            <h3 class="card-title justify-center text-xl mb-2">{{ method.title }}</h3>
            <p class="text-base-content/70">{{ method.description }}</p>
          </div>
        </div>
      </div>

      <!-- 检测区域 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
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
              class="border-2 border-dashed border-base-300 rounded-lg p-12 text-center hover:border-primary transition-colors"
              @dragover.prevent @drop.prevent="handleFileDrop" @click="$refs.imageInput.click()">
              <div v-if="!selectedImage" class="space-y-4">
                <div class="text-6xl text-base-content/30">📁</div>
                <p class="text-lg font-medium">点击或拖拽图片到此处</p>
                <p class="text-sm text-base-content/60">支持 JPG、PNG 格式，最大 5MB</p>
              </div>

              <div v-else class="space-y-4">
                <img :src="selectedImage" alt="Selected image" class="max-w-full max-h-64 mx-auto rounded-lg shadow-lg">
                <p class="text-sm text-base-content/60">{{ selectedImageName }}</p>
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
              class="border-2 border-dashed border-base-300 rounded-lg p-12 text-center hover:border-primary transition-colors"
              @dragover.prevent @drop.prevent="handleVideoDrop" @click="$refs.videoInput.click()">
              <div v-if="!selectedVideo" class="space-y-4">
                <div class="text-6xl text-base-content/30">🎬</div>
                <p class="text-lg font-medium">点击或拖拽视频到此处</p>
                <p class="text-sm text-base-content/60">支持 MP4、AVI 格式，最大 50MB</p>
              </div>

              <div v-else class="space-y-4">
                <video :src="selectedVideo" controls class="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"></video>
                <p class="text-sm text-base-content/60">{{ selectedVideoName }}</p>
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
      </div>

      <!-- 检测结果 -->
      <div v-if="detectionResult" class="mt-8">
        <DetectionResult :result="detectionResult" @close="clearResult" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Picture, VideoCamera, Camera, Apple, Warning, DeleteFilled } from '@element-plus/icons-vue'
import DetectionResult from 'components/DetectionResult.vue'

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

// 响应式数据
const selectedMethod = ref(1)
const selectedImage = ref('')
const selectedImageName = ref('')
const selectedVideo = ref('')
const selectedVideoName = ref('')
const isCameraActive = ref(false)
const isDetecting = ref(false)
const detectionResult = ref(null)
const cameraVideo = ref(null)
const cameraStream = ref(null)

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
const generateMockResult = () => {
  const categories = [
    { name: '可回收垃圾', iconComponent:null, color: 'text-blue-600' },
    { name: '厨余垃圾', iconComponent: Apple, color: 'text-green-600' },
    { name: '有害垃圾', iconComponent: Warning, color: 'text-red-600' },
    { name: '其他垃圾', iconComponent: DeleteFilled, color: 'text-gray-600' }
  ]

  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const confidence = (Math.random() * 20 + 80).toFixed(1) // 80-100%

  return {
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
  const tips = {
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