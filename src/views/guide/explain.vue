<template>
  <div class="wrap">
    <div class="back-placeholder">
      <div class="back">
        <van-icon
          name="arrow-left"
          size="0.3rem"
          color="#3F4663"
          @click="backStep"/>
      </div>
    </div>
    <div class="container">
      <div class="brand">
        <p class="title icon pdb25">{{ $t('third.duTitle') }}<p>
        <p class="content gray">{{ $t('third.duconnect') }}</p>
      </div>
      <div class="connect">
        <p class="title pdb40">{{ $t('third.duTitle') }}</p>
        <p class="sec-title pdb30">{{ $t('third.duStep1') }}</p>
        <p class="content pdb80">{{ $t('third.duexplain1') }}</p>
        <p class="sec-title pdb30">{{ $t('third.duStep2') }}</p>
        <p class="content pdb30">{{ $t('third.duexplain2') }}</p>
        <p class="content pdb30">{{ $t('third.duexplain3') }}</p>
        <p class="content pdb40">{{ $t('third.duexplain4') }}</p>
        <p class="pdb80"><img width="100%" src="../../assets/xiaodu-step-1.png"/></p>
        <p class="sec-title pdb30">{{ $t('third.duStep3') }}</p>
        <p class="content pdb40">{{ $t('third.duexplain5') }}</p>
        <p class="pdb50"><img width="100%" src="../../assets/xiaodu-step-2.png"/></p>
        <p class="content pdb40">{{ $t('third.duexplain6') }}</p>
        <p class="pdb50"><img width="100%" src="../../assets/xiaodu-step-3.png"/></p>
        <p class="content pdb30">{{ $t('third.duexplain7') }}</p>
        <p class="pdb80"><img width="100%" src="../../assets/xiaodu-step-4.png"/></p>
        <p class="title pdb40">{{ $t('third.duStep4') }}</p>
        <p class="sec-title pdb30">{{ $t('third.duexplain8') }}</p>
        <p class="content pdb30">{{ $t('third.duexplain9') }}</p>
        <p class="content pdb80">{{ $t('third.duexplain10') }}</p>
        <p class="sec-title pdb30">{{ $t('third.duexplain11') }}</p>
        <p class="content pdb30">{{ $t('third.duexplain12') }}</p>
        <p class="content pdb30">{{ $t('third.duexplain13') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'thirdExplain',
  data() {
    return {}
  },
  methods: {
    backStep() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.back-placeholder {
  height: 0.75rem;
}
.back {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  width: 100%;
  max-width: 7.5rem;
  padding: 0.2rem 0.34rem;
  background: #fff;
}
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
.pdb80 {
  padding-bottom: 0.8rem;
}
.brand {
  padding-bottom: 0.85rem;
}
.title {
  font-size: 0.36rem;
  font-weight: bold;
  color: #3F4663;
}
.icon:before {
  display: inline-block;
  content: '';
  width: 0.48rem;
  height: 0.36rem;
  background-size: 100% 100%;
  background-image: url(../../assets/xiaodu-icon.png);
  vertical-align: top;
  margin-right: 0.2rem;
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
  line-height: 0.36rem;
}
.gray {
  color: #94A5BE;
}
</style>
