<template>
  <div class="device-detail">
    <van-nav-bar
      :title="$t('devicedetail.title')"
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
    <div v-if="isSa" class="sa-box">
      <CommonImage
        class="sa-img"
        :src="saInfo.logo_url"
        fit="contain"/>
      <p class="one-line">{{ saInfo.name }}</p>
    </div>
    <!--loading模块-->
    <Loading v-show="loading"></Loading>
    <!--嵌入插件详情页-->
    <iframe v-show="!loading" id="insert" class="iframe"></iframe>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'deviceDetail',
  data() {
    return {
      id: '',
      isSa: false,
      loading: false,
      deviceInfo: {},
      saInfo: {}
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    canSet() {
      if (this.deviceInfo.permissions) {
        return this.deviceInfo.permissions.update_device || this.deviceInfo.permissions.delete_device
      }
      return false
    },
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取设备详情
    initData() {
      this.http.getDeviceDetail(this.id).then((res) => {
        if (res.status !== 0) {
          return
        }
        const { device_info: deviceInfo } = res.data
        this.deviceInfo = deviceInfo || {}
      })
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
    // const baseUrl = window.location.origin // 'http://sa.zhitingtech.com'
    // const url = `${baseUrl}/plugins/${pluginId}/html?device_id=${deviceId}`
    const iframe = document.querySelector('#insert')
    iframe.src = pluginUrl
    // const iDoc = iframe.contentDocument
    // const el = iDoc.createElement('script')
    // el.text = 'console.log("你都发few偶")'
    // el.src = 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js'
    // iDoc.body.appendChild(el)
    this.loading = true
    iframe.onload = () => {
      this.loading = false
      // console.log(iDoc === document.querySelector('#insert').contentDocument)
    }
  }
}
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: calc(100vh - 46px);
}
.sa-box {
  padding: 0.62rem;
  text-align: center;
  p {
    font-size: 0.32rem;
    color: #3F4663;
  }
}
.sa-img {
  width: 2.6rem;
  height: 2.6rem;
}
</style>
