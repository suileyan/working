import http from '@/http'
import type { StatisticsOverviewResponse, UserStatisticsResponse } from '@/types/apis/statistics'

// 获取系统统计概览
export const getStatisticsOverview = (): Promise<StatisticsOverviewResponse> => {
  return http.get('/api/rubbish/api/statistics/overview/')
}

// 获取用户统计信息
export const getUserStatistics = (userId: string | number): Promise<UserStatisticsResponse> => {
  return http.get(`/api/rubbish/api/statistics/user/${userId}/`)
}