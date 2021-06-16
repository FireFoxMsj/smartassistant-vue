<template>
  <div class="wrap">
    <van-nav-bar
      :title="$t('scene.effictiveTimeTitle')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right>
        <van-button
          class="right-btn"
          :class="{ 'disabled': !canFinish }"
          round type="info"
          size="small"
          @click="handleFinish">{{ $t('global.finish') }}</van-button>
      </template>
    </van-nav-bar>
    <div class="cell">
      <div class="cell-item" @click="changeType(1)">
        <div class="cell-item--left">{{ $t('effectiveTime.allDay') }}</div>
        <div class="cell-item--right">
          <i class="check-icon" :class="{ 'active': params.time_period === 1 }"></i>
        </div>
      </div>
    </div>
    <div class="cell">
      <div class="cell-item" @click="changeType(2)">
        <div class="cell-item--left">{{ $t('effectiveTime.period') }}</div>
        <div class="cell-item--right">
          <i class="check-icon" :class="{ 'active': params.time_period === 2 }"></i>
        </div>
      </div>
      <div v-show="params.time_period === 2" class="time-wrap">
        <div class="time-box" @click="showTime('start')">
          <p class="time-label">{{ $t('effectiveTime.start') }}</p>
          <p class="time active">{{ startTimeStr }}</p>
        </div>
        <div class="time-box" @click="showTime('end')">
          <p class="time-label">{{ $t('effectiveTime.end') }}</p>
          <p class="time active">{{ endTimeStr }}</p>
        </div>
      </div>
    </div>
    <div class="cell mgt20 border-0">
      <div class="cell-item" @click="repeatShow = true">
        <div class="cell-item--left">{{ $t('effectiveTime.repeat') }}</div>
        <div class="cell-item--right">
          <span class="daily">{{ repeatFrequency }}</span>
          <van-icon name="arrow" color="#94A5BE" class="arrow-icon"/>
        </div>
      </div>
    </div>
    <!-- 时间选择 -->
    <TimePicker
      v-model="pickerShow"
      :start-time="startTime"
      :end-time="endTime"
      :current="current"
      :type="timeType"
      @on-sure="handleTime"/>
    <!-- 重复选择 -->
    <RepeatPicker
      v-model="repeatShow"
      :type="params.repeat_type"
      @on-change="handleRepeat"/>
    <!--自定义选择-->
    <weekPicker
      v-model="weekShow"
      :week="weekList"
      @on-sure="handleWeek"/>
  </div>
</template>
<script>
import TimePicker from '@/components/TimePicker.vue'
import RepeatPicker from './components/RepeatPicker.vue'
import weekPicker from './components/WeekPicker.vue'

const dayTime = new Date(new Date().toLocaleDateString()).getTime() / 1000

export default {
  name: 'effectiveTime',
  components: {
    TimePicker,
    RepeatPicker,
    weekPicker
  },
  data() {
    return {
      pickerShow: false,
      repeatShow: false,
      weekShow: false,
      timeType: '',
      weekList: [], // 自定义
      params: {
        time_period: 1, // 生效方式 1 全天 2 时间段
        effect_start_time: 0, // 生效开始时间
        effect_end_time: 0, // 生效结束时间
        repeat_type: 1, // 重复执行的类型；1：每天; 2:工作日 ；3：自定义;auto_run为false可不传
        repeat_date: '1234567' // 只能传长度为7包含1-7的数字；"1122"视为不合法传参;repeat_type为0时:"1234567";1时:12345;2时：任意
      }
    }
  },
  computed: {
    canFinish() {
      return !(this.params.repeat_type === 3 && this.weekList.length === 0)
    },
    startTime() {
      if (this.params.effect_start_time) {
        return this.$methods.getTimestamp(this.params.effect_start_time)
      }
      return 0
    },
    startTimeStr() {
      return this.$methods.formatTime(this.startTime)
    },
    endTime() {
      if (this.params.effect_end_time) {
        return this.$methods.getTimestamp(this.params.effect_end_time)
      }
      return 0
    },
    endTimeStr() {
      return this.$methods.formatTime(this.endTime)
    },
    current() {
      if (this.timeType === 'start') {
        return this.$methods.getTimestamp(this.params.effect_start_time)
      }
      return this.$methods.getTimestamp(this.params.effect_end_time)
    },
    repeatFrequency() {
      if (this.params.repeat_type === 1) {
        return this.$t('effectiveTime.everyDay')
      }
      if (this.params.repeat_type === 2) {
        return this.$t('effectiveTime.week')
      }
      let name = ''
      const map = {
        1: this.$t('effectiveTime.monday'),
        2: this.$t('effectiveTime.tuesday'),
        3: this.$t('effectiveTime.wednesday'),
        4: this.$t('effectiveTime.thursday'),
        5: this.$t('effectiveTime.friday'),
        6: this.$t('effectiveTime.saturday'),
        7: this.$t('effectiveTime.sunday')
      }
      this.weekList.forEach((val) => {
        name += `${map[val]}、`
      })
      return name.replace(/、$/, '')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 修改方式
    changeType(type) {
      this.params.time_period = type
    },
    showTime(type) {
      this.timeType = type
      this.pickerShow = true
    },
    // 处理时间
    handleTime(start, end) {
      this.params.effect_start_time = start + dayTime
      this.params.effect_end_time = end + dayTime
      this.pickerShow = false
    },
    // 处理重复频类
    handleRepeat(val) {
      this.repeatShow = false
      if (val.value === 3) {
        this.weekShow = true
      } else {
        this.params.repeat_type = val.value
      }
    },
    // 处理自定义
    handleWeek(list) {
      this.params.repeat_type = 3
      this.weekList = list.sort((a, b) => a - b)
      this.weekShow = false
    },
    // 处理完成
    handleFinish() {
      if (!this.canFinish) {
        return
      }
      // 判断时间
      if (this.params.effect_end_time < this.params.effect_start_time) {
        this.$toast(this.$t('effectiveTime.timeErr'))
        return
      }
      if (this.params.time_period === 1) {
        this.params.effect_start_time = dayTime
        this.params.effect_end_time = dayTime + (24 * 60 * 60 - 1)
      }
      if (this.params.repeat_type === 1) {
        this.params.repeat_date = '1234567'
      } else if (this.params.repeat_type === 2) {
        this.params.repeat_date = '12345'
      } else if (this.params.repeat_type === 3) {
        this.params.repeat_date = this.weekList.join('')
      }
      this.$methods.setSession('sceneParams', JSON.stringify(this.params))
      this.$router.go(-1)
    }
  },
  created() {
    // 初始化数据
    const paramsStr = this.$methods.getSession('sceneParams')
    this.params = paramsStr ? JSON.parse(paramsStr) : {}
    if (this.params.repeat_type === 3) {
      this.weekList = this.params.repeat_date.split('').map(item => item - 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.mgt20 {
  margin-top: 0.2rem;
}
.wrap {
  min-height: 100vh;
  background: $bgColor;
}
.right-btn {
  background: #2DA3F6;
  min-width: 1rem;
  height: .5rem;
}
.disabled {
  opacity: 1;
  background: #F6F8FD;
  color: #cccccc;
  border-color: #F6F8FD;
}
.active {
  color: #2DA3F6;
}
.cell {
  background: #fff;
  border-top: 1PX solid #eee;
}
.cell-item {
  display: flex;
  align-items: center;
  padding: 0.3rem;
}
.border-0 {
  border: 0;
}
.cell-item--left {
  flex: 1;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.cell-item--right {
  display: flex;
  align-items: center;
  .active {
    background-image: url(../../assets/check-icon.png);
  }
}
.check-icon {
  display: inline-block;
  width: 0.38rem;
  height: 0.38rem;
  background-image: url(../../assets/uncheck-icon.png);
  background-size: 100% 100%;
}
.time-wrap {
  display: flex;
  padding: 0.08rem 0 0.3rem;
}
.time-box {
  flex: 1;
  text-align: center;
  .active {
    color: #2DA3F6;
  }
}
.time-label {
  font-weight: bold;
  font-size: 0.22rem;
  color: #3F4663;
  padding-bottom: 0.15rem;
}
.time {
  font-size: 0.36rem;
  font-weight: bold;
  color: #94A5BE;
}
.daily {
  font-size: 0.28rem;
  font-weight: bold;
  color: #94A5BE;
  margin-right: 0.3rem;
}
.arrow-icon {
}
</style>
