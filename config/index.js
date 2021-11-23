const env = process.env.NODE_ENV

// 本地包版本
// const getRemote = () => {
//   const isHttps = /https/.test(window.location.protocol)
//   const isApp = navigator.userAgent.includes('zhitingua')
//   return new Promise((resolve, reject) => {
//     if (env === 'development') {
//       resolve('ws://192.168.22.106:37965/ws') // 'sa.zhitingtech.com'
//     } else if (isApp) {
//       zhiting.invoke('getSocketAddress', {}, (res) => {
//         if (res.status === 0) {
//           resolve(res.address)
//         } else {
//           reject('get address error')
//         }
//       })
//     } else if (isHttps) {
//       resolve(`wss://${window.location.host}/ws`)
//     } else {
//       resolve(`ws://${window.location.host}/ws`)
//     }
//   })
// }

const getRemote = () => {
  const isHttps = /https/.test(window.location.protocol)
  if (env === 'development') {
    return 'ws://192.168.22.123:9020/ws' // 'sa.zhitingtech.com'
  }
  if (isHttps) {
    return `wss://${window.location.host}/ws`
  }
  return `ws://${window.location.host}/ws`
}

export {
  getRemote
}

export default {}
