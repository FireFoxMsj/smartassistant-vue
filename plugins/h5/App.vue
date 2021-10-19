<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'app',
  methods: {
    ...mapActions(['setDeviceInfo', 'setArgs']),
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
    }
  },
  created() {
    // 保存参数信息
    const params = this.getUrlParams()
    this.setArgs(params)
    // 获取设备信息
    window.zt.getDeviceInfo({}, (res) => {
      this.setDeviceInfo(res)
    })
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
