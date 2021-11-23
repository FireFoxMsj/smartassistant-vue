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
              <span v-if="!plugin.is_added" class="op-btn" @click.stop="unstallSingle(plugin)">{{ $t('global.add') }}</span>
              <span v-else class="op-btn" @click.stop="handleDelBtn(plugin)">{{ $t('global.del') }}</span>
              <span v-if="!plugin.is_newest && plugin.is_added" class="op-btn mgl20" @click.stop="unstallSingle(plugin)">{{ $t('global.update') }}</span>
            </div>
          </div>
          <p class="version">{{ $t('branddetail.version') }}v{{ plugin.version }}</p>
          <p class="desc three-line" v-html="plugin.info"></p>
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
      loading: false,
      brandName: '',
      type: ''
    }
  },
  computed: {
    ...mapGetters(['isInsert']),
    pluginList() {
      return this.detailData.plugins || []
    },
    deviceList() {
      return this.detailData.support_devices || []
    }
  },
  methods: {
    initData(brandName) {
      this.loading = true
      this.http.getBrandDetail(brandName).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { data } = res
        const { brand } = data
        if (brand.plugins) {
          brand.plugins.forEach((plugin) => {
            plugin.info = plugin.info.replace(/\n/g, '<br/>')
            plugin.isInstall = false
          })
        }
        this.detailData = brand
      })
    },
    // 全部添加/更新
    installAll(isUpdate = false) {
      const plugins = []
      this.pluginList.forEach((plugin) => {
        if (!isUpdate) {
          if (!plugin.is_added) {
            plugin.isInstall = true
            plugins.push(plugin.id)
          }
        } else if (!plugin.is_newest && plugin.is_added) {
          plugin.isInstall = true
          plugins.push(plugin.id)
        }
      })
      this.install(plugins)
    },
    // 添加/更新单个插件
    unstallSingle(plugin) {
      const plugins = [plugin.id]
      plugin.isInstall = true
      this.install(plugins)
    },
    // 添加插件
    install(plugins) {
      const params = {
        plugins
      }
      this.http.installPlugin(this.brandName, params).then((res) => {
        if (res.status !== 0) {
          return
        }
        const successPlugins = res.data.success_plugins || []
        // 如果全部插件安装成功
        this.pluginList.forEach((plugin) => {
          plugin.isInstall = false
          if (successPlugins.includes(plugin.id)) {
            plugin.is_added = true
            plugin.is_newest = true
          }
        })
      }).catch(() => {
        this.pluginList.forEach((plugin) => {
          plugin.isInstall = false
        })
      })
    },
    // 点击删除按钮
    handleDelBtn(plugin) {
      console.log(plugin)
      let res = ''
      this.currentPlugin = plugin
      res = plugin.name.replace(/、$/, '')
      this.deleteTip = `${this.$t('branddetail.delContent1')}${res}${this.$t('branddetail.delContent2')}`
      this.sureShow = true
    },
    deletePlugin() {
      const plugins = [this.currentPlugin.id]
      const params = {
        plugins
      }
      this.http.deletePlugin(this.brandName, params).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.currentPlugin.is_added = false
        // 删除成功提示
        this.$toast(this.$t('global.delSuccess'))
      })
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
    const { brand } = this.$route.query
    const { type } = this.$route.query
    this.brandName = brand
    this.type = type
    this.initData(brand)
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
  word-break: break-word;
}
.delete-tip{
  padding: .4rem .3rem;
  line-height: .6rem;
}
</style>
