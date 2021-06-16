<template>
  <div class="wrap">
    <van-nav-bar
      :title="title"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right>
        <span class="reset-btn" @click="reset">{{ $t('global.reset') }}</span>
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div v-show="!isEmpty" class="scene-part">
        <div
          v-for="item in sceneList"
          :key="item.id"
          class="cell"
          @click="handleOp(item)">
          <img
            src="../../assets/condition-scene-icon.png"
            class="scene-icon"/>
          <p class="op-name one-line">{{ item.name }}</p>
          <i class="check-icon" :class="{ 'checked': result.includes(item.id) }"></i>
        </div>
        <div class="cell mgt60" @click="delayShow = true">
          <span class="delay">{{ $t('condition.delay') }}</span>
          <div class="cell-right">
            <span>{{ timeWord }}</span>
            <van-icon
              name="arrow"
              color="#cccccc"
              size="0.3rem"
              class="icon"/>
          </div>
        </div>
        <div class="op-btn-placeholder">
          <div class="op-btn-box">
            <van-button
              class="op-btn"
              :disabled="result.length <= 0"
              @click="handleNext">{{ $t('condition.next') }}</van-button>
          </div>
        </div>
      </div>
      <div v-show="isEmpty" class="empty-part">
        <div class="empty-box">
          <img src="../../assets/empty-list.png"/>
          <p>{{ $t('global.empty') }}</p>
        </div>
      </div>
    </template>
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

export default {
  name: 'conditionsSwitch',
  components: {
    TimePicker
  },
  data() {
    return {
      delayShow: false,
      loading: false,
      currentTime: 0,
      timeWord: '',
      result: [], // 选择的场景
      sceneType: 0, // 场景类型 2:手动执行;3:开启自动执行;4:关闭自动执行
      sceneList: [],
      taskList: [],
      query: {},
      switchTitle: ''
    }
  },
  computed: {
    isEmpty() {
      return this.sceneList.length === 0
    },
    isModify() {
      return this.query.index !== undefined
    },
    title() {
      if (this.sceneType === 2) {
        return this.$t('creatScene.controlItemTitle1')
      }
      if (this.sceneType === 3) {
        return this.$t('creatScene.controlItemTitle2')
      }
      return this.$t('creatScene.controlItemTitle3')
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 重置操作
    reset() {
      this.result = []
      this.timeWord = ''
    },
    // 跳转至创建场景页面
    toCreatScene() {
      this.$router.go(-1)
    },
    // 初始化列表
    initList() {
      const params = {
        type: 1
      }
      this.http.scenesList(params).then((res) => {
        if (res.status !== 0) {
          return
        }
        const { data } = res
        const autoList = data.auto_run || []
        if (this.sceneType === 2) {
          this.sceneList = data.manual || []
        } else if (this.sceneType === 3 || this.sceneType === 4) {
          this.sceneList = autoList
        } else {
          this.sceneList = []
        }
        this.initData()
      })
    },
    // 初始化数据
    initData() {
      const { index } = this.query
      if (this.isModify) {
        const task = this.taskList[index]
        if (task.delay_seconds) {
          this.handleDelay(task.delay_seconds)
        }
        this.result.push(task.control_scene_id)
      }
    },
    // 处理选择场景
    handleOp(item) {
      const index = this.result.findIndex(id => item.id === id)
      if (index === -1) {
        this.result.push(item.id)
      } else {
        this.result.splice(index, 1)
      }
    },
    // 处理延迟
    handleDelay(val) {
      this.currentTime = val
      this.timeWord = `${this.$methods.formatTime(val)} ${this.$t('condition.rear')}`
      this.delayShow = false
    },
    // 处理下一步
    handleNext() {
      this.result.forEach((sceneId) => {
        const scene = this.sceneList.find(item => item.id === sceneId)
        const sceneTasks = {
          type: this.sceneType,
          control_scene_id: sceneId,
          delay_seconds: this.currentTime
        }
        if (this.currentTime === 0) {
          delete sceneTasks.delay_seconds
        }
        if (this.isModify) {
          const { index } = this.query
          this.taskList[index] = Object.assign(this.taskList[index], sceneTasks)
        } else {
          sceneTasks.control_scene_info = {
            name: scene.name
          }
          this.taskList.push(sceneTasks)
        }
      })
      this.$methods.setSession('taskList', JSON.stringify(this.taskList))
      this.toCreatScene()
    }
  },
  created() {
    const taskStr = this.$methods.getSession('taskList')
    this.taskList = taskStr ? JSON.parse(taskStr) : []
    const { query } = this.$route
    this.query = query
    this.sceneType = query.type - 0
    this.initList()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 0 0.3rem;
  min-height: 100vh;
  background: $bgColor;
}
.cell {
  display: flex;
  align-items: center;
  padding: 0.3rem;
  background: #fff;
  border-radius: 0.2rem;
  margin-top: 0.2rem;
}
.mgt60 {
  margin-top: 0.6rem;
}
.scene-icon {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.3rem;
}
.delay {
  flex: 1;
  font-weight: bold;
  font-size: 0.28rem;
  color: #3F4663;
}
.op-name {
  width: 4.6rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.check-icon {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  background-image: url(../../assets/uncheck-box-icon.png);
  background-size: 100% 100%;
}
.checked {
  background-image: url(../../assets/check-box-icon.png);
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
.empty-part {
  display: flex;
  height: calc(100vh - 1.2rem);
  align-items: center;
  justify-content: center;
}
.empty-box {
  text-align: center;
  p {
    padding-top: 0.2rem;
    font-size: 0.28rem;
    color: #94A5BE;
  }
}
</style>
