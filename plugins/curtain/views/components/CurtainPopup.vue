<template>
  <van-popup
    v-model="show"
    round
    position="bottom"
    @open="initData">
    <div class="condition-box">
      <div class="condition-item">

      </div>
    </div>
  </van-popup>
</template>
<script>
const activeIcon = require('@/assets/check-icon.png')
const inactiveIcon = require('@/assets/uncheck-icon.png')

export default {
  name: 'switchPopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    initVal: {
      type: [String, Number],
      default: ''
    },
    needSwitch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIcon,
      inactiveIcon,
      // show: this.value,
      show: true,
      active: this.initVal,
      opList: [
        {
          value: 'on',
          name: '打开'
        },
        {
          value: 'off',
          name: '关闭'
        },
        {
          value: 'percent',
          name: '进程'
        }
      ]
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
    initData() {
      setTimeout(() => {
        if (typeof this.initVal === 'number') {
          this.active = 'percent'
        } else {
          this.active = this.initVal
        }
      })
    },
    switchChange(item) {
      this.active = item.value
      this.$emit('on-change', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  position: relative;
}
.close-btn {
  font-weight: bold;
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
.title {
  padding: 0.35rem 0.3rem;
  font-weight: bold;
  font-size: 0.32rem;
  color: #3F4663;
}
.active {
  color: #2DA3F6;
}
.img-icon {
  height: 0.37rem;
}
</style>
