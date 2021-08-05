<template>
  <div>
    <van-button class="bottom-operation" :icon="menu" @click="show = true"></van-button>
    <!-- 设备权限控制选择 -->
    <van-popup
      v-model="show"
      round
      position="bottom"
      class="action-condition">
      <div class="condition-box">
        <slot name="trigger"></slot>
        <div class="condition-item-bottom" @click="show = false">
          <van-icon size=".3rem" name="cross" />
        </div>
      </div>
    </van-popup>
    <!-- 估计升级检测 -->
    <UpdatePopup v-model="updateShow" :plugin-info="pluginInfo"></UpdatePopup>
  </div>
</template>

<script>
import UpdatePopup from './UpdatePopup.vue'

const menu = require('../switch/assets/menu.png')

export default {
  name: 'bottomMenu',
  components: {
    UpdatePopup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    pluginInfo: {
      type: Object,
      default: () => {}
    },
    ws: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      menu,
      show: false,
      loading: false,
      dialogShow: false,
      updateShow: false,
      triggerList: [],
    }
  },
  computed: {},
  watch: {
    list(list) {
      if (list.length > 0) {
        this.triggerList = list
      }
    }
  },
  methods: {
    // 固件升级
    handleUpdate() {
      this.updateShow = true
    },
    handleTrigger(params) {
      if (params.value === 0) {
        this.show = false
        this.switchShow = true
      } else if (params.value === 2) {
        this.correct = true
        setTimeout(() => {
          this.correct = false
        }, 2000)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .bottom-operation{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    background: #FFFFFF;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: .4rem .4rem 0px 0px;
    cursor: pointer;
  }
  .condition-item-bottom{
    padding: .3rem .3rem;
    text-align: center;
  }
  .update-wrap {
    width: 100%;
    height: 100%;
  }
  .wrapper-detail {
    height: 100%;
    padding: 0;
    background: #ffffff;
  }
  .main-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  >>> .van-nav-bar .van-icon,
  >>> .van-nav-bar__text {
    color: #1A2734;
  }
  .custom-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 1rem 0;
  }
  .custom-box img{
    width: 2.43rem;
    height: auto;
  }
  .custom-box .image{
    margin-bottom: .5rem;
  }
  .custom-box .description{
    font-weight: bold;
    font-size: .28rem;
    color: #3F4663;
  }

  .update-btn-box {
    padding: .2rem .3rem;
    margin-bottom: .5rem;
  }
  .update-btn-box .van-button{
    height: 1rem;
    border-radius: 0.2rem;
  }
  .update-info-dialog{
    background-color: transparent;
  }
  .update-info-box{
    width: 4.8rem;
    text-align: center;
    background-color: #ffffff;
    margin: 0 auto;
    border-radius: .32rem;
    padding: .3rem 0;
  }
  .update-info-box .rocket{
    text-align: center;
  }
  .update-info-box .rocket img{
    width: 2.73rem;
    height: auto;
  }
  .update-info-box h2{
    font-size: .4rem;
    font-weight: bold;
    color: #3F4663;
    margin: .24rem 0;
  }
  .update-info-box p{
    font-weight: bold;
    color: #3F4663;
    line-height: .4rem;
    padding: 0 .5rem;
    text-align: left;
  }
  .update-info-box .update-btn{
    padding: .2rem .4rem;
  }
  .close-btn{
    width: .48rem;
    height: .48rem;
    background-color: #ffffff;
    margin: 0 auto;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .3rem;
    margin-top: .8rem;
  }
  @media only screen and (min-width: 750px){
    .bottom-operation{
      width: 750px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>

<style scoped>
  .bottom-operation >>> .van-icon__image{
    width: .37rem;
    height: .25rem;
  }
</style>

<style>
  .toasts{
    width: 6rem;
    height: 1rem;
    background-color: rgba(0,0,0,.8);
  }
</style>
