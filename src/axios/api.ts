import { request } from './index'

// 风险点列表
export function getRiskPointList(params: {}) {
  return request('/api/getRiskPointList', params, 'get')
}
