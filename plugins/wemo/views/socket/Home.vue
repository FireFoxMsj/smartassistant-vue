<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onRefresh="refresh"/>
    <div class="device">
      <div class="device-pic">
        <div
          class="device-img device-img--real"></div>
        <p class="device-name">插座</p>
      </div>
    </div>
    <div class="device-op">
        <div class="op-item">
          <van-button
            class="open-btn"
            :class="{'open-btn--on': isOn}"
            :disabled="!isOnline"
            @click="switchSocket"></van-button>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OfflineNotice from '../../../components/OfflineNotice.vue'

export default {
  name: 'home',
  components: {
    OfflineNotice
  },
  data() {
    return {
      isOn: false, // 开关是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      instanceId: '', // 实例id
      stateId: 1, // 状态消息id
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
      dayUse: 0, // 当日用电，单位度
      monthUse: 0, // 当月用电，单位度
      currentPower: 0, // 当前功率，单位瓦
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId'])
  },
  methods: {
    // 重新连接
    refresh() {
      this.isFleshing = true
      this.initData()
    },
    switchSocket() {
      if (!this.isOn) {
        // 开灯
        this.sendCommand('power', 'on')
      } else {
        // 关灯
        this.sendCommand('power', 'off')
      }
      this.isOn = !this.isOn
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
        domain: this.pluginId,
        service: 'get_attributes',
        identity: this.identity
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
            this.isOn = attr.val === 'on'
          }
        })
      }
      // 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'state_changed') {
        const { data: changeData } = msgJson
        const { attr } = changeData
        if (changeData.identity === this.identity) {
          if (attr.attribute === 'power') {
            this.isOn = attr.val === 'on'
          }
        }
      }
    }
  },
  mounted() {
    this.initData()
    this.websocket.onmessage((data) => {
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
  background-image: url(../../assets/socket/socket-off.png);
  margin-bottom: 0.4rem;
}
.device-img--on {
  background-image: url(../../assets/socket/socket-on.png);
}
.device-img--real {
  background-image: url(../../assets/socket/socket-real.png);
}
.device-name {
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
}
.device-op {
  padding: 0 0.7rem;
  display: flex;
  justify-content: center;
  .open-btn {
    width: 1.4rem;
    height: 1.4rem;
    background-size: 0.62rem 0.68rem;
    background-repeat: no-repeat;
    background-position: center center;
    border: 0.01rem solid #cfd6e0;
    border-radius: 0.4rem;
    background-color: $bgColor;
    background-image: url('../../assets/socket/open-off.png');
  }
  .op-name {
    padding-top: 0.2rem;
    font-size: 0.24rem;
    color: #94a5be;
  }
  .open-btn--on {
    background-color: #2da3f6;
    background-image: url('../../assets/socket/open-on.png');
    box-shadow: 0 0 0.2rem 0 rgba(45, 163, 246, 0.5);
  }
}
</style>
