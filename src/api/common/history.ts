import http from '@/http'
import type { AxiosResponse } from 'axios'

// 历史记录相关的类型定义
export interface HistoryRecord {
  id: number
  user: {
    id: number
    username: string
  } | null
  detection_type: 'image' | 'video' | 'camera'
  original_file: string
  result_image?: string
  detected_category: {
    id: number
    name: string
  } | null
  detected_item?: {
    id: number
    name: string
  } | null
  confidence: number
  processing_time?: number
  is_correct?: boolean | null
  user_feedback?: string
  detection_data?: {
    success: boolean
    detections: Array<{
      id: number
      class_id: number
      class_name: string
      confidence: number
      bbox: {
        x1: number
        y1: number
        x2: number
        y2: number
      }
    }>
    processing_time: number
    image_size: [number, number]
    model_info: {
      device: string
      confidence_threshold: number
      iou_threshold: number
    }
  }
  created_at: string
}

export interface HistoryListParams {
  user?: number
  type?: 'image' | 'video' | 'camera'
}

// API返回的是数组格式，不是分页格式
export type HistoryListResponse = HistoryRecord[]

/**
 * 获取检测记录列表
 * @param params 查询参数
 * @returns Promise<HistoryListResponse>
 */
export const getHistoryRecords = async (params: HistoryListParams = {}): Promise<HistoryListResponse> => {
  try {
    // 参数验证
    if (params.user !== undefined && (!Number.isInteger(params.user) || params.user < 1)) {
      throw new Error('用户ID必须是大于0的整数')
    }

    if (params.type !== undefined && !['image', 'video', 'camera'].includes(params.type)) {
      throw new Error('检测类型必须是 image、video 或 camera')
    }

    const response: AxiosResponse<HistoryListResponse> = await http.get('/api/rubbish/api/records/', {
      params,
      timeout: 10000 // 10秒超时
    })

    // 验证响应数据结构 - API返回的是数组
    if (!Array.isArray(response)) {
      throw new Error('服务器返回数据格式错误，期望数组格式')
    }

    // 验证每条记录的必要字段
    response.forEach((record, index) => {
      if (!record.id || !record.created_at) {
        console.warn(`记录 ${index} 缺少必要字段:`, record)
      }
    })

    return response
  } catch (error: any) {
    console.error('获取历史记录失败:', error)

    // 根据错误类型提供更具体的错误信息
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    } else if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          throw new Error('未授权访问，请重新登录')
        case 403:
          throw new Error('没有权限访问历史记录')
        case 404:
          throw new Error('历史记录接口不存在')
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error('服务器错误，请稍后重试')
        default:
          throw new Error(`请求失败 (${status})`)
      }
    } else if (error.request) {
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      throw new Error(error.message || '获取历史记录失败')
    }
  }
}

/**
 * 删除单条历史记录
 * @param recordId 记录ID
 * @returns Promise<void>
 */
export const deleteHistoryRecord = async (recordId: number): Promise<void> => {
  try {
    // 参数验证
    if (!recordId || recordId <= 0) {
      throw new Error('无效的记录ID')
    }

    await http.delete(`/api/rubbish/api/records/${recordId}/`, {
      timeout: 5000 // 5秒超时
    })
  } catch (error: any) {
    console.error('删除历史记录失败:', error)

    if (error.code === 'ECONNABORTED') {
      throw new Error('删除请求超时，请重试')
    } else if (error.response?.status === 401) {
      throw new Error('未授权操作，请重新登录')
    } else if (error.response?.status === 403) {
      throw new Error('没有权限删除此记录')
    } else if (error.response?.status === 404) {
      throw new Error('记录不存在或已被删除')
    } else if (error.response?.status >= 500) {
      throw new Error('服务器错误，删除失败')
    } else if (error.message) {
      throw error
    } else {
      throw new Error('删除失败，请稍后重试')
    }
  }
}

/**
 * 批量删除历史记录
 * @param recordIds 记录ID数组
 * @returns Promise<void>
 */
export const batchDeleteHistoryRecords = async (recordIds: number[]): Promise<void> => {
  try {
    await http.post('/api/rubbish/api/records/batch_delete/', {
      record_ids: recordIds
    })
  } catch (error) {
    console.error('批量删除历史记录失败:', error)
    throw error
  }
}

/**
 * 清空用户所有历史记录
 * @param userId 用户ID（可选，不传则清空当前用户的记录）
 * @returns Promise<void>
 */
export const clearAllHistoryRecords = async (userId?: number): Promise<void> => {
  try {
    // 参数验证
    if (userId !== undefined && userId <= 0) {
      throw new Error('无效的用户ID')
    }

    await http.post('/api/rubbish/api/records/clear_all/', {
      user_id: userId
    }, {
      timeout: 10000 // 10秒超时，清空操作可能需要更长时间
    })
  } catch (error: any) {
    console.error('清空历史记录失败:', error)

    if (error.code === 'ECONNABORTED') {
      throw new Error('清空请求超时，请重试')
    } else if (error.response?.status === 401) {
      throw new Error('未授权操作，请重新登录')
    } else if (error.response?.status === 403) {
      throw new Error('没有权限清空历史记录')
    } else if (error.response?.status === 404) {
      throw new Error('清空接口不存在')
    } else if (error.response?.status >= 500) {
      throw new Error('服务器错误，清空失败')
    } else if (error.message) {
      throw error
    } else {
      throw new Error('清空失败，请稍后重试')
    }
  }
}

/**
 * 更新历史记录反馈
 * @param recordId 记录ID
 * @param feedback 反馈信息
 * @param isCorrect 检测是否正确
 * @returns Promise<HistoryRecord>
 */
export const updateHistoryRecordFeedback = async (
  recordId: number,
  feedback: string,
  isCorrect: boolean
): Promise<HistoryRecord> => {
  try {
    const response: AxiosResponse<HistoryRecord> = await http.patch(`/api/rubbish/api/records/${recordId}/`, {
      user_feedback: feedback,
      is_correct: isCorrect
    })
    return response.data
  } catch (error) {
    console.error('更新历史记录反馈失败:', error)
    throw error
  }
}

/**
 * 获取历史记录统计信息
 * @param userId 用户ID（可选）
 * @returns Promise<any>
 */
export const getHistoryStatistics = async (userId?: number): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await http.get('/api/rubbish/api/records/statistics/', {
      params: { user_id: userId }
    })
    return response.data
  } catch (error) {
    console.error('获取历史统计失败:', error)
    throw error
  }
}