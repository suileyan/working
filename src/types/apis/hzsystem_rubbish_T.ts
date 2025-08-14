// 数据集概览
export interface DatasetOverview {
  total_categories: number;
  total_images: number;
  train_images: number;
  val_images: number;
  dataset_size: number;
}

export interface DatasetCategory {
  id: string;
  name: string;
  train_count: number;
  val_count: number;
  total_count: number;
  sample_images: string[];
}

export interface DatasetConfig {
  train: string;
  val: string;
  nc: number;
  names: string[];
}

export interface DatasetResponse {
  overview: DatasetOverview;
  categories: DatasetCategory[];
  config: DatasetConfig;
}

// 垃圾分类
export interface RubbishCategory {
  id: number;
  name: string;
  category_type: string;
  description: string;
  disposal_method: string;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export type RubbishCategoryListResponse = RubbishCategory[];

export interface CreateRubbishCategoryRequest {
  name: string;
  category_type: string;
  description: string;
  disposal_method: string;
  icon: string;
  color: string;
}

export interface RubbishItem {
  id: number;
  category_name: string;
  category_type: string;
  name: string;
  description: string;
  disposal_tips: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  category: number;
}

export type RubbishItemListResponse = RubbishItem[];

export interface CreateRubbishItemRequest {
  name: string;
  category: number;
  description: string;
  disposal_tips: string;
  image?: string;
}

export interface DetectionRecord {
  id: number;
  user_name: string;
  category_name: string;
  item_name: string;
  detection_type: string;
  original_file: string;
  result_image: string;
  confidence: number;
  processing_time: number;
  is_correct: boolean;
  user_feedback: string;
  detection_data: {
    bbox: number[];
    area: number;
  };
  created_at: string;
  user: number;
  detected_category: number;
  detected_item: number;
}

export type DetectionRecordListResponse = DetectionRecord[];

export interface KnowledgeArticle {
  id: number;
  title: string;
  article_type: string;
  content: string;
  summary: string;
  cover_image: string | null;
  is_published: boolean;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type KnowledgeArticleListResponse = KnowledgeArticle[];

export interface CreateKnowledgeArticleRequest {
  title: string;
  article_type: string;
  content: string;
  summary: string;
  cover_image?: string;
  is_published: boolean;
  sort_order: number;
}

export interface UpdateKnowledgeArticleRequest {
  title: string;
  article_type: string;
  content: string;
  summary: string;
  cover_image?: string;
  is_published: boolean;
  sort_order: number;
}

export interface StatisticsOverview {
  total_detections: number;
  total_users: number;
  accuracy_rate: number;
  category_distribution: {
    detected_category__name: string;
    count: number;
  }[];
}
