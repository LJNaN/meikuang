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

// 传感器列表 开关量
export function getAqjcAqkcList(params = {}) {
  Object.assign(params, token)
  return request('/api/getAqjcAqkcList', params, 'get')
}

// 传感器列表 模拟量 与下面那个组合着用
export function getAqjcAqmcList(params = {}) {
  Object.assign(params, token)
  return request('/api/getAqjcAqmcList', params, 'get')
}

// 传感器数值  开关量、模拟量传感器-数值 与上面那个组合着用 
export function getAqjcAqssList(params = {}) {
  Object.assign(params, token)
  return request('/api/getAqjcAqssList', params, 'get')
}

// 传感器数值  矿压-矿压传感器
export function getKydevList(params = {}) {
  Object.assign(params, token)
  return request('/api/getKydevList', params, 'get')
}

// 传感器数值  矿压-数值
export function getKyjcKyrtdataList(params = {}) {
  Object.assign(params, token)
  return request('/api/getKyjcKyrtdataList', params, 'get')
}

// 传感器数值  水文-水文传感器
export function getSwdevList(params = {}) {
  Object.assign(params, token)
  return request('/api/getSwdevList', params, 'get')
}

// 传感器数值  水文-水文传感器-数值
export function getSwjcSwrtdataList(params = {}) {
  Object.assign(params, token)
  return request('/api/getSwjcSwrtdataList', params, 'get')
}


// location 列表
export function getRiskPointList(params = {}) {
  Object.assign(params, token)
  return request('/api/getRiskPointList', params, 'get')
}

// 风险点人员数量
export function getRyPointNum(params = {}) {
  Object.assign(params, token)
  return request('/api/getRyPointNum', params, 'get')
}

