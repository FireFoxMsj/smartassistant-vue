<template>
  <div class="system-wrapper">
    <div class="img-box">
      <img :src="systemImg" class="system-img"/>
      <p class="tip-wrod">请将手机连接到{{ args.hotspot_name }}后返回智汀家庭云APP</p>
    </div>
    <div class="btn-box-placeholder">
      <div class="btn-box">
        <van-button class="op-btn" @click="toSystem">去设置WLAN</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const systemImg = require('../../../assets/wlan-system.png')

export default {
  name: 'wlan-system',
  data() {
    return {
      timer: null,
      systemImg
    }
  },
  computed: {
    ...mapGetters(['args', 'deviceInfo'])
  },
  methods: {
    toSystem() {
      window.zt.toSystemWlan()
    },
    // 轮询跳转至配网页面
    polling() {
      const { hotspot_name: hotspotName } = this.args
      if (!hotspotName) {
        return
      }
      this.timer = setInterval(() => {
        window.zt.getConnectWifi({}, (res) => {
          if (res.status === 0 && res.wifiName === hotspotName) {
            clearInterval(this.timer)
            this.$router.push({
              name: 'deviceConnect'
            })
          }
        })
      }, 2000)
    }
  },
  created() {
    // 轮询调用
    this.polling()
    // 设置标题
    window.zt.setTitle({
      title: this.deviceInfo.name,
      isShow: true
    })
  }
}
</script>
<style scoped>
.img-box {
  padding: 0.9rem 0.3rem;
  text-align: center;
}
.system-img {
  width: 2.44rem;
  height: 2.87rem;
}
.tip-wrod {
  padding-top: 0.7rem;
  font-size: 0.28rem;
  color: #3f4663;
}
.btn-box-placeholder {
  height: 1.6rem;
}
.btn-box {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0.3rem;
}
.op-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
