<template>
  <div class="code-input-main">
    <input
      class="code-input"
      ref="codeInput"
      @focus="focus"
      @blur="blur"
      type="text" v-model="code"
      maxlength="8"
      :data-value="`${code}`"
      onkeyup="value=value.replace(/\s+/g, '')">
    <van-password-input
      :class="`item-${code.length}`"
      gutter=".3rem"
      :length="codeLength"
      :value="code"
      :focused="showKeyboard"
      :mask="false"
      :error-info="errorInfo"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'kitCode',
  props: {
    codeLength: {
      default: 6,
      type: Number
    }
  },
  data() {
    return {
      showKeyboard: false,
      code: '',
      errorInfo: '',
      queryData: {},
      msgId: ''
    }
  },
  computed: {
    ...mapGetters(['websocket']),
  },
  watch: {
    code(code) {
      this.$refs.codeInput.focus()
      this.code = this.code.replace(/\s+/g, '')
      if (code.length === 8) {
        this.autoRequest(code)
      }
    }
  },
  methods: {
    focus() {
      this.showKeyboard = true
    },
    blur() {
      this.showKeyboard = false
    },
    // 进行home-kit码匹配
    autoRequest(code) {
      // 发送发现指令
      this.msgId = Date.now()
      this.websocket.send({
        id: this.msgId,
        domain: 'homekit',
        service: 'set_attributes',
        identity: this.queryData.identity,
        service_data: {
          attributes: [
            {
              attribute: 'pin',
              instance_id: this.queryData.instance_id,
              val: code
            }
          ]
        }
      })
      // 接受消息
      this.websocket.onmessage((data) => {
        const msg = JSON.parse(data)
        if (msg.id === this.msgId) {
          if (msg.success) {
            // 跳转至设备详情页
            setTimeout(() => {
              // 跳转至设备详情页
              this.$router.push({
                name: 'deviceConnect',
                query: this.queryData
              })
            }, 1000)
          } else {
            this.errorInfo = '设置失败'
          }
        }
      })
    }
  },
  mounted() {
    this.queryData = this.$route.query
    // this.$nextTick(() => {
    //   this.$refs.codeInput.focus()
    // })
  }
}
</script>
<style lang="scss" scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }

  .code-input-main {
    position: relative;
  }

  .code-input {
    height: .8rem;
    width: 100%;
    position: absolute;
    z-index: 9999;
    border: none;
    outline: none;
    color: transparent;
    background-color: transparent;
    text-shadow: 0 0 0 transparent;
    opacity: 0;
  }
</style>
<style scoped>
  .van-password-input >>> .van-password-input__security{
    height: .8rem;
  }
  .van-password-input >>> .van-password-input__item{
    width: .6rem;
    background: #FFFFFF;
    border: .02rem solid #CCCCCC;
    border-radius: 8px;
    text-align: center;
    font-size: .4rem;
    color: #3F4663;
    font-weight: 700;
  }
  .van-password-input >>> .van-password-input__error-info {
    text-align: left;
  }
  .van-password-input >>> .van-password-input__item--focus{
    border-color: #2DA3F6;
  }
  .van-password-input >>> .van-password-input__item--focus .van-password-input__cursor{
    background-color: #2DA3F6;
  }
  .van-password-input .item-1 >>> .van-password-input__item:nth-child(1){
    border-color: #2DA3F6;
  }
  .van-password-input .item-2 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-2 >>> .van-password-input__item:nth-child(2){
    border-color: #2DA3F6;
  }
  .van-password-input .item-3 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-3 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-3 >>> .van-password-input__item:nth-child(3){
    border-color: #2DA3F6;
  }
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-4 >>> .van-password-input__item:nth-child(4){
    border-color: #2DA3F6;
  }
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-5 >>> .van-password-input__item:nth-child(5){
    border-color: #2DA3F6;
  }
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(5),
  .van-password-input .item-6 >>> .van-password-input__item:nth-child(6){
    border-color: #2DA3F6;
  }
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(5),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(6),
  .van-password-input .item-7 >>> .van-password-input__item:nth-child(7){
    border-color: #2DA3F6;
  }
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(1),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(2),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(3),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(4),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(5),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(6),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(7),
  .van-password-input .item-8 >>> .van-password-input__item:nth-child(8){
    border-color: #2DA3F6;
  }
</style>
