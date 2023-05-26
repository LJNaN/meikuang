import { request } from './index'

const token = {
  belongMine: 610632007274
}

// 人员预警列表
export function getRyyjList(params = {}) {
  Object.assign(params, token)
  return request('/api/getRyyjList', params, 'get')
}

// 区域预警列表
export function getQyyjList(params = {}) {
  Object.assign(params, token)
  return request('/api/getQyyjList', params, 'get')
}

// 人员定位
export function getRydwRyczList(params = {}) {
  Object.assign(params, token)
  return request('/api/getRydwRyczList', params, 'get')
}

// 人员数据列表
export function getRysj(params = {}) {
  Object.assign(params, token)
  return request('/api/getRysj', params, 'get')
}

// 传感器列表  与下面那个组合着用
export function getAqjcAqmcList(params = {}) {
  Object.assign(params, token)
  return request('/api/getAqjcAqmcList', params, 'get')
}

// 传感器数值  与上面那个组合着用
export function getAqjcAqssList(params = {}) {
  Object.assign(params, token)
  return request('/api/getAqjcAqssList', params, 'get')
}