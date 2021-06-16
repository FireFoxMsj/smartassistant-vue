import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'
import store from '../store'
import i18n from '../lang/index'
import * as $methods from '../utils/common'
import router from '../router'
import Bus from '../bus/index'

// 怎加一个普通的axios
const commonAx = axios.create({
  baseURL: '/',
  withCredentials: true, // 跨域携带证书
  timeout: 10000,
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
})

commonAx.interceptors.request.use((config) => {
  // 每个请求都带上token
  const { token } = store.state
  if (token) {
    config.headers['smart-assistant-token'] = token
  }
  return config
})

const commonItr = (reqAxios, type, url, params) => {
  let reqParams = params
  let reqUrl = url
  if (typeof params !== 'object') {
    reqParams = {}
  }
  const arg = qs.stringify(reqParams)
  if (Object.keys(reqParams).length > 0) {
    reqUrl = (type === 'get') ? `${url}?${arg}` : url
  }

  return reqAxios[type](reqUrl, reqParams)
}

const commonBase = (reqAxios, type, url, params) => new Promise((resolve, reject) => {
  commonItr(reqAxios, type, url, params)
    .then((response) => {
      const { data } = response
      if (data.status === 13) {
        // 登录拦截
        $methods.default.setStore('token', '')
        store.commit('setToken', '')
        router.replace({
          name: 'professionLogin'
        })
      } else if (data.status === 10) {
        // 没有权限 重新获取权限
        const { userInfo } = store.state
        Bus.$emit('updatePermission', userInfo.user_id)
        Toast(data.reason)
      } else if (data.status !== 0) {
        Toast(data.reason)
      }
      resolve(data)
    })
    .catch((error) => {
      Toast.fail(i18n.messages[i18n.locale].global.netWorkErr)
      reject(error)
    })
})


// 是因为 post 和 put 第二个参数是data，所以可以直接在第二个参数的位置写上数据，

// 后台可以访问到,而delete第二个参数是 config，所以要通过 config 里面的 data 来传参，所以应该这样写：axios.delete('/api',{data:{id:1}})

export const g = (url, params) => commonBase(commonAx, 'get', url, params)

export const p = (url, params) => commonBase(commonAx, 'post', url, params)

export const d = (url, params) => commonBase(commonAx, 'delete', url, { data: params })

export const u = (url, params) => commonBase(commonAx, 'put', url, params)

export const pa = (url, params) => commonBase(commonAx, 'patch', url, params)

export const op = (url, params) => commonBase(commonAx, 'options', url, params)
