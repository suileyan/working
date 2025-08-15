import serviceAxios from '@/http'
import { uploadFile } from './file'

/**
 * 图片检测接口响应类型
 */
export interface ImageDetectionResponse {
  success: boolean
  record_id: number
  detections: {
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
  }[]
  processing_time: number
  original_image: string
  result_image: string
  detected_category: string | null
}

/**
 * 视频检测接口响应类型
 */
export interface VideoDetectionResponse {
  success: boolean
  record_id: number
  frame_detections: {
    frame_number: number
    timestamp: number
    detections: {
      class_id: number
      class_name: string
      confidence: number
      bbox: [number, number, number, number]
    }[]
  }[]
  summary: {
    total_frames: number
    processed_frames: number
    total_detections: number
    unique_classes: string[]
  }
  processing_time: number
  original_video: string
  detected_category: string | null
}

/**
 * 图片检测
 * @param file 图片文件
 * @param confidence 置信度阈值，默认0.5
 * @param iou_threshold IOU阈值，默认0.45
 * @returns Promise<ImageDetectionResponse>
 */
export const detectImage = async (
  file: File,
  confidence: number = 0.5,
  iou_threshold: number = 0.45
): Promise<ImageDetectionResponse> => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('confidence', confidence.toString())
  formData.append('iou_threshold', iou_threshold.toString())

  return serviceAxios({
    method: 'POST',
    url: '/api/yolo/api/detect/image/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 视频检测
 * @param file 视频文件
 * @param confidence 置信度阈值，默认0.5
 * @param iou_threshold IOU阈值，默认0.45
 * @param frame_skip 跳帧数，默认5
 * @returns Promise<VideoDetectionResponse>
 */
export const detectVideo = async (
  file: File,
  confidence: number = 0.5,
  iou_threshold: number = 0.45,
  frame_skip: number = 5
): Promise<VideoDetectionResponse> => {
  const formData = new FormData()
  formData.append('video', file)
  formData.append('confidence', confidence.toString())
  formData.append('iou_threshold', iou_threshold.toString())
  formData.append('frame_skip', frame_skip.toString())

  return serviceAxios({
    method: 'POST',
    url: '/api/yolo/api/detect/video/',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 将base64图片数据转换为File对象
 * @param base64Data base64图片数据
 * @param filename 文件名
 * @returns File对象
 */
export const base64ToFile = (base64Data: string, filename: string = 'image.jpg'): File => {
  const arr = base64Data.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}