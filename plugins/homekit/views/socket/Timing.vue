<template>
  <div class="wrapper">
    <van-nav-bar
      title="定时任务"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #right>
        <template v-if="!isDelete">
          <van-popover
            v-model="showPopover"
            placement="bottom-end"
            trigger="click">
            <div class="help-content">当同一个时间有多个任务时，将执行最后保存的任务。</div>
            <template #reference>
              <div class="help-btn"></div>
            </template>
          </van-popover>
          <div class="del-btn" @click="handleDel"></div>
        </template>
        <span v-else @click="handleCancel">取消</span>
      </template>
    </van-nav-bar>
    <div class="timing-list">
      <van-swipe-cell
        v-for="item in taskList"
        :key="item.id">
        <div class="timing-item" @click="toTaskManage(item)">
          <div class="timing-info">
            <h3 class="time">{{ item.time }}</h3>
            <p class="repeat">{{ item.repeat }}</p>
          </div>
          <div class="right-part">
            <!--开关控制-->
            <van-switch
              v-if="!isDelete"
              v-model="item.active"
              :loading="switchLoading"
              active-color="#2da3f6"
              inactive-color="#cfd6e0"
              size="0.36rem"
              @click.stop="changeSwitch(item)"/>
            <!--删除选择-->
            <template v-else>
              <div
                class="checked-icon"
                :class="{ 'checked': item.checked }"
                @click.stop="handleChecked(item)"></div>
            </template>
          </div>
        </div>
        <template #right>
          <van-button
            square
            class="delete-button"
            @click="deleteTask(item)">删除</van-button>
        </template>
      </van-swipe-cell>
    </div>
    <!-- 没有任务 -->
    <van-empty v-if="taskList.length === 0" description="暂无任务"/>
    <div class="add-btn-placeholder">
      <div class="add-btn-box">
        <van-button
          v-if="!isDelete"
          class="add-btn"
          @click="addMission">添加任务</van-button>
        <van-button
          v-else
          class="delete-btn"
          :disabled="!delLength"
          @click="deleteTask">删除({{ delLength }})</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { formatTime, formatRepeat } from '../../utils/index'

export default {
  name: 'timing',
  data() {
    return {
      isDelete: false,
      showPopover: false,
      checked: true,
      switchLoading: false, // 开关切换状态loading
      taskList: []
    }
  },
  computed: {
    delLength() {
      const list = this.taskList.filter(item => item.checked)
      return list.length
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取任务列表
    getTaskList() {
      const identity = window.socketIdentity
      this.http.getMaskList(identity).then((list) => {
        this.taskList = this.formatData(list)
      })
    },
    // 格式化列表数据类型
    formatData(list) {
      const res = list.map((item) => {
        // 任务执行动作
        let action = '开启'
        if (!item.start_at) {
          // 如果没有开启时间 就是关闭
          action = '关闭'
        }
        // 重复规律
        item.repeat = `${action}，${formatRepeat(item.weekdays)}`
        // 时间
        let time = ''
        if (item.start_at && item.end_at) {
          time = `${formatTime(item.start_at)}-${formatTime(item.end_at)}`
        } else if (item.start_at) {
          time = `${formatTime(item.start_at)}`
        } else if (item.end_at) {
          time = `${formatTime(item.end_at)}`
        }
        item.time = time
        item.checked = false
        return item
      })
      return res
    },
    // 改变开关状态
    changeSwitch(task) {
      const { identity, id } = task
      const params = {
        active: !task.active
      }
      this.switchLoading = true
      this.http.changeMask(identity, id, params).then(() => {
        this.switchLoading = false
      }).catch(() => {
        this.switchLoading = false
      })
    },
    // 删除任务
    deleteTask(task) {
      const identity = window.socketIdentity
      const delArr = []
      if (task.id) {
        delArr.push(task.id)
      } else {
        this.taskList.forEach((item) => {
          if (item.checked) {
            delArr.push(item.id)
          }
        })
      }
      const params = {
        delete: delArr
      }
      this.http.delMask(identity, params).then(() => {
        // 删除成功
        this.getTaskList()
      })
    },
    // 编辑任务
    toTaskManage(task) {
      this.$router.push({
        name: 'socketTaskManage',
        query: task
      })
    },
    // 添加任务
    addMission() {
      this.$router.push({
        name: 'socketTaskManage'
      })
    },
    // 处理删除按钮
    handleDel() {
      this.isDelete = true
    },
    // 处理取消按钮
    handleCancel() {
      this.isDelete = false
    },
    // 处理任务选择
    handleChecked(task) {
      task.checked = !task.checked
    }
  },
  created() {
    // 获取任务列表
    this.getTaskList()
  }
}
</script>
<style lang="scss" scoped>
.timing-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.4rem 0.3rem 0.3rem;
  border-bottom: 1PX solid #eee;
  .timing-info {
    flex: 1;
    .time {
      padding-bottom: 0.12rem;
      font-size: 0.6rem;
      font-weight: bold;
      color: #3f4663;
    }
    .repeat {
      font-size: 0.22rem;
      font-weight: bold;
      color: #94a5be;
    }
  }
}
.help-btn {
  width: 0.3rem;
  height: 0.3rem;
  background-image: url(../../assets/socket/icon-help.png);
  background-size: 100% 100%;
  margin-right: 0.4rem;
}
.help-content {
  padding: 0.13rem 0.3rem;
  max-width: 4.88rem;
  font-size: 0.28rem;
  color: #3f4663;
  line-height: 1.5;
}
.del-btn {
  width: 0.3rem;
  height: 0.3rem;
  background-image: url(../../assets/socket/icon-delete.png);
  background-size: 100% 100%;
  margin-left: -0.1rem;
}
.checked-icon {
  width: 0.36rem;
  height: 0.36rem;
  background-image: url(../../assets/socket/uncheck-box-icon.png);
  background-size: 100% 100%;
}
.checked {
  background-image: url(../../assets/socket/check-box-icon.png);
}
.delete-button {
  width: 1.2rem;
  height: 100%;
  background: #ff0000;
  color: #fff;
}
.add-btn-placeholder {
  height: 1.6rem;
}
.add-btn-box {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  padding: 0.3rem;
  background: #fff;
  .add-btn {
    width: 6.9rem;
    height: 1rem;
    background: #2da3f6;
    border-radius: 0.2rem;
    color: #fff;
  }
  .delete-btn {
    width: 6.9rem;
    height: 1rem;
    background: #f6f8fd;
    border: 1PX solid #cfd6e0;
    border-radius: 0.2rem;
    color: #3f4663;
  }
}
</style>
