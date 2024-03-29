<template>
  <div class="device-detail">
    <van-nav-bar
      v-show="titleShow"
      :title="$t('deviceDetail.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="onClicRight">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="canSet" #right>
        <van-icon
          name="setting-o" color="#3F4663" size="0.36rem"/>
      </template>
    </van-nav-bar>
    <!-- sa设备 -->
    <div v-if="isSa">
      <div class="sa-box">
        <CommonImage
          class="sa-img"
          :src="saInfo.logo_url"
          fit="contain"/>
        <p class="one-line">{{ saInfo.name }}</p>
      </div>
      <div class="plugin-op" v-if="opList.length>0">
        <div
          v-for="item in opList"
          :key="item.value"
          class="op-item"
          @click="handleOp(item)">
          <span>{{ item.name }}</span>
          <van-icon name="arrow" class="right-icon"/>
        </div>
      </div>
    </div>
    <div v-else class="plugin-html">
      <!--loading模块-->
      <Loading v-show="loading"></Loading>
      <!--嵌入插件详情页-->
      <iframe
        v-show="!isSa"
        id="insert"
        name="insert"
        class="iframe"
        :class="{ 'full-height': !titleShow, 'opacity': loading }"></iframe>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const menu = require('../../assets/menu.png')

export default {
  name: 'deviceDetail',
  data() {
    return {
      menu,
      id: '',
      isSa: false,
      pluginUrl: '',
      loading: false,
      titleShow: true, // 是否显示标题
      deviceInfo: {},
      saInfo: {}
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo']),
    canSet() {
      if (this.deviceInfo.permissions) {
        return this.deviceInfo.permissions.update_device || this.deviceInfo.permissions.delete_device
      }
      return false
    },
    opList() {
      const arr = []
      const softwarePower = 'sa_firmware_upgrade'
      const firmwarePower = 'sa_software_upgrade'
      if (this.userInfo.is_owner) {
        arr.push({
          value: 'powerManage',
          name: this.$t('deviceDetail.power')
        })
      }
      if (this.permissions[softwarePower]) {
        arr.push({
          value: 'softwareUpgrade',
          name: this.$t('deviceDetail.softwareUpgrade')
        })
      }
      if (this.permissions[firmwarePower]) {
        arr.push({
          value: 'firmwareUpgrade',
          name: this.$t('deviceDetail.update')
        })
      }
      return arr
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 处理sa设备操作
    handleOp(item) {
      // 处理逻辑
      if (item.value === 'powerManage') {
        this.$router.push({
          name: 'powerManage'
        })
      } else if (item.value === 'softwareUpgrade') {
        this.$router.push({
          name: 'softwareUpgrade'
        })
      } else if (item.value === 'firmwareUpgrade') {
        // this.$router.push({
        //   name: 'firmwareUpgrade'
        // })
        this.$toast.loading('开发中...')
      }
    },
    // 获取设备详情
    initData() {
      this.http.getDeviceDetail(this.id).then((res) => {
        if (res.status !== 0) {
          return
        }
        const { device_info: deviceInfo } = res.data
        this.deviceInfo = deviceInfo || {}
        // 设置iframe地址
        this.setPlugin()
      }).catch(() => {
        this.setPlugin()
      })
    },
    // 设置插件地址
    setPlugin() {
      // 替换插件连接地址设备名称（修复修改设备名称无法更新问题）
      const { name } = this.deviceInfo
      const pluginUrl = name ? this.pluginUrl.replace(/name=[^&]*/, `name=${name}`) : this.pluginUrl
      const iframe = document.querySelector('#insert') || {}
      iframe.src = decodeURIComponent(pluginUrl)
      // 接受子级message
      window.addEventListener('message', this.receiMessage, false)
      this.loading = true
      iframe.onload = () => {
        this.loading = false
      }
    },
    onClicRight() {
      // 去设备设置页面
      this.$router.push({
        name: 'deviceManage',
        query: {
          id: this.id,
          isSa: this.isSa
        }
      })
    },
    // 接受消息
    receiMessage(msg) {
      if (msg.data.op === 'setTitle') {
        // 查看通知详情
        this.titleShow = msg.data.value.isShow
      }
    }
  },
  mounted() {
    const {
      deviceId,
      isSa,
      pluginUrl
    } = this.$route.query
    this.id = deviceId
    this.initData()
    if (`${isSa}` === 'true') {
      // sa设备不走外链
      this.isSa = true
      const saInfo = this.$methods.getSession('sa')
      this.saInfo = saInfo ? JSON.parse(saInfo) : {}
      return
    }
    // 设置插件详情页面
    this.pluginUrl = pluginUrl
  }
}
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: calc(100vh - 0.98rem);
}
.full-height {
  height: calc(100vh - 0.04rem);
}
.opacity {
  opacity: 0;
}
.sa-box {
  padding: 0.62rem;
  text-align: center;
  p {
    font-size: 0.32rem;
    color: #3F4663;
  }
}
.plugin-op {
  border-top: 0.2rem solid #f6f8fd;
}
.op-item {
  display: flex;
  align-items: center;
  padding: 0.37rem 0.3rem;
  background: #fff;
  border-bottom: 1PX solid #eee;
  span {
    flex: 1;
    width: 6.04rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3F4663;
  }
}
.sa-img {
  width: 2.6rem;
  height: 2.6rem;
}
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
.condition-item{
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: .3rem .3rem;
  overflow: hidden;
  background-color: #fff;
  border-bottom: 1px solid #EEEEEE;
  cursor: pointer;
  .item-name{
    flex: 1;
  }
  .item-desc{
    font-weight: 500;
    color: #94A5BE;
  }
  .revise{
    width: .4rem;
  }
}
.condition-item-bottom{
  padding: .3rem .3rem;
  text-align: center;
}
.switch-wrap {
  position: relative;
  .close-btn {
    font-weight: bold;
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
  }
  .title {
    padding: 0.4rem 0.3rem;
    font-weight: bold;
    font-size: 0.32rem;
    color: #3F4663;
    position: relative;
  }
  .switch-title{
    color: #94A5BE;
  }
  .switch-title.active{
    color: #2DA3F6;
  }
}
</style>
