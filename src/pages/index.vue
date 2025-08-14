<template>
  <div class="min-h-screen bg-base-100">
    <!-- 英雄区域 -->
    <div class="hero min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div class="hero-content text-center">
        <div class="max-w-2xl" v-motion-fade-visible>
          <div class="text-6xl mb-6 text-green-600" v-motion-slide-up :delay="100">
            <el-icon :size="72">
              <Grape />
            </el-icon>
          </div>
          <h1 class="text-5xl font-bold mb-5 text-green-800" v-motion-slide-up :delay="200">
            {{ heroSection.title }}
          </h1>
          <p class="py-6 text-lg text-gray-700" v-motion-slide-up :delay="400">
            {{ heroSection.description }}
          </p>
          <div class="flex gap-4 justify-center flex-wrap" v-motion-slide-up :delay="600">
            <router-link to="/detection" :class="heroSection.primaryButton.class">
              {{ heroSection.primaryButton.text }}
            </router-link>
            <router-link to="/knowledge" :class="heroSection.secondaryButton.class">
              {{ heroSection.secondaryButton.text }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 检测方式展示 -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4" v-motion :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }">
            {{ detectionSection.title }}
          </h2>
          <p class="text-xl text-base-content/70 max-w-2xl mx-auto" v-motion :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }">
            {{ detectionSection.subtitle }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="method in detectionSection.methods" :key="method.id"
            class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300" v-motion
            :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { delay: method.delay } }">
            <div class="card-body text-center">
              <div class="text-4xl mb-4 text-primary">
                <el-icon :size="48">
                  <component :is="method.icon" />
                </el-icon>
              </div>
              <h3 class="card-title justify-center text-xl mb-2">{{ method.title }}</h3>
              <p class="text-base-content/70 mb-4">{{ method.description }}</p>
              <div class="card-actions justify-center">
                <button class="btn btn-primary btn-sm">立即尝试</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 系统统计数据 -->
    <div class="py-20 bg-green-600 text-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">系统数据概览</h2>
          <p class="text-green-100">基于深度学习技术的智能识别系统</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div v-for="(stat, index) in statsSection.stats" :key="stat.id" v-motion-slide-visible-once-up
            :delay="stat.delay">
            <div class="stat bg-white/10 rounded-lg p-6">
              <div class="stat-value text-4xl font-bold text-white">{{ stat.animatedValue }}{{ stat.suffix }}</div>
              <div class="stat-title text-green-100 mt-2">{{ stat.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 垃圾分类指南预览 -->
    <section class="py-20 bg-primary text-primary-content">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-6" v-motion :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }">
            垃圾分类指南
          </h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90" v-motion :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }">
            了解四大垃圾分类，正确投放每一件垃圾，为环保贡献力量
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="category in wasteCategories" :key="category.id"
            class="card bg-primary-content text-primary shadow-xl hover:shadow-2xl transition-all duration-300" v-motion
            :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 * category.id } }">
            <div class="card-body text-center p-4">
              <div class="text-3xl mb-2" :class="category.color">
                <el-icon :size="32">
                  <component :is="category.icon" />
                </el-icon>
              </div>
              <h3 class="card-title justify-center text-lg mb-2">{{ category.name }}</h3>
              <div class="text-xs space-y-1">
                <div v-for="example in category.examples.slice(0, 3)" :key="example"
                  class="badge badge-primary badge-outline badge-xs">
                  {{ example }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center" v-motion :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 1000 } }">
          <button class="btn btn-secondary btn-lg" @click="router.push('/knowledge')">
            查看完整分类指南
          </button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer footer-center p-10 bg-green-800 text-white">
      <div>
        <div class="text-4xl mb-4 text-green-600">
          <el-icon :size="48">
            <Grape />
          </el-icon>
        </div>
        <h3 class="text-xl font-bold mb-2">智能垃圾分类系统</h3>
        <p class="text-green-200">让垃圾分类更简单，让环境保护更有效</p>
      </div>
      <div>
        <div class="grid grid-flow-col gap-4">
          <router-link to="/knowledge" class="link link-hover text-green-200">分类指南</router-link>
          <router-link to="/detection" class="link link-hover text-green-200">智能检测</router-link>
          <router-link to="/history" class="link link-hover text-green-200">历史记录</router-link>
          <router-link to="/statistics" class="link link-hover text-green-200">统计信息</router-link>
        </div>
      </div>
      <div>
        <p class="text-green-200">© 2024 智能垃圾分类系统. 保护环境，从正确分类开始.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Camera, VideoCamera, Picture, Grape, Apple, Warning, DeleteFilled } from '@element-plus/icons-vue'
import router from '@/router'
import { getDatasetInfo } from '@/api/common/dataset'
import type { DatasetResponse } from '@/types/factory'

interface Button {
  text: string
  class: string
}

interface Feature {
  id: number
  icon: any
  title: string
  description: string
  delay: number
}

interface Stat {
  id: number
  animatedValue: any
  targetValue: number
  suffix: string
  title: string
  delay: number
}

// 英雄区域数据
const heroSection: {
  title: string
  description: string
  primaryButton: Button
  secondaryButton: Button
} = {
  title: '智能垃圾分类系统',
  description: '基于深度学习技术的智能识别系统，帮助您正确分类垃圾，保护环境。识别准确率高达95.8%，支持图片、视频和实时摄像头检测。',
  primaryButton: {
    text: '开始检测',
    class: 'btn btn-primary btn-lg'
  },
  secondaryButton: {
    text: '学习分类',
    class: 'btn btn-outline btn-lg'
  }
}

// 检测方式数据
const detectionSection: {
  title: string
  subtitle: string
  methods: Feature[]
} = {
  title: '多种检测方式',
  subtitle: '选择最适合您的检测方式，快速准确识别垃圾类型',
  methods: [
    {
      id: 1,
      icon: Picture,
      title: '图片检测',
      description: '上传垃圾图片，AI智能识别分类，支持JPG、PNG格式，最大5MB',
      delay: 200
    },
    {
      id: 2,
      icon: VideoCamera,
      title: '视频检测',
      description: '上传垃圾视频，逐帧分析识别，支持MP4、AVI格式，最大50MB',
      delay: 400
    },
    {
      id: 3,
      icon: Camera,
      title: '实时摄像头',
      description: '调用设备摄像头实时检测，即拍即识别，方便快捷',
      delay: 600
    }
  ]
}

// 统计数据
const statsSection: { stats: Stat[] } = {
  stats: [
    {
      id: 1,
      animatedValue: ref(0),
      targetValue: 95.8,
      suffix: '%',
      title: '识别准确率',
      delay: 200
    },
    {
      id: 2,
      animatedValue: ref(0),
      targetValue: 3,
      suffix: '种',
      title: '检测方式',
      delay: 400
    },
    {
      id: 3,
      animatedValue: ref(0),
      targetValue: 4,
      suffix: '大类',
      title: '垃圾分类',
      delay: 600
    },
    {
      id: 4,
      animatedValue: ref(0),
      targetValue: 1234,
      suffix: '+',
      title: '用户数量',
      delay: 800
    }
  ]
}

// 垃圾分类数据
interface WasteCategory {
  id: number
  name: string
  icon?: string | any
  description: string
  examples: string[]
  color?: string
}

const wasteCategories: WasteCategory[] = [
  {
    id: 1,
    name: '可回收垃圾',
    // icon: Recycle,
    color: 'text-blue-600',
    examples: ['塑料瓶', '纸张纸箱', '金属罐', '玻璃瓶', '旧衣物'],
    description: ''
  },
  {
    id: 2,
    name: '厨余垃圾',
    icon: Apple,
    color: 'text-green-600',
    examples: ['剩菜剩饭', '蔬菜水果皮', '肉骨头', '蛋壳茶叶渣', '过期食品'],
    description: ''
  },
  {
    id: 3,
    name: '有害垃圾',
    icon: Warning,
    color: 'text-red-600',
    examples: ['废电池', '废灯管', '过期药品', '油漆农药', '温度计'],
    description: ''
  },
  {
    id: 4,
    name: '其他垃圾',
    icon: DeleteFilled,
    color: 'text-gray-600',
    examples: ['烟蒂烟灰', '污染纸张', '破碎陶瓷', '猫砂尿不湿', '一次性餐具'],
    description: ''
  }
]

// 数字动画函数
const animateNumber = (target: { value: number }, finalValue: number, duration: number = 2000): void => {
  const startTime = Date.now()
  const startValue = 0

  const updateNumber = (): void => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    target.value = Math.floor(startValue + (finalValue - startValue) * easeOutQuart)

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }

  requestAnimationFrame(updateNumber)
}

onMounted(() => {
  // 延迟启动数字动画
  setTimeout(() => {
    statsSection.stats.forEach(stat => {
      animateNumber(stat.animatedValue, stat.targetValue)
    })
  }, 1000)
})
</script>

<style scoped>
/* 自定义样式 */
.hero {
  background-image:
    radial-gradient(at 40% 20%, hsla(28, 100%, 74%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 1) 0px, transparent 50%),
    radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 1) 0px, transparent 50%);
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>