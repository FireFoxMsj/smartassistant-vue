<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onRefresh="refresh"/>
    <div class="device">
      <div class="sensor-box humidity">
        <div class="details">
          <p><span class="degree">5</span><span class="unit">℃</span></p>
          <p class="label">寒冷</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OfflineNotice from '../../../components/OfflineNotice.vue'

const menu = require('../../assets/switch/menu.png')

export default {
  name: 'home',
  components: {
    OfflineNotice
  },
  data() {
    return {
      menu,
      switchType: 'switchThird',
      loading: false,
      isOn: false, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      saId: '', // saId
      token: '', // 用户token
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId']),
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
    openLight(item) {
      const temp = item
      this.targetId = temp.instance_id
      if (temp.val === 'off') {
        // 开灯
        this.sendCommand(1, 'power', item.instance_id, 'on')
        this.$toast.loading({
          message: '开灯中...',
          forbidClick: true,
        })
      } else {
        // 关灯
        this.sendCommand(-1, 'power', item.instance_id, 'off')
        this.$toast.loading({
          message: '关灯中...',
          forbidClick: true,
        })
      }
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
}
.sensor-box{
  width: 3rem;
  height: 3rem;
  background: rgba(140, 154, 166, .05);
  border-radius: 50%;
  position: relative;
}
  .details{
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1.7rem;
    height: 1.7rem;
    display: flex;
    position: absolute;
    top: calc(50% - .85rem);
    left: calc(50% - .85rem);
    background: #FDFDFD;
    box-shadow: 0px 0px 50px 0px rgba(255, 105, 49, 0.1);
    border-radius: 50%;
  }
  .degree{
    font-size: .6rem;
    font-weight: 700;
    color: #3F4663;
  }
  .unit{
    font-size: .36rem;
    font-weight: 700;
    color: #3F4663;
  }
  .label{
    font-size: .2rem;
    font-weight: 400;
    color: #3F4663;
    margin-top: .05rem;
  }
</style>
