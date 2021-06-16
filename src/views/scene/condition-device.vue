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
        :class="{ 'delay': item.action === 'delay' }"
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
    <!-- 亮度选择 -->
    <LightPopup
      v-model="lightShow"
      :needCondition="isCondition"
      :initCondition="initCondition"
      :initVal="currentLight"
      @on-confirm="handleLight"
      :title="$t('condition.brightness')"/>
    <!-- 色温选择 -->
    <LightPopup
      v-model="tempShow"
      :needCondition="isCondition"
      :initCondition="initCondition"
      :initVal="currentTemp"
      @on-confirm="handleTemp"
      :title="$t('condition.temperature')"
      :min="3000"
      :max="5700"
      active-color="transparent"
      inactive-color="linear-gradient(90deg, #FFB06B, #FFD26E 40%, #7ECFFC)"/>
    <!-- 延时选择 -->
    <TimePicker
      v-model="delayShow"
      :title="$t('condition.delay')"
      :current="currentTime"
      @on-sure="handleDelay"/>
  </div>
</template>
<script>
import TimePicker from '@/components/TimePicker.vue'
import SwitchPopup from './components/SwitchPopup.vue'
import LightPopup from './components/LightPopup.vue'

export default {
  name: 'conditionsDevice',
  components: {
    SwitchPopup,
    LightPopup,
    TimePicker
  },
  data() {
    return {
      loading: false,
      switchShow: false,
      lightShow: false,
      tempShow: false,
      delayShow: false,
      canNext: false,
      operation: 'condition', // 操作类型 condition 触发条件 execution 执行条件
      currentIndex: 0,
      currentSwitch: '', // 当前开关状态
      initCondition: '', // 当前操作符
      currentLight: 10, // 当前亮度值
      currentTemp: 0, // 当前色温值
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
          if (item.action !== 'delay' && item.chose.value) {
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
        this.deviceInfo.actions.forEach((item) => {
          const obj = Object.assign({}, item)
          obj.chose = {}
          list.push(obj)
        })
        this.opList = list
        // 判断是否是执行条件
        if (this.operation === 'execution') {
          const obj = {
            action: 'delay',
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
          const conditionItem = this.conditionList[index].condition_item
          this.opList.forEach((item) => {
            if (item.action === conditionItem.action) {
              item.chose = {
                value: conditionItem.action_val,
                name: `${conditionItem.action_val}%`,
                op: conditionItem.operator
              }
            }
          })
        } else {
          const task = this.taskList[index] || {}
          const taskDevices = task.scene_task_devices || []
          this.opList.forEach((item) => {
            taskDevices.forEach((dev) => {
              if (item.action === dev.action) {
                const name = dev.action === 'switch' ? map[dev.action_val] : `${dev.action_val}%`
                item.chose = {
                  value: dev.action_val,
                  name
                }
              }
            })
          })
          // 延时
          const currentIndex = this.opList.findIndex(item => item.action === 'delay')
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
      if (item.action === 'switch') {
        this.currentSwitch = item.chose.value
        this.switchShow = true
      } else if (item.action === 'set_bright') {
        this.currentLight = item.chose.value
        this.initCondition = item.chose.op || '='
        this.lightShow = true
      } else if (item.action === 'set_color_temp') {
        this.currentTemp = item.chose.value
        this.initCondition = item.chose.op || '='
        this.tempShow = true
      } else if (item.action === 'delay') {
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
    // 开关处理
    handleSwitch(item) {
      this.switchShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          condition_item: {
            operator: '=',
            action: 'switch',
            attribute: 'power',
            action_val: `${item.value}`
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        this.opList[this.currentIndex].chose = item
      }
    },
    // 亮度选择处理
    handleLight(val, op) {
      this.lightShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          condition_item: {
            operator: op,
            action: 'set_bright',
            attribute: 'brightness',
            action_val: `${val}`
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        const chose = {
          value: val,
          name: `${val}%`
        }
        this.opList[this.currentIndex].chose = chose
      }
    },
    // 处理色温选择
    handleTemp(val, op) {
      this.tempShow = false
      if (this.isCondition) {
        // 保存传输数据
        const sceneConditions = {
          condition_type: 2,
          device_id: this.deviceId,
          condition_item: {
            operator: op,
            action: 'set_color_temp',
            attribute: 'color_temp',
            action_val: `${val}`
          }
        }
        this.handleCondition(sceneConditions)
      } else {
        const chose = {
          value: val,
          name: `${val}%`
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
        if (item.chose.value && item.action !== 'delay') {
          const obj = { // type为smart_device时，必须设置
            device_id: this.deviceId,
            action: item.action,
            attribute: item.attr,
            action_val: `${item.chose.value}`
          }
          task.push(obj)
        }
        if (item.action === 'delay') {
          delay = item.chose.value || 0
        }
      })
      const sceneTasks = {
        type: 1, // 1:控制设备；2:手动执行;3:开启自动执行;4:关闭自动执行
        delay_seconds: delay, // 可不传，延迟秒数
        scene_task_devices: task
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
    }
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
