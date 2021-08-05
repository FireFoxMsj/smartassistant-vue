<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onReflesh="reflesh"/>
    <div class="device">
      <div class="device-pic">
        <div
          class="device-img"
          :class="{ 'device-img--on': isOn }"></div>
        <p class="device-name">插座</p>
      </div>
      <div class="device-info">
        <div class="info-item" @click="toStatistics('day')">
          <p class="info-item--info">
            <countTo :startVal="0" :endVal="dayUse" :duration="2000"/>
            <span class="info-unit">度</span>
          </p>
          <p class="info-item--title">今日用电</p>
        </div>
        <div class="info-item" @click="toStatistics('month')">
          <p class="info-item--info">
            <countTo :startVal="0" :endVal="monthUse" :duration="2000"/>
            <span class="info-unit">度</span>
          </p>
          <p class="info-item--title">今月用电</p>
        </div>
        <div class="info-item">
          <p class="info-item--info">
            <countTo :startVal="0" :endVal="currentPower" :duration="2000"/>
            <span class="info-unit">W</span>
          </p>
          <p class="info-item--title">当前功率</p>
        </div>
      </div>
      <div class="device-op">
        <div class="op-item">
          <van-button
            class="statistics-btn"
            :disabled="!isOnline"
            @click="toStatistics('day')"></van-button>
          <p class="op-name">电量统计</p>
        </div>
        <div class="op-item">
          <van-button
            class="open-btn"
            :class="{'open-btn--on': isOn}"
            :disabled="!isOnline"
            @click="openLight"></van-button>
        </div>
        <div class="op-item">
          <van-button
            class="timing-btn"
            :disabled="!isOnline"
            @click="toTiming"></van-button>
          <p class="op-name">定时任务</p>
        </div>
      </div>
    </div>
    <!-- 底部更新插件菜单 -->
    <BottomMenu ref="menu">
      <template v-slot:trigger>
        <div class="condition-item" @click="handleUpdate">
          <div class="item-name">固件升级</div>
          <van-icon name="arrow" color="#CCCCCC" size=".4rem"/>
        </div>
      </template>
    </BottomMenu>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import BottomMenu from '../../components/BottomMenu.vue'
import OfflineNotice from '../../components/OfflineNotice.vue'

export default {
  name: 'home',
  components: {
    BottomMenu,
    OfflineNotice,
    countTo
  },
  data() {
    return {
      ws: null, // websocket对象
      isOn: false, // 开关是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      deviceId: '',
      identity: '', // 设备唯一值
      instanceId: '', // 实例id
      stateId: 1, // 状态消息id
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
      dayUse: 0, // 当日用电，单位度
      monthUse: 0, // 当月用电，单位度
      currentPower: 0, // 当前功率，单位瓦
    }
  },
  methods: {
    // 重新连接
    reflesh() {
      this.isFleshing = true
      this.initData()
    },
    // 固件升级
    handleUpdate() {
      this.$refs.menu.handleUpdate()
    },
    // 去统计页面
    toStatistics(type) {
      this.$router.push({
        name: 'statistics',
        query: {
          type
        }
      })
    },
    // 去定时任务页面
    toTiming() {
      this.$router.push({
        name: 'timing'
      })
    },
    openLight() {
      if (!this.isOn) {
        // 开灯
        this.sendCommand('power', true)
      } else {
        // 关灯
        this.sendCommand('power', false)
      }
      this.isOn = !this.isOn
    },
    // 发送操作指令
    sendCommand(attribute, val) {
      window.socketWs.send({
        id: 1,
        domain: 'zhiting',
        service: 'set_attributes',
        identity: this.identity,
        service_data: {
          instances: [
            {
              type: 'switch',
              instance_id: this.instanceId,
              attributes: [
                {
                  attribute,
                  val,
                  val_type: ''
                }
              ]
            }
          ]
        }
      })
    },
    // 初始状态
    initData() {
      this.getDeviceState()
      // 初始统计数据
      this.initStatistics()
    },
    // 获取设备初始值
    getDeviceState() {
      // 获取初始值
      this.stateId = Number(`1${Date.now()}`)
      window.socketWs.send({
        id: this.stateId,
        domain: 'zhiting',
        service: 'get_attributes',
        identity: this.identity
      })
    },
    // 初始统计数据
    initStatistics() {
      const identity = window.socketIdentity
      const p1 = this.http.getPower(identity)
      const p2 = this.http.getElectricUse(identity)
      Promise.all([p1, p2]).then((res) => {
        const powerResult = res[0]
        const useResult = res[1]
        const dayLen = useResult.daily_electric_use.length - 1
        const monthLen = useResult.monthly_electric_use.length - 1
        this.currentPower = powerResult.electric_use
        this.dayUse = useResult.daily_electric_use[dayLen].electric_use
        this.monthUse = useResult.monthly_electric_use[monthLen].electric_use
      })
    },
    // 处理ws信息
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      // 初始化设备信息
      if (msgJson.id === this.stateId) {
        // 设置刷新
        setTimeout(() => {
          this.isFleshing = false
        }, 1000)
        if (!msgJson.success) {
          this.isOnline = false
          return
        }
        this.isOnline = true
        const { instances } = msgJson.result.device
        const outlet = instances.filter(item => item.type === 'outlet')
        const { attributes } = outlet[0]
        this.instanceId = outlet[0].instance_id
        attributes.forEach((attr) => {
          if (attr.attribute === 'power') {
            this.isOn = attr.val
          }
        })
        // this.isOnline = state.is_online
        // 延迟结束刷新动画
        // this.isReady = true
      }
      // 初始化用户权限
      // if (msgJson.id === this.perId && msgJson.result) {
      //   this.permission = msgJson.result.actions
      // }
      // 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'state_changed') {
        // const { data: changeData } = msgJson
        // const { state } = changeData
        // // 如果正在操作则忽略同步, 开关状态除外
        // if (this.isLock) {
        //   if (changeData.instance_id === this.instanceId) {
        //     if (state.attribute === 'power') {
        //       this.isOn = state.val
        //     }
        //   }
        //   return
        // }
        // if (changeData.instance_id === this.instanceId) {
        //   if (state.attribute === 'power') {
        //     this.isOn = state.val
        //   } else if (state.attribute === 'color_temp') {
        //     this.temperature = state.val
        //   } else if (state.attribute === 'brightness') {
        //     this.light = state.val
        //   }
        // }
      }
    }
  },
  mounted() {
    this.identity = window.socketIdentity
    this.initData()
    // window.socketWs.onopen(() => {
    //   this.initData()
    // })
    window.socketWs.onmessage((data) => {
      this.handleMessage(data)
    })
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
}
.device-img {
  display: inline-block;
  width: 2.8rem;
  height: 2.8rem;
  background-size: 100% 100%;
  background-image: url(../assets/socket-off.png);
  margin-bottom: 0.4rem;
}
.device-img--on {
  background-image: url(../assets/socket-on.png);
}
.device-name {
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
}
.device-info {
  padding-top: 1rem;
  padding-bottom: 2.2rem;
  display: flex;
  .info-item {
    flex: 1;
  }
  .info-item--info {
    font-size: 0.52rem;
    font-weight: bold;
    color: #2da3f6;
    span {
      display: inline-block;
      font-weight: bold;
    }
    .info-unit {
      font-size: 0.28rem;
    }
  }
  .info-item--title {
    padding-top: 0.22rem;
    font-size: 0.24rem;
    font-weight: bold;
    color: #3f4663;
  }
}
.device-op {
  padding: 0 0.7rem;
  display: flex;
  justify-content: space-between;
  .statistics-btn {
    width: 1rem;
    height: 1rem;
    background-size: 100% 100%;
    background-image: url('../assets/statistics.png');
    border: 0;
  }
  .open-btn {
    width: 1.4rem;
    height: 1.4rem;
    background-size: 0.62rem 0.68rem;
    background-repeat: no-repeat;
    background-position: center center;
    border: 0.01rem solid #cfd6e0;
    border-radius: 0.4rem;
    background-color: $bgColor;
    background-image: url('../assets/open-off.png');
  }
  .op-name {
    padding-top: 0.2rem;
    font-size: 0.24rem;
    color: #94a5be;
  }
  .open-btn--on {
    background-color: #2da3f6;
    background-image: url('../assets/open-on.png');
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
  .timing-btn {
    width: 1rem;
    height: 1rem;
    background-size: 100% 100%;
    background-image: url('../assets/timing.png');
    border: 0;
  }
}
.condition-item{
  position: relative;
  display: flex;
  align-items: center;
  padding: .3rem .3rem;
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
</style>
