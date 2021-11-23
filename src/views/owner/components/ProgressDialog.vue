<template>
  <van-overlay :show="show" @click="closeOverlay">
    <div class="progress-wrapper">
      <div class="block" @click.stop>
        <div class="block-box">
          <h3 class="title">{{ title }}</h3>
          <p class="content" v-html="content"></p>
          <div class="progress">
            <span class="progress-position" :style="{ width: percent }"></span>
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>
<script>
export default {
  name: 'progressDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    rate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: this.value,
      percentage: 0,
      timer: null
    }
  },
  computed: {
    percent() {
      return `${this.percentage}%`
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      if (val) {
        this.mockProgress()
      }
      this.$emit('input', val)
    },
  },
  methods: {
    closeOverlay() {
      this.show = false
    },
    // 模拟进度
    mockProgress() {
      this.percentage = 0
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.percentage += 1
        if (this.percentage >= 95) {
          clearInterval(this.timer)
        }
      }, 500)
    },
    // 完成进度
    done() {
      this.percentage = 100
    }
  }
}
</script>
<style lang="scss" scoped>
.progress-wrapper {
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
.title {
  padding-bottom: 0.22rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3f4663;
}
.content {
  padding-bottom: 0.22rem;
  text-align: left;
  line-height: 1.5;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3f4663;
}
.progress {
  position: relative;
  width: 100%;
  height: 0.16rem;
  background: #eeeeee;
  border-radius: 0.08rem;
  overflow: hidden;
}
.progress-position {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #2da3f6;
  border-radius: 0.08rem;
  transition: width 0.5s linear;
}
</style>
