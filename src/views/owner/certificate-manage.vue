<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('owner.certificate')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="content">
      <p class="tip-word">{{ $t('owner.certificateTip') }}</p>
      <div class="set-box">
        <div
          v-for="item in setList"
          :key="item.value"
          class="set-item"
          @click="handleSet(item)">
          <div class="left">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.desc }}</p>
          </div>
          <div
            class="check-icon"
            :class="{ 'checked': item.checked }"></div>
        </div>
      </div>
    </div>
    <div class="finish-btn-placeholder">
      <div class="finish-btn-box">
        <p class="word">{{ $t('owner.certificateSetTip') }}</p>
        <van-button class="finish-btn">{{ $t('global.finish') }}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'powerManage',
  data() {
    return {
      setList: [
        {
          value: 1,
          title: this.$t('owner.certificateTitle1'),
          desc: this.$t('owner.certificateDesc1'),
          checked: false
        },
        {
          value: 2,
          title: this.$t('owner.certificateTitle2'),
          desc: this.$t('owner.certificateDesc2'),
          checked: true
        }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    handleSet(set) {
      this.setList.forEach((item) => {
        item.checked = false
      })
      set.checked = true
    }
  }
}
</script>
<style lang="scss" scoped>
.tip-word {
  padding: 0.16rem 0.3rem;
  font-size: 0.24rem;
  font-weight: bold;
  color: #94A5be;
  line-height: 1.5;
}
.set-item {
  display: flex;
  align-items: center;
  padding: 0.38rem 0.3rem;
  background: #fff;
  border-bottom: 1PX solid #eee;
  .left {
    flex: 1;
  }
  .title {
    padding-bottom: 0.15rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3f4663;
  }
  .desc {
    font-size: 0.22rem;
    font-weight: bold;
    color: #94a5be;
  }
  .check-icon {
    width: 0.37rem;
    height: 0.37rem;
    background-image: url(../../assets/uncheck-icon.png);
    background-size: 100% 100%;
  }
  .checked {
    background-image: url(../../assets/check-icon.png);
  }
}
.finish-btn-placeholder {
  height: 2.2rem;
}
.finish-btn-box {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  padding: 0.3rem;
  text-align: center;
  .word {
    padding-bottom: 0.35rem;
    font-size: 0.22rem;
    color: #94a5be;
  }
}
.finish-btn {
  width: 6.9rem;
  height: 1rem;
  background: #2da3f6;
  border-radius: 0.2rem;
  color: #fff;
}
</style>
