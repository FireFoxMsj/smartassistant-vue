import * as http from './instance'

const apiHeader = process.env.NODE_ENV === 'development' ? '/api' : ''

/**
* 请求列子
*/
export const example = params => http.p(
  `${apiHeader}/examle`,
  params
)

/**
* 设备列表
 @param { id: String } 路径参数 家庭id
*/
export const getDeviceList = (params = {}) => http.g(
  `${apiHeader}/devices`,
  params
)

/**
* 获取设备详情
@param { id: String } 路径参数 设备id
*/
export const getDeviceDetail = (id, params = {}) => http.g(
  `${apiHeader}/devices/${id}`,
  params
)

/**
* 修改设备名称
@param { id: String } 路径参数 设备id
@param { name: String } 修改后的设备名称
*/
export const editDevice = (id, params = {}) => http.u(
  `${apiHeader}/devices/${id}`,
  params
)

/**
* 删除设备
@param { id: String } 路径参数 设备id
*/
export const deleteDevice = (id, params = {}) => http.d(
  `${apiHeader}/devices/${id}`,
  params
)

/**
* 添加设备
@param { device_identity: String } device_identity 设备标识
*/
export const addDevice = (params = {}) => http.p(
  `${apiHeader}/devices`,
  params
)

/**
* 品牌列表
@param { name:String, type:Number } 名称，类型
*/
export const getBrandList = params => http.g(
  `${apiHeader}/brands`,
  params
)

/**
* 品牌详情
@param { id: Number } 参数路径，品牌id
*/
export const getBrandDetail = (id, params = {}) => http.g(
  `${apiHeader}/brands/${id}`,
  params
)

/**
* 获取家庭列表
*/
export const getAreaList = (params = {}) => http.g(
  `${apiHeader}/areas`,
  params
)

/**
* 获取家庭详情
@param { id: String } 路径参数 家庭id
*/
export const getAreaDetail = (id, params = {}) => http.g(
  `${apiHeader}/areas/${id}`,
  params
)

/**
* 获取家庭详情
@param { id: String } 路径参数 家庭id
*/
export const editAreaName = (id, params = {}) => http.u(
  `${apiHeader}/areas/${id}`,
  params
)

/**
* 删除家庭
@param { id: String } 路径参数 家庭id
*/
export const deleteArea = (id, params = {}) => http.d(
  `${apiHeader}/areas/${id}`,
  params
)

/**
* 获取区域详情
@param { id: String } 路径参数 区域id
*/
export const getLocationDetail = (id, params = {}) => http.g(
  `${apiHeader}/locations/${id}`,
  params
)

/**
* 编辑区域名称
@param { id: String } 路径参数 区域id
@param { name: String } 新的区域名称
*/
export const editLocationName = (id, params = {}) => http.u(
  `${apiHeader}/locations/${id}`,
  params
)

/**
* 删除家庭区域
@param { id: String } 路径参数 区域id
*/
export const deleteLocation = (id, params = {}) => http.d(
  `${apiHeader}/locations/${id}`,
  params
)

/**
 * 家庭/物业下的房间/区域列表
 @param { id: String } 路径参数 家庭id
 */
export const getLocations = (params = {}) => http.g(
  `${apiHeader}/locations`,
  params
)

/**
* 添加家庭区域
@param { id: String, name: String } 家庭id 房间名称
*/
export const addLocation = (params = {}) => http.p(
  `${apiHeader}/locations`,
  params
)

/**
* 设置房间排序
@param { id: String } 路径参数 家庭id
@param { locations_id: String[] } 房间ID列表
*/
export const editLocationSort = (params = {}) => http.u(
  `${apiHeader}/locations`,
  params
)

/**
* 登录
@param { phone: String, password: String } 账号 密码
*/
export const login = (params = {}) => http.p(
  `${apiHeader}/users/login`,
  params
)

/**
* 内网登出
@param { phone: String, password: String } 账号 密码
*/
export const sessionLogout = (params = {}) => http.p(
  `${apiHeader}/sessions/logout`,
  params
)

/**
* 内网登录
@param { account_name: String, password: String } 账号 密码
*/
export const sessionLogin = (params = {}) => http.p(
  `${apiHeader}/sessions/login`,
  params
)

/**
* 获取角色列表
@param { }
*/
export const getRoleList = (params = {}) => http.g(
  `${apiHeader}/roles`,
  params
)

/**
* 添加角色
@param { }
*/
export const addRole = (params = {}) => http.p(
  `${apiHeader}/roles`,
  params
)

/**
* 编辑角色
@param { }
*/
export const editRole = (id, params = {}) => http.u(
  `${apiHeader}/roles/${id}`,
  params
)

/**
* 获取角色详情
@param { id } 路径参数 角色id
*/
export const getRoleDetail = (id, params = {}) => http.g(
  `${apiHeader}/roles/${id}`,
  params
)

/**
* 删除角色
@param { id } 路径参数 角色id
*/
export const deleteRole = (id, params = {}) => http.d(
  `${apiHeader}/roles/${id}`,
  params
)

/**
* 获取角色模板
@param {}
*/
export const getRoleTemp = (params = {}) => http.g(
  `${apiHeader}/role_tmpl`,
  params
)

/**
* 获取角色权限
@param {}
*/
export const getRolePermission = (id, params = {}) => http.g(
  `${apiHeader}/users/${id}/permissions`,
  params
)

/**
* 获取成员列表
@param {  }
*/
export const getUser = (params = {}) => http.g(
  `${apiHeader}/users`,
  params
)

/**
* 获取成员详情
@param { id } 成员id
*/
export const getUserDetail = (id, params = {}) => http.g(
  `${apiHeader}/users/${id}`,
  params
)

/**
* 获取成员详情
@param { id } 成员id
*/
export const editUser = (id, params = {}) => http.u(
  `${apiHeader}/users/${id}`,
  params
)

/**
* 删除成员
@param { id } 成员id
*/
export const deleteMember = (id, params = {}) => http.d(
  `${apiHeader}/users/${id}`,
  params
)

/**
* 退出家庭
@param { id } 成员id
*/
export const quitArea = (areaId, userId, params = {}) => http.d(
  `${apiHeader}/areas/${areaId}/users/${userId}`,
  params
)

/**
* 编辑成员
@param { id, role_id } 成员id 角色id
*/
export const editMember = (id, roleId, params = {}) => http.u(
  `${apiHeader}/users/${id}/roles/${roleId}`,
  params
)

/**
 * 获取邀请二维码
 @param { id } 角色id
 */
export const getInvitationCode = (id, params = {}) => http.p(
  `${apiHeader}/users/${id}/invitation/code`,
  params
)

/**
 * 获取场景列表
 @param {}
 */
export const scenesList = (params = {}) => http.g(
  `${apiHeader}/scenes`,
  params
)

/**
 * 创建场景
 @param {id} 场景ID
 */
export const creatScene = (params = {}) => http.p(
  `${apiHeader}/scenes`,
  params
)

/**
 * 获取场景
 @param {id} 场景ID
 */
export const getSceneDetail = (id, params = {}) => http.g(
  `${apiHeader}/scenes/${id}`,
  params
)

/**
 * 修改场景
 @param {id} 场景ID
 */
export const reviseScene = (id, params = {}) => http.u(
  `${apiHeader}/scenes/${id}`,
  params
)

/**
 * 删除场景
 @param {id} 场景ID
 */
export const deleteScene = (id, params = {}) => http.d(
  `${apiHeader}/scenes/${id}`,
  params
)

/**
 * 执行场景
 @param {id} 场景ID
 */
export const executeScene = (id, params = {}) => http.p(
  `${apiHeader}/scenes/${id}/execute`,
  params
)

/**
 * 获取日志列表
 @param {}
 */
export const logsList = (params = {}) => http.g(
  `${apiHeader}/scene_logs`,
  params
)
