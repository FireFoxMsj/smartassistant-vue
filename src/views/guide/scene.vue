<template>
  <div class="guide">
    <van-nav-bar
      :title="$t('sceneGuide.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="pdb30"><img width="100%" src="../../assets/guide-scene-1.png"/></div>
    <div class="container">
      <div class="connect">
        <p class="title pdb40">{{ $t('sceneGuide.stepTitle1') }}</p>
        <p class="sec-title pdb30">{{ $t('sceneGuide.step1') }}</p>
        <p class="content pdb80">{{ $t('sceneGuide.explain1') }}</p>
        <p class="sec-title pdb30">{{ $t('sceneGuide.step2') }}</p>
        <p class="content pdb40">{{ $t('sceneGuide.explain2') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/guide-scene-2.png"/></p>
        <p class="content pdb40">{{ $t('sceneGuide.explain3') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/guide-scene-3.png"/></p>
        <p class="content pdb40">{{ $t('sceneGuide.explain4') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/guide-scene-4.png"/></p>
        <p class="content pdb40">{{ $t('sceneGuide.explain5') }}</p>
        <p class="pdb60"><img width="100%" src="../../assets/guide-scene-5.png"/></p>
        <p class="content pdb40">{{ $t('sceneGuide.explain6') }}</p>
        <p><img width="100%" src="../../assets/guide-scene-6.png"/></p>
      </div>
    </div>
    <div
      v-if="permissions.add_scene"
      style="height:1.6rem;">
      <div class="create-btn-box">
        <van-button
          block
          class="create-btn"
          @click="toCreateScene"
          color="#2DA3F6">
          {{ $t('sceneGuide.create') }}
        </van-button>
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
.content {
  font-size: 0.28rem;
  color: #3F4663;
  line-height: 0.48rem;
}
.how-creat{
  border-radius: .2rem;
  border: 1px solid #EEEEEE;
  margin-bottom: .3rem;
  overflow: hidden;
}
.how-creat .intro-text{
  padding: .2rem .3rem;
}
.how-creat h2{
  font-size: .28rem;
  font-weight: bold;
  color: #3F4663;
  margin-bottom: .2rem;
}
.how-creat p{
  font-size: .24rem;
  font-weight: 400;
  color: #3F4663;
  line-height: .36rem;
}
.create-btn-box {
  width: 100%;
  max-width: 750px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem .3rem;
  background: #ffffff;
}
.create-btn {
  height: 1rem;
  font-size: 0.28rem;
  text-align: center;
  border-radius: .2rem;
}
</style>
