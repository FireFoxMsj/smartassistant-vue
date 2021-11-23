<template>
  <div class="plugin-detail">
    <van-nav-bar
      :title="$t('plugindetail.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="plugin-part">
        <div class="plugin-item">
          <div class="item-top clearfix">
            <span class="name one-line">{{ pluginInfo.name }}</span>
            <van-loading
              v-show="isInstall"
              color="#1989fa"
              size="0.4rem"
              class="float-r"/>
            <div class="float-r" v-show="!isInstall && !isInsert">
              <span v-if="!pluginInfo.is_added" class="op-btn" @click.stop="install">{{ $t('global.add') }}</span>
              <span v-else class="op-btn" @click.stop="handleDelBtn">{{ $t('global.del') }}</span>
              <span v-if="!pluginInfo.is_newest && pluginInfo.is_added" class="op-btn mgl20" @click.stop="install">{{ $t('global.update') }}</span>
            </div>
          </div>
          <p class="version">{{ $t('plugindetail.version') }}v{{ pluginInfo.version }}</p>
          <p class="desc" v-html="pluginInfo.info"></p>
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
  name: 'pluginDetail',
  data() {
    return {
      pluginId: '',
      pluginInfo: {},
      sureShow: false,
      isInstall: false,
      deleteTip: '', // 删除提示
      msgId: 1, // 安装消息id
      updateMsgId: 1, // 更新消息id
      loading: false
    }
  },
  computed: {
    ...mapGetters(['isInsert']),
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取插件详情
    getPluginDetail() {
      this.loading = true
      this.http.getPluginDetail(this.pluginId).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.pluginInfo = res.data.plugin
        this.pluginInfo.info = res.data.plugin.info.replace(/\n/g, '<br/>')
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加插件
    install() {
      const plugins = [this.pluginInfo.id]
      const params = {
        plugins
      }
      this.isInstall = true
      this.http.installPlugin(this.pluginInfo.brand, params).then((res) => {
        this.isInstall = false
        if (res.status !== 0) {
          return
        }
        this.pluginInfo.is_added = true
        this.pluginInfo.is_newest = true
      }).catch(() => {
        this.isInstall = false
      })
    },
    // 点击删除按钮
    handleDelBtn() {
      let res = ''
      const plugin = this.pluginInfo
      res = plugin.name
      res = res.replace(/、$/, '')
      this.deleteTip = `${this.$t('branddetail.delContent1')}${res}${this.$t('branddetail.delContent2')}`
      this.sureShow = true
    },
    deletePlugin() {
      this.isInstall = true
      this.http.deleteCreatPlugin(this.pluginInfo.id).then((res) => {
        this.isInstall = false
        if (res.status !== 0) {
          return
        }
        this.pluginInfo.is_added = false
        // 删除成功提示
        this.$toast(this.$t('global.delSuccess'))
      }).catch(() => {
        this.isInstall = false
      })
    }
  },
  created() {
    const { query } = this.$route
    this.pluginId = query.pluginId
    if (this.pluginId) {
      this.getPluginDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
.mgl20 {
  margin-left: 0.2rem;
}
.plugin-part {
  background: #ffffff;
  box-shadow: 0 0 0.2rem 0 rgba(21, 21, 21, 0.1);
  border-radius: 0.2rem;
  margin: 0.15rem 0.3rem;
}
.plugin-item {
  padding: 0.3rem 0;
  margin: 0 0.4rem;
  border-bottom: 1PX solid #eeeeee;
}
.item-top {
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
