<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('owner.backup')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3f4663"/>
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
    <p class="title">{{ $t('owner.backupRecord') }}</p>
    <div class="backup-list">
      <div
        v-for="item in backupList"
        :key="item.created_at"
        class="backup-item">
        <div class="top">
          <p class="left">{{ item.logTime }}</p>
          <p class="center">{{ item.logDate }}</p>
          <div class="right">
            <p v-if="isRecovering && currentBackup.file_name === item.file_name" class="op-btn">
              <van-loading size="0.28rem" color="#2da3f6" class="btn-icon"/>{{ $t('global.recovering') }}
            </p>
            <template v-else>
              <p
                class="op-btn"
                :class="{ 'btn-disabled': item.disabled }"
                @click="handleRecover(item)">
                <van-icon name="replay" class="btn-icon"/>{{ $t('global.recover') }}
              </p>
              <p
                class="op-btn"
                :class="{ 'btn-disabled': item.disabled }"
                @click="handleDelete(item)">
                <van-icon name="delete-o" class="btn-icon"/>{{ $t('global.del') }}
              </p>
            </template>
          </div>
        </div>
        <p class="backup-detail"><span>备注：</span>{{ item.note }}</p>
      </div>
    </div>
    <div class="backup-btn-placeholder">
      <div class="backup-btn-box">
        <van-button
          class="backup-btn"
          :disabled="isRecovering"
          @click="toBackupMark">{{ $t('owner.backupBtn') }}</van-button>
      </div>
    </div>
    </template>
    <!--确认弹窗-->
    <ConfirmDialog
      v-model="confirmShow"
      :title="confirmTitle"
      :secondTitle="confirmSecondTitle"
      :content="confirmContent"
      @confirm="handleConfirm"/>
    <!--操作反馈弹窗-->
    <FeedbackDialog
      v-model="feedbackShow"
      :type="feedbackType"
      :title="feedbackTitle"
      :content="feedbackContent"/>
  </div>
</template>
<script>
import ConfirmDialog from './components/ConfirmDialog.vue'
import FeedbackDialog from './components/FeedbackDialog.vue'

export default {
  name: 'backup',
  components: {
    ConfirmDialog,
    FeedbackDialog
  },
  data() {
    return {
      loading: false,
      backupList: [],
      confirmShow: false,
      confirmTitle: '',
      confirmSecondTitle: '',
      confirmContent: '',
      feedbackShow: false,
      feedbackType: '',
      feedbackTitle: '',
      feedbackContent: '',
      opType: '', // recover delete
      isRecovering: false, // 是否正在恢复数据
      currentBackup: {} // 当前操作备份
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    toBackupMark() {
      this.$router.push({
        name: 'backupMark'
      })
    },
    // 获取备份数据列表
    getBackupList() {
      this.loading = true
      this.http.getBackupList().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.backupList = this.formatData(res.data.backups || [])
      }).catch(() => {
        this.loading = false
      })
    },
    // 格式化数据
    formatData(list) {
      return list.map((item) => {
        const logDate = this.$methods.getTime(item.created_at, 'YY-MM-DD')
        const logTime = this.$methods.getTime(item.created_at, 'hh:mm')
        item.logDate = logDate
        item.logTime = logTime
        item.disabled = false
        return item
      })
    },
    // 处理恢复
    handleRecover(item) {
      if (item.disabled) {
        return
      }
      this.opType = 'recover'
      this.confirmTitle = this.$t('global.recover')
      this.confirmSecondTitle = this.$t('owner.backupConfirmSecTitle')
      this.confirmContent = this.$t('owner.backupConfirmContent')
      this.currentBackup = item
      this.confirmShow = true
    },
    // 处理删除
    handleDelete(item) {
      if (item.disabled) {
        return
      }
      this.opType = 'delete'
      this.confirmTitle = this.$t('global.del')
      this.confirmSecondTitle = this.$t('owner.backupDelSecTitle')
      this.confirmContent = ''
      this.currentBackup = item
      this.confirmShow = true
    },
    // 处理确定回调
    handleConfirm() {
      // 恢复确定
      if (this.opType === 'recover') {
        this.recoverBackup()
      } else if (this.opType === 'delete') {
        this.deleteBackup()
      }
    },
    // 恢复数据处理
    recoverBackup() {
      // 处理ui显示
      this.backupList.forEach((item) => {
        if (item.file_name === this.currentBackup.file_name) {
          item.disabled = false
        } else {
          item.disabled = true
        }
      })
      // 发送请求
      const params = {
        file_name: this.currentBackup.file_name
      }
      this.isRecovering = true
      this.http.recoverBackup(params).then((res) => {
        const date = this.$methods.getTime(this.currentBackup.created_at, 'YY-MM-DD hh:mm')
        if (res.status === 0) {
          // 成功回调
          this.feedbackType = 'success'
          this.feedbackTitle = this.$t('owner.recoverSuccess')
          this.feedbackContent = `${this.$t('owner.backupDate')}：${date}`
          this.backupSuccess()
        } else {
          // 失败回调
          this.feedbackType = 'fail'
          this.feedbackTitle = this.$t('owner.recoverFail')
          this.feedbackContent = `${this.$t('owner.backupDate')}：${date}`
          this.backupList.forEach((item) => { item.disabled = false })
          this.isRecovering = false
          this.feedbackShow = true
        }
      }).catch(() => {
        this.isRecovering = false
      })
    },
    // 恢复成功回调
    backupSuccess() {
      // 轮询调用接口判断sa是否重启成功
      setTimeout(() => {
        this.http.getSaVersionInfo().then((res) => {
          if (res.status === 0) {
            this.backupList.forEach((item) => { item.disabled = false })
            this.isRecovering = false
            this.feedbackShow = true
          }
        }).catch(() => {
          this.backupSuccess()
        })
      }, 8000)
    },
    // 删除备份处理
    deleteBackup() {
      const params = {
        file_name: this.currentBackup.file_name
      }
      this.http.deleteBackup(params).then((res) => {
        if (res.status !== 0) {
          return
        }
        // 删除列表数据
        const index = this.backupList.findIndex(item => item.file_name === this.currentBackup.file_name)
        this.backupList.splice(index, 1)
        this.$toast(this.$t('global.delSuccess'))
      })
    }
  },
  created() {
    this.getBackupList()
  }
}
</script>
<style lang="scss" scoped>
.title {
  padding: 0.3rem;
  font-size: 0.24rem;
  color: #94a5be;
}
.backup-item {
  padding: 0.3rem;
  background: #fff;
  margin-bottom: 0.2rem;
  .top {
    display: flex;
    align-items: center;
    .left {
      padding-right: 0.3rem;
      font-size: 0.52rem;
      color: #3f4663;
      height: 0.46rem;
      border-right: 1PX solid #eee;
    }
    .center {
      align-self: flex-end;
      padding-left: 0.28rem;
      font-size: 0.18rem;
      color: #3f4663;
    }
    .right {
      flex: 1;
      text-align: right;
    }
    .op-btn {
      display: inline-block;
      margin-left: 0.6rem;
      font-size: 0.28rem;
      color: #2da3f6;
    }
    .btn-disabled {
      color: #94a5be;
    }
    .btn-icon {
      display: inline-block;
      vertical-align: top;
      margin-right: 0.15rem;
    }
  }
  .backup-detail {
    padding-top: 0.13rem;
    line-height: 0.44rem;
    font-size: 0.24rem;
    color: #3f4663;
    text-align: justify;
    span {
      font-weight: bold;
    }
  }
}
.backup-btn-placeholder {
  height: 1.6rem;
}
.backup-btn-box {
  padding: 0.3rem 0;
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.backup-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
