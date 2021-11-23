<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onRefresh="refresh"/>
    <div class="device">
      <div class="temp-drag"><span class="degree">22</span><span class="unit">℃</span></div>
      <p>制冷 风速自动 扫风开</p>
      <van-button
        :class="[isOn ? 'open-btn--on' : 'open-btn--off']"
        :disabled="!isOnline"
        @click="openLight(!isOn)"
      ></van-button>
    </div>
    <div class="control">
      <p>温度调节 22℃</p>
      <van-slider
        v-model="temperature"
        :min="tempMin"
        :max="tempMax"
        @input="inputChange('temperature')"
        @drag-start="dragStart"
        @drag-end="dragEnd"
        :disabled="!isOnline"
        bar-height="0.8rem"
        active-color="#2DA3F6"
      >
        <template #button>
          <div class="pf-control--btn"></div>
        </template>
      </van-slider>
    </div>
    <div class="control-item-box">
      <ul class="clearfix">
        <li v-for="(item,index) in modeList" :key="index">
          <div class="mode-status">
            <p class="mode one-line">{{item.mode}}</p>
            <span class="status">{{item.statusName}}</span>
          </div>
          <div class="icon"><img :src="item.icon" alt=""></div>
        </li>
      </ul>
    </div>
    <!-- 空调模式控制 -->
    <van-popup
      v-model="airModeShow"
      round
      closeable
      position="bottom">
      <div class="switch-wrap">
        <h3 class="title">空调模式</h3>
        <div class="mode-box">
          <ul class="clearfix">
            <li v-for="(mode,index) in airMode" :key="index">
              <a href="javascript:;" :class="{'active': airActive === index}" @click="changeMode(mode,index, 'air')">
                <div class="icon"><img :src="airActive === index?mode.onIcon:mode.offIcon" alt=""></div>
                <div class="name">{{mode.name}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <!-- 风速模式控制 -->
    <van-popup
      v-model="windSpeedShow"
      round
      closeable
      position="bottom">
      <div class="switch-wrap">
        <h3 class="title">风速</h3>
        <div class="mode-box">
          <ul class="clearfix">
            <li>
              <a href="javascript:;" :class="{'active': modeInfo.active}" @click="modeInfo.active = !modeInfo.active">
                <div class="icon"><img :src="modeInfo.active?modeInfo.onIcon:modeInfo.offIcon" alt=""></div>
                <div class="name">{{modeInfo.name}}</div>
              </a>
            </li>
            <li v-for="(mode,index) in modeInfo.windSpeedMode" :key="index">
              <a href="javascript:;" :class="{'active': windSpeedActive === index}" @click="changeMode(mode,index,'windSpeed')">
                <div class="icon"><img :src="windSpeedActive === index?mode.onIcon:mode.offIcon" alt=""></div>
                <div class="name">{{mode.name}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <!-- 守护模式控制 -->
    <van-popup
      v-model="guardModeShow"
      round
      position="bottom">
      <div class="switch-wrap">
        <h3 class="title"><span>守护模式</span> <van-switch size=".4rem" v-model="guardModeInfo.active" /></h3>
        <div class="mode-box">
          <ul class="clearfix">
            <li v-for="(mode,index) in guardModeInfo.guardMode" :key="index">
              <a href="javascript:;" :class="{'active': guardActive === index}" @click="changeMode(mode,index,'guard')">
                <div class="icon"><img :src="guardActive === index?mode.onIcon:mode.offIcon" alt=""></div>
                <div class="name">{{mode.name}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OfflineNotice from '../../../components/OfflineNotice.vue'

const frostOn = require('../../assets/air/frost-on.png')
const frostOff = require('../../assets/air/frost-off.png')
const fanOn = require('../../assets/air/fan-on.png')
const fanOff = require('../../assets/air/fan-off.png')
const switchOn = require('../../assets/air/on.png')
const switchOff = require('../../assets/air/off.png')
const hotOn = require('../../assets/air/hot-on.png')
const hotOff = require('../../assets/air/hot-off.png')
const lowSpeedOn = require('../../assets/air/low-speed-on.png')
const mediumSpeedOn = require('../../assets/air/medium-speed-on.png')
const highSpeedOn = require('../../assets/air/high-speed-on.png')
const copyIcon = require('../../assets/air/copy.png')
const frostBigOn = require('../../assets/air/frost-big-on.png')
const frostBigOff = require('../../assets/air/frost-big-off.png')
const hotBigOn = require('../../assets/air/hot-big-on.png')
const hotBigOff = require('../../assets/air/hot-big-off.png')
const lowSpeedBigOn = require('../../assets/air/low-speed-big-on.png')
const lowSpeedBigOff = require('../../assets/air/low-speed-big-off.png')
const mediumSpeedBigOn = require('../../assets/air/medium-speed-big-on.png')
const mediumSpeedBigOff = require('../../assets/air/medium-speed-big-off.png')
const highSpeedBigOn = require('../../assets/air/low-speed-big-on.png')
const highSpeedBigOff = require('../../assets/air/low-speed-big-off.png')
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
      loading: false,
      isOn: false, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      tempMin: 0, // 温度最小值
      tempMax: 100, // 温度最大值
      temperature: 22, // 温度
      saId: '', // saId
      token: '', // 用户token
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
      modeList: [
        { mode: '空调模式', statusName: '制冷', icon: frostOn },
        { mode: '空调模式', statusName: '制热', icon: hotOn },
        { mode: '风速', statusName: '自动', icon: fanOn },
        { mode: '扫风', statusName: '已打开', icon: switchOn },
        { mode: '扫风', statusName: '已打开', icon: switchOff },
        { mode: '风速', statusName: '低', icon: lowSpeedOn },
        { mode: '风速', statusName: '中', icon: mediumSpeedOn },
        { mode: '风速', statusName: '高', icon: highSpeedOn },
        { mode: '守护模式', statusName: '关闭', icon: switchOff },
        { mode: '子设备', statusName: '', icon: copyIcon }
      ],
      airModeShow: false,
      airActive: 0,
      airMode: [
        {
          name: '制冷',
          onIcon: frostBigOn,
          offIcon: frostBigOff
        },
        {
          name: '制热',
          onIcon: hotBigOn,
          offIcon: hotBigOff
        }
      ],
      windSpeedShow: false,
      windSpeedActive: 0,
      modeInfo: {
        name: '自动',
        onIcon: frostBigOn,
        offIcon: frostBigOff,
        active: true,
        windSpeedMode: [
          {
            name: '低',
            onIcon: lowSpeedBigOn,
            offIcon: lowSpeedBigOff
          },
          {
            name: '中',
            onIcon: mediumSpeedBigOn,
            offIcon: mediumSpeedBigOff
          },
          {
            name: '高',
            onIcon: highSpeedBigOn,
            offIcon: highSpeedBigOff
          }
        ],
      },
      guardModeShow: true,
      guardActive: 0,
      guardModeInfo: {
        name: '自动',
        onIcon: frostBigOn,
        offIcon: frostBigOff,
        active: true,
        guardMode: [
          {
            name: '在家',
            onIcon: homeBigOn,
            offIcon: homeBigOff
          },
          {
            name: '离家',
            onIcon: lockHomeBigOn,
            offIcon: lockHomeBigOff
          },
          {
            name: '睡眠',
            onIcon: sleepBigOn,
            offIcon: sleepBigOff
          }
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId']),
    goImg() {
      if (this.isOn) {
        return frostOn
      }
      return frostOn
    },
  },
  methods: {
    // 刷新
    refresh() {
      this.isFleshing = true
      this.getDeviceState()
    },
    // 获取设备初始值
    getDeviceState() {
      this.loading = true
      this.stateId = Number(`1${Date.now()}`)
      // 获取初始值
      this.websocket.send({
        domain: this.pluginId,
        id: this.stateId,
        service: 'get_attributes',
        identity: this.identity,
        service_data: {
          device_id: this.deviceId
        }
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
    inputChange() {
      if (!this.isReady) {
        return
      }
      const now = Date.now()
      const wait = 500
      if (now - this.lastTime - wait > 0) {
        this.temperatureChange(this.temperature)
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
    // 温度变化
    temperatureChange(val) {
      // 灯关闭不发送指令
      if (!this.isOn) {
        return
      }
      // 调节温度
      this.sendCommand('color_temp', val)
    },
    // 处理ws信息
    handleMessage(data) {
      this.$toast.clear()
      const msgJson = JSON.parse(data)
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
        this.loading = false
        let obj = {}
        const arr = []
        const list = msgJson.result.device.instances || []
        list.forEach((item) => {
          const power = item.attributes.find(x => x.attribute === 'power')
          if (item.type === 'switch') {
            power.instance_id = item.instance_id
            arr.push(power)
          } else if (item.type === 'info') {
            obj = item
          }
        })
        this.switchInfo = obj
        this.switchList = arr
      } else if (msgJson.id === 1) {
        if (msgJson.success) {
          this.$toast.success('开关已开启')
        } else {
          this.$toast.fail('开启失败')
        }
        this.switchList.forEach((item) => {
          if (item.instance_id === this.targetId) {
            item.val = item.val === 'on' ? 'off' : 'on'
          }
        })
      } else if (msgJson.id === -1) {
        if (msgJson.success) {
          this.$toast.success('开关已关闭')
        } else {
          this.$toast.fail('关闭失败')
        }
        this.switchList.forEach((item) => {
          if (item.instance_id === this.targetId) {
            item.val = item.val === 'on' ? 'off' : 'on'
          }
        })
      } else if (msgJson.id === 2) {
        this.$bus.$emit('handleMessage', msgJson)
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
.device {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  text-align: center;
  .temp-drag{
    .degree{
      font-size: 1.6rem;
      font-weight: 700;
      color: #3F4663;
    }
    .unit{
      font-size: .8rem;
      font-weight: 700;
      color: #3F4663;
    }
  }
  p{
    font-size: .28rem;
    font-weight: 400;
    color: #94A5BE;
    padding-bottom: 0.7rem;
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
}
.control {
  padding: .4rem .3rem;
  margin: 0 .3rem .5rem .3rem;
  background: #FFFFFF;
  box-shadow: 0px 0px .2rem 0px rgba(0, 0, 0, 0.1);
  border-radius: .2rem;
  p {
    font-size: 0.28rem;
    color: #3F4663;
    font-weight: 700;
    padding-bottom: 0.37rem;
  }
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
  margin: 0 .3rem;
  ul{
    margin-left: -2%;
    margin-right: -2%;
  }
  ul>li{
    float: left;
    width: 46%;
    height: 1.4rem;
    padding: .3rem .3rem;
    box-shadow: 0px 0px .2rem 0px rgba(0, 0, 0, 0.1);
    border-radius: .2rem;
    margin: .2rem 2%;
    display: flex;
    align-items: center;
    .mode-status{
      flex: 1;
      .mode{
        font-size: .28rem;
        font-weight: 700;
        color: #3F4663;
        margin-bottom: .1rem;
      }
      .status{
        font-size: .28rem;
        font-weight: 700;
        color: #2DA3F6;
      }
    }
    .icon{
      font-size: .5rem;
      color: #2DA3F6;
      img{
        height: .56rem;
        width: auto;
      }
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
    justify-content: space-between;
    padding: 0.4rem 0.3rem;
    font-weight: bold;
    font-size: 0.32rem;
    color: #3F4663;
    position: relative;
  }
  .mode-box{
    padding: .2rem 0;
    a{ display: block}
    li{
      float: left;
      width: 25%;
      text-align: center;
      .icon{
        margin-bottom: .15rem;
      }
      .icon img{
        width: 1rem;
        height: 1rem;
      }
      .name{
        font-size: .28rem;
        font-weight: 500;
        color: #94A5BE;
      }
    }
    .active .name{
      color: #3699FF;
    }
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
