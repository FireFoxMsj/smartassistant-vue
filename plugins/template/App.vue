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
    ...mapActions(['setWebsocket', 'setIdentity', 'setDeviceId']),
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
      // 根据mode跳转到设备页面
      if (model === 'switch') {
        // 开关
        this.$router.replace({
          name: 'switch',
          query
        })
      } else if (model === 'socket') {
        // 插座
        this.$router.replace({
          name: 'socket',
          query
        })
      } else if (model === 'light') {
        // 灯
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
    const { token } = params
    // 设置设备id
    const deviceId = params.device_id
    this.setDeviceId(deviceId)
    // 设置设备唯一标识
    const { identity } = params
    this.setIdentity(identity)
    // 生成连接 并设置全局对象
    const ws = new Socket({
      url: `${getRemote()}?token=${token}`,
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
