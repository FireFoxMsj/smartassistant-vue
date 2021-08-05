<template>
  <div>
  <van-popup
    v-model="show"
    class="update-wrap"
    position="bottom">
    <div class="wrapper-detail">
      <div class="main-box">
        <van-nav-bar
          title="固件升级"
          left-arrow
          :fixed="true"
          :placeholder="true"
          @click-left="onClickLeft">
        </van-nav-bar>
        <div class="custom-box">
          <div class="image">
            <img src="../switch/assets/update-firmware.png" alt="">
          </div>
          <p class="description">当前版本：{{version.val}}</p>
        </div>
        <div class="update-btn-box">
          <van-button type="danger" color="#2da3f6" block @click="dialogShow = true">检查更新</van-button>
        </div>
      </div>
    </div>
  </van-popup>
  <van-dialog class="update-info-dialog" v-model="dialogShow" title="" :showConfirmButton="false">
    <div class="update-info-box">
      <div class="rocket"><img src="../switch/assets/rocket.png" alt=""></div>
      <h2>检查更新</h2>
      <p class="description">检查到有新版本2.0.6-2054，是否更新？</p>
      <div class="update-btn">
        <van-button round color="#2da3f6" block @click="update()">更新</van-button>
      </div>
    </div>
    <div class="close-btn" @click="dialogShow = false">
      <van-icon name="cross" />
    </div>
  </van-dialog>
  </div>
</template>

<script>

export default {
  name: 'updatePopup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    pluginInfo: {
      type: Object,
      default: () => {}
    },
    ws: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      loading: false,
      dialogShow: false,
      instanceInfo: this.pluginInfo,
      wsData: null
    }
  },
  computed: {
    version() {
      if (this.instanceInfo) {
        return this.instanceInfo.attributes.filter(x => x.attribute === 'version')[0]
      }
      return ''
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onClickLeft() {
      this.show = false
    },
    update() {
      this.$bus.$emit('update')
    },
    getUpdateInfo(data) {
      this.$toast.loading({
        message: '固件更新中...',
        forbidClick: true,
        duration: 119000
      })
      setTimeout(() => {
        this.$toast.clear()
        if (data) {
          if (data.success) {
            // this.$toast({ message: '当前已是最新版本', className: 'toasts' })
            this.$toast({ message: '固件升级成功', className: 'toasts' })
          } else {
            this.$toast({ message: '获取更新信息失败', className: 'toasts' })
          }
        } else {
          this.$toast({ message: '固件升级失败', className: 'toasts' })
        }
      }, 120000)
    }
  },
  mounted() {
    this.$bus.$on('handleMessage', (val) => {
      this.getUpdateInfo(val)
    })
  }
}
</script>
<style scoped>
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
</style>

<style>
  .toasts{
    width: 6rem;
    height: 1rem;
    background-color: rgba(0,0,0,.8);
  }
</style>
