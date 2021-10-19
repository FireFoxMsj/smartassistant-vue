<template>
  <div class="wrapper">
    <div class="device-box">
      <van-image
        fit="contain"
        class="device-img"
        :src="ledImg"/>
      <p class="device-name">智能灯</p>
    </div>
    <div class="wlan-box">
      <div class="field">
        <i class="wifi-icon"></i>
        <input v-model="wifiName" type="text" class="password" />
      </div>
      <div class="field mgt55">
        <i class="lock-icon"></i>
        <input v-model="wifiPass" :type="isClose ? 'password' : 'text'" class="password" />
        <van-icon :name="isClose ? 'closed-eye' : 'eye-o'" @click="isClose = !isClose"/>
      </div>
    </div>
    <div class="bottom-box-placeholder">
      <div class="bottom-box">
        <van-button class="next-btn" @click="toNext">下一步</van-button>
        <!-- <p class="other" @click="toOtherWlan">连接其他路由器</p> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

const ledImg = require('../../assets/light/led.png')

export default {
  name: 'wlanConnect',
  data() {
    return {
      ledImg,
      wifiName: '',
      wifiPass: '',
      isClose: true
    }
  },
  methods: {
    ...mapActions(['setWifiInfo']),
    toNext() {
      const wifiInfo = {
        wifiName: this.wifiName,
        wifiPass: this.wifiPass
      }
      this.setWifiInfo(wifiInfo)
      this.$router.push({
        name: 'deviceConnect'
      })
    },
    toOtherWlan() {
      this.$router.push({
        name: 'wlanList'
      })
    }
  },
  created() {
    window.zt.getConnectWifi({}, (res) => {
      if (res.status === 0) {
        this.wifiName = res.wifiName
      }
    })
  }
}
</script>
<style scoped>
.mgt55 {
  margin-top: 0.55rem;
}
.wrapper {
  padding: 0 0.3rem;
}
.device-box {
  padding-top: 0.6rem;
  padding-bottom: 1.1rem;
  text-align: center;
}
.device-img {
  min-width: 0.5rem;
  max-width: 2.1rem;
  height: 2.1rem;
}
.device-name {
  padding-top: 0.3rem;
  font-weight: bold;
  font-size: 0.28rem;
  color: #3f4663;
}
.field {
  display: flex;
  align-items: center;
  padding: 0.16rem 0.08rem;
  border-bottom: 1PX solid #ccc;
}
.wifi-icon {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  background-image: url(../../assets/icon-wifi.png);
  background-size: 100% 100%;
  margin-right: 0.25rem;
}
.lock-icon {
  display: inline-block;
  width: 0.28rem;
  height: 0.28rem;
  background-image: url(../../assets/icon-lock.png);
  background-size: 100% 100%;
  margin-right: 0.32rem;
}
.password {
  padding-right: 0.2rem;
  width: 5.6rem;
}
.bottom-box-placeholder {
  height: 2.6rem;
}
.bottom-box {
  position: fixed;
  bottom: 0;
}
.next-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  margin-bottom: 0.88rem;
  color: #fff;
}
.other {
  padding-bottom: 0.42rem;
  text-align: center;
  font-size: 0.28rem;
  color: #94a5be;
}
</style>
