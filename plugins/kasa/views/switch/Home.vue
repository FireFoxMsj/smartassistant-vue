<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onRefresh="refresh"/>
    <div class="device">
      <!-- 无数据 -->
      <div v-if="switchList.length === 0" class="switch-box">
        <div class="single-open switch-off">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">开关</p>
          </div>
        </div>
      </div>
      <!-- 单开 -->
      <div v-if="switchList.length === 1" class="switch-box">
        <div
          v-for="(item, index) in switchList"
          :key="index"
          class="single-open"
          :class="[item.val === 'on' ? 'switch-on' : 'switch-off']"
          @click="openLight(item)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">开关</p>
          </div>
        </div>
      </div>
      <!-- 双开 -->
      <div v-if="switchList.length === 2" class="switch-box">
        <div
          v-for="(item,index) in switchList"
          :key="index"
          class="double-open"
          :class="[item.val === 'on' ? 'switch-on' : 'switch-off']"
          @click="openLight(item)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">{{ index===0?'左键':index===1?'右键':'' }}</p>
          </div>
        </div>
      </div>
      <!-- 三开 -->
      <div v-if="switchList.length === 3" class="switch-box">
        <div
          v-for="(item,index) in switchList"
          :key="index"
          class="third-open"
          :class="[item.val === 'on' ? 'switch-on' : 'switch-off']"
          @click="openLight(item)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">{{ index===0?'左键':index===1?'中键':'右键' }}</p>
          </div>
        </div>
      </div>
      <p class="device-name">{{deviceName}}</p>
    </div>
    <!-- 底部更新插件菜单 -->
    <BottomMenu ref="menu" :plugin-info="switchInfo">
      <template v-slot:trigger>
        <div class="condition-item" @click="handleUpdate()">
          <div class="item-name">固件升级</div>
          <van-icon name="arrow" color="#CCCCCC" size=".4rem"/>
        </div>
      </template>
    </BottomMenu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BottomMenu from '../../components/BottomMenu.vue'
import OfflineNotice from '../../../components/OfflineNotice.vue'

const menu = require('../../assets/switch/menu.png')

export default {
  name: 'home',
  components: {
    BottomMenu,
    OfflineNotice
  },
  data() {
    return {
      menu,
      isOn: false, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      saId: '', // saId
      token: '', // 用户token
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
      switchList: [],
      targetId: null,
      switchInfo: {
        type: 'info',
        instance_id: 2,
        attributes: [
          {
            attribute: 'version',
            val: '1.0.2',
            val_type: 'string'
          }
        ]
      },
      deviceName: ''
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
      } else {
        // 关灯
        this.sendCommand(-1, 'power', item.instance_id, 'off')
      }
    },
    // 处理ws信息
    handleMessage(data) {
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
        if (!msgJson.success) {
          this.$toast.fail('开启失败')
          return
        }
        this.switchList.forEach((item) => {
          if (item.instance_id === this.targetId) {
            item.val = item.val === 'on' ? 'off' : 'on'
          }
        })
      } else if (msgJson.id === -1) {
        if (!msgJson.success) {
          this.$toast.fail('关闭失败')
          return
        }
        this.switchList.forEach((item) => {
          if (item.instance_id === this.targetId) {
            item.val = item.val === 'on' ? 'off' : 'on'
          }
        })
      } else if (msgJson.id === 2) {
        this.$bus.$emit('handleMessage', msgJson)
      }// 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'attribute_change') {
        const { data: changeData } = msgJson
        const { attr } = changeData
        if (changeData.identity === this.identity) {
          this.switchList.forEach((item) => {
            if (item.instance_id === changeData.instance_id) {
              if (attr.attribute === 'power') {
                item.val = attr.val
              }
            }
          })
        }
      }
    },
    // 固件升级
    handleUpdate() {
      this.$refs.menu.handleUpdate()
    },
    // 执行升级
    update() {
      this.websocket.send({
        domain: this.pluginId,
        id: 2,
        service: 'set_attributes',
        identity: this.identity,
        service_data: {
          instances: {
            type: 'info',
            instance_id: 2,
            attributes: [
              {
                attribute: 'version',
                val: '1.0.2',
                val_type: 'string'
              }
            ]
          }
        }
      })
    },
  },
  created() {
    const { query } = this.$route
    if (query.name) {
      this.deviceName = query.name
    }
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
}
.device-name {
  padding-top: 0.52rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
}
.switch-box {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 0.12rem;
  width: 6.7rem;
  height: 6.7rem;
  background: #fff;
  border: 0.1rem solid #CFD6E0;
  border-radius: 0.4rem;
  margin: 0 auto;
}
.single-open {
  width: 100%;
  height: 5.96rem;
}
.double-open {
  width: 3.05rem;
  height: 5.96rem;
}
.third-open {
  width: 2rem;
  height: 5.96rem;
}
.switch-on {
  position: relative;
  background: linear-gradient(#F1F4FC, #E2E6F0);
  margin-top: 0.3rem;
  box-shadow: 0 -0.3rem 0 0 #CFD6E0;
  border-radius: 0.2rem;
  .light {
    position: absolute;
    top: 0.37rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0.6rem;
    height: 0.08rem;
    background: #42CF38;
    border-radius: 0.04rem;
    box-shadow: 0 0 0.1rem 0 #42cf38;
  }
  .btn-box {
    position: absolute;
    left: 50%;
    bottom: 0.6rem;
    transform: translateX(-50%);
  }
  .open-btn {
    width: 0.79rem;
    height: 0.84rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../assets/switch/open-on.png');
  }
}
.switch-off {
  position: relative;
  background: linear-gradient(#E2E6F0, #F1F4FC);
  box-shadow: 0 0.3rem 0 0 #CFD6E0;
  border-radius: 0.2rem;
  .light {
    position: absolute;
    top: 0.68rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0.6rem;
    height: 0.08rem;
    background: #CFD6E0;
    border-radius: 0.04rem;
  }
  .btn-box {
    position: absolute;
    left: 50%;
    bottom: 0.3rem;
    transform: translateX(-50%);
  }
  .open-btn {
    width: 0.79rem;
    height: 0.84rem;
    background-size: 0.6rem 0.65rem;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('../../assets/switch/open-off.png');
  }
}
.btn-word {
  padding-top: 0.47rem;
  font-size: 0.28rem;
  color: #94A5BE;
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
.default-box{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 2.8rem;
    height: 2.8rem;
  }
}
</style>
