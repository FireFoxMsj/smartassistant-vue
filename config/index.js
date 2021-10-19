const env = process.env.NODE_ENV

const getRemote = () => {
  const isHttps = /https/.test(window.location.protocol)
  if (env === 'development') {
    return 'ws://192.168.22.106:37965/ws' // 'sa.zhitingtech.com'
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
