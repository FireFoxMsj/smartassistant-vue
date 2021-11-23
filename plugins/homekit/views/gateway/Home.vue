<template>
  <div class="home">
    <OfflineNotice :show="!isOnline" :loading="isFleshing" @onRefresh="refresh" />
    <div class="tab-box" v-if="hasColor">
      <ul class="clearfix">
        <li v-for="(item, index) in tabList" :key="index">
          <a
            href="javascript:;"
            :class="{ active: isActive === index }"
            @click="isActive = index"
          >{{ item.name }}</a
          >
        </li>
      </ul>
    </div>
    <div v-show="isActive===0" class="device" :class="{'on': isBattery}">
      <div class="radar-part">
        <div class="radar"></div>
        <div class="dot dot-1" :class="{ 'a-breath': isBattery }"></div>
        <div class="dot dot-2" :class="{ 'a-breath': isBattery }"></div>
        <div class="dot dot-3" :class="{ 'a-breath': isBattery }"></div>
        <div class="dot dot-4" :class="{ 'a-breath': isBattery }"></div>
        <div class="dot dot-5" :class="{ 'a-breath': isBattery }"></div>
        <div class="dot dot-6" :class="{ 'a-breath': isBattery }"></div>
        <div class="dot dot-7" :class="{ 'a-breath': isBattery }"></div>
        <div class="top-block"></div>
        <div class="bottom-block"></div>
        <div class="shield" v-if="isBattery"><img src="../../assets/gateway/shield-on.png" alt="" /></div>
        <div class="shield" v-else><img src="../../assets/gateway/shield-off.png" alt="" /></div>
        <p>{{isBattery?'在家守护中':'守护已关闭'}}</p>
      </div>
    </div>
    <div v-if="isActive===0" class="control">
      <div class="switch-wrap">
        <h3 class="title">
          <span>守护模式</span> <span class="mode-status" :class="{ on: isBattery }">{{isBattery?'打开':'关闭'}}</span>
        </h3>
        <div class="mode-box">
          <ul class="clearfix">
            <li v-for="(mode, index) in guardModeInfo.guardMode" :key="index">
              <a
                href="javascript:;"
                :class="{ active: guardActive === index && isBattery }"
                @click="changeMode(mode, index, 'guard')"
              >
                <div class="icon">
                  <img :src="guardActive === index && isBattery ? mode.onIcon : mode.offIcon" alt="" />
                </div>
                <div class="name">{{ mode.name }}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="isActive===0" class="control-item-box">
      <ul class="clearfix">
        <li v-for="(item, index) in modeList" :key="index" @click="associateShow = true">
          <span class="copy-icon"><img :src="item.icon" alt=""/></span>
          <div class="mode-status">
            <p class="mode one-line">{{ item.mode }}</p>
          </div>
          <div class="icon"><van-icon name="arrow" /></div>
        </li>
      </ul>
    </div>
    <div v-show="isActive===1&&hasColor" class="color-box">
      <div id="picker" class="picker-box">
        <svg style="display:none;">
          <defs>
            <g id="handle">
              <circle
                cx="8"
                cy="8"
                r="6"
                fill="transparent"
                stroke-width="2"
                stroke="#fff"
              ></circle>
            </g>
          </defs>
        </svg>
      </div>
    </div>
    <div v-show="isActive===1&&permission.brightness" class="control">
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
        active-color="linear-gradient(to right, #FEBF32, #FFB06B)"
      >
        <template #button>
          <div class="light-control--btn"></div>
        </template>
      </van-slider>
    </div>
    <div v-show="isActive===1&&permission.power" class="device">
      <van-button
        :class="[isOn ? 'open-btn--on' : 'open-btn--off']"
        :disabled="!isOnline"
        @click="openLight(!isOn)"
      ></van-button>
    </div>
    <!-- 子设备 -->
    <van-popup v-model="associateShow" class="associate-box" position="bottom">
      <div class="content">
        <van-nav-bar title="" left-arrow @click-left="onClickLeft">
          <template #title>
            <span class="title">子设备</span>
          </template>
        </van-nav-bar>
        <div class="scroll-box">
          <div class="brand-item" v-for="(item,index) in associateItem" :key="index" @click="goSensor(item)">
            <div class="brand-face">
              <img :src="item.url" class="icon-img" />
            </div>
            <div class="brand-name">{{item.name}} <span v-if="!item.online">离线</span></div>
            <van-icon name="arrow" size=".4rem" class="right-icon" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import iro from '@jaames/iro'
import OfflineNotice from '../../../components/OfflineNotice.vue'

const copyIcon = require('../../assets/air/copy.png')
const frostBigOn = require('../../assets/air/frost-big-on.png')
const frostBigOff = require('../../assets/air/frost-big-off.png')
const homeBigOn = require('../../assets/air/home-big-on.png')
const homeBigOff = require('../../assets/air/home-big-off.png')
const lockHomeBigOn = require('../../assets/air/lock-home-big-on.png')
const lockHomeBigOff = require('../../assets/air/lock-home-big-off.png')
const sleepBigOn = require('../../assets/air/sleep-big-on.png')
const sleepBigOff = require('../../assets/air/sleep-big-off.png')

export default {
  name: 'home',
  components: {
    OfflineNotice
  },
  data() {
    return {
      isBattery: true, // 是否有电池
      isOn: true, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      tabList: [{ name: '守护' }, { name: '彩灯' }],
      isActive: 0,
      light: 50, // 亮度
      lightMin: 0, // 亮度最小值
      lightMax: 100, // 亮度最大值
      tempMin: 0, // 色温最小值
      tempMax: 100, // 色温最大值
      temperature: 0, // 色温
      hueMin: 0, // 色彩最小值
      hueMax: 100, // 色彩最大值
      hue: 0, // 色彩
      saturationMin: 0, // 饱和度最小值
      saturationMax: 100, // 饱和度最大值
      saturation: 0, // 饱和度
      rgbMax: 16777215, // 色彩最大值
      rgbMin: 0, // 色彩最小值
      rgb: 0, // 色彩
      instanceId: '', // 实例id
      permission: {
        brightness: false,
        color_temp: false,
        power: false,
        hue: false, // 色彩
        saturation: false // 饱和度
      }, // 用户权限
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
      modeList: [{ mode: '子设备', statusName: '', icon: copyIcon }],
      associateShow: false,
      associateItem: [
        {
          url: '../../assets/gateway/fan-on.png', name: '温湿度传感器', path: 'flood-sensor', online: false
        },
        { url: '../../assets/gateway/fan-on.png', name: '人体传感器', online: false },
        { url: '../../assets/gateway/fan-on.png', name: '门窗传感器', online: false },
        { url: '../../assets/gateway/fan-on.png', name: '烟雾报警器', online: true },
        { url: '../../assets/gateway/fan-on.png', name: '燃气报警器', online: true },
        { url: '../../assets/gateway/fan-on.png', name: '水浸报警器', online: true }
      ],
      guardActive: -1,
      guardModeInfo: {
        name: '自动',
        onIcon: frostBigOn,
        offIcon: frostBigOff,
        active: true,
        guardMode: [
          {
            name: '在家',
            onIcon: homeBigOn,
            offIcon: homeBigOff,
            value: 0
          },
          {
            name: '离家',
            onIcon: lockHomeBigOn,
            offIcon: lockHomeBigOff,
            value: 1
          },
          {
            name: '睡眠',
            onIcon: sleepBigOn,
            offIcon: sleepBigOff,
            value: 2
          }
        ]
      },
      isScan: false
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId']),
    hasColor() {
      return this.permission.hue && this.permission.saturation
    }
  },
  watch: {},
  methods: {
    ...mapActions(['setSensorData']),
    // 刷新
    refresh() {
      this.isFleshing = true
      this.getDeviceState()
    },
    // 获取设备初始值
    getDeviceState() {
      this.stateId = Number(`1${Date.now()}`)
      // 获取初始值
      this.websocket.send({
        domain: this.pluginId,
        id: this.stateId,
        service: 'get_attributes',
        identity: this.identity
      })
    },
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
          }
        ],
        // Set the initial color to pure red
        color: '#f00'
      })
      this.colorPicker.on('color:change', (color) => {
        this.colorChange(color)
      })
    },
    // 发送操作指令
    sendCommand(id, attribute, instanceId, val) {
      this.websocket.send({
        id,
        domain: this.pluginId,
        service: 'set_attributes',
        identity: this.identity,
        service_data: {
          attributes: [
            {
              attribute,
              instance_id: instanceId,
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
        }
        this.lastTime = now
      }
    },
    // 拖动变化
    dragStart() {
      this.isLock = true
    },
    // 拖动结束
    dragEnd() {
      this.isLock = false
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
    // 颜色变化处理
    colorChange(val) {
      const now = Date.now()
      const wait = 500
      if (now - this.lastTime - wait > 0) {
        if (this.hasColor && this.isActive === 1) {
          this.sendCommand('hue', val.hue)
          this.sendCommand('saturation', val.saturation)
          this.lastTime = now
        }
      }
    },
    // 处理ws信息
    handleMessage(data) {
      this.$toast.clear()
      const msgJson = JSON.parse(data)
      console.log(msgJson)
      // 初始化设备信息
      if (msgJson.id === this.stateId) {
        setTimeout(() => {
          this.isFleshing = false
        }, 1000)
        if (!msgJson.result) {
          this.isOnline = false
          return
        }
        this.isOnline = true
        const { instances } = msgJson.result.device
        this.setSensorData(msgJson.result.device)
        const lightBulb = instances.find(item => item.type === 'light_bulb')
        const motionSensor = instances.find(item => item.type === 'motion_sensor')
        const securitySystem = instances.find(item => item.type === 'security_system')
        const lightArry = lightBulb.attributes
        const securitySystemArry = securitySystem.attributes
        const motionSensorArry = motionSensor.attributes
        this.instanceId = lightBulb.instance_id
        lightArry.forEach((attr) => {
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
          } else if (attr.attribute === 'hue') {
            this.hueMin = attr.min
            this.hue = attr.val
            this.hueMax = attr.max
            this.permission.hue = attr.can_control
          } else if (attr.attribute === 'saturation') {
            this.saturationMin = attr.min
            this.saturation = attr.val
            this.saturationMax = attr.max
            this.permission.saturation = attr.can_control
          } else if (attr.attribute === 'rgb') {
            this.rgbMin = attr.min
            this.rgb = attr.val
            this.rgbMax = attr.max
            this.permission.rgb = attr.can_control
          }
        })
        motionSensorArry.forEach((attr) => {
          if (attr.attribute === 'battery') {
            this.isBattery = !!attr.val
          }
        })
        securitySystemArry.forEach((attr) => {
          if (attr.attribute === 'current_state') {
            this.guardActive = attr.val
          }
        })
        this.colorPicker.color.hsv = { h: this.hue, s: this.saturation, v: 100 }
        this.isReady = true
      }
    },
    // 获取百分比
    getPercent(max, min, value) {
      let res = Math.round(Number(((value - min) / (max - min)) * 100))
      if (res < 0) {
        res = 0
      }
      return res
    },
    // 改变模式
    changeMode(params, index, type) {
      if (type === 'air') {
        this.airActive = index
      }
      if (type === 'windSpeed') {
        this.windSpeedActive = index
      }
      if (type === 'guard') {
        this.guardActive = index
      }
    },
    // 关闭关联子设备
    onClickLeft() {
      this.associateShow = false
    },
    goSensor(params) {
      this.$router.push({
        name: params.path
      })
    }
  },
  created() {
    // 初始设备值
    this.getDeviceState()
    // 处理ws信息
    this.websocket.onmessage((data) => {
      this.handleMessage(data)
    })
    // 接收bus事件
    this.$bus.$on('update', this.update)
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
.disable {
  opacity: 0.8;
}
.tab-box {
  padding: 0 0.3rem;
  position: absolute;
  width: 50%;
  top: .5rem;
  transform: translateX(50%);
  z-index: 99;
}
.tab-box li {
  width: 50%;
  text-align: center;
  float: left;
}
.tab-box li a {
  padding: 0.2rem 0.2rem;
  font-size: 0.32rem;
  color: #94a5be;
  font-weight: 700;
  position: relative;
}
.tab-box li a.active {
  color: #3699ff;
}
.tab-box li a.active:before {
  content: "";
  width: 0.4rem;
  height: 0.06rem;
  background: #3699ff;
  border-radius: 0.03rem;
  position: absolute;
  left: 50%;
  margin-left: -0.2rem;
  bottom: 0;
}
.device {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  text-align: center;
  .radar-part {
    position: relative;
    height: 4.9rem;
    width: 4.9rem;
    margin: 0 auto;
    .top-block {
      position: absolute;
      width: 4.9rem;
      height: 2rem;
      left: 50%;
      margin-left: -2.45rem;
      top: -2px;
      background: linear-gradient(
        top,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 20%,
        rgba(255, 255, 255, 0) 100%
      );
      z-index: 10;
    }
    .bottom-block {
      position: absolute;
      width: 4.9rem;
      height: 2rem;
      left: 50%;
      margin-left: -2.45rem;
      bottom: -2px;
      background: linear-gradient(
        top,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 80%,
        rgba(255, 255, 255, 1) 100%
      );
      z-index: 10;
    }
    p {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 0.28rem;
      font-weight: 700;
      color: #FD7357;
      z-index: 99;
    }
    .shield {
      width: 1.24rem;
      height: 1.24rem;
      position: absolute;
      top: 50%;
      margin-top: -0.62rem;
      left: 50%;
      margin-left: -0.62rem;
      text-align: center;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f1f1;
      overflow: hidden;
      img {
        width: 0.74rem;
        height: auto;
      }
    }
  }
  .radar {
    position: relative;
    z-index: 9;
    height: 4.9rem;
    width: 4.9rem;
    background: -webkit-repeating-radial-gradient(
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 19%,
      #eee 20%,
      rgba(255, 255, 255, 0) 20%
    );
    margin: 0 auto;
    border-radius: 50%;
    border: 0.02rem solid #eee;
    overflow: hidden;
  }
  .dot {
    position: absolute;
    width: .1rem;
    height: .1rem;
    background: #ccc;
    opacity: 1;
    border-radius: 50%;
    z-index: 11;
  }
  .dot-1 {
    width: .09rem;
    height: .09rem;
    top: 2rem;
    left: -.1rem;
    animation-delay: 0.4s;
  }
  .dot-2 {
    width: .06rem;
    height: .06rem;
    top: 1.52rem;
    left: 1.12rem;
    animation-delay: 0.2s;
  }
  .dot-3 {
    width: .04rem;
    height: .04rem;
    top: 1.25rem;
    right: 1rem;
    animation-delay: 2.3s;
  }
  .dot-4 {
    width: .12rem;
    height: .12rem;
    top: 1.8rem;
    right: 1.4rem;
    animation-delay: 1s;
  }
  .dot-5 {
    width: .06rem;
    height: .06rem;
    top: 50%;
    right: 0;
    animation-delay: 1.5s;
  }
  .dot-6 {
    width: .06rem;
    height: .06rem;
    top: 3.5rem;
    left: 1rem;
    animation-delay: 2s;
  }
  .dot-7 {
    width: .06rem;
    height: .06rem;
    top: 3.2rem;
    right: 0.5rem;
    animation-delay: 0.8s;
  }
  .a-breath {
    animation-name: breath;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}
.device.on {
  .dot{
    background: #1EE8D1;
  }
  p{
    color: #3699FF;
  }
}
.color-box {
  width: 100%;
  padding: 0.5rem 0 0.6rem 0;
  text-align: center;
  .picker-box {
    display: inline-block;
    padding-top: 0.6rem;
  }
}
.control {
  padding: 0.4rem 0.3rem;
  margin: 0 0.3rem 0.5rem 0.3rem;
  background: #ffffff;
  box-shadow: 0px 0px 0.2rem 0px rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  p {
    font-size: 0.28rem;
    color: #3f4663;
    font-weight: 700;
    padding-bottom: 0.37rem;
  }
}
.open-btn--off {
  width: 1.4rem;
  height: 1.4rem;
  background-color: $bgColor;
  background-image: url("../../assets/light/open-off.png");
  background-size: 0.62rem 0.68rem;
  background-repeat: no-repeat;
  background-position: center center;
  border: 0.01rem solid #cfd6e0;
  border-radius: 0.4rem;
}
.open-btn--on {
  width: 1.4rem;
  height: 1.4rem;
  background-color: #2da3f6;
  background-image: url("../../assets/light/open-on.png");
  background-size: 0.62rem 0.68rem;
  background-repeat: no-repeat;
  background-position: center center;
  border: 0.01rem solid #cfd6e0;
  border-radius: 0.4rem;
  box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
}
.light-control--btn {
  width: 0.5rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.1rem;
  box-shadow: 0px 0px 10px 0px #d1d1d1;
}
.pf-control--btn {
  width: 0.5rem;
  height: 1rem;
  background: #fff;
  border: 0.1rem solid #fff;
  border-radius: 0.1rem;
  box-shadow: 0px 0px 10px 0px #d1d1d1;
}
.control-item-box {
  margin: 0 0.3rem;
  ul {
    margin-left: -2%;
    margin-right: -2%;
  }
  ul > li {
    padding: 0.3rem 0.3rem;
    box-shadow: 0px 0px 0.2rem 0px rgba(0, 0, 0, 0.1);
    border-radius: 0.2rem;
    margin: 0.2rem 2%;
    display: flex;
    align-items: center;
    .copy-icon {
      margin-right: 0.15rem;
      img {
        height: 0.56rem;
        width: auto;
      }
    }
    .mode-status {
      flex: 1;
      .mode {
        font-size: 0.28rem;
        font-weight: 700;
        color: #3f4663;
      }
      .status {
        font-size: 0.28rem;
        font-weight: 700;
        color: #2da3f6;
      }
    }
    .icon {
      font-size: 0.5rem;
      color: #94a5be;
    }
  }
}
.switch-wrap {
  position: relative;
  .close-btn {
    font-weight: bold;
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
  }
  .title {
    display: flex;
    font-weight: bold;
    font-size: 0.32rem;
    color: #3f4663;
    position: relative;
    margin-bottom: 0.2rem;
  }
  .mode-status {
    width: 0.8rem;
    height: 0.36rem;
    line-height: 0.36rem;
    text-align: center;
    border-radius: 0.18rem;
    font-size: 0.24rem;
    font-weight: 500;
    margin-left: 0.2rem;
  }
  .mode-status {
    background: rgba(253, 115, 87, 0.2);
    color: #fd7357;
  }
  .mode-status.on {
    background: rgba(7, 181, 163, 0.2);
    color: #07b5a3;
  }
  .mode-box {
    padding: 0.2rem 0;
    a {
      display: block;
    }
    li {
      float: left;
      width: 33.33%;
      text-align: center;
      .icon {
        margin-bottom: 0.15rem;
      }
      .icon img {
        width: 1rem;
        height: 1rem;
      }
      .name {
        font-size: 0.28rem;
        font-weight: 500;
        color: #94a5be;
      }
    }
    .active .name {
      color: #3699ff;
    }
  }
}
.associate-box {
  width: 100%;
  height: 100%;
  .title {
    font-size: 0.36rem;
    color: #3f4663;
  }
  .brand-item {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.3rem;
    background: #fff;
    margin-top: 1px;
    border-bottom: 1px solid #e5e5e5;
    .brand-name {
      font-size: 0.28rem;
      font-weight: bold;
      color: #3f4663;
      flex: 1;
      span {
        display: inline-block;
        width: 0.6rem;
        height: 0.32rem;
        border: 1px solid #94a5be;
        border-radius: 0.04rem;
        margin-left: 0.16rem;
        font-size: 0.2rem;
        color: #94a5be;
        text-align: center;
        line-height: 0.32rem;
      }
    }
    .brand-face {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 0.2rem;
      border: 1px solid #e5e5e5;
      overflow: hidden;
      margin-right: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-img {
      width: auto;
      height: 0.76rem;
    }
    .van-icon {
      color: #cccccc;
      font-size: 0.32rem;
    }
  }
}
@keyframes breath {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 0;
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
