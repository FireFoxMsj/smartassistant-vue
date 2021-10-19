<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onReflesh="refresh"/>
    <div class="device">
      <div class="battery"><span class="battery-icon"><img src="../../assets/body-sensor/battery.png" alt=""></span><span class="battery-percentage">59%</span></div>
      <div class="sensor-box">
        <div class="ring-1 on"></div>
        <div class="ring-2 on"></div>
        <div class="ring-3 on">
          <div class="details">
            <img :src="goImg" alt="">
          </div>
        </div>
      </div>
      <div class="status-text on">未检测到动作</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OfflineNotice from '../../components/OfflineNotice.vue'

const onImg = require('../../assets/body-sensor/go-off.png')
const offImg = require('../../assets/body-sensor/go-on.png')

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
      saId: '', // saId
      token: '', // 用户token
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
    }
  },
  computed: {
    ...mapGetters(['websocket', 'identity', 'deviceId', 'pluginId']),
    goImg() {
      if (this.isOn) {
        return onImg
      }
      return offImg
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
}
.battery{
  display: flex;
  align-items: center;
  padding: .2rem .2rem;
  img{
    width: .14rem;
    height: auto;
  }
  .battery-percentage{
    font-size: .24rem;
    font-weight: 700;
    color: #F3A934;
    margin-left: .05rem;
  }
}
.sensor-box{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
  position: relative;
}
.ring-1{
  width: 3.6rem;
  height: 3.6rem;
  background: rgba(148, 165, 190, 0.1);
  border-radius: 50%;
  position: absolute;
  top: calc(50% - 1.8rem);
  left: calc(50% - 1.8rem);
  z-index: 1;
}
.ring-1.on{
  background: rgba(54, 153, 255, 0.1);
}
.ring-2{
  width: 2.6rem;
  height: 2.6rem;
  background: rgba(148, 165, 190, 0.1);
  border-radius: 50%;
  position: absolute;
  top: calc(50% - 1.3rem);
  left: calc(50% - 1.3rem);
  z-index: 2;
}
.ring-2.on{
  background: rgba(54, 153, 255, 0.1);
}
.ring-3{
  width: 1.6rem;
  height: 1.6rem;
  background: rgba(148, 165, 190, 0.1);
  border-radius: 50%;
  position: absolute;
  top: calc(50% - .8rem);
  left: calc(50% - .8rem);
  z-index: 3;
}
.ring-3.on{
  background: rgba(54, 153, 255, 0.1);
}
.details{
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  img{
    width: .73rem;
    height: auto;
  }
}
.status-text{
  text-align: center;
  font-size: .32rem;
  font-weight: 700;
  color: #94A5BE;
}
.status-text.on{
  color: #3699FF;
}
</style>
