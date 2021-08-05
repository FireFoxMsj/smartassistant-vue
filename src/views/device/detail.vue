<template>
  <div class="device-detail">
    <van-nav-bar
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
      <div class="plugin-op">
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
      <iframe v-show="!isSa && !loading" id="insert" class="iframe"></iframe>
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
      loading: false,
      deviceInfo: {},
      saInfo: {},
      opList: [
        {
          value: 'powerManage',
          name: this.$t('deviceDetail.power')
        },
        {
          value: 'firmwareUpgrade',
          name: this.$t('deviceDetail.update')
        }
      ]
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
    const iframe = document.querySelector('#insert')
    iframe.src = pluginUrl
    this.loading = true
    iframe.onload = () => {
      this.loading = false
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
