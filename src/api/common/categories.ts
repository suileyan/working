import serverConfig from '@/http'

// 垃圾分类类别接口响应类型
export interface CategoryResponse {
  id: number
  name: string
  category_type: string
  description: string
  disposal_method: string
  icon: string
  color: string
  created_at: string
  updated_at: string
}

/**
 * 获取所有垃圾分类类别
 * @returns Promise<CategoryResponse[]>
 */
export const getCategories = (): Promise<CategoryResponse[]> => {
  return serverConfig.get('/api/rubbish/api/categories/')
}