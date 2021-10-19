<template>
  <div class="connect">
    <van-nav-bar
      title="设备连接"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="progress">
      <van-circle
        v-model="currentRate"
        :rate="rate"
        :speed="100"
        color="#2DA3F6"
        layer-color="#DDE5EB"
        size="4.6rem"
        :stroke-width="40"/>
      <div class="spaner">
        <p class="rate-font">{{ rateFixed }}<span>%</span></p>
      </div>
    </div>
    <div class="feed-back-box">
      <template  v-if="connectFail">
        <p class="feed-title c-error">添加设备失败!</p>
        <p class="feed-content">{{ failReason }}</p>
      </template>
      <template v-else-if="connectSuccess">
        <div class="feed-title">
          <van-icon name="checked" size="0.4rem" color="#0bdb99"  class="success-icon"/>
          <span class="feed-title">添加设备成功</span>
        </div>
      </template>
      <template v-else>
        <p class="feed-title">添加设备中...</p>
      </template>
    </div>
    <div class="connect-info-box">
      <!-- 设备连接状态 -->
      <div
        v-for="(item, index) in connectMsgs"
        :key="item.msg + index"
        class="step-box">
        <template v-if="item.type === 'success'">
          <van-icon name="checked" size="0.4rem" color="#0bdb99"/>
          <span class="mgl20">{{ item.msg }}</span>
        </template>
        <template v-else-if="item.type === 'fail'">
          <van-icon name="warning" size="0.4rem" color="#ff7f7f"/>
          <span class="mgl20 c-error">{{ item.msg }}</span>
        </template>
        <template v-else-if="item.type === 'connecting'">
          <van-loading color="#a5b3c7" size="0.36rem"/>
          <span  class="mgl20 gray">{{ item.msg }}</span>
        </template>
      </div>
    </div>
    <div v-if="connectFail" class="btn-box-placeholder">
      <div class="btn-box">
        <van-button class="op-btn" @click="retry">重试</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const RETRY_MAX = 3 // 重试的最大次数

export default {
  name: 'deviceConnect',
  data() {
    return {
      currentRate: 0,
      rate: 0,
      timer: null,
      device: {},
      switchToAp: false, // 切换到softap连接
      connectTimes: 0, // 重试次数
      receiveTimes: 0, // 重试次数
      networkTimes: 0, // 重试次数
      networkStatus: 2, // 设备置网状态 0 成功 1 失败 2 置网中
      connectMsgs: [], // 连接信息反馈
      msgBody: { // 消息体格式
        type: 'success', // success fail connecting,
        msg: '设备正在连接中...'
      }
    }
  },
  computed: {
    ...mapGetters(['args', 'wifiInfo']),
    rateFixed() {
      return parseInt(this.currentRate, 10)
    },
    connectFail() {
      return this.connectTimes >= RETRY_MAX || this.receiveTimes >= RETRY_MAX || this.networkTimes >= RETRY_MAX
    },
    connectSuccess() {
      return this.networkStatus === 0
    },
    failReason() {
      if (this.connectTimes >= RETRY_MAX) {
        return '请检查并确保设备已重置，手机连接的热点是正确的'
      }
      if (this.receiveTimes >= RETRY_MAX) {
        return '请检查并确保设备与手机尽量靠近，以便信息传输'
      }
      return '请检查并确保WLAN密码输入正确'
    }
  },
  watch: {
    connectFail(val) {
      if (val) {
        clearInterval(this.timer)
        this.switchToAp = true
        this.rate = 0
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.replace({
        name: 'configuration'
      })
    },
    // 添加反馈消息
    addFeedBackMsg(type, msg) {
      const msgBody = {
        type,
        msg
      }
      if (type === 'success' || type === 'fail') {
        const index = this.connectMsgs.findIndex(item => item.type === 'connecting')
        if (index !== -1) {
          this.connectMsgs.splice(index, 1)
        }
      }
      this.connectMsgs.push(msgBody)
    },
    // 重置数据
    resetData() {
      this.connectTimes = 0
      this.receiveTimes = 0
      this.networkTimes = 0
      this.connectMsgs = []
    },
    connectDevice() {
      this.resetData()
      this.mockProcess()
      const { mode } = this.args
      if (mode) {
        // monde = bluetooth_softap
        const modeArr = mode.split('_')
        // 如果支持蓝牙
        if (modeArr.includes('bluetooth') && !this.switchToAp) {
          this.connectByBle()
        } else if (modeArr.includes('softap')) {
          // 支持wifi连接
          this.connectBySoftap()
        }
      }
    },
    // 通过蓝牙连接设备
    connectByBle() {
      const { bluetooth_name: bluetoothName } = this.args
      this.addFeedBackMsg('connecting', '连接设备中...')
      window.zt.connectDeviceByBluetooth({
        bluetoothName // 设备连接的蓝牙名称
      }, (res) => {
        if (res.status === 0) {
          this.addFeedBackMsg('success', '连接设备成功！')
          this.sendNetworkInfo('connectNetworkByBluetooth')
        } else {
          this.addFeedBackMsg('fail', '连接设备失败！')
          this.connectTimes += 1
          if (this.connectTimes < RETRY_MAX) {
            this.connectByBle()
          }
        }
      })
    },
    // 通过设备热点连接设备失败回调
    softApFailCallback() {
      this.addFeedBackMsg('fail', '连接设备失败！')
      this.connectTimes += 1
      if (this.connectTimes < RETRY_MAX) {
        this.connectBySoftap()
      } else {
        this.$router.push({
          name: 'wlanSystem'
        })
      }
    },
    connectBySoftap() {
      const { hotspot_name: hotspotName } = this.args
      this.addFeedBackMsg('connecting', '连接设备中...')
      window.zt.connectDeviceHotspot({
        hotspotName // 设备的热点名称
      }, (res) => {
        if (res.status === 0) {
          this.createDeviceByHotspot(hotspotName)
        } else {
          this.softApFailCallback()
        }
      })
    },
    // 通过设备热点创建设备
    createDeviceByHotspot(hotspotName) {
      window.zt.createDeviceByHotspot({
        hotspotName, // 设备的热点名称
        ownership: 'abcd1234' // 设备拥有权 默认: abcd1234
      }, (res) => {
        if (res.status === 0) {
          this.connectDeviceByHotspot()
        } else {
          this.softApFailCallback()
        }
      })
    },
    // 通过热点连接设备
    connectDeviceByHotspot() {
      window.zt.connectDeviceByHotspot({}, (res) => {
        if (res.status === 0) {
          this.addFeedBackMsg('success', '连接设备成功！')
          this.sendNetworkInfo('connectNetworkByHotspot')
        } else {
          this.softApFailCallback()
        }
      })
    },
    // 发送配网信息
    sendNetworkInfo(method) {
      this.addFeedBackMsg('connecting', '设备接收网络信息中...')
      setTimeout(() => {
        this.addFeedBackMsg('success', '设备接收网络信息成功！')
        // 如果是蓝牙方式则通过蓝牙连接 如果是热点方式则通过热点连接
        this.deviceDistributionNetwork(method)
      }, 1000)
    },
    // 设备配网
    deviceDistributionNetwork(method) {
      this.networkStatus = 2
      this.addFeedBackMsg('connecting', '设备连接网络中...')
      window.zt[method]({
        wifiName: this.wifiInfo.wifiName, // 设备要置网的wifi名称
        wifiPass: this.wifiInfo.wifiPass // 设备要置网的wifi密码
      }, (res) => {
        if (res.status === 0) {
          this.rate = 100
          this.networkStatus = 0
          this.addFeedBackMsg('success', '设备连接网络成功！')
        } else {
          this.networkStatus = 1
          this.addFeedBackMsg('fail', '设备连接网络失败！')
          this.networkTimes += 1
          if (this.networkTimes < RETRY_MAX) {
            this.deviceDistributionNetwork(method)
          }
        }
      })
    },
    // 模拟进度条
    mockProcess() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.rate >= 94) {
          clearInterval(this.timer)
          return
        }
        this.rate = this.rate + 1
      }, 50)
    },
    // 重试连接
    retry() {
      this.connectDevice()
    }
  },
  created() {
    // 连接设备
    this.connectDevice()
    // 设置标题
    window.zt.setTitle({
      isShow: false
    })
  }
}
</script>
<style lang="scss" scoped>
.connect {
  padding-top: 1.5rem;
}
.progress {
  position: relative;
  width: 4.6rem;
  margin: 0 auto;
}
.spaner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -0.02rem;
  left: -0.02rem;
  width: 4.64rem;
  height: 4.64rem;
  background-image: url(../../../assets/circle-spiner.png);
  background-size: 100% 100%;
}
.rate-font {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3F4663;
  span {
    font-size: 0.75rem;
  }
}
.feed-back-box {
  padding-top: 0.53rem;
  text-align: center;
}
.success-icon {
  vertical-align: text-bottom;
  margin-right: 0.2rem;
}
.feed-title {
  padding-bottom: 0.1rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
}
.feed-content {
  text-align: center;
  font-size: 0.28rem;
  color: #ff7f7f;
  line-height: 1.5;
}
.c-error {
  color: #ff7f7f;
}
.connect-info-box {
  font-size: 0.28rem;
  color: #3f4663;
  padding: 0.5rem 1.05rem;
  text-align: left;
}
.step-box {
  display: flex;
  align-items: center;
  padding-top: 0.4rem;
  .mgl20 {
    margin-left: 0.2rem;
  }
  .gray {
    color: #A5B3C7;
  }
}
.btn-box-placeholder {
  height: 1.6rem;
}
.btn-box {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0.3rem;
}
.op-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
