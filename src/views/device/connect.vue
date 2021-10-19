<template>
  <div class="connect">
    <van-nav-bar
      :title="$t('connect.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="progress">
      <van-circle
        v-model="currentRate"
        :rate="rate"
        :speed="100"
        color="#2DA3F6"
        layer-color="#DDE5EB"
        size="4.6rem"
        :stroke-width="40"/>
      <div class="spaner">
        <p class="rate-font">{{ rateFixed }}<span>%</span></p>
      </div>
    </div>
    <p v-if="isConnecting" class="connecting">{{ $t('connect.connect') }}...</p>
    <template v-else>
      <div v-if="isConnectSuccess" class="connect-success">
        <van-icon name="checked" size="0.4rem" color="#0BDB99"/>
        <span>{{ $t('connect.success') }}</span>
      </div>
      <div v-else class="connect-fail">
        <p>{{ $t('connect.fail') }}</p>
        <button @click="reScan">{{ $t('connect.retry') }}</button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'deviceConnect',
  data() {
    return {
      currentRate: 0,
      rate: 0,
      timer: null,
      device: {},
      isConnecting: false, // 是否连接中
      isConnectSuccess: false // 是否连接成功
    }
  },
  computed: {
    ...mapGetters(['websocket']),
    rateFixed() {
      return parseInt(this.currentRate, 10)
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    connectDevice() {
      this.mockProcess()
      const areaId = this.device.area_id
      const device = Object.assign({}, this.device)
      delete device.area_id
      const params = {
        device
      }
      this.isConnecting = true
      this.http.addDevice(params).then((res) => {
        this.isConnecting = false
        clearInterval(this.timer)
        if (res.status === 0) {
          this.rate = 100
          this.isConnectSuccess = true
          // 跳转至设备详情页
          setTimeout(() => {
            this.$router.replace({
              name: 'locationSetting',
              query: {
                from: device.name,
                areaId,
                deviceId: res.data.device_id
              }
            })
          }, 1000)
        } else {
          this.isConnectSuccess = false
        }
      }).catch(() => {
        clearInterval(this.timer)
        this.isConnecting = false
      })
    },
    // 模拟进度条
    mockProcess() {
      this.rate = 0
      this.timer = setInterval(() => {
        if (this.rate >= 94) {
          clearInterval(this.timer)
          return
        }
        this.rate = this.rate + 2
      }, 50)
    },
    // 重新扫描
    reScan() {
      this.onClickLeft()
    },
  },
  created() {
    this.device = this.$route.query
    if (Object.keys(this.device).length) {
      // 连接设备
      this.connectDevice()
    }
  }
}
</script>
<style lang="scss" scoped>
.progress {
  position: relative;
  width: 4.6rem;
  margin: 1.5rem auto 0 auto;
}
.spaner {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -0.02rem;
  left: -0.02rem;
  width: 4.64rem;
  height: 4.64rem;
  background-image: url(../../assets/circle-spiner.png);
  background-size: 100% 100%;
}
.rate-font {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3F4663;
  span {
    font-size: 0.75rem;
  }
}
.connecting {
  padding-top: 0.53rem;
  font-size: 0.28rem;
  color: #94A5BE;
  text-align: center;
}
.connect-fail {
  padding-top: 0.5rem;
  text-align: center;
  p {
    padding-bottom: 0.86rem;
    font-size: 0.28rem;
    color: #FE0000;
  }
  button {
    width: 3rem;
    height: 1rem;
    background: #2DA3F6;
    border-radius: 0.2rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #ffffff;
  }
}
.connect-success {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.46rem;
  span {
    margin-left: 0.21rem;
  }
}
</style>
