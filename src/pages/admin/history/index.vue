<script setup lang="ts">
    import { Motion } from "motion-v";
    
    // 检测历史数据
    const historyData = {
      todayDetection: {
        value: 1234,
        change: "+5.2%",
        label: "今日检测",
      },
      weekDetection: {
        value: 8567,
        change: "+12.8%",
        label: "本周检测",
      },
      monthDetection: {
        value: 34567,
        change: "+18.5%",
        label: "本月检测",
      },
      errorDetection: {
        value: 123,
        change: "-2.1%",
        label: "错误检测",
      },
    };
    
    // 动画配置
    const cardVariants = {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      whileHover: {
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2, ease: ["easeOut"] },
      },
      transition: { duration: 0.4, ease: ["easeOut"] },
    };
    
    const statsCardVariants = {
      initial: { opacity: 0, y: 40, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      whileHover: {
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3, ease: ["easeOut"] },
      },
      transition: { duration: 0.5, ease: ["easeOut"] },
    };
    
    const iconVariants = {
      initial: { scale: 0, rotate: -180 },
      animate: { scale: 1, rotate: 0 },
      whileHover: {
        scale: 1.2,
        rotate: 10,
        transition: { duration: 0.2, ease: ["easeOut"] },
      },
      transition: { duration: 0.6, delay: 0.3, ease: ["easeOut"] },
    };
    </script>
    
    <template>
      <div class="history">
        <!-- 检测历史页面 -->
        <Motion
          :initial="cardVariants.initial"
          :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any"
          :transition="{ ...cardVariants.transition, delay: 0.3 } as any"
        >
          <el-card class="mb-6">
            <template #header>
              <div class="flex items-center justify-between">
                <span class="text-lg font-medium">检测历史</span>
                <Motion
                  :initial="{ scale: 0.8, opacity: 0 }"
                  :animate="{ scale: 1, opacity: 1 }"
                  :whileHover="{ scale: 1.05 }"
                  :transition="{ duration: 0.3, delay: 0.5 }"
                >
                  <el-button type="primary" size="small">刷新数据</el-button>
                </Motion>
              </div>
            </template>
    
            <!-- 统计卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Motion
                :initial="statsCardVariants.initial"
                :animate="statsCardVariants.animate"
                :whileHover="statsCardVariants.whileHover as any"
                :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
                class="bg-blue-50 p-6 rounded-lg cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-600 text-sm font-medium">
                      {{ historyData.todayDetection.label }}
                    </p>
                    <Motion
                      :initial="{ opacity: 0, y: 10 }"
                      :animate="{ opacity: 1, y: 0 }"
                      :transition="{ duration: 0.4, delay: 0.6 }"
                    >
                      <p class="text-2xl font-bold text-blue-900">
                        {{ historyData.todayDetection.value.toLocaleString() }}
                      </p>
                      <p class="text-sm text-blue-600 mt-1">
                        {{ historyData.todayDetection.change }}
                      </p>
                    </Motion>
                  </div>
                  <Motion
                    :initial="iconVariants.initial"
                    :animate="iconVariants.animate"
                    :whileHover="iconVariants.whileHover as any"
                    :transition="{ ...iconVariants.transition, delay: 0.5 } as any"
                    class="text-blue-500"
                  >
                    <el-icon size="32">
                      <Calendar />
                    </el-icon>
                  </Motion>
                </div>
              </Motion>
    
              <Motion
                :initial="statsCardVariants.initial"
                :animate="statsCardVariants.animate"
                :whileHover="statsCardVariants.whileHover as any"
                :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
                class="bg-green-50 p-6 rounded-lg cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-600 text-sm font-medium">
                      {{ historyData.weekDetection.label }}
                    </p>
                    <Motion
                      :initial="{ opacity: 0, y: 10 }"
                      :animate="{ opacity: 1, y: 0 }"
                      :transition="{ duration: 0.4, delay: 0.7 }"
                    >
                      <p class="text-2xl font-bold text-green-900">
                        {{ historyData.weekDetection.value.toLocaleString() }}
                      </p>
                      <p class="text-sm text-green-600 mt-1">
                        {{ historyData.weekDetection.change }}
                      </p>
                    </Motion>
                  </div>
                  <Motion
                    :initial="iconVariants.initial"
                    :animate="iconVariants.animate"
                    :whileHover="iconVariants.whileHover as any"
                    :transition="{ ...iconVariants.transition, delay: 0.6 } as any"
                    class="text-green-500"
                  >
                    <el-icon size="32">
                      <Clock />
                    </el-icon>
                  </Motion>
                </div>
              </Motion>
    
              <Motion
                :initial="statsCardVariants.initial"
                :animate="statsCardVariants.animate"
                :whileHover="statsCardVariants.whileHover as any"
                :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
                class="bg-yellow-50 p-6 rounded-lg cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-600 text-sm font-medium">
                      {{ historyData.monthDetection.label }}
                    </p>
                    <Motion
                      :initial="{ opacity: 0, y: 10 }"
                      :animate="{ opacity: 1, y: 0 }"
                      :transition="{ duration: 0.4, delay: 0.8 }"
                    >
                      <p class="text-2xl font-bold text-yellow-900">
                        {{ historyData.monthDetection.value.toLocaleString() }}
                      </p>
                      <p class="text-sm text-yellow-600 mt-1">
                        {{ historyData.monthDetection.change }}
                      </p>
                    </Motion>
                  </div>
                  <Motion
                    :initial="iconVariants.initial"
                    :animate="iconVariants.animate"
                    :whileHover="iconVariants.whileHover as any"
                    :transition="{ ...iconVariants.transition, delay: 0.7 } as any"
                    class="text-yellow-500"
                  >
                    <el-icon size="32">
                      <DataAnalysis />
                    </el-icon>
                  </Motion>
                </div>
              </Motion>
    
              <Motion
                :initial="statsCardVariants.initial"
                :animate="statsCardVariants.animate"
                :whileHover="statsCardVariants.whileHover as any"
                :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
                class="bg-red-50 p-6 rounded-lg cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-red-600 text-sm font-medium">
                      {{ historyData.errorDetection.label }}
                    </p>
                    <Motion
                      :initial="{ opacity: 0, y: 10 }"
                      :animate="{ opacity: 1, y: 0 }"
                      :transition="{ duration: 0.4, delay: 0.9 }"
                    >
                      <p class="text-2xl font-bold text-red-900">
                        {{ historyData.errorDetection.value.toLocaleString() }}
                      </p>
                      <p class="text-sm text-red-600 mt-1">
                        {{ historyData.errorDetection.change }}
                      </p>
                    </Motion>
                  </div>
                  <Motion
                    :initial="iconVariants.initial"
                    :animate="iconVariants.animate"
                    :whileHover="iconVariants.whileHover as any"
                    :transition="{ ...iconVariants.transition, delay: 0.8 } as any"
                    class="text-red-500"
                  >
                    <el-icon size="32">
                      <Warning />
                    </el-icon>
                  </Motion>
                </div>
              </Motion>
            </div>
          </el-card>
        </Motion>
      </div>
    </template>
    
    <style scoped>
    .history {
      width: 100%;
    }
    
    /* 统计卡片增强样式 */
    .cursor-pointer {
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;
    }
    
    .cursor-pointer:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    /* 响应式动画优化 */
    @media (prefers-reduced-motion: reduce) {
      .cursor-pointer {
        transition: none;
      }
    }
    
    /* 增强卡片视觉效果 */
    .el-card {
      border-radius: 12px;
      border: none;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    
    .el-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }
    </style>
    