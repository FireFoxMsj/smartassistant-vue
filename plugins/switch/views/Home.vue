<template>
  <div class="home">
    <van-notice-bar
      v-show="!isOnline"
      color="#F6AE1E"
      background="#FDF3DF"
      :scrollable="false"
      text="当前设备已离线，连接局域网后才能控制此设备"/>
    <div class="device">
      <!-- 单开 -->
      <div v-if="false" class="switch-box">
        <div
          class="single-open"
          :class="[single.isOn ? 'switch-on' : 'switch-off']"
          @click="openLight(single)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">开关</p>
          </div>
        </div>
      </div>
      <!-- 双开 -->
      <div v-if="false" class="switch-box">
        <div
          v-for="item in doubleList"
          :key="item.name"
          class="double-open"
          :class="[item.isOn ? 'switch-on' : 'switch-off']"
          @click="openLight(item)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <!-- 三开 -->
      <div class="switch-box">
        <div
          v-for="item in thirdList"
          :key="item.name"
          class="third-open"
          :class="[item.isOn ? 'switch-on' : 'switch-off']"
          @click="openLight(item)">
          <div class="light"></div>
          <div class="btn-box">
            <div class="open-btn"></div>
            <p class="btn-word">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <p class="device-name">开关</p>
    </div>
  </div>
</template>

<script>
import Socket from 'ws-plugin'

export default {
  name: 'home',
  data() {
    return {
      ws: null, // websocket对象
      isOn: false, // 灯是否打开
      isOnline: true, // 设备在线离线状态
      deviceId: '',
      stateId: 1,
      isLock: false, // 是否正在操作，正在操作时，状态推送不改变
      lastTime: null,
      single: {
        isOn: false,
        name: '开关'
      },
      doubleList: [
        {
          isOn: false,
          name: '左键'
        },
        {
          isOn: true,
          name: '右键'
        }
      ],
      thirdList: [
        {
          isOn: false,
          name: '左键'
        },
        {
          isOn: false,
          name: '中键'
        },
        {
          isOn: true,
          name: '右键'
        }
      ]
    }
  },
  methods: {
    // 获取设备初始值
    getDeviceState() {
      // 获取初始值
    },
    openLight(item) {
      const temp = item
      if (item.isOn) {
        // 开灯
      } else {
        // 关灯
      }
      temp.isOn = !temp.isOn
    },
    // 处理ws信息
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      // 初始化设备信息
      console.log(msgJson)
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
    }
  },
  created() {
    // 生成连接
    const self = this
    this.ws = new Socket({
      url: 'ws://192.168.0.84:8088/ws',
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
  background: linear-gradient(#$bgColor;, #E2E6F0);
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
  background: linear-gradient(#E2E6F0, #$bgColor;);
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
</style>
