const env = process.env.NODE_ENV

const getRemote = () => {
  const isHttps = /https/.test(window.location.protocol)
  if (env === 'development') {
    return 'ws://192.168.0.101:8088/ws' // 'sa.zhitingtech.com' ws://192.168.0.123:8088/ws
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
