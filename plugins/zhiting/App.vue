<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import Socket from 'ws-plugin'
import { mapActions } from 'vuex'
import { getRemote } from '../../config/index'
import { isApp } from './utils/index'

export default {
  name: 'app',
  watch: {
    $route(to) {
      const hideTitleList = ['socketTiming', 'socketTaskManage', 'socketStatistics']
      const { name } = to
      // 响应路径需要隐藏标题
      if (hideTitleList.includes(name)) {
        if (isApp()) {
          // app内隐藏标题
          zhiting.invoke('setTitle', {
            isShow: false // 是否显示标题栏，默认显示
          })
        } else {
          // 隐藏头部
          const data = {
            op: 'setTitle',
            value: {
              isShow: false
            }
          }
          this.postMessage(data)
        }
      } else if (isApp()) {
        // app内隐藏标题
        zhiting.invoke('setTitle', {
          isShow: true // 是否显示标题栏，默认显示
        })
      } else {
        // 隐藏头部
        const data = {
          op: 'setTitle',
          value: {
            isShow: true
          }
        }
        this.postMessage(data)
      }
    }
  },
  methods: {
    ...mapActions(['setWebsocket', 'setIdentity', 'setDeviceId', 'setDeviceInfo', 'setArgs']),
    // pc向父级发消息
    postMessage(data) {
      window.parent.postMessage(data, '*')
    },
    // 浏览器地址转化
    getUrlParams() {
      const { search, href } = window.location
      const url = search || href
      const str = url.substr(url.indexOf('?') + 1)
      const obj = {}
      const arr = str.split('&')
      arr.forEach((item) => {
        const param = item.split('=')
        const [key, value] = param
        obj[key] = decodeURIComponent(value)
      })
      return obj
    },
    toDeviceDetail(query) {
      const { model } = query
      // 开关
      const switchs = ['zt.switch.bb102s', 'ZTSW3ZL001W', 'ZTSW1SLW001W', 'ZTSW2SLW001W', 'ZTSW3SLW001W']
      // 插座
      const sockets = ['zt.socket.bb001s', 'ZTSOPOL001W']
      // 窗帘电机
      const curtains = ['ZTCMOCLW001W']
      // 根据mode跳转到设备页面
      if (switchs.includes(model)) {
        this.$router.replace({
          name: 'switch',
          query
        })
      } else if (sockets.includes(model)) {
        this.$router.replace({
          name: 'socket',
          query
        })
      } else if (curtains.includes(model)) {
        this.$router.replace({
          name: 'curtain',
          query
        })
      }
    }
  },
  created() {
    // 获取device_id参数
    const params = this.getUrlParams()
    this.setArgs(params)
    // 获取设备信息
    window.zt.getDeviceInfo({}, (res) => {
      this.setDeviceInfo(res)
    })
    const saId = params.sa_id
    const { token } = params
    // 设置设备id
    const deviceId = params.device_id
    this.setDeviceId(deviceId)
    // 设置设备唯一标识
    const { identity } = params
    this.setIdentity(identity)
    // 生成连接 并设置全局对象
    const ws = new Socket({
      url: `${getRemote()}?token=${token}&sa_id=${saId}`,
    })
    this.setWebsocket(ws)
    this.toDeviceDetail(params)
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-avtive {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
