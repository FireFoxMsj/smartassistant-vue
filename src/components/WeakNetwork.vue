<template>
  <div class="wrap">
    <div class="error-box">
      <van-image class="error-image" :src="wifiImg"/>
      <p class="error-word">{{ $t('global.weak') }}</p>
      <van-button @click="retry" class="retry-btn">{{ $t('global.retry') }}</van-button>
    </div>
  </div>
</template>
<script>
const wifiImg = require('../assets/network-error.png')

export default {
  name: 'weakNetwork',
  data() {
    return {
      wifiImg
    }
  },
  methods: {
    retry() {
      this.$emit('on-retry')
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.9rem;
  height: calc(100vh - 3rem);
  background: rgba(255, 255, 255, 0.8);
  margin: 0 auto;
  border-radius: 0.2rem;
}
.error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-image {
  width: 2rem;
  height: 0.76rem;
}
.error-word {
  padding-top: 0.1rem;
  color: #94A5BE;
}
.retry-btn {
  width: 2rem;
  height: 0.8rem;
  background-color: transparent;
  border: 0.01rem solid #2DA3F6;
  border-radius: 0.08rem;
  color: #2DA3F6;
  margin-top: 1rem;
}
</style>
