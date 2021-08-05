<template>
  <van-popup
    v-model="show"
    round
    position="bottom"
    @open="initData(current)">
    <div class="picker-wrap">
      <van-icon
        name="cross"
        size="0.18rem"
        color="#3F4663"
        class="close-btn"
        @click="show = false"/>
      <h3 class="title">{{ title }}</h3>
      <div class="picker-box">
        <van-picker
          ref="picker"
          visible-item-count="5"
          :columns="columns"
          item-height="1rem"/>
        <div class="time-label">
          <span>时</span>
          <span>分</span>
        </div>
      </div>
      <van-button
        @click="handleConfirm"
        class="sure-btn">确定</van-button>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: 'teimPicker',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: '开启时间',
    },
    // 当前时间
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: this.value,
      columns: []
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
    // 初始化值
    initData(val) {
      setTimeout(() => {
        // 初始化当前值
        this.initCurrent(val)
      })
    },
    // 格式化时间
    formatTime(val) {
      if (!val) {
        return '00:00'
      }
      let hour = Math.floor(val / 60 / 60)
      let minue = Math.floor((val / 60) % 60)
      hour = hour > 9 ? hour : `0${hour}`
      minue = minue > 9 ? minue : `0${minue}`
      return `${hour}:${minue}`
    },
    // 初始化当前选择时间
    initCurrent(val) {
      const { picker } = this.$refs
      const res = this.formatTime(val)
      const list = res.split(':')
      picker.setValues(list)
    },
    // 处理值变化
    handleConfirm() {
      const { picker } = this.$refs
      const res = this.formatToSecond(picker.getValues())
      this.$emit('onSure', res)
    },
    // 时间转为秒
    formatToSecond(arr) {
      let res = 0
      arr.forEach((item, index) => {
        const val = parseInt(item, 10)
        if (index === 0) {
          res += val * 60 * 60
        } else if (index === 1) {
          res += val * 60
        } else {
          res += val
        }
      })
      return res
    },
    initColmns() {
      const arr = []
      this.columns = []
      // 初始化列表值
      for (let i = 0; i <= 59; i += 1) {
        const val = i > 9 ? `${i}` : `0${i}`
        arr.push(val)
      }
      for (let i = 1; i <= 2; i += 1) {
        let val = []
        if (i === 1) {
          val = arr.slice(0, 24)
        } else {
          val = arr
        }
        const obj = {
          values: val
        }
        this.columns.push(obj)
      }
    }
  },
  created() {
    this.initColmns()
  }
}
</script>
<style lang="scss" scoped>
.title {
  padding-bottom: 0.3rem;
  font-weight: bold;
  font-size: 0.32rem;
  color: #3F4663;
}
.picker-wrap {
  position: relative;
  background: #fff;
  padding: 0.3rem;
}
.picker-box {
  position: relative;
}
.picker-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: -0.3rem;
  right: -0.3rem;
  height: 1PX;
  z-index: 9;
  background: #eee;
}
.close-btn {
  position: absolute;
  z-index: 9;
  top: 0.3rem;
  right: 0.3rem;
  font-weight: bold;
}
.time-wrap {
  display: flex;
  padding: 0.08rem 0 0.3rem;
}
.time {
  font-size: 0.36rem;
  font-weight: bold;
  color: #94A5BE;
}
.time-label {
  display: flex;
  align-items: center;
  width: calc(100% - 1.2rem);
  height: 1rem;
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  pointer-events: none;
  span {
    flex: 1;
    text-align: right;
    font-size: 0.28rem;
    font-weight: bold;
    color: #94A5BE;
  }
}
.sure-btn {
  width: 100%;
  height: 1rem;
  background: #F6F8FD;
  border: 0;
  border-radius: 0.2rem;
  margin-top: 0.8rem;
  color: #3F4663;
}
</style>
<style scoped>
.picker-box >>> .van-picker__columns {
  padding: 0 0.4rem;
}
.picker-box >>> .van-ellipsis {
  font-size: 0.36rem;
  font-weight: bold;
  color: #3F4663;
}
.picker-box >>> .van-picker__frame {
  left: 0;
  right: 0;
}
</style>
