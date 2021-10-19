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
          <span class="tip-word">{{ getOpName(item) }}</span>
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
import WeekPicker from '../../components/WeekPicker.vue'
import TimePicker from '../../components/TimePicker.vue'
import { formatTime, formatRepeat } from '../../utils/index'

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
      task: {}, // 编辑初始数据
      opList: [
        {
          id: 'weekdays',
          name: '重复规律',
          value: '-1'
        },
        {
          id: 'start_at',
          name: '开启时间',
          value: 0
        },
        {
          id: 'end_at',
          name: '关闭时间',
          value: 0
        }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 处理操作
    handleOp(op) {
      this.currentOp = op
      if (op.id === 'weekdays') {
        this.currentWeek = op.value
        this.weekShow = true
      } else {
        if (!op.value) {
          this.currentTime = Date.now() / 1000
        } else {
          this.currentTime = op.value
        }
        this.timeTitle = op.name
        this.timeShow = true
      }
    },
    // 获取操作值提示
    getOpName(op) {
      if (op.id === 'weekdays') {
        return formatRepeat(op.value)
      }
      return formatTime(op.value)
    },
    // 选择日期确认
    handleWeek(result) {
      this.currentOp.value = result
      this.weekShow = false
    },
    // 选择时间确认
    handleTime(result) {
      this.currentOp.value = result
      console.log(result)
      this.timeShow = false
    },
    // 前端拦截判断
    verify(params) {
      if (params.weekdays === '-1') {
        this.$toast('请选择重复规律')
        return false
      }
      if (!params.start_at && !params.end_at) {
        this.$toast('请选择时间')
        return false
      }
      if (params.start_at && params.end_at) {
        console.log(params.start_at, params.end_at)
        if (params.start_at > params.end_at) {
          this.$toast('开始时间不能大于结束时间')
          return false
        }
      }
      return true
    },
    // 新建任务
    saveTask() {
      const identity = window.socketIdentity
      const params = {
        identity
      }
      this.opList.forEach((item) => {
        if (item.id === 'weekdays') {
          params.weekdays = item.value
        } else if (item.id === 'start_at') {
          params.start_at = item.value
        } else if (item.id === 'end_at') {
          params.end_at = item.value
        }
      })
      if (!this.verify(params)) {
        return
      }
      this.saveLoading = true
      if (this.task.id) {
        // 编辑保存
        this.http.changeMask(identity, this.task.id, params).then(() => {
          // 新建成功操作
          this.saveLoading = false
          this.$router.go(-1)
        }).catch(() => {
          this.saveLoading = false
        })
      } else {
        // 新增保存
        this.http.addMask(identity, params).then(() => {
          // 新建成功操作
          this.saveLoading = false
          this.$router.go(-1)
        }).catch(() => {
          this.saveLoading = false
        })
      }
    }
  },
  created() {
    // 判断是否是编辑
    this.task = this.$route.query
    if (this.task.id) {
      // 编辑初始化数据
      this.opList.forEach((item) => {
        item.value = this.task[item.id] || 0
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
