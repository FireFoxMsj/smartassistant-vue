import * as http from './instance'

const apiHeader = process.env.NODE_ENV === 'development' ? '/api' : '/api'

/**
* 获取当前功率
*/
export const getPower = (identity, params) => http.g(
  `${apiHeader}/plugin/zhiting/api/identity/${identity}/power`,
  params
)

/**
* 获取用户电量统计数据
*/
export const getElectricUse = (identity, params) => http.g(
  `${apiHeader}/plugin/zhiting/api/identity/${identity}/statistic/electric_use`,
  params
)

/**
* 获取定时任务列表
*/
export const getMaskList = (identity, params) => http.g(
  `${apiHeader}/plugin/zhiting/api/identity/${identity}/crons`,
  params
)

/**
* 创建定时任务
*/
export const addMask = (identity, params) => http.p(
  `${apiHeader}/plugin/zhiting/api/identity/${identity}/crons`,
  params
)

/**
* 删除定时任务
*/
export const delMask = (identity, params) => http.p(
  `${apiHeader}/plugin/zhiting/api/identity/${identity}/crons/batch`,
  params
)

/**
* 修改任务
*/
export const changeMask = (identity, maskId, params) => http.u(
  `${apiHeader}/plugin/zhiting/api/identity/${identity}/crons/${maskId}`,
  params
)
