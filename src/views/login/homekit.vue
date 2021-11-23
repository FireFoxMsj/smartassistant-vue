<template>
  <div class="home-kit">
    <van-nav-bar
      title="Homekit设置代码"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
    </van-nav-bar>
    <div class="kit-info">
      <div class="kit-code">
          <van-image
            width="2.8rem"
            height="1.3rem"
            :src="kitCode"
          />
        </div>
      <div class="kit-title">输入HomeKit设置代码</div>
      <div class="kit-text">请在包装或配件上查找8位设置代码</div>
    </div>
    <kit-code :code-length="8"></kit-code>
  </div>
</template>
<script>
import KitCode from '../../components/KitCode.vue'

const kitCode = require('../../assets/home-kit-code.png')

export default {
  name: 'homeKit',
  data() {
    return {
      kitCode,
      queryData: {},
    }
  },
  components: {
    'kit-code': KitCode
  },
  computed: {},
  watch: {},
  methods: {
    onClickLeft() {
      this.$router.push({
        name: 'deviceDiscover',
        query: {
          areaId: this.queryData.areaId
        }
      })
    }
  },
  mounted() {
    if (this.$route.query) {
      this.queryData = this.$route.query
    }
  }
}
</script>
<style lang="scss" scoped>
  .kit-info{
    padding: .5rem 0;
    .kit-code{
      text-align: center;
      margin-bottom: .3rem;
    }
    .kit-title{
      text-align: center;
      font-size: .4rem;
      font-weight: bold;
      color: #3F4663;
      margin-bottom: .2rem;
    }
    .kit-text{
      font-size: .24rem;
      font-weight: 400;
      color: #3F4663;
      text-align: center;
    }
  }
</style>
<style scoped>
  >>> .van-nav-bar .van-icon{
    color: #3F4663;
  }
</style>
