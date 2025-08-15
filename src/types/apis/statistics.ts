// 统计概览相关类型定义

// 分类分布数据
export interface CategoryDistribution {
  detected_category__name: string
  count: number
}

// 统计概览响应
export interface StatisticsOverviewResponse {
  total_detections: number
  total_users: number
  accuracy_rate: number
  category_distribution: CategoryDistribution[]
}

// 用户统计响应
export interface UserStatisticsResponse {
  total_detections: number
  correct_detections: number
  accuracy_rate: number
  weekly_detections: number
  monthly_detections: number
  eco_points: number
  achievements: string[]
  recent_records: Array<{
    id: number
    user_name: string
    category_name: string
    item_name: string
    detection_type: string
    original_file: string
    result_image: string
    confidence: number
    processing_time: number
    is_correct: boolean
    user_feedback: string
    detection_data: {
      bbox: number[]
      area: number
    }
    created_at: string
    user: number
    detected_category: number
    detected_item: number
  }>
}