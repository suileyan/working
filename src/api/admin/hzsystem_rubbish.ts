import type {
  DatasetResponse,
  RubbishCategory,
  RubbishCategoryListResponse,
  CreateRubbishCategoryRequest,
  RubbishItem,
  RubbishItemListResponse,
  CreateRubbishItemRequest,
  DetectionRecordListResponse,
    KnowledgeArticle,
  KnowledgeArticleListResponse,
  CreateKnowledgeArticleRequest,
  UpdateKnowledgeArticleRequest,
  StatisticsOverview
} from '@/types/apis/hzsystem_rubbish_T'
import serviceAxios from '@/http'

// 1.1 获取数据集概览
export function getDatasetAPI(): Promise<DatasetResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/dataset/',
    method: 'get'
  })
}

// 1.2 获取垃圾分类列表
export function getRubbishCategoriesAPI(): Promise<RubbishCategoryListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/categories/',
    method: 'get'
  })
}

// 1.2 创建垃圾分类
export function createRubbishCategoryAPI(data: CreateRubbishCategoryRequest): Promise<RubbishCategory> {
  return serviceAxios({
    url: '/api/rubbish/api/categories/',
    method: 'post',
    data
  })
}

// 1.3 获取垃圾物品列表
export function getRubbishItemsAPI(params?: { category?: number }): Promise<RubbishItemListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/items/',
    method: 'get',
    params
  })
}

// 1.3 创建垃圾物品
export function createRubbishItemAPI(data: CreateRubbishItemRequest): Promise<RubbishItem> {
  return serviceAxios({
    url: '/api/rubbish/api/items/',
    method: 'post',
    data
  })
}

// 1.4 获取检测记录列表
export function getDetectionRecordsAPI(params?: { user?: number; type?: string }): Promise<DetectionRecordListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/records/',
    method: 'get',
    params
  })
}

// 1.5.1 获取知识文章列表
export function getKnowledgeArticlesAPI(params?: { type?: string }): Promise<KnowledgeArticleListResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/knowledge/',
    method: 'get',
    params
  })
}

// 1.5.2 创建知识文章
export function createKnowledgeArticleAPI(data: CreateKnowledgeArticleRequest | FormData): Promise<KnowledgeArticle> {
  const isFormData = data instanceof FormData;
  return serviceAxios({
    url: '/api/rubbish/api/knowledge/',
    method: 'post',
    data,
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  })
}

// 1.5.3 更新知识文章（全量更新）
export function updateKnowledgeArticleAPI(id: number, data: UpdateKnowledgeArticleRequest | FormData): Promise<KnowledgeArticle> {
  const isFormData = data instanceof FormData;
  return serviceAxios({
    url: `/api/rubbish/api/knowledge/${id}/`,
    method: 'put',
    data,
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  })
}

// 1.5.3 部分更新知识文章
export function patchKnowledgeArticleAPI(id: number, data: Partial<UpdateKnowledgeArticleRequest> | FormData): Promise<KnowledgeArticle> {
  const isFormData = data instanceof FormData;
  return serviceAxios({
    url: `/api/rubbish/api/knowledge/${id}/`,
    method: 'patch',
    data,
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  })
}

// 1.5.4 删除知识文章
export function deleteKnowledgeArticleAPI(id: number): Promise<void> {
  return serviceAxios({
    url: `/api/rubbish/api/knowledge/${id}/`,
    method: 'delete'
  })
}

// 1.6 获取统计概览
export function getStatisticsOverviewAPI(): Promise<StatisticsOverview> {
  return serviceAxios({
    url: '/api/rubbish/api/statistics/overview/',
    method: 'get'
  })
}
