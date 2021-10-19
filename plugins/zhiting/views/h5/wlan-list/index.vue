<template>
<div class="wrapper">
  <div class="wlan-list">
    <div
      v-for="(item, index) in wlanList"
      :key="index"
      class="wlan-item"
      @click="handleConnect(item)">
      <p class="wlan-name">{{ item.wifiName }}</p>
      <i class="wifi-icon-color"></i>
    </div>
  </div>
  <!--弹出层-->
  <van-popup
    v-model="show"
    round
    position="bottom">
    <div class="wlan-box">
      <h3 class="title">连接WLAN</h3>
      <van-icon name="cross" class="close-btn" @click="show=false"/>
      <div class="field">
        <i class="wifi-icon"></i>
        <input v-model="wifiName" type="text" class="password" />
      </div>
      <div class="field mgt55">
        <i class="lock-icon"></i>
        <input v-model="wifiPass" :type="isClose ? 'password' : 'text'" class="password" />
        <van-icon :name="isClose ? 'closed-eye' : 'eye-o'" @click="isClose = !isClose"/>
      </div>
      <van-button class="save-btn" @click="handleConfirm">确定</van-button>
    </div>
  </van-popup>
</div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'wlanList',
  data() {
    return {
      show: false,
      isClose: true,
      wifiName: '', // wiFi名称
      wifiPass: '', // wifi密码
      wlanList: []
    }
  },
  methods: {
    ...mapActions(['setWifiInfo']),
    handleConnect(wifi) {
      this.wifiName = wifi.wifiName
      this.show = true
    },
    // 确定按钮
    handleConfirm() {
      const wifiInfo = {
        wifiName: this.wifiName,
        wifiPass: this.wifiPass
      }
      this.setWifiInfo(wifiInfo)
      this.$router.push({
        name: 'deviceConnect'
      })
    }
  },
  created() {
    // 设置标题
    window.zt.setTitle({
      title: '选择WLAN',
      isShow: true
    })
    // 获取wifi列表
    window.zt.getSystemWifiList({}, (res) => {
      if (res.status === 0) {
        this.wlanList = res.list
      }
    })
  }
}
</script>
<style scoped>
.wlan-item {
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border-bottom: 1PX solid #eee;
}
.wlan-name {
  flex: 1;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3f4663;
}
.wifi-icon-color {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  background-image: url(../../../assets/icon-wifi-color.png);
  background-size: 100% 100%;
}
.wlan-box {
  position: relative;
  padding: 0 0.3rem;
}
.close-btn {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3f4663;
}
.title {
  padding-top: 0.35rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
}
.field {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.08rem 0.16rem 0.08rem;
  border-bottom: 1PX solid #ccc;
}
.wifi-icon {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  background-image: url(../../../assets/icon-wifi.png);
  background-size: 100% 100%;
  margin-right: 0.25rem;
}
.lock-icon {
  display: inline-block;
  width: 0.28rem;
  height: 0.28rem;
  background-image: url(../../../assets/icon-lock.png);
  background-size: 100% 100%;
  margin-right: 0.32rem;
}
.password {
  padding-right: 0.2rem;
  width: 5.6rem;
}
.save-btn {
  width: 6.9rem;
  height: 1rem;
  background: #f6f8fd;
  border-radius: 0.2rem;
  border: 0;
  margin: 0.5rem 0;
  color: #3f4663;
}
</style>
