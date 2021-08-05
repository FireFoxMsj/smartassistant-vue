<template>
  <div class="wrapper">
    <van-nav-bar
      title="添加定时任务"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
    </van-nav-bar>
    <div class="task-box">
      <div
        v-for="item in opList"
        :key="item.value"
        class="op-item"
        @click="handleOp(item)">
        <span class="title">{{ item.name }}</span>
        <div class="right-part">
          <span class="tip-word">{{ item.chose.name }}</span>
          <van-icon name="arrow" class="arrow-icon"/>
        </div>
      </div>
    </div>
    <div class="save-btn-placeholder">
      <div class="save-btn-box">
        <van-button
          class="save-btn"
          @click="saveTask"
          :disabled="saveLoading">保存</van-button>
      </div>
    </div>
    <WeekPicker
      v-model="weekShow"
      :week="currentWeek"
      @onSure="handleWeek"/>
    <TimePicker
      v-model="timeShow"
      :title="timeTitle"
      :current="currentTime"
      @onSure="handleTime"/>
  </div>
</template>
<script>
import WeekPicker from '../components/WeekPicker.vue'
import TimePicker from '../components/TimePicker.vue'
import { formatTime } from '../utils/index'

export default {
  components: {
    WeekPicker,
    TimePicker
  },
  name: 'taskManage',
  data() {
    return {
      weekShow: false,
      timeShow: false,
      timeTitle: '',
      currentTime: 0, // 当前时间
      currentOp: {},
      currentWeek: '',
      saveLoading: false,
      opList: [
        {
          value: 'repeat',
          name: '重复规律',
          chose: {}
        },
        {
          value: 'startTime',
          name: '开启时间',
          chose: {}
        },
        {
          value: 'endTime',
          name: '关闭时间',
          chose: {}
        }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 时间戳获取时分秒的秒数
    getTimestamp(val) {
      if (!val) {
        return 0
      }
      const date = new Date(val * 1000)
      const hours = date.getHours()
      const minues = date.getMinutes()
      const seconds = date.getSeconds()
      return (hours * 60 + minues) * 60 + seconds
    },
    // 处理操作
    handleOp(op) {
      this.currentOp = op
      if (op.value === 'repeat') {
        if (!op.chose.value) {
          this.currentWeek = ''
        } else {
          this.currentWeek = op.chose.value
        }
        this.weekShow = true
      } else {
        if (!op.chose.value) {
          this.currentTime = this.getTimestamp(Date.now() / 1000)
        } else {
          this.currentTime = op.chose.value
        }
        this.timeTitle = op.name
        this.timeShow = true
      }
    },
    // 选择日期确认
    handleWeek(result, name) {
      this.currentOp.chose = {
        value: result,
        name
      }
      this.weekShow = false
    },
    // 选择时间确认
    handleTime(result) {
      this.currentOp.chose = {
        value: result,
        name: formatTime(result)
      }
      this.timeShow = false
    },
    // 新建任务
    saveTask() {
      const identity = window.socketIdentity
      const params = {
        identity
      }
      this.opList.forEach((item) => {
        if (item.value === 'repeat') {
          params.weekdays = item.chose.value
        } else if (item.value === 'startTime') {
          params.start_at = item.chose.value
        } else if (item.value === 'endTime') {
          params.end_at = item.chose.value
        }
      })
      this.saveLoading = true
      this.http.addMask(identity, params).then((res) => {
        // 新建成功操作
        this.saveLoading = false
      }).catch(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  background: #f6f8fd;
}
.task-box {
  padding-top: 0.2rem;
}
.op-item {
  display: flex;
  align-items: center;
  padding: 0.36rem 0.3rem;
  background: #fff;
  border-bottom: 1PX solid #eee;
  font-size: 0.28rem;
  color: #3f4663;
  .title {
    flex: 1;
  }
  .tip-word {
    font-weight: bold;
  }
  .arrow-icon {
    font-weight: 0.3rem;
    color: #ccc;
    margin-left: 0.2rem;
    vertical-align: middle;
  }
}
.save-btn-placeholder {
  height: 1.6rem;
}
.save-btn-box {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  padding: 0.3rem;
}
.save-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
