<template>
<div class="wrapper">
  <div class="wlan-list">
    <div v-for="item in wlanList" :key="item.id" class="wlan-item" @click="handleConnect">
      <p class="wlan-name">{{ item.name }}</p>
      <i class="wifi-icon"></i>
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
        <span>WOSHIWIFI123</span>
      </div>
      <div class="field mgt55">
        <i class="lock-icon"></i>
        <input :type="isClose ? 'password' : 'text'" class="password" />
        <van-icon :name="isClose ? 'closed-eye' : 'eye-o'" @click="isClose = !isClose"/>
      </div>
      <van-button class="save-btn">保存</van-button>
    </div>
  </van-popup>
</div>
</template>
<script>
export default {
  name: 'wlanList',
  data() {
    return {
      show: false,
      isClose: true,
      wlanList: [
        {
          id: 1,
          name: 'Pulic-WiFi'
        },
        {
          id: 2,
          name: 'KFC-WiFi'
        },
        {
          id: 3,
          name: 'TPlink-WiFi'
        },
        {
          id: 4,
          name: '公共wifi'
        }
      ]
    }
  },
  methods: {
    handleConnect() {
      this.show = true
    }
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
.wifi-icon {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  background-image: url(../../assets/icon-wifi-color.png);
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
