<template>
  <div class="connect">
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
      <template v-if="networdStatus === 0">
        <div class="feed-title">
          <van-icon name="checked" size="0.4rem" color="#0bdb99"  class="success-icon"/>
          <span class="feed-title">添加设备成功</span>
        </div>
      </template>
      <template v-if="networdStatus === 2">
        <p class="feed-title">添加设备中...</p>
      </template>
      <template  v-if="networdStatus === 1">
        <p class="feed-title c-error">添加设备失败!</p>
        <p class="feed-content">请检查并确保手机和设备处于同一个局域网中</p>
      </template>
    </div>
    <div class="connect-info-box">
      <!-- 设备连接状态 -->
      <div class="step-box">
        <template v-if="connectStatus === 0">
          <van-icon name="checked" size="0.4rem" color="#0bdb99"/>
          <span>连接设备成功！</span>
        </template>
        <template v-else-if="connectStatus === 1">
          <van-icon name="warning" size="0.4rem" color="#ff7f7f"/>
          <span class="c-error">连接设备失败！</span>
        </template>
        <template v-else-if="connectStatus === 2">
          <van-icon name="circle" size="0.4rem" color="#a5b3C7"/>
          <span  class="gray">连接设备中...</span>
        </template>
      </div>
      <!-- 设备接受信息状态 -->
      <div v-show="connectStatus === 0" class="step-box">
        <template v-if="receiveStatus === 0">
          <van-icon name="checked" size="0.4rem" color="#0bdb99"/>
          <span>设备接收网络信息成功！</span>
        </template>
        <template v-else-if="receiveStatus === 1">
          <van-icon name="warning" size="0.4rem" color="#ff7f7f"/>
          <span class="c-error">设备接收网络信息失败！</span>
        </template>
        <template v-else-if="receiveStatus === 2">
          <van-icon name="circle" size="0.4rem" color="#a5b3C7"/>
          <span  class="gray">设备接收网络信息中...</span>
        </template>
      </div>
      <!--连接网络状态-->
      <div v-show="receiveStatus === 0" class="step-box">
        <template v-if="networdStatus === 0">
          <van-icon name="checked" size="0.4rem" color="#0bdb99"/>
          <span>设备连接网络成功！</span>
        </template>
        <template v-else-if="networdStatus === 1">
          <van-icon name="warning" size="0.4rem" color="#ff7f7f"/>
          <span class="c-error">设备连接网络失败！</span>
        </template>
        <template v-else-if="networdStatus === 2">
          <van-icon name="circle" size="0.4rem" color="#a5b3C7"/>
          <span  class="gray">设备连接网络中...</span>
        </template>
      </div>
    </div>
    <div v-if="networdStatus === 1" class="btn-box-placeholder">
      <div class="btn-box">
        <van-button class="op-btn">重试</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'deviceConnect',
  data() {
    return {
      currentRate: 0,
      rate: 0,
      timer: null,
      device: {},
      connectStatus: 2, // 状态 0：成功 1：失败 2：连接中
      receiveStatus: 2, // 状态 0：成功 1：失败 2：连接中
      networdStatus: 2, // 状态 0：成功 1：失败 2：连接中
    }
  },
  computed: {
    ...mapGetters(['args', 'wifiInfo']),
    rateFixed() {
      return parseInt(this.currentRate, 10)
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    connectDevice() {
      this.mockProcess()
      this.connectStatus = 2
      const { mode } = this.args
      if (mode) {
        // monde = bluetooth_softap
        const modeArr = mode.split('_')
        // 如果支持蓝牙
        if (modeArr.includes('bluetooth')) {
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
      window.zt.connectDeviceByBluetooth({
        bluetoothName // 设备连接的蓝牙名称
      }, (res) => {
        if (res.status === 0) {
          this.connectStatus = 0
          this.sendNetworkInfo()
        }
      })
    },
    connectBySoftap() {
      const { hotspot_name: hotspotName } = this.args
      window.zt.connectDeviceHotspot({
        hotspotName // 设备的热点名称
      }, (res) => {
        if (res.status === 0) {
          this.createDeviceByHotspot(hotspotName)
        } else {
          this.$router.push({
            name: 'wlanSystem'
          })
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
        }
      })
    },
    // 通过热点连接设备
    connectDeviceByHotspot() {
      window.zt.connectDeviceByHotspot({}, (res) => {
        if (res.status === 0) {
          this.connectStatus = 0
          this.sendNetworkInfo()
        }
      })
    },
    // 发送配网信息
    sendNetworkInfo() {
      this.receiveStatus = 2
      setTimeout(() => {
        this.receiveStatus = 0
        this.networdStatus = 2
        window.zt.connectNetworkByBluetooth({
          wifiName: this.wifiInfo.wifiName, // 设备要置网的wifi名称
          wifiPass: this.wifiInfo.wifiPass // 设备要置网的wifi密码
        }, (res) => {
          if (res.status === 0) {
            this.rate = 100
            this.networdStatus = 0
          }
        })
      }, 1000)
    },
    // 模拟进度条
    mockProcess() {
      this.rate = 0
      this.timer = setInterval(() => {
        if (this.rate >= 94) {
          clearInterval(this.timer)
          return
        }
        this.rate = this.rate + 1
      }, 50)
    }
  },
  created() {
    // 连接设备
    this.connectDevice()
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
  background-image: url(../../assets/circle-spiner.png);
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
  span {
    margin-left: 0.21rem;
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
