<template>
  <div class="brand-detail">
    <van-nav-bar
      :title="$t('branddetail.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="brand-part">
        <div class="brand-msg clearfix">
          <CommonImage
            class="float-l"
            width="1rem"
            height="1rem"
            radius="0.2rem"
            :src="detailData.logo_url"/>
          <p class="brand-name two-line float-l">{{ detailData.name }}</p>
          <template>
          <button
              v-if="!detailData.is_added"
              class="op-btn float-r"
              @click="installAll">{{ $t('branddetail.addAll') }}</button>
            <button
              v-else-if="!detailData.is_newest"
              class="op-btn float-r"
              @click="updateAll">{{ $t('branddetail.updateAll') }}</button>
            <span
              v-else
              class="added float-r">{{ $t('branddetail.added') }}</span>
          </template>
        </div>
        <div
          v-for="plugin in pluginList"
          :key="plugin.id"
          class="plugin-item"
          @click="toPluginDetail(plugin)">
          <div class="item-top clearfix">
            <span class="name one-line">{{ plugin.name }}</span>
            <van-loading
              v-show="plugin.isInstall"
              color="#1989fa"
              size="0.4rem"
              class="float-r"/>
            <div class="float-r" v-show="!plugin.isInstall && !isInsert">
              <span v-if="!plugin.is_added" class="op-btn" @click.stop="install(plugin)">{{ $t('global.add') }}</span>
              <span v-else class="op-btn" @click.stop="handleDelBtn(plugin)">{{ $t('global.del') }}</span>
              <span v-if="!plugin.is_newest && plugin.is_added" class="op-btn mgl20" @click.stop="update(plugin)">{{ $t('global.update') }}</span>
            </div>
          </div>
          <p class="version">{{ $t('branddetail.version') }}{{ plugin.version }}</p>
          <p class="desc">{{ plugin.info }}</p>
        </div>
      </div>
      <div class="device-part">
        <p class="device-word">{{ $t('branddetail.supportTip') }}</p>
        <div class="device-list">
          <div
            v-for="device in deviceList"
            :key="device.name"
            class="device-item">
            <div class="device-pic">
              <CommonImage
                class="img"
                fit="contain"
                :src="device.logo_url"/>
            </div>
            <p class="device-name">{{ device.name }}</p>
          </div>
        </div>
      </div>
    </template>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="sureShow"
      show-cancel-button
      @confirm="deletePlugin"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <p class="delete-tip">{{ deleteTip }}</p>
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'brandDetail',
  data() {
    return {
      detailData: {},
      currentPlugin: {}, // 当前操作的插件
      sureShow: false,
      deleteTip: '', // 删除提示
      loading: false
    }
  },
  computed: {
    ...mapGetters(['websocket', 'isInsert']),
    pluginList() {
      return this.detailData.plugins || []
    },
    deviceList() {
      return this.detailData.support_devices || []
    }
  },
  methods: {
    initData(id) {
      this.loading = true
      this.http.getBrandDetail(id).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { data } = res
        const { brand } = data
        if (brand.plugins) {
          brand.plugins.forEach((plugin) => {
            plugin.isInstall = false
          })
        }
        this.detailData = brand
      })
    },
    // 全部添加
    installAll() {
      this.pluginList.forEach((plugin) => {
        if (!plugin.is_added) {
          this.install(plugin)
        }
      })
    },
    // 更新全部
    updateAll() {
      this.pluginList.forEach((plugin) => {
        if (!plugin.is_newest && plugin.is_added) {
          this.update(plugin)
        }
      })
    },
    // 添加插件
    install(plugin) {
      plugin.isInstall = true
      plugin.installId = this.$methods.getId() - 0
      this.websocket.send({
        id: plugin.installId,
        domain: 'plugin',
        service: 'install',
        service_data: {
          plugin_id: plugin.id
        }
      })
    },
    // 更新插件
    update(plugin) {
      plugin.isInstall = true
      plugin.updateId = this.$methods.getId() - 0
      this.websocket.send({
        id: plugin.updateId,
        domain: 'plugin',
        service: 'update',
        service_data: {
          plugin_id: plugin.id
        }
      })
    },
    // 点击删除按钮
    handleDelBtn(plugin) {
      let res = ''
      this.currentPlugin = plugin
      this.currentPlugin.support_devices.forEach((device) => {
        res += `${device.name}、`
      })
      res = res.replace(/、$/, '')
      this.deleteTip = `${this.$t('branddetail.delContent1')}${res}${this.$t('branddetail.delContent2')}`
      this.sureShow = true
    },
    deletePlugin() {
      // 删除插件
      this.websocket.send({
        id: 1,
        domain: 'plugin',
        service: 'remove',
        service_data: {
          plugin_id: this.currentPlugin.id
        }
      })
      this.currentPlugin.is_added = false
      // 删除成功提示
      this.$toast(this.$t('global.delSuccess'))
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    toPluginDetail(plugin) {
      this.$router.push({
        name: 'pluginDetail',
        query: {
          pluginId: plugin.id
        }
      })
    }
  },
  created() {
    const { id } = this.$route.query
    this.initData(id)
  },
  mounted() {
    this.websocket.onmessage((data) => {
      // 回调是否成功
      const msgJson = JSON.parse(data)
      const { success } = msgJson
      if (!success) {
        return
      }
      this.pluginList.forEach((plugin) => {
        // 如果是添加
        if (msgJson.id === plugin.installId) {
          plugin.isInstall = false
          plugin.is_added = true
          plugin.is_newest = true
        }
        // 如果是更新
        if (msgJson.id === plugin.updateId) {
          plugin.isInstall = false
          plugin.is_newest = true
        }
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.mgl20 {
  margin-left: 0.2rem;
}
.brand-part {
  background: #FFFFFF;
  box-shadow: 0 0 0.2rem 0 rgba(21, 21, 21, 0.1);
  border-radius: 0.2rem;
  margin: 0.15rem 0.3rem;
}
.brand-msg {
  padding: 0.4rem;
  border-bottom: 0.02rem solid #eeeeee;
  .op-btn {
    padding: 0;
    width: 1.4rem;
    height: 0.6rem;
    background: $bgColor;
    border-radius: 0.08rem;
    font-size: 0.28rem;
    color: #2DA3F6;
  }
  .added {
    font-size: 0.28rem;
    color: #94A5BE;
  }
}
.brand-name {
  width: 3.12rem;
  margin-left: 0.23rem;
  font-size: 0.28rem;
  line-height: 0.4rem;
  font-weight: bold;
  color: #3F4663;
  word-break: break-all;
}
.plugin-item {
  padding: 0.3rem 0;
  margin: 0 0.4rem;
  border-bottom: 1PX solid #eeeeee;
}
.plugin-item:last-child {
  border-bottom: 0;
}
.item-top {
  height: 0.4rem;
  .name {
    max-width: 4.2rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #3F4663;
  }
  .op-btn {
    font-size: 0.28rem;
    color: #2DA3F6;
  }
}
.version {
  padding-top: 0.12rem;
  font-size: 0.24rem;
  font-weight: bold;
  color: #94A5BE;
}
.desc {
  padding-top: 0.16rem;
  font-size: 0.24rem;
  line-height: 0.36rem;
  color: #3F4663;
}
.device-part {
  padding: 0.4rem 0.3rem;
}
.device-word {
  padding-bottom: 0.2rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.device-item {
  display: flex;
  align-items: center;
  padding: 0.2rem 0;
  border-bottom: 1PX solid #eeeeee;
}
.device-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  background: #FFFFFF;
  border: 1PX solid #eeeeee;
  border-radius: 0.08rem;
  .img {
    height: 0.8rem;
    max-width: 0.8rem;
  }
}
.device-name {
  font-size: 0.28rem;
  color: #3F4663;
  margin-left: 0.3rem;
}
.delete-tip {
  padding: 0.58rem 0.8rem;
  font-size: 0.28rem;
  font-weight: bold;
  line-height: 1.5;
  color: #3F4663;
  text-align: center;
}
</style>
