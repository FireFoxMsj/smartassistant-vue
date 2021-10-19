<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onReflesh="refresh"/>
    <div class="device">
      <template v-if="curtainType===0">
        <div class="curtain" ref="curtain">
          <div class="curtain-top"></div>
          <div class="curtain-wrapper">
            <div class="curtain-panel curtain-panel-left" :style="styleLeft"></div>
            <div class="curtain-content">
              <img src="../../assets/curtain/objects.png" alt="">
            </div>
            <div class="pull-box pull-box-left">
              <van-slider v-model="leftValue" @change="onChangeLeft" @input="inputChangeLeft('curtain')" />
            </div>
            <div class="pull-box pull-box-right">
              <van-slider v-model="rightValue" @change="onChangeRight" @input="inputChangeRight('curtain')"/>
            </div>
            <div class="curtain-panel curtain-panel-right" :style="styleRight"></div>
          </div>
        </div>
      </template>
      <template v-if="curtainType===1">
        <div class="curtain unilateral" ref="curtain">
          <div class="curtain-top"></div>
          <div class="curtain-wrapper">
            <div class="curtain-panel curtain-panel-left" :style="styleLeft"></div>
            <div class="curtain-content">
              <img src="../../assets/curtain/objects.png" alt="">
            </div>
            <div class="pull-box pull-box-left">
              <van-slider v-model="leftValue" @change="onChangeLeft" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="curtainType===-1">
        <div class="curtain unilateral" ref="curtain">
          <div class="curtain-top"></div>
          <div class="curtain-wrapper">
            <div class="curtain-content">
              <img src="../../assets/curtain/objects.png" alt="">
            </div>
            <div class="curtain-panel curtain-panel-right" :style="styleRight"></div>
            <div class="pull-box pull-box-right">
              <van-slider v-model="rightValue" @change="onChangeRight" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="curtainType===2">
        <div class="curtain unilateral vertical" ref="curtain">
          <div class="curtain-top"></div>
          <div class="curtain-wrapper">
            <div class="curtain-panel curtain-panel-top" :style="styleTop"></div>
            <div class="curtain-content">
              <img src="../../assets/curtain/objects.png" alt="">
            </div>
          </div>
          <div class="curtain-bottom"></div>
          <div class="pull-box pull-box-top">
            <van-slider vertical v-model="topValue" @change="onChangeTop" />
          </div>
        </div>
      </template>
      <div class="name">{{ deviceName }}</div>
      <div class="status-progress">打开状态：{{ currentPercent }}%</div>
    </div>
    <div class="control">
      <div class="bottom-slider">
        <van-slider
          v-model="currentPercent"
          bar-height="0.8rem"
          active-color="#2DA3F6">
          <template #button>
            <div class="light-control--btn"></div>
          </template>
        </van-slider>
      </div>
      <div class="top-slider">
        <van-slider
          v-model="endPercent"
          @change="topSliderChange"
          @drag-start="dragStart"
          @drag-end="dragEnd"
          :disabled="!isOnline"
          bar-height="0.8rem">
          <template #button>
            <div class="light-control--btn"></div>
          </template>
        </van-slider>
      </div>
      <div class="between">
        <span class="off">关</span>
        <span class="on">开</span>
      </div>
    </div>
    <div class="control-btn">
      <div class="button-item" >
        <van-button v-if="curtainType===0" class="sides-close-off" :disabled="!isOnline || isStart" @click="closeCurtain(false)"></van-button>
        <van-button v-if="curtainType===1" class="sides-right-close-off" :disabled="!isOnline || isStart" @click="closeCurtain(false)"></van-button>
        <van-button v-if="curtainType===-1" class="sides-left-close-off" :disabled="!isOnline || isStart" @click="closeCurtain(false)"></van-button>
        <van-button v-if="curtainType===2" class="down-off" :disabled="!isOnline || isStart" @click="closeCurtain(false)"></van-button>
        <p>关闭</p>
      </div>
      <div class="button-item" >
        <van-button class="play-off" :disabled="!isOnline" @click="pause(light)"></van-button>
        <p>暂停</p>
      </div>
      <div class="button-item">
        <van-button v-if="curtainType===0" class="sides-open-off" :disabled="!isOnline || isEnd" @click="openCurtain(true)"></van-button>
        <van-button v-if="curtainType===1" class="sides-left-open-off" :disabled="!isOnline || isEnd" @click="openCurtain(true)"></van-button>
        <van-button v-if="curtainType===-1" class="sides-right-open-off" :disabled="!isOnline || isEnd" @click="openCurtain(true)"></van-button>
        <van-button v-if="curtainType===2" class="up-off" :disabled="!isOnline || isEnd" @click="openCurtain(false)"></van-button>
        <p>开启</p>
      </div>
    </div>
    <!-- 底部更新插件菜单 -->
    <BottomMenu ref="menu">
      <template v-slot:trigger>
        <div
          v-for="item in triggerList"
          :key="item.value"
          class="condition-item"
          @click="handleTrigger(item)"
          :class="{'disabled': item.disabled}">
          <div class="item-name">
            {{ item.name }}
          </div>
          <div class="item-desc">
            <p>{{ item.desc }}</p>
          </div>
          <van-icon v-if="item.type==='style' || item.type==='update'" name="arrow" color="#CCCCCC" size=".4rem"/>
          <van-switch
            v-if="item.type==='reversal'"
            v-model="item.is_on"
            size=".36rem"
            inactive-color="#CFD6E0"/>
          <van-image
            class="revise"
            :class="{'active': correct}"
            v-if="item.type==='correct'"
            width=".32rem"
            height=".32rem"
            :src="correction"
          />
        </div>
      </template>
    </BottomMenu>
    <!-- 窗帘控制开关 -->
    <van-popup
      v-model="switchShow"
      round
      position="bottom">
      <div class="switch-wrap">
        <h3 class="title">
          <van-icon
            name="cross"
            color="#3F4663"
            size="0.36rem"
            class="close-btn"
            @click="switchShow = false"/>
        </h3>
        <van-radio-group v-model="active">
          <van-cell-group
            v-for="item in opList"
            :key="item.value"
            clickable
            @click="switchChange(item)">
            <van-cell :title="item.name" clickable @click="active = item.value">
              <template #title>
                <span class="switch-title" :class="{ 'active': active === item.value }">
                  {{ item.name }}
                </span>
              </template>
              <template #right-icon>
                <van-radio :name="item.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BottomMenu from '../../components/BottomMenu.vue'
import OfflineNotice from '../../components/OfflineNotice.vue'

const menu = require('../../assets/curtain/menu.png')
const correction = require('../../assets/curtain/refresh.png')

export default {
  name: 'curtain',
  components: {
    BottomMenu,
    OfflineNotice
  },
  data() {
    return {
      menu,
      correction,
      curtainType: 2, // 0是双开，1是左边单开，-1是右边单开，2是上边单开
      deviceName: '窗帘',
      endPercent: 0, // 当前百分比
      currentPercent: 50, // 结束百分比
      isOnline: true, // 设备在线离线状态
      saId: '', // saId
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
      isFleshing: false,
      light: 50,
      leftValue: 50,
      rightValue: 50,
      topValue: 50,
      bottomValue: 50,
      progressLeft: 0,
      progressRight: 0,
      curtainWidth: 0,
      direction: 0,
      directionType: 'horizontal',
      processLeft: 0,
      processRight: 0,
      processData: 0,
      timeInt: null,
      show: false,
      triggerList: [
        {
          type: 'style',
          disabled: false,
          name: '窗帘样式',
          desc: '双开',
          is_on: false
        },
        {
          type: 'reversal',
          disabled: false,
          name: '窗帘正反转',
          is_on: false
        },
        {
          type: 'correct',
          disabled: false,
          name: '窗帘校准',
          is_on: false
        },
        {
          type: 'update',
          disabled: false,
          name: '固件升级',
          is_on: false
        }
      ],
      switchShow: false,
      active: -1,
      opList: [
        {
          value: 0,
          name: '双开'
        },
        {
          value: 1,
          name: '左开'
        },
        {
          value: -1,
          name: '右开'
        },
        {
          value: 2,
          name: '上下'
        }
      ],
      correct: false
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId']),
    isStart() {
      return this.currentPercent === 0
    },
    isEnd() {
      return this.currentPercent === 100
    },
    width() {
      let btnWidth = 14
      if (this.curtainType === 1 || this.curtainType === -1) {
        btnWidth = 7
      } if (this.curtainType === 0) {
        btnWidth = 14
      } if (this.curtainType === 2) {
        btnWidth = 10
      }
      const moveWidth = 100 - btnWidth
      const width = `${Math.round(this.currentPercent / 100 * moveWidth)}%`
      return width
    },
    styleLeft() {
      return `transform: translateX(-${this.width});`
    },
    styleRight() {
      return `transform: translateX(${this.width});`
    },
    styleTop() {
      return `transform: translateY(-${this.width});`
    }
  },
  watch: {
    currentPercent(newVal) {
      this.processData = newVal
    },
    endPercent(newVal) {
      this.leftValue = 100 - newVal
      this.rightValue = newVal
      this.topValue = 100 - newVal
      this.bottomValue = newVal
      this.processData = newVal
    }
  },
  methods: {
    // 刷新
    refresh() {
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
      this.websocket.send({
        domain: 'curtain',
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
      this.websocket.send({
        domain: 'plugin',
        id: this.perId,
        service: 'get_actions',
        service_data: {
          device_id: this.deviceId
        }
      })
    },
    // 打开窗帘
    openCurtain() {
      this.endPercent = 100
      this.processData = 100
      this.topSliderChange(100)
      // 开窗帘
      this.websocket.send({
        domain: 'curtain',
        id: 1,
        service: 'switch',
        service_data: {
          device_id: this.deviceId,
          power: 'on',
          process: 100
        }
      })
    },
    // 关闭窗帘
    closeCurtain() {
      this.endPercent = 0
      this.processData = 0
      this.topSliderChange(0)
      // 关窗帘
      this.websocket.send({
        domain: 'curtain',
        id: 1,
        service: 'switch',
        service_data: {
          device_id: this.deviceId,
          power: 'off',
          process: 0
        }
      })
    },
    // 暂停窗帘
    pause(value) {
      clearInterval(this.timeInt)
      this.timeInt = null
      this.websocket.send({
        domain: 'curtain',
        id: 1,
        service: 'switch',
        service_data: {
          device_id: this.deviceId,
          power: 'pause',
          process: value
        }
      })
    },
    // 拖动变化
    dragStart() {
      this.isLock = true
    },
    // 拖动结束
    dragEnd() {
      this.isLock = false
    },
    // 处理ws信息
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      // 初始化设备信息
      if (msgJson.id === this.stateId && msgJson.result) {
        const { state } = msgJson.result
        this.currentPercent = state.brightness
        this.isOnline = state.is_online
        this.endPercent = this.currentPercent
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
        // 如果正在操作则忽略同步
        if (this.isLock) {
          return
        }
        if (changeData.device_id === this.deviceId) {
          if (state.brightness !== undefined) {
            this.currentPercent = state.brightness
            this.endPercent = this.currentPercent
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
    },
    // 左窗帘拉动按钮
    onChangeLeft(value) {
      this.rightValue = 100 - value
      this.endPercent = 100 - value
      this.topSliderChange(100 - value)
    },
    // 左窗帘拉动监听
    inputChangeLeft() {
      this.rightValue = 100 - this.leftValue
    },
    // 右窗帘拉动按钮
    onChangeRight(value) {
      this.leftValue = 100 - value
      this.endPercent = value
      this.topSliderChange(value)
    },
    // 右窗帘拉动监听
    inputChangeRight() {
      this.leftValue = 100 - this.rightValue
    },
    // 向上窗帘拉动按钮
    onChangeTop(value) {
      this.topValue = value
      this.endPercent = 100 - value
      this.topSliderChange(100 - value)
    },
    // 窗帘定时移动
    getCurtainStatus() {
      let s = this.currentPercent
      if (!this.direction) {
        s -= 1
        s = s < 0 ? 0 : s
      } else {
        s += 1
        s = s > 100 ? 100 : s
      }
      return s
    },
    // 拉动进度上面的滑块
    topSliderChange(e) {
      const val = e
      const that = this
      this.direction = val > this.currentPercent ? 1 : 0
      clearInterval(that.timeInt)
      that.timeInt = setInterval(() => {
        const s = that.getCurtainStatus()
        that.currentPercent = s
        if ((that.direction && s > val) || (!that.direction && s < val)) {
          clearInterval(that.timeInt)
        }
      }, 100)
    },
    // 窗帘操作控制
    handleTrigger(params) {
      if (params.type === 'style') {
        this.show = false
        this.switchShow = true
      } else if (params.type === 'correct') {
        this.correct = true
        setTimeout(() => {
          this.correct = false
        }, 2000)
      } else if (params.type === 'update') {
        this.$refs.menu.handleUpdate()
      }
    },
    switchChange(params) {
      this.triggerList[0].desc = params.name
    }
  },
  destroyed() {
    this.timeInt = null
  },
  created() {
    // 获取device_id参数
    const { search, href } = window.location
    const params = search ? this.getUrlParams(search) : this.getUrlParams(href)
    this.saId = params.sa_id
    this.token = params.token
    if (params.name) {
      this.deviceName = params.name
    }
    // 初始化参数
    this.endPercent = this.currentPercent
    this.processData = this.currentPercent
    this.curtainType = Number(params.curtainType) || 0
  },
  mounted() {
    this.$nextTick(() => {
      this.curtainWidth = this.$refs.curtain.clientWidth / 2
    })
  }
}
</script>
<style lang="scss" scoped>
.notice-right {
  font-size: 0.24rem;
  span {
    font-size: 0.24rem;
    margin-left: 0.12rem;
  }
}
.curtain{
  width: 5.2rem;
  height: 4rem;
  margin: 0 auto;
  position: relative;
  .curtain-wrapper{
    width: 5rem;
    height: 3.45rem;
    margin: 0 auto;
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }
  .curtain-top{
    width: 100%;
    height: .16rem;
    background-color: #bac3c8;
  }
  .curtain-bottom{
    width: 100%;
    height: .14rem;
    background-color: #E7ECEF;
  }
  .curtain-content {
    position: absolute;
    text-align: center;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 4.77rem;
      height: auto;
    }
  }
  .curtain-panel {
    float: left;
    position: relative;
    width: 50%;
    height: 100%;
    /*-webkit-transition: all 5s ease-out;*/
    /*transition: all 5s ease-out;*/
    z-index: 2;
    overflow: hidden;
    .pull{
      position: absolute;
      top: 50%;
      margin-top: -.33rem;
      width: .66rem;
      height: .66rem;
      background: url("../../assets/curtain/pull.png") no-repeat 0 0;
      background-size: 100% 100%;
    }
    .pull.pull-left{
      right: -.1rem;
    }
    .pull.pull-right{
      left: -.1rem;
    }
    .pull.pull-box-top{
      top: -.1rem;
    }
    .pull.pull-box-bottom{
      bottom: -.1rem;
    }
  }
  .curtain-panel-left {
    -webkit-box-pack: end;
    -webkit-justify-content: center;
    -ms-flex-pack: end;
    justify-content: center;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background: url("../../assets/curtain/curtain-horizontal.png") no-repeat left 0;
    background-size: auto 3.45rem;
    transition: all .2s linear;
  }
  .curtain-panel-right {
    -webkit-box-pack: end;
    -webkit-justify-content: center;
    -ms-flex-pack: end;
    justify-content: center;
    -webkit-transform: translateX(50%);
    transform: translateX(50%);
    background: url("../../assets/curtain/curtain-horizontal.png") no-repeat right 0;
    background-size: auto 3.45rem;
    transition: all .2s linear;
  }
  .curtain-panel-top {
    -webkit-box-pack: end;
    -webkit-justify-content: center;
    -ms-flex-pack: end;
    justify-content: center;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    background: url("../../assets/curtain/curtain-vertical.png") no-repeat center 0;
    background-size: 2.95rem auto;
    transition: all .2s linear;
  }
  .curtain-panel-bottom {
    -webkit-box-pack: end;
    -webkit-justify-content: center;
    -ms-flex-pack: end;
    justify-content: center;
    -webkit-transform: translateY(50%);
    transform: translateY(50%);
    background: url("../../assets/curtain/curtain-vertical.png") no-repeat center 0;
    background-size: 2.95rem auto;
    transition: all .2s linear;
  }
  .active .curtain-panel-left,.active .curtain-panel-right{
    transform: translateX(0%);
  }
}
.curtain.vertical{
  width: 3.4rem;
  height: 4rem;
}
.curtain.unilateral{
  .curtain-panel{
    width: 100%;
  }
  .pull-box{
    width: 100%;
  }
}
.curtain.vertical .curtain-wrapper{
  width: 3.2rem;
}
.curtain.unilateral .curtain-content {
  img{
    width: 100%;
    height: auto;
  }
}

.device {
  padding-top: 0.1rem;
  padding-bottom: 1rem;
  text-align: center;
  .name{
    font-size: .32rem;
    font-weight: bold;
    color: #3F4663;
    margin-bottom: .2rem;
  }
  .status-progress{
    font-size: .28rem;
    color: #2DA3F6;
  }
}
.control {
  position: relative;
  padding: 0 0.6rem;
  .top-slider{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    padding: 0 0.6rem;
  }
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
.between{
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: .2rem 0;
  margin-bottom: 1rem;
  span{
    font-size: .28rem;
    font-weight: bold;
    color: #3F4663;
  }
}
.control-btn{
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-around;
  -ms-flex-pack: justify;
  justify-content: space-around;
  .van-button{
    width: 1.4rem;
    height: 1.4rem;
    background-color: $bgColor;
    border: 0.01rem solid #CFD6E0;
    border-radius: 0.4rem;
  }
  p{
    margin-top: .2rem;
    font-size: .28rem;
    font-weight: bold;
    color: #94A5BE;
    text-align: center;
  }
  .van-button.on ~ p{
    color: #2DA3F6;
  }
  .sides-open-off {
    background: url('../../assets/curtain/sides-open-off.png') no-repeat center center;
    background-size: 0.75rem 0.4rem;
  }
  .sides-open-off:active{
    background: #2DA3F6 url('../../assets/curtain/sides-open-on.png') no-repeat center center;
    background-size: 0.75rem 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-open-on {
    background: #2DA3F6 url('../../assets/curtain/sides-open-on.png') no-repeat center center;
    background-size: 0.75rem 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-close-off {
    background: url('../../assets/curtain/sides-close-off.png') no-repeat center center;
    background-size: 0.75rem 0.4rem;
  }
  .sides-close-off:active{
    background: #2DA3F6 url('../../assets/curtain/sides-close-on.png') no-repeat center center;
    background-size: 0.75rem 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-close-on {
    background: #2DA3F6 url('../../assets/curtain/sides-close-on.png') no-repeat center center;
    background-size: 0.75rem 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .down-off {
    background: url('../../assets/curtain/down-off.png') no-repeat center center;
    background-size: 0.41rem 0.56rem;
  }
  .down-off:active{
    background: #2DA3F6 url('../../assets/curtain/down-on.png') no-repeat center center;
    background-size: 0.41rem 0.56rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .down-on {
    background: #2DA3F6 url('../../assets/curtain/down-on.png') no-repeat center center;
    background-size: 0.41rem 0.56rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .up-off {
    background: url('../../assets/curtain/up-off.png') no-repeat center center;
    background-size: 0.41rem 0.56rem;
  }
  .up-off:active{
    background: #2DA3F6 url('../../assets/curtain/up-on.png') no-repeat center center;
    background-size: 0.41rem 0.56rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .up-on {
    background: #2DA3F6 url('../../assets/curtain/up-on.png') no-repeat center center;
    background-size: 0.41rem 0.56rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-left-close-off {
    background: url('../../assets/curtain/sides-left-close-off.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
  }
  .sides-left-close-off:active {
    background: #2DA3F6 url('../../assets/curtain/sides-left-close-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-left-close-on {
    background: #2DA3F6 url('../../assets/curtain/sides-left-close-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-left-open-off {
    background: url('../../assets/curtain/sides-left-open-off.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
  }
  .sides-left-open-off:active {
    background: #2DA3F6 url('../../assets/curtain/sides-left-open-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-left-open-on {
    background: #2DA3F6 url('../../assets/curtain/sides-left-open-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-right-close-off {
    background: url('../../assets/curtain/sides-right-close-off.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
  }
  .sides-right-close-off:active{
    background: #2DA3F6 url('../../assets/curtain/sides-right-close-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-right-close-on {
    background: #2DA3F6 url('../../assets/curtain/sides-right-close-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-right-open-off {
    background: url('../../assets/curtain/sides-right-open-off.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
  }
  .sides-right-open-off:active {
    background: #2DA3F6 url('../../assets/curtain/sides-right-open-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .sides-right-open-on {
    background: #2DA3F6 url('../../assets/curtain/sides-right-open-on.png') no-repeat center center;
    background-size: 0.56rem 0.41rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .play-off {
    background: url('../../assets/curtain/play-off.png') no-repeat center center;
    background-size: 0.31rem 0.4rem;
  }
  .play-off:active{
    background: #2DA3F6 url('../../assets/curtain/play-on.png') no-repeat center center;
    background-size: 0.31rem 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .play-on {
    background: #2DA3F6 url('../../assets/curtain/play-on.png') no-repeat center center;
    background-size: 0.31rem 0.4rem;
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
}
.bottom-operation{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1rem;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: .4rem .4rem 0px 0px;
  cursor: pointer;
}
.condition-item{
  position: relative;
  display: flex;
  align-items: center;
  padding: .3rem;
  overflow: hidden;
  background-color: #fff;
  border-bottom: 1px solid #EEEEEE;
  cursor: pointer;
  .item-name{
    flex: 1;
  }
  .item-desc{
    font-weight: 500;
    color: #94A5BE;
  }
  .revise{
    width: .4rem;
  }
}
.condition-item-bottom{
  padding: .3rem .3rem;
  text-align: center;
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
    padding: 0.4rem 0.3rem;
    font-weight: bold;
    font-size: 0.32rem;
    color: #3F4663;
    position: relative;
  }
  .switch-title{
    color: #94A5BE;
  }
  .switch-title.active{
    color: #2DA3F6;
  }
}
.revise.active {
  -webkit-animation: rotate 1.2s linear infinite;
  -o-animation: rotate 1.2s linear infinite;
  -moz-animation: rotate 1.2s linear infinite;
  animation: rotate 1.2s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
@media only screen and (min-width: 750px){
  .bottom-operation{
    width: 750px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
<style scoped>
.control >>> .van-slider {
  border-radius: 0.2rem;
}
.control >>> .top-slider .van-slider__bar,.control >>> .top-slider .van-slider{
  background-color: transparent;
}
.control >>> .bottom-slider .van-slider__button-wrapper{
  display: none;
}
.control >>> .van-slider__button-wrapper-right {
  right: -0.24rem;
}
.notice >>> .van-notice-bar__content {
  font-size: 0.24rem;
}
.pull-box{
  z-index: 10;
  width: 50%;
  position: absolute;
  top: 50%;
  padding: 0 .3rem;
}
.unilateral .pull-box{
  width: 100%;
}
.vertical .pull-box{
  height: 100%;
  top: 0;
  padding: .3rem 0;
}
.pull-box-left{
  left: 0;
}
.pull-box-right{
  right: 0;
}
.pull-box .van-slider,.pull-box >>> .van-slider__bar{
  background-color: transparent;
}
.pull-box >>> .van-slider__button{
  width: .66rem;
  height: .66rem;
  background: url("../../assets/curtain/pull.png") no-repeat 0 0;
  background-size: 100% 100%;
  box-shadow: none;
}
.vertical .pull-box >>> .van-slider__button{
  transform: rotate(90deg);
}
.bottom-operation >>> .van-icon__image{
  width: .37rem;
  height: .25rem;
}
</style>
