import type { DatasetResponse } from '@/types/factory'
import serviceAxios from '@/http'

// 获取数据集概览信息和类别统计
export function getDatasetInfo(): Promise<DatasetResponse> {
  return serviceAxios({
    url: '/api/rubbish/api/dataset/',
    method: 'get',
  })
}