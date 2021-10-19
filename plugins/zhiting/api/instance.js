import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'

// 怎加一个普通的axios
const commonAx = axios.create({
  baseURL: '/',
  withCredentials: true, // 跨域携带证书
  timeout: 10000,
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
})

// commonAx.interceptors.request.use((config) => {
//   return config
// })

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
      resolve(data)
    })
    .catch((error) => {
      Toast.fail('网络错误')
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
