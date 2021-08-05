<template>
  <van-notice-bar
    v-show="show"
    class="notice"
    color="#F6AE1E"
    background="#FDF3DF"
    :scrollable="false"
    text="当前设备已离线，连接局域网后才能控制此设备">
    <template #right-icon>
      <div @click="reflesh" class="notice-right">
        <van-icon name="replay" :class="{ 'a-rotate': loading }"/>
        <span>刷新</span>
      </div>
    </template>
  </van-notice-bar>
</template>
<script>
export default {
  name: 'offlineNotice',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    reflesh() {
      this.$emit('onReflesh')
    }
  }
}
</script>
<style scoped>
.notice-right {
  font-size: 0.24rem;
}
.notice-right span {
  font-size: 0.24rem;
  margin-left: 0.12rem;
}
.a-rotate {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
.notice >>> .van-notice-bar__content {
  font-size: 0.24rem;
}
</style>
