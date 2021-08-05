<template>
  <div class="guide">
    <van-nav-bar
      :title="$t('credentialsGuide.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="container">
      <div class="connect">
        <p class="content pdb50">{{ $t('credentialsGuide.tip') }}</p>
        <p class="sec-title pdb25">{{ $t('credentialsGuide.stepTitle1') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/credentials-step-1.png"/></p>
        <p class="sec-title pdb25">{{ $t('credentialsGuide.stepTitle2') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/credentials-step-2.png"/></p>
        <p class="sec-title pdb25">{{ $t('credentialsGuide.stepTitle3') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/credentials-step-3.png"/></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'guideScene',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    toCreateScene() {
      this.$router.push({
        name: 'setScene'
      })
    },
    wakeUp() {
      this.$router.push({ name: 'creatScene' })
    },
    office() {
      this.$router.push({ name: 'creatScene' })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 0.3rem;
}
.pdb25 {
  padding-bottom: 0.25rem;
}
.pdb30 {
  padding-bottom: 0.3rem;
}
.pdb40 {
  padding-bottom: 0.4rem;
}
.pdb50 {
  padding-bottom: 0.5rem;
}
.pdb60 {
  padding-bottom: 0.6rem;
}
.pdb80 {
  padding-bottom: 0.8rem;
}
.title {
  font-size: 0.36rem;
  font-weight: bold;
  color: #3F4663;
}
.sec-title {
  position: relative;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.sec-title:before {
  content: '';
  position: absolute;
  top: -0.02rem;
  left: -0.08rem;
  width: 0.22rem;
  height: 0.22rem;
  background: #3F4663;
  opacity: 0.2;
  border-radius: 50%;
}
.content {
  font-size: 0.28rem;
  color: #3F4663;
  line-height: 0.48rem;
}
</style>
