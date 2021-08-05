<template>
  <div class="home">
    <OfflineNotice
      :show="!isOnline"
      :loading="isFleshing"
      @onReflesh="reflesh"/>
    <div class="device">
      <div class="empty-box" v-if="loading">
        <van-loading v-if="loading" size=".4rem" color="#0094ff" vertical>加载中...</van-loading>
      </div>
      <!-- 单开 -->
      <div v-if="switchList.length === 1" class="switch-box">
        <div
          v-for="(item,index) in switchList"
          :key="index"
          class="single-open"
          :class="[item.attributes[0].val ? 'switch-on' : 'switch-off']"
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
          :class="[item.attributes[0].val ? 'switch-on' : 'switch-off']"
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
          :class="[item.attributes[0].val ? 'switch-on' : 'switch-off']"
          @click="openLight(item)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">{{ index===0?'左键':index===1?'中键':'右键' }}</p>
          </div>
        </div>
      </div>
      <p class="device-name">开关</p>
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
import Socket from 'ws-plugin'
// import { getRemote } from '../../../config/index'
import BottomMenu from '../../components/BottomMenu.vue'
import OfflineNotice from '../../components/OfflineNotice.vue'

const menu = require('../assets/menu.png')

export default {
  name: 'home',
  components: {
    BottomMenu,
    OfflineNotice
  },
  data() {
    return {
      menu,
      switchType: 'switchThird',
      loading: false,
      ws: null, // websocket对象
      isOn: false, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      isFleshing: false, // 是否在刷新
      deviceId: '',
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
      identity: ''
    }
  },
  methods: {
    // 刷新
    reflesh() {
      this.isFleshing = true
      this.getDeviceState()
    },
    // 获取设备初始值
    getDeviceState() {
      this.loading = true
      this.stateId = Number(`1${Date.now()}`)
      // 获取初始值
      this.ws.send({
        domain: 'zhiting',
        id: this.stateId,
        service: 'get_attributes',
        identity: this.identity,
        service_data: {
          device_id: this.deviceId
        }
      })
    },
    openLight(item) {
      const temp = item
      this.targetId = temp.instance_id
      temp.attributes[0].val = !temp.attributes[0].val
      if (temp.attributes[0].val) {
        // 开灯
        this.ws.send(
          {
            domain: 'zhiting',
            id: 1,
            service: 'set_attributes',
            identity: this.identity,
            service_data: {
              instances: [temp]
            }
          }
        )
        this.$toast.loading({
          message: '开灯中...',
          forbidClick: true,
        })
        console.log('开灯')
      } else {
        // 关灯
        this.ws.send(
          {
            domain: 'zhiting',
            id: -1,
            service: 'set_attributes',
            identity: this.identity,
            service_data: {
              instances: [temp]
            }
          }
        )
        this.$toast.loading({
          message: '关灯中...',
          forbidClick: true,
        })
        console.log('关灯')
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
          return
        }
        this.loading = false
        let obj = {}
        const arr = []
        const list = msgJson.result.instances || []
        list.forEach((item) => {
          const itemType = item
          itemType.attributes.filter(x => x.attribute === 'power')
          if (itemType.type === 'switch') {
            arr.push(itemType)
          } else {
            obj = itemType
          }
        })
        this.switchInfo = obj
        this.switchList = arr
      } else if (msgJson.id === 1) {
        if (msgJson.success) {
          this.$toast.success('开关已开启')
        } else {
          this.switchList.forEach((item) => {
            if (item.instance_id === this.targetId) {
              item.attributes[0].val = !item.attributes[0].val
            }
          })
          this.$toast.fail('开启失败')
        }
      } else if (msgJson.id === -1) {
        if (msgJson.success) {
          this.$toast.success('开关已关闭')
        } else {
          this.switchList.forEach((item) => {
            if (item.instance_id === this.targetId) {
              item.attributes[0].val = !item.attributes[0].val
            }
          })
          this.$toast.fail('关闭失败')
        }
      } else if (msgJson.id === 2) {
        this.$bus.$emit('handleMessage', msgJson)
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
    // 固件升级
    handleUpdate() {
      this.$refs.menu.handleUpdate()
    },
    // 执行升级
    update() {
      this.ws.send({
        domain: 'zhiting',
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
    // 生成连接
    const self = this
    this.ws = new Socket({
      url: 'ws://192.168.0.188:8088/ws',
      onOpen() {
        self.getDeviceState()
      },
      onMessage(data) {
        self.handleMessage(data)
      }
    })
    // 获取device_id参数
    const { search, href } = window.location
    const params = search ? this.getUrlParams(search) : this.getUrlParams(href)
    this.deviceId = params.device_id
    // 接收bus事件
    this.$bus.$on('update', this.update)
    const { query } = this.$route
    if (query.identity) {
      this.identity = Number(query.identity)
    }
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
    background-image: url('../assets/open-on.png');
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
    background-image: url('../assets/open-off.png');
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
</style>
