// 数据集概览信息类型
export interface DatasetOverview {
  total_categories: number
  total_images: number
  train_images: number
  val_images: number
  dataset_size: number
}

// 数据集类别信息类型
export interface DatasetCategory {
  id: number
  name: string
  train_count: number
  val_count: number
  total_count: number
  sample_images: string[]
}

// 数据集配置类型
export interface DatasetConfig {
  names: Record<string, string>
}

// 数据集接口响应类型
export interface DatasetResponse {
  overview: DatasetOverview
  categories: DatasetCategory[]
  config: DatasetConfig
}

// 数据集统计数据类型（用于首页展示）
export interface DatasetStats {
  total_categories: number
  total_images: number
  accuracy_rate: number
  detection_methods: number
}