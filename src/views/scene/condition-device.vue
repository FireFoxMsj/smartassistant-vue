<template>
  <div class="wrap">
    <van-nav-bar
      :title="deviceInfo.name"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="!isCondition" #right>
        <span class="reset-btn" @click="reset">{{ $t('global.reset') }}</span>
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div
        v-for="(item, index) in opList"
        :key="index"
        class="cell"
        :class="{ 'delay': item.attribute === 'delay' }"
        @click="handleOp(item, index)">
        <p class="op-name one-line">{{ item.name }}</p>
        <div class="cell-right">
          <span v-if="!isCondition">{{ item.chose.name }}</span>
          <van-icon
            name="arrow"
            color="#cccccc"
            size="0.3rem"
            class="icon"/>
        </div>
      </div>
      <div v-if="!isCondition" class="op-btn-placeholder">
        <div class="op-btn-box">
          <van-button
            class="op-btn"
            :disabled="!canNext"
            @click="handleNext">{{ $t('condition.next') }}</van-button>
        </div>
      </div>
    </template>
    <!-- 开关选择 -->
    <SwitchPopup
      v-model="switchShow"
      :needSwitch="!isCondition"
      :initVal="currentSwitch"
      @on-change="handleSwitch"
      :title="$t('condition.switch')"/>
    <!-- 窗帘控制选择 -->
    <CurtainPopup
      v-model="curtainShow"
      :needSwitch="!isCondition"
      :initVal="currentCurtain"
      @on-change="handleCurtain"
      :title="$t('condition.curtainTitle')"/>
    <!-- 百分比选择 -->
    <PercentagePopup
      v-model="percentShow"
      :needCondition="isCondition"
      :initCondition="initCondition"
      :initVal="currentPercent"
      @on-confirm="handlePercent"
      :title="percentTitle"
      :tipWord="tipWord"
      :activeColor="activeColor"
      :inactiveColor="inactiveColor"
      :max="percentMax"
      :min="percentMin"/>
    <!-- 延时选择 -->
    <TimePicker
      v-model="delayShow"
      :title="$t('condition.delay')"
      :current="currentTime"
      @on-sure="handleDelay"/>
  </div>
</template>
<script>
import { getAttr } from '@/config/deviceAttr'
import TimePicker from '@/components/TimePicker.vue'
import SwitchPopup from './components/SwitchPopup.vue'
import CurtainPopup from './components/CurtainPopup.vue'
import PercentagePopup from './components/PercentagePopup.vue'

export default {
  name: 'conditionsDevice',
  components: {
    SwitchPopup,
    CurtainPopup,
    PercentagePopup,
    TimePicker
  },
  data() {
    return {
      loading: false,
      switchShow: false,
      curtainShow: false, // 窗帘控制显示
      percentShow: false, // 百分比控制显示
      delayShow: false,
      canNext: false,
      operation: 'condition', // 操作类型 condition 触发条件 execution 执行条件
      currentIndex: 0,
      currentSwitch: '', // 当前开关状态
      currentCurtain: '', // 当前窗帘状态
      initCondition: '', // 当前操作符
      currentPercent: 0, // 当前百分比值
      percentTitle: '', // 百分比弹窗标题
      tipWord: '', // 提示文案
      activeColor: '', // 百分比激活颜色
      inactiveColor: '', // 百分比底部颜色
      percentMax: 0, // 百分比最大值
      percentMin: 0, // 百分比最大值
      currentAttr: {}, // 当前控制属性
      currentTime: 0, // 当前时间
      opList: [], // 用户操作列表
      deviceId: '', // 设备id
      conditionList: [],
      taskList: [],
      delTaskList: [], // 删除任务id
      deviceInfo: {},
      query: {} // 参数，用来初始化
    }
  },
  computed: {
    isCondition() {
      return this.operation === 'condition'
    },
    isModify() {
      return this.query.index !== undefined
    },
    info() {
      return {
        name: this.deviceInfo.name,
        location_name: this.deviceInfo.location.name,
        logo_url: this.deviceInfo.logo_url,
        status: this.deviceInfo.status
      }
    }
  },
  watch: {
    opList: {
      deep: true,
      handler(list) {
        let result = false
        list.forEach((item) => {
          if (item.attribute !== 'delay' && item.chose.value) {
            result = true
          }
        })
        this.canNext = result
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取设备详情
    getDeviceDetail() {
      this.loading = true
      this.http.getDeviceDetail(this.deviceId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.deviceInfo = res.data.device_info
        const list = []
        this.deviceInfo.attributes.forEach((item) => {
          item.name = getAttr(item.attribute)
          const obj = Object.assign({}, item)
          obj.chose = {}
          list.push(obj)
        })
        this.opList = list
        // 判断是否是执行条件
        if (this.operation === 'execution') {
          const obj = {
            attribute: 'delay',
            name: this.$t('condition.delay'),
            chose: {}
          }
          this.opList.push(obj)
        }
        // 初始修改值
        this.initData()
      }).catch(() => {
        this.loading = false
      })
    },
    // 初始值
    initData() {
      const map = {
        on: this.$t('condition.turnOn'),
        off: this.$t('condition.shutDown'),
        toggle: this.$t('condition.change')
      }
      const { index } = this.query
      if (this.isModify) {
        if (this.isCondition) {
          const conditionAttr = this.conditionList[index].condition_attr
          this.opList.forEach((item) => {
            if (item.attribute === conditionAttr.attribute) {
              item.chose = {
                max: conditionAttr.max,
                min: conditionAttr.min,
                value: conditionAttr.val,
                name: `${this.$methods.getPercent(conditionAttr.max, conditionAttr.min, conditionAttr.val)}%`,
                op: conditionAttr.operator
              }
            }
          })
        } else {
          const task = this.taskList[index] || {}
          const taskDevices = task.attributes || []
          this.opList.forEach((item) => {
            taskDevices.forEach((dev) => {
              if (item.attribute === dev.attribute) {
                if (dev.attribute === 'power') {
                  item.chose = {
                    value: dev.val,
                    name: map[dev.val]
                  }
                } else {
                  item.chose = {
                    max: dev.max,
                    min: dev.min,
                    value: dev.val,
                    name: `${this.$methods.getPercent(dev.max, dev.min, dev.val)}%`
                  }
                }
              }
            })
          })
          // 延时
          const currentIndex = this.opList.findIndex(item => item.attribute === 'delay')
          this.currentIndex = currentIndex
          if (task.delay_seconds) {
            this.handleDelay(task.delay_seconds)
          }
        }
      }
    },
    // 重置操作
    reset() {
      this.opList.forEach((item) => {
        item.chose = {}
      })
    },
    handleOp(item, index) {
      this.currentIndex = index
      if (item.attribute === 'power') {
        // 开关
        this.currentSwitch = `${item.chose.value}`
        this.switchShow = true
      } else if (item.attribute === 'brightness') {
        // 亮度
        this.percentTitle = this.$t('condition.brightness')
        this.tipWord = ''
        this.activeColor = 'linear-gradient(to right, #FEBF32, #FFB06B)'
        this.inactiveColor = '#f1f4fc'
        this.currentAttr = {
          max: item.max,
          min: item.min,
          attribute: 'brightness',
        }
        this.percentMax = item.max
        this.percentMin = item.min
        this.currentPercent = item.chose.value ? item.chose.value : item.min
        this.initCondition = item.chose.op || '='
        this.percentShow = true
      } else if (item.attribute === 'color_temp') {
        // 色温
        this.percentTitle = this.$t('condition.temperature')
        this.tipWord = ''
        this.activeColor = 'transparent'
        this.inactiveColor = 'linear-gradient(90deg, #FFB06B, #FFD26E 40%, #7ECFFC)'
        this.currentAttr = {
          max: item.max,
          min: item.min,
          attribute: 'color_temp',
        }
        this.percentMax = item.max
        this.percentMin = item.min
        this.currentPercent = item.chose.value ? item.chose.value : item.min
        this.initCondition = item.chose.op || '='
        this.percentShow = true
      } else if (item.attribute === 'curtain_postion') {
        // 如果是执行任务
        if (!this.isCondition) {
          this.currentCurtain = item.chose.value
          this.curtainShow = true
        } else {
          // 窗帘位置
          this.percentTitle = this.$t('condition.curtainTitle')
          this.tipWord = this.$t('condition.curtainState')
          this.activeColor = '#2da3f6'
          this.inactiveColor = '#f1f4fc'
          this.currentAttr = {
            max: item.max,
            min: item.min,
            attribute: 'curtain_postion',
          }
          this.percentMax = item.max
          this.percentMin = item.min
          this.currentPercent = item.chose.value ? item.chose.value : item.min
          this.initCondition = item.chose.op || '='
          this.percentShow = true
        }
      } else if (item.attribute === 'delay') {
        if (!this.isCondition) {
          this.currentTime = item.chose.value
        }
        this.delayShow = true
      }
    },
    // 跳转至创建场景页面
    toCreatScene() {
      this.$router.replace({
        name: 'setScene',
        query: {
          sceneId: this.$route.query.sceneId
        }
      })
    },
    /**
    *  把source的字段，覆盖设置到target的字段，递归覆盖，不直接覆盖对象
    * @param target
    * @param source
    */
    extend(target, source) {
      Object.keys(source).forEach((key) => {
        const newValue = source[key]
        const oldValue = target[key]
        // 如果 是数组，有值就追加，没值就覆盖
        if (Array.isArray(oldValue)) {
          target[key] = [...oldValue, ...newValue]
        } else if (typeof (oldValue) === 'object') {
          // 如果是object 递归设置
          target[key] = this.extend(oldValue, newValue)
        } else {
          // 判断，如果不是object，就直接设置
          // 普通字段
          target[key] = newValue
        }
      })
      return target
    },
    // 处理选择条件
    handleCondition(condition) {
      const { index } = this.query
      if (this.isModify) {
        // 初始修改数据
        this.conditionList[index] = this.extend(this.conditionList[index], condition)
      } else {
        condition.device_info = this.info
        this.conditionList.push(condition)
      }
      this.$methods.setSession('conditionList', JSON.stringify(this.conditionList))
      this.toCreatScene()
    },
    // 窗帘选择处理
    handleCurtain(item) {
      this.curtainShow = false
      if (item.value === 'percent') {
        // 弹出百分比选择
        this.percentTitle = this.$t('condition.curtainTitle')
        this.activeColor = '#2da3f6'
        this.inactiveColor = '#f1f4fc'
        const { value } = this.opList[this.currentIndex].chose
        this.currentPercent = typeof value === 'number' ? value : 0
        this.percentShow = true
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 开关处理
    handleSwitch(item) {
      this.switchShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: '=',
          condition_attr: {
            attribute: 'power',
            val: item.value,
            val_type: this.opList[this.currentIndex].val_type,
            instance_id: this.opList[this.currentIndex].instance_id
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 百分比选择处理
    handlePercent(val, op) {
      this.percentShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          operator: op,
          condition_attr: {
            attribute: this.currentAttr.attribute,
            max: this.opList[this.currentIndex].max,
            min: this.opList[this.currentIndex].min,
            val,
            val_type: this.opList[this.currentIndex].val_type,
            instance_id: this.opList[this.currentIndex].instance_id
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        const chose = {
          max: this.currentAttr.max,
          min: this.currentAttr.min,
          value: val,
          name: `${this.$methods.getPercent(this.currentAttr.max, this.currentAttr.min, val)}%`
        }
        this.opList[this.currentIndex].chose = chose
      }
    },
    // 处理延迟
    handleDelay(val) {
      const chose = {
        value: val,
        name: `${this.$methods.formatTime(val)} ${this.$t('condition.rear')}`
      }
      this.opList[this.currentIndex].chose = chose
      this.delayShow = false
    },
    // 下一步处理
    handleNext() {
      let delay = 0
      const task = []
      this.opList.forEach((item) => {
        if (item.chose.value && item.attribute !== 'delay') {
          if (item.attribute === 'power') {
            const obj = { // type为smart_device时，必须设置
              device_id: this.deviceId,
              attribute: item.attribute,
              val: item.chose.value,
              instance_id: item.instance_id,
              val_type: item.val_type
            }
            task.push(obj)
          } else {
            const obj = { // type为smart_device时，必须设置
              device_id: this.deviceId,
              attribute: item.attribute,
              max: item.max,
              min: item.min,
              val: item.chose.value,
              instance_id: item.instance_id,
              val_type: item.val_type
            }
            task.push(obj)
          }
        }
        if (item.attribute === 'delay') {
          delay = item.chose.value || 0
        }
      })
      const sceneTasks = {
        type: 1, // 1:控制设备；2:手动执行;3:开启自动执行;4:关闭自动执行
        delay_seconds: delay, // 可不传，延迟秒数
        device_id: this.deviceId,
        attributes: task
      }
      if (delay === 0) {
        // 延迟秒速为0时 删除
        delete sceneTasks.delay_seconds
      }
      sceneTasks.device_info = this.info
      if (this.isModify) {
        // 删除任务
        const { index } = this.query
        const { id } = this.taskList[index]
        if (id && !this.delTaskList.includes(id)) {
          this.delTaskList.push(id)
        }
        this.taskList[index] = sceneTasks
      } else {
        this.taskList.push(sceneTasks)
      }
      this.$methods.setSession('delTaskList', JSON.stringify(this.delTaskList))
      this.$methods.setSession('taskList', JSON.stringify(this.taskList))
      this.toCreatScene()
    },
  },
  created() {
    const conditionStr = this.$methods.getSession('conditionList')
    this.conditionList = conditionStr ? JSON.parse(conditionStr) : []
    const taskStr = this.$methods.getSession('taskList')
    this.taskList = taskStr ? JSON.parse(taskStr) : []
    const delTaskStr = this.$methods.getSession('delTaskList')
    this.delTaskList = delTaskStr ? JSON.parse(delTaskStr) : []
    const { query } = this.$route
    this.query = query
    this.operation = query.op || 'condition'
    // 初始化设备相关信息
    this.deviceId = query.id - 0
    this.getDeviceDetail()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  min-height: 100vh;
  background: $bgColor;
}
.cell {
  display: flex;
  align-items: center;
  padding: 0.36rem 0.3rem;
  background: #fff;
  border-top: 1PX solid #eee;
}
.delay {
  margin-top: 0.2rem;
  border-top: 0;
}
.op-name {
  flex: 1;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.cell-right {
  span {
    font-weight: bold;
    color: #94A5BE;
    margin-right: 0.3rem;
  }
  .icon {
    vertical-align: middle;
  }
}
.op-btn-placeholder {
  height: 1.6rem;
}
.op-btn-box {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 0.3rem;
  background: $bgColor;
}
.op-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
