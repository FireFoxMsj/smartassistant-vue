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
    <div class="block">
      <h3 class="backup-msg">{{ $t('owner.backupLocation') }}</h3>
      <h3 class="backup-msg">{{ $t('owner.backupData') }}</h3>
    </div>
    <div class="mark-box">
      <h3 class="mark">{{ $t('owner.backupBtn') }}：</h3>
      <van-field
        v-model="markMessage"
        class="text-border"
        rows="9"
        type="textarea"
        :placeholder="$t('owner.backupMarkPlaceholder')"
        :maxlength="255"
        :show-word-limit="true"/>
    </div>
    <p class="tip">{{ $t('owner.backupMarkTip') }}</p>
    <div class="backup-btn-placeholder">
      <div class="backup-btn-box">
        <van-button class="backup-btn" @click="handleBackup">{{ $t('owner.backupStart') }}</van-button>
      </div>
    </div>
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
    <!--进度弹窗-->
    <ProgressDialog
      ref="progress"
      v-model="progressShow"
      :title="progressTitle"
      :content="progressContent"/>
  </div>
</template>
<script>
import ConfirmDialog from './components/ConfirmDialog.vue'
import ProgressDialog from './components/ProgressDialog.vue'
import FeedbackDialog from './components/FeedbackDialog.vue'

export default {
  name: 'backupMark',
  components: {
    ConfirmDialog,
    ProgressDialog,
    FeedbackDialog
  },
  data() {
    return {
      markMessage: '',
      confirmShow: false,
      confirmTitle: '',
      confirmSecondTitle: '',
      confirmContent: '',
      progressShow: false,
      progressTitle: '',
      progressContent: '',
      feedbackShow: false,
      feedbackType: '',
      feedbackTitle: '',
      feedbackContent: ''
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 处理备份按钮
    handleBackup() {
      this.confirmTitle = this.$t('owner.backupBtn')
      this.confirmSecondTitle = this.$t('owner.backupMarkSecTitle')
      this.confirmContent = this.$t('owner.backupMarkContent')
      this.confirmShow = true
    },
    // 处理确定回调
    handleConfirm() {
      this.progressTitle = this.$t('owner.backingUp')
      this.progressContent = `${this.$t('owner.backupNeedTime')}<br/>${this.$t('owner.backupTime')}：2021-10-13  17:22`
      this.progressShow = true
      this.createBackup()
    },
    // 备份数据
    createBackup() {
      const params = {
        note: this.markMessage
      }
      this.http.createBackup(params).then((res) => {
        const now = Date.now() / 1000
        const date = this.$methods.getTime(now, 'YY-MM-DD hh:mm')
        if (res.status === 0) {
          this.feedbackType = 'success'
          this.feedbackTitle = this.$t('owner.backupSuccess')
          this.feedbackContent = `${this.$t('owner.backupDate')}：${date}`
          this.backupSuccess()
        } else {
          this.feedbackType = 'fail'
          this.feedbackTitle = this.$t('owner.backupFail')
          this.feedbackContent = `${this.$t('owner.backupDate')}：${date}<br/>${this.$t('owner.backupFailReason')}：${res.reason}`
          this.progressShow = false
          this.feedbackShow = true
        }
      })
    },
    // 备份成功回调
    backupSuccess() {
      // 轮询调用接口判断sa是否重启成功
      setTimeout(() => {
        this.http.getSaVersionInfo().then((res) => {
          if (res.status === 0) {
            this.markMessage = ''
            this.$refs.progress.done()
            this.progressShow = false
            this.feedbackShow = true
          }
        }).catch(() => {
          this.backupSuccess()
        })
      }, 8000)
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  padding: 0 0.3rem;
  background: #fff;
  margin-top: 0.2rem;
}
.mark-box {
  padding: 0.3rem;
  background: #fff;
  margin-top: 0.2rem;
}
.backup-msg {
  padding: 0.35rem 0;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3f4663;
  border-bottom: 1PX solid #eee;
}
.backup-msg:last-child {
  border-bottom: 0;
}
.mark {
  padding-bottom: 0.4rem;
  font-size: 0.28rem;
  color: #3f4663;
  font-weight: bold;
}
.text-border {
  border: 1PX solid #ddd;
  border-radius: 0.08rem;
}
.tip {
  padding: 0.3rem;
  font-size: 0.24rem;
  color: #ff0000;
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
