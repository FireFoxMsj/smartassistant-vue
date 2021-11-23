<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onRefresh="refresh"/>
    <div v-show="hasColor" class="color-box">
      <p>{{ deviceName }}</p>
      <div id="picker" class="picker-box">
        <svg style="display:none;">
          <defs>
            <g id="handle">
              <circle cx="8" cy="8" r="6" fill="transparent" stroke-width="2" stroke="#fff"></circle>
            </g>
          </defs>
        </svg>
      </div>
    </div>
    <div v-if="!hasColor" class="device">
      <img :src="lightImg">
      <p>{{ deviceName }}</p>
      <van-button
        v-if="permission.power"
        :class="[ isOn ? 'open-btn--on' : 'open-btn--off']"
        :disabled="!isOnline"
        @click="openLight(!isOn)"></van-button>
    </div>
    <div v-if="permission.brightness" class="control">
      <p>亮度 {{ getPercent(lightMax, lightMin, light) }}%</p>
      <van-slider
        v-model="light"
        :min="lightMin"
        :max="lightMax"
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
    <div v-if="permission.color_temp" class="control mgt60">
      <p>色温 {{ getPercent(tempMax, tempMin, temperature) }}%</p>
      <van-slider
        v-model="temperature"
        :min="tempMin"
        :max="tempMax"
        @input="inputChange('temperature')"
        @drag-start="dragStart"
        @drag-end="dragEnd"
        :disabled="!isOnline"
        bar-height="0.8rem"
        active-color="transparent"
        inactive-color="linear-gradient(90deg, #FFB06B, #FFD26E 40%, #7ECFFC)">
        <template #button>
          <div class="light-control--btn"></div>
        </template>
      </van-slider>
    </div>
    <!--有色彩时才显示-->
    <div v-if="hasColor" class="device">
      <van-button
        :class="[ isOn ? 'open-btn--on' : 'open-btn--off']"
        :disabled="!isOnline"
        @click="openLight(!isOn)"></van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import iro from '@jaames/iro'
import OfflineNotice from '../../../components/OfflineNotice.vue'

const onImg = require('../../assets/light/linght-on.png')
const offImg = require('../../assets/light/linght-off.png')

export default {
  name: 'home',
  components: {
    OfflineNotice
  },
  data() {
    return {
      ws: null, // websocket对象
      colorPicker: null, // colorPicker对象
      deviceName: '智能灯',
      isOn: false, // 灯是否打开
      lightMin: 0, // 色温最小值
      lightMax: 100, // 色温最大值
      light: 0, // 亮度
      tempMin: 0, // 色温最小值
      tempMax: 100, // 色温最大值
      temperature: 0, // 色温
      isOnline: true, // 设备在线离线状态
      instanceId: '', // 实例id
      saId: '', // saId
      token: '', // 用户token
      permission: {
        brightness: true,
        color_temp: true,
        power: true
      }, // 用户权限
      stateId: 1, // 获取状态消息id
      perId: 1, // 获取权限id
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      isReady: false, // 是否成功获取设备初始化状态
      lastTime: null,
      isFleshing: false
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId']),
    lightImg() {
      if (this.isOn) {
        return onImg
      }
      return offImg
    },
    // 是否有色彩功能
    hasColor() {
      return false
    }
  },
  methods: {
    // 生成colorPicker组件
    createPicker() {
      // 适配大小
      const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
      const standard = 375
      const width = 200 * (clientWidth / standard)
      this.colorPicker = new iro.ColorPicker('#picker', {
        // Set the size of the color picker
        width,
        handleSvg: '#handle',
        layout: [
          {
            component: iro.ui.Wheel
          },
        ],
        // Set the initial color to pure red
        color: '#f00'
      })
      this.colorPicker.on('color:change', (color) => {
        this.colorChange(color.hexString)
      })
    },
    // 刷新
    refresh() {
      this.isReady = false
      this.isFleshing = true
      this.initData()
    },
    // 初始状态
    initData() {
      this.getDeviceState()
    },
    // 获取设备初始值
    getDeviceState() {
      // 获取初始值
      this.stateId = Number(`1${Date.now()}`)
      this.websocket.send({
        id: this.stateId,
        domain: 'lifx',
        service: 'get_attributes',
        identity: this.identity
      })
    },
    // 发送操作指令
    sendCommand(attribute, val) {
      this.websocket.send({
        id: 1,
        domain: this.pluginId,
        service: 'set_attributes',
        identity: this.identity,
        service_data: {
          attributes: [
            {
              attribute,
              instance_id: this.instanceId,
              val
            }
          ]
        }
      })
    },
    openLight(status) {
      if (status) {
        // 开灯
        this.sendCommand('power', 'on')
      } else {
        // 关灯
        this.sendCommand('power', 'off')
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
    // 颜色变化处理
    colorChange(val) {
      const now = Date.now()
      const wait = 500
      if (now - this.lastTime - wait > 0) {
        console.log(val)
        this.lastTime = now
      }
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
      this.sendCommand('brightness', val)
    },
    // 色温变化
    temperatureChange(val) {
      // 灯关闭不发送指令
      if (!this.isOn) {
        return
      }
      // 调节色温
      this.sendCommand('color_temp', val)
    },
    // 处理ws信息
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      // 初始化设备信息
      if (msgJson.id === this.stateId) {
        // 延迟结束刷新动画
        setTimeout(() => {
          this.isFleshing = false
        }, 1000)
        if (!msgJson.success) {
          this.isOnline = false
          return
        }
        this.isOnline = true
        const { instances } = msgJson.result.device
        const lightBulb = instances.filter(item => item.type === 'light_bulb')
        const { attributes } = lightBulb[0]
        this.instanceId = lightBulb[0].instance_id
        attributes.forEach((attr) => {
          if (attr.attribute === 'power') {
            this.isOn = attr.val === 'on'
            this.permission.power = attr.can_control
          } else if (attr.attribute === 'color_temp') {
            this.temperature = attr.val
            this.tempMin = attr.min
            this.tempMax = attr.max
            this.permission.color_temp = attr.can_control
          } else if (attr.attribute === 'brightness') {
            this.light = attr.val
            this.lightMin = attr.min
            this.lightMax = attr.max
            this.permission.brightness = attr.can_control
          }
        })
        this.isReady = true
      }
      // 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'attribute_change') {
        const { data: changeData } = msgJson
        const { attr } = changeData
        // 如果正在操作则忽略同步, 开关状态除外
        if (this.isLock) {
          if (changeData.instance_id === this.instanceId) {
            if (attr.attribute === 'power') {
              this.isOn = attr.val === 'on'
            }
          }
          return
        }
        if (changeData.instance_id === this.instanceId) {
          if (attr.attribute === 'power') {
            this.isOn = attr.val === 'on'
          } else if (attr.attribute === 'color_temp') {
            this.temperature = attr.val
          } else if (attr.attribute === 'brightness') {
            this.light = attr.val
          }
        }
      }
    },
    // 百分比
    getPercent(max, min, value) {
      let res = Math.round(Number(((value - min) / (max - min) * 100)))
      if (res < 0) {
        res = 0
      }
      return res
    }
  },
  created() {
    const { query } = this.$route
    if (query.name) {
      this.deviceName = query.name
    }
    // 初始设备状态
    this.initData()
    // 处理ws信息
    this.websocket.onmessage((data) => {
      this.handleMessage(data)
    })
  },
  mounted() {
    this.createPicker()
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
.color-box {
  padding: 0.3rem 0 0.6rem 0;
  text-align: center;
  .picker-box {
    display: inline-block;
    padding-top: 0.6rem;
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
}
.open-btn--off {
  width: 1.4rem;
  height: 1.4rem;
  background-color: $bgColor;
  background-image: url('../../assets/light/open-off.png');
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
  background-image: url('../../assets/light/open-on.png');
  background-size: 0.62rem 0.68rem;
  background-repeat: no-repeat;
  background-position: center center;
  border: 0.01rem solid #CFD6E0;
  border-radius: 0.4rem;
  box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
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
