// 垃圾分类系统相关类型定义

// 垃圾类型枚举
export const WasteCategory = {
  RECYCLABLE: 'recyclable',
  KITCHEN: 'kitchen', 
  HAZARDOUS: 'hazardous',
  OTHER: 'other'
} as const

export type WasteCategory = typeof WasteCategory[keyof typeof WasteCategory]

// 垃圾分类项
export interface WasteItem {
  id: number
  name: string
  category: WasteCategory
  description?: string
  disposal_guide?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

// 检测记录
export interface DetectionRecord {
  id: number
  user_id?: number
  image_url: string
  detected_category: WasteCategory
  confidence: number
  detection_time: string
  is_correct?: boolean
  feedback?: string
}

// 检测统计
export interface DetectionStats {
  total_detections: number
  today_detections: number
  weekly_detections: number
  monthly_detections: number
  error_detections: number
  accuracy_rate: number
  category_distribution: Record<WasteCategory, number>
}

// 垃圾分类查询参数
export interface WasteQueryParams {
  category?: WasteCategory
  keyword?: string
  page: number
  page_size: number
}

// 检测记录查询参数
export interface DetectionQueryParams {
  user_id?: number
  category?: WasteCategory
  start_date?: string
  end_date?: string
  page: number
  page_size: number
}

// 垃圾分类列表响应
export interface WasteListResponse {
  data: {
    items: WasteItem[]
    total: number
  }
  message?: string
}

// 检测记录列表响应
export interface DetectionListResponse {
  data: {
    records: DetectionRecord[]
    total: number
  }
  message?: string
}

// 检测统计响应
export interface DetectionStatsResponse {
  data: DetectionStats
  message?: string
}

// 图片检测请求
export interface ImageDetectionRequest {
  image: File | string // File对象或base64字符串
  user_id?: number
}

// 图片检测响应
export interface ImageDetectionResponse {
  data: {
    category: WasteCategory
    confidence: number
    item_name?: string
    description?: string
    disposal_guide?: string
    detection_id: number
  }
  message?: string
}

// 检测反馈请求
export interface DetectionFeedbackRequest {
  detection_id: number
  is_correct: boolean
  correct_category?: WasteCategory
  feedback?: string
}

// API响应基础类型
export interface RubbishApiResponse {
  message?: string
  msg?: string
  data?: any
}

// 批量删除检测记录请求
export interface BatchDeleteDetectionRequest {
  detection_ids: number[]
}

// 模型性能数据
export interface ModelPerformance {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  last_updated: string
}

// 模型性能响应
export interface ModelPerformanceResponse {
  data: ModelPerformance
  message?: string
}