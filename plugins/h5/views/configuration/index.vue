<template>
  <div class="wrapper">
    <div class="config-box">
      <div v-if="deviceInfo.provisioning" class="iframe-box">
        <iframe :src="deviceInfo.provisioning" class="config-iframe"></iframe>
      </div>
      <div v-else class="default-box">
        <div class="config-img"></div>
        <h3 class="config-title">设备重置</h3>
        <p class="config-content">请查看设备说明书将设备重置，使设备进入等待连接状态。</p>
      </div>
    </div>
    <div class="bottom-wrapper-placeholder">
      <div class="bottom-wrapper">
        <van-checkbox class="agree" v-model="checked">已确认上述操作</van-checkbox>
        <van-button
          class="next-btn"
          :disabled="!checked"
          @click="toNext">下一步</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'configuration',
  data() {
    return {
      checked: false
    }
  },
  computed: {
    ...mapGetters(['deviceInfo'])
  },
  methods: {
    toNext() {
      this.$router.push({
        name: 'wlanConnect'
      })
    }
  },
  mounted() {

  }
}
</script>
<style scoped>
.wrapper {
  padding: 0 0.3rem;
}
.config-box {
  padding-top: 0.7rem;
  text-align: center;
}
.config-iframe {
  width: 100%;
  height: calc(100vh - 0.98rem);
}
.config-img {
  width: 3.6rem;
  height: 3.6rem;
  background-image: url(../../assets/config.png);
  background-size: 100% 100%;
  margin: 0 auto;
}
.config-title {
  padding-top: 0.46rem;
  padding-bottom: 0.32rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
}
.config-content {
  line-height: 1.5;
  font-size: 0.28rem;
  color: #3f4663;
  text-align: left;
}
.bottom-wrapper-placeholder {
  height: 2.1rem;
}
.agree {
  padding-bottom: 0.46rem;
}
.agree >>> .van-checkbox__label {
  color: #94a5be;
}
.bottom-wrapper {
  position: fixed;
  bottom: 0.3rem;
}
.next-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
