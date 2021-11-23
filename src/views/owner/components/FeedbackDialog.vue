<template>
  <van-overlay :show="show" @click="show = false">
    <div class="feed-wrapper" @click.stop>
      <div class="block">
        <div v-if="type === 'success'" class="success-box">
          <van-icon name="checked" size="0.8rem" color="#0bdb99"/>
          <h3 class="success-title">{{ title }}</h3>
          <p class="content" v-html="content"></p>
          <van-button class="confirm-btn" @click="handleConfirm">{{ $t('global.confirm') }}</van-button>
        </div>
        <div v-if="type === 'fail'" class="fail-box">
          <van-icon name="warning" size="0.8rem" color="#ff7f7f"/>
          <h3 class="fail-title">{{ title }}</h3>
          <p class="content" v-html="content"></p>
          <van-button class="confirm-btn" @click="handleConfirm">{{ $t('global.confirm') }}</van-button>
        </div>
      </div>
    </div>
  </van-overlay>
</template>
<script>
export default {
  name: 'feedbackDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'success' // success fail
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: this.value
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleConfirm() {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.feed-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  padding: 0.5rem;
  width: 6rem;
  background: #fff;
  border-radius: 0.2rem;
  text-align: center;
}
.success-title {
  padding-top: 0.2rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #0bdb99;
}
.fail-title {
  padding-top: 0.2rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #ff7f7f;
}
.content {
  padding-top: 0.1rem;
  line-height: 0.48rem;
  font-size: 0.28rem;
  color: #3f4663;
}
.confirm-btn {
  width: 2rem;
  height: 0.8rem;
  background: #2da3f6;
  border-radius: 0.1rem;
  margin-top: 0.45rem;
  color: #fff;
}
</style>
