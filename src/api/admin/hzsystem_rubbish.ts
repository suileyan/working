import serviceAxios from "@/http";

import type {
  WasteItem,
  DetectionRecord,
  WasteQueryParams,
  DetectionQueryParams,
  WasteListResponse,
  DetectionListResponse,
  DetectionStatsResponse,
  ImageDetectionRequest,
  ImageDetectionResponse,
  DetectionFeedbackRequest,
  RubbishApiResponse,
  BatchDeleteDetectionRequest,
  ModelPerformanceResponse
} from '@/types/apis/hzsystem_rubbish_T'

// 获取垃圾分类列表
export const getWasteItemsAPI = (params: WasteQueryParams): Promise<WasteListResponse> => {
  return serviceAxios({
    url: '/admin/waste/items',
    method: 'GET',
    params
  })
}

// 添加垃圾分类项
export const addWasteItemAPI = (data: Omit<WasteItem, 'id' | 'created_at' | 'updated_at'>): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: '/admin/waste/items',
    method: 'POST',
    data
  })
}

// 编辑垃圾分类项
export const editWasteItemAPI = (id: number, data: Partial<Omit<WasteItem, 'id' | 'created_at' | 'updated_at'>>): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: `/admin/waste/items/${id}`,
    method: 'PUT',
    data
  })
}

// 获取垃圾分类项详情
export const wasteItemDetailAPI = (id: number): Promise<{ data: WasteItem; message?: string }> => {
  return serviceAxios({
    url: `/admin/waste/items/${id}`,
    method: 'GET'
  })
}

// 删除垃圾分类项
export const deleteWasteItemAPI = (id: number): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: `/admin/waste/items/${id}`,
    method: 'DELETE'
  })
}

// 获取检测记录列表
export const getDetectionRecordsAPI = (params: DetectionQueryParams): Promise<DetectionListResponse> => {
  return serviceAxios({
    url: '/admin/detection/records',
    method: 'GET',
    params
  })
}

// 获取检测记录详情
export const detectionRecordDetailAPI = (id: number): Promise<{ data: DetectionRecord; message?: string }> => {
  return serviceAxios({
    url: `/admin/detection/records/${id}`,
    method: 'GET'
  })
}

// 删除检测记录
export const deleteDetectionRecordAPI = (id: number): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: `/admin/detection/records/${id}`,
    method: 'DELETE'
  })
}

// 批量删除检测记录
export const batchDeleteDetectionRecordsAPI = (data: BatchDeleteDetectionRequest): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: '/admin/detection/records/batch-delete',
    method: 'POST',
    data
  })
}

// 图片检测
export const imageDetectionAPI = (data: ImageDetectionRequest): Promise<ImageDetectionResponse> => {
  return serviceAxios({
    url: '/api/detection/image',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 检测反馈
export const detectionFeedbackAPI = (data: DetectionFeedbackRequest): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: '/api/detection/feedback',
    method: 'POST',
    data
  })
}

// 获取检测统计数据
export const getDetectionStatsAPI = (): Promise<DetectionStatsResponse> => {
  return serviceAxios({
    url: '/admin/detection/stats',
    method: 'GET'
  })
}

// 获取模型性能数据
export const getModelPerformanceAPI = (): Promise<ModelPerformanceResponse> => {
  return serviceAxios({
    url: '/admin/model/performance',
    method: 'GET'
  })
}

// 重新训练模型
export const retrainModelAPI = (): Promise<RubbishApiResponse> => {
  return serviceAxios({
    url: '/admin/model/retrain',
    method: 'POST'
  })
}

// 获取垃圾分类知识库
export const getWasteKnowledgeAPI = (params: { category?: string; keyword?: string }): Promise<WasteListResponse> => {
  return serviceAxios({
    url: '/api/waste/knowledge',
    method: 'GET',
    params
  })
}

// 搜索垃圾分类
export const searchWasteAPI = (keyword: string): Promise<WasteListResponse> => {
  return serviceAxios({
    url: '/api/waste/search',
    method: 'GET',
    params: { keyword }
  })
}
