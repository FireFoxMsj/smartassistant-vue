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

export default {
  name: 'app',
  methods: {
    ...mapActions(['setWebsocket', 'setIdentity', 'setDeviceId', 'setPluginId']),
    // 浏览器地址转化
    getUrlParams(url) {
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
      // 灯
      const light = ['ceiling17', 'lamp9', 'color8']
      if (light.includes(model)) {
        this.$router.replace({
          name: 'light',
          query
        })
      }
    }
  },
  created() {
    // 获取device_id参数
    const { search, href } = window.location
    const params = search ? this.getUrlParams(search) : this.getUrlParams(href)
    const saId = params.sa_id
    const { token } = params
    // 设置设备id
    const deviceId = params.device_id
    this.setDeviceId(deviceId)
    // 设置设备唯一标识
    const { identity } = params
    this.setIdentity(identity)
    // 设置插件id
    const { pluginId } = params
    this.setPluginId(pluginId)
    // 生成连接 并设置全局对象
    const wsUrl = getRemote()
    const ws = new Socket({
      url: `${wsUrl}?token=${token}&sa_id=${saId}`,
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
