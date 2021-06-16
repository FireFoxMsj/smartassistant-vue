<template>
  <div class="home">
    <van-notice-bar
      v-show="!isOnline"
      color="#F6AE1E"
      background="#FDF3DF"
      :scrollable="false"
      text="当前设备已离线，连接局域网后才能控制此设备"/>
    <div v-show="isOn" class="device">
      <img src="../assets/socket-on.png">
      <p>插座</p>
      <van-button
        class="open-btn open-btn--on"
        :disabled="!isOnline"
        @click="openLight(false)"></van-button>
    </div>
    <div v-show="!isOn" class="device">
      <img src="../assets/socket-off.png">
      <p>插座</p>
      <van-button
        class="open-btn open-btn--off"
        :disabled="!isOnline"
        @click="openLight(true)"></van-button>
    </div>
  </div>
</template>

<script>
import Socket from 'ws-plugin'

export default {
  name: 'home',
  data() {
    return {
      ws: null, // websocket对象
      isOn: false, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      deviceId: '',
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null
    }
  },
  methods: {
    // 获取设备初始值
    getDeviceState() {
      // 获取初始值
    },
    openLight(status) {
      if (status) {
        // 开灯
      } else {
        // 关灯
      }
      this.isOn = status
    },
    // 处理ws信息
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      // 初始化设备信息
      console.log(msgJson)
    },
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
    }
  },
  created() {
    // 生成连接
    const self = this
    this.ws = new Socket({
      url: 'ws://192.168.0.84:8088/ws',
      onOpen() {
        self.getDeviceState()
      },
      onMessage(data) {
        self.handleMessage(data)
      }
    })
    // 获取device_id参数
    const { search, href } = window.location
    const params = search ? this.getUrlParams(search) : this.getUrlParams(href)
    this.deviceId = params.device_id
  }
}
</script>
<style lang="scss" scoped>
.mgt60 {
  margin-top: 0.6rem;
}
.device {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  text-align: center;
  img {
    width: 2.8rem;
  }
  p {
    padding-top: 0.3rem;
    padding-bottom: 4rem;
    font-size: 0.32rem;
    color: #3F4663;
  }
  .open-btn {
    width: 1.4rem;
    height: 1.4rem;
    background-size: 0.62rem 0.68rem;
    background-repeat: no-repeat;
    background-position: center center;
    border: 0.01rem solid #CFD6E0;
    border-radius: 0.4rem;
  }
  .open-btn--off {
    background-color: $bgColor;
    background-image: url('../assets/open-off.png');
  }
  .open-btn--on {
    background-color: #2DA3F6;
    background-image: url('../assets/open-on.png');
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
}
</style>
