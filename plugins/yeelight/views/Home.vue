<template>
  <div class="home">
    <van-notice-bar
      v-show="!isOnline"
      class="notice"
      color="#F6AE1E"
      background="#FDF3DF"
      :scrollable="false"
      text="当前设备已离线，连接局域网后才能控制此设备">
      <template #right-icon>
        <div @click="reflesh" class="notice-right">
          <van-icon name="replay" :class="{ 'a-rotate': isFleshing }"/>
          <span>刷新</span>
        </div>
      </template>
    </van-notice-bar>
    <div v-show="isOn" class="device">
      <template>
        <img v-if="lightType === 'ceiling17'" src="../assets/led.png">
        <img v-else-if="lightType === 'lamp9'" src="../assets/lamp.png">
        <img v-else src="../assets/linght-on.png">
      </template>
      <p>{{ deviceName }}</p>
      <van-button
        v-if="permission.switch.is_permit"
        class="open-btn--on"
        :disabled="!isOnline"
        @click="openLight(false)"></van-button>
    </div>
    <div v-show="!isOn" class="device">
      <template>
        <img v-if="lightType === 'ceiling17'" src="../assets/led.png">
        <img v-else-if="lightType === 'lamp9'" src="../assets/lamp.png">
        <img v-else src="../assets/linght-off.png">
      </template>
      <p>{{ deviceName }}</p>
      <van-button
        v-if="permission.switch.is_permit"
        class="open-btn--off"
        :disabled="!isOnline"
        @click="openLight(true)"></van-button>
    </div>
    <div v-if="permission.set_bright.is_permit" class="control">
      <p>亮度 {{ light }}%</p>
      <van-slider
        v-model="light"
        @change="lightChange"
        @input="inputChange('light')"
        @drag-start="dragStart"
        @drag-end="dragEnd"
        :disabled="!isOnline"
        bar-height="0.8rem"
        active-color="linear-gradient(to right, #FEBF32, #FFB06B)">
        <template #button>
          <div class="light-control--btn"></div>
        </template>
      </van-slider>
    </div>
    <div v-if="permission.set_color_temp.is_permit" class="control mgt60">
      <p>色温</p>
      <van-slider
        v-model="temperature"
        @change="temperatureChange"
        @input="inputChange('temperature')"
        @drag-start="dragStart"
        @drag-end="dragEnd"
        :disabled="!isOnline"
        bar-height="0.8rem"
        active-color="transparent"
        inactive-color="linear-gradient(90deg, #FFB06B, #FFD26E 40%, #7ECFFC)">
        <template #button>
          <div class="pf-control--btn"></div>
        </template>
      </van-slider>
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
      deviceName: '智能灯',
      isOn: false, // 灯是否打开
      light: 0, // 亮度
      temperature: 0, // 色温
      isOnline: true, // 设备在线离线状态
      deviceId: '',
      token: '', // 用户token
      permission: {
        set_bright: {},
        set_color_temp: {},
        switch: {}
      }, // 用户权限
      stateId: 1, // 获取状态消息id
      perId: 1, // 获取权限id
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      isReady: false, // 是否成功获取设备初始化状态
      lastTime: null,
      lightType: 'ceiling17', // ceiling17: 吸顶灯 lamp9: 台灯
      isFleshing: false
    }
  },
  methods: {
    // 刷新
    reflesh() {
      this.isReady = false
      this.isFleshing = true
      this.initData()
    },
    // 初始状态
    initData() {
      this.getDeviceState()
      this.getDevicePermission()
    },
    // 获取设备初始值
    getDeviceState() {
      // 获取初始值
      this.stateId = Number(`1${Date.now()}`)
      this.ws.send({
        domain: 'yeelight',
        id: this.stateId,
        type: 'call_service',
        service: 'state',
        service_data: {
          device_id: this.deviceId
        }
      })
    },
    // 获取用户操作权限
    getDevicePermission() {
      // 获取初始值
      this.perId = Number(`2${Date.now()}`)
      this.ws.send({
        domain: 'plugin',
        id: this.perId,
        service: 'get_actions',
        service_data: {
          device_id: this.deviceId
        }
      })
    },
    openLight(status) {
      if (status) {
        // 开灯
        this.ws.send({
          domain: 'yeelight',
          id: 1,
          service: 'switch',
          service_data: {
            device_id: this.deviceId,
            power: 'on'
          }
        })
      } else {
        // 关灯
        this.ws.send({
          domain: 'yeelight',
          id: 1,
          service: 'switch',
          service_data: {
            device_id: this.deviceId,
            power: 'off'
          }
        })
      }
      this.isOn = status
    },
    // 拖动变化
    dragStart() {
      this.isLock = true
    },
    // 拖动结束
    dragEnd() {
      this.isLock = false
    },
    // 拖动监听
    inputChange(attr) {
      if (!this.isReady) {
        return
      }
      const now = Date.now()
      const wait = 500
      if (now - this.lastTime - wait > 0) {
        if (attr === 'light') {
          this.lightChange(this.light)
        } else if (attr === 'temperature') {
          this.temperatureChange(this.temperature)
        }
        this.lastTime = now
      }
    },
    // 亮度变化
    lightChange(val) {
      // 灯关闭不发送指令
      if (!this.isOn) {
        return
      }
      // 调节亮度
      this.ws.send({
        domain: 'yeelight',
        id: 1,
        service: 'set_bright',
        service_data: {
          device_id: this.deviceId,
          brightness: val
        }
      })
    },
    // 色温变化
    temperatureChange(val) {
      // 灯关闭不发送指令
      if (!this.isOn) {
        return
      }
      // 调节色温
      this.ws.send({
        domain: 'yeelight',
        id: 1,
        service: 'set_color_temp',
        service_data: {
          device_id: this.deviceId,
          color_temp: val
        }
      })
    },
    // 处理ws信息
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      // 初始化设备信息
      if (msgJson.id === this.stateId && msgJson.result) {
        const { state } = msgJson.result
        this.isOn = state.power === 'on'
        this.light = state.brightness
        this.temperature = state.color_temp
        this.isOnline = state.is_online
        // 延迟结束刷新动画
        setTimeout(() => {
          this.isFleshing = false
        }, 1000)
        this.isReady = true
      }
      // 初始化用户权限
      if (msgJson.id === this.perId && msgJson.result) {
        this.permission = msgJson.result.actions
      }
      // 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'state_changed') {
        const { data: changeData } = msgJson
        const { state } = changeData
        // 如果正在操作则忽略同步, 开关状态除外
        if (this.isLock) {
          if (changeData.device_id === this.deviceId) {
            if (state.power !== undefined) {
              this.isOn = state.power === 'on'
            }
          }
          return
        }
        if (changeData.device_id === this.deviceId) {
          if (state.power !== undefined) {
            this.isOn = state.power === 'on'
          }
          if (state.brightness !== undefined) {
            this.light = state.brightness
          }
          if (state.color_temp !== undefined) {
            this.temperature = state.color_temp
          }
          if (state.is_online !== undefined) {
            this.isOnline = state.is_online
          }
        }
      }
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
    // 获取device_id参数
    const { search, href } = window.location
    const params = search ? this.getUrlParams(search) : this.getUrlParams(href)
    this.deviceId = Number(params.device_id)
    this.lightType = params.model || 'ceiling17'
    this.token = params.token
    if (params.name) {
      this.deviceName = params.name
    }
    // 生成连接
    const self = this
    this.ws = new Socket({
      url: `ws://192.168.0.84:8088/ws?token=${this.token}`,
      onOpen() {
        self.initData()
      },
      onMessage(data) {
        self.handleMessage(data)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.mgt60 {
  margin-top: 0.6rem;
}
.notice-right {
  font-size: 0.24rem;
  span {
    font-size: 0.24rem;
    margin-left: 0.12rem;
  }
}
.device {
  padding-top: 0.1rem;
  padding-bottom: 1rem;
  text-align: center;
  img {
    width: 2.8rem;
    height: 2.8rem;
    object-fit: contain;
  }
  p {
    padding-bottom: 0.7rem;
    font-size: 0.32rem;
    color: #3F4663;
  }
  .open-btn--off {
    width: 1.4rem;
    height: 1.4rem;
    background-color: $bgColor;
    background-image: url('../assets/open-off.png');
    background-size: 0.62rem 0.68rem;
    background-repeat: no-repeat;
    background-position: center center;
    border: 0.01rem solid #CFD6E0;
    border-radius: 0.4rem;
  }
  .open-btn--on {
    width: 1.4rem;
    height: 1.4rem;
    background-color: #2DA3F6;
    background-image: url('../assets/open-on.png');
    background-size: 0.62rem 0.68rem;
    background-repeat: no-repeat;
    background-position: center center;
    border: 0.01rem solid #CFD6E0;
    border-radius: 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
}
.control {
  padding: 0 0.6rem;
  p {
    font-size: 0.28rem;
    color: #3F4663;
    padding-bottom: 0.37rem;
  }
}
.light-control--btn {
  width: 0.5rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.1rem;
  box-shadow: 0px 0px 10px 0px #d1d1d1;
}
.pf-control--btn {
  width: 0.3rem;
  height: 0.8rem;
  background: #fff;
  border: 0.1rem solid #fff;
  border-radius: 0.1rem;
  box-shadow: 0px 0px 10px 0px #d1d1d1;
}
.a-rotate {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
</style>
<style scoped>
.control >>> .van-slider {
  border-radius: 0.2rem;
}
.control >>> .van-slider__button-wrapper-right {
  right: -0.24rem;
}
.notice >>> .van-notice-bar__content {
  font-size: 0.24rem;
}
</style>
