<template>
  <div class="brand-box">
    <div v-if="type=== 'system'" class="brand-item" @click="toDetail(brand, 'brand')">
      <CommonImage
        width="0.8rem"
        height="0.8rem"
        radius="0.2rem"
        :src="brand.logo_url"/>
      <div class="mgs-part">
        <p class="name">{{ brand.name }}</p>
      </div>
    </div>
    <div v-else class="creat-brand-box">
      <div class="creat-brand-item" @click="toDetail(brand, 'plugin')">
        <div class="mgs-part">
          <p class="name">{{ brand.name }} <span v-if="brand.build_status === -1" class="status-text">{{ $t('brandsupport.addFail') }}</span></p>
        </div>
        <div class="status clearfix">
          <van-loading
          v-if="brand.build_status===0"
          color="#1989fa"
          size="0.4rem"
          class="float-r"/>
          <div v-else>
            <van-button class="op-btn" :loading="isInstall"  @click.stop="handDelete(brand)">{{ $t('global.del') }}</van-button>
          </div>
        </div>
      </div>
      <div v-if="brand.info" class="introduce three-line">{{brand.info}}</div>
    </div>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="sureShow"
      show-cancel-button
      @confirm="sureDelete"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <p class="delete-tip">{{ deleteTip }}</p>
    </van-dialog>
  </div>
</template>
<script>
export default {
  name: 'brandItem',
  props: {
    brand: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'system'
    }
  },
  data() {
    return {
      sureShow: false,
      deleteTip: '', // 删除提示
      currentPlugin: {},
      isInstall: false
    }
  },
  methods: {
    toDetail(params, type) {
      if (type === 'brand') {
        this.$router.push({
          name: 'brandDetail',
          query: {
            brand: this.brand.name,
          }
        })
      } else {
        if (params.build_status === -1 || params.build_status === 0) {
          return
        }
        this.$router.push({
          name: 'pluginDetail',
          query: {
            pluginId: params.id
          }
        })
      }
    },
    // 全部添加/更新
    installAll(isUpdate = false) {
      const plugins = []
      this.brand.isInstall = true
      this.brand.plugins.forEach((plugin) => {
        if (isUpdate) {
          if (!plugin.is_newest && plugin.is_added) {
            plugins.push(plugin.id)
          }
        } else if (!plugin.is_added) {
          plugins.push(plugin.id)
        }
      })
      this.install(this.brand.name, plugins)
    },
    // 添加插件
    install(brand, plugins) {
      const params = {
        plugins
      }
      this.http.installPlugin(brand, params).then((res) => {
        this.brand.isInstall = false
        if (res.status !== 0) {
          return
        }
        const successPlugins = res.data.success_plugins || []
        // 如果全部插件安装成功
        if (plugins.length === successPlugins.length) {
          this.brand.is_added = true
          this.brand.is_newest = true
        }
        // 更新插件状态
      }).catch(() => {
        this.brand.isInstall = false
      })
    },
    // 删除插件
    handDelete(brand) {
      this.currentPlugin = brand
      if (brand.build_status === -1) {
        this.sureDelete()
      } else {
        let res = ''
        res = brand.name.replace(/、$/, '')
        this.deleteTip = `${this.$t('branddetail.delContent1')}${res}${this.$t('branddetail.delContent2')}`
        this.sureShow = true
      }
    },
    sureDelete() {
      // this.brandList.splice(this.brandList.indexOf(item), 1)
      this.isInstall = true
      this.http.deleteCreatPlugin(this.currentPlugin.id).then((res) => {
        this.isInstall = false
        if (res.status !== 0) {
          return
        }
        // 删除成功提示
        this.$toast(this.$t('global.delSuccess'))
        this.$emit('update')
      }).catch(() => {
        this.isInstall = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.brand-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 0.01rem solid #eeeeee;
  .mgs-part {
    flex: 1;
    margin-left: 0.32rem;
    .name {
      padding-bottom: 0.14rem;
      font-size: 0.28rem;
      color: #3F4663;
      font-weight: 700;
    }
    .num {
      font-size: 0.24rem;
      color: #94A5BE;
    }
  }
  .op-btn {
    padding: 0;
    width: 1rem;
    height: 0.6rem;
    background: $bgColor;
    border-radius: 0.08rem;
    font-size: 0.28rem;
    color: #2DA3F6;
  }
}
.creat-brand-box{
  padding: 0.3rem 0;
  border-bottom: 0.01rem solid #eeeeee;
  overflow: hidden;
  .creat-brand-item{
    display: flex;
    align-items: center;
    .mgs-part{
      flex: 1;
      .name {
        padding-bottom: 0.14rem;
        font-size: 0.28rem;
        color: #3F4663;
        font-weight: 700;
        position: relative;
        .status-text{
          display: inline-block;
          border: 1px solid #ee0a24;
          border-radius: .04rem;
          padding: 2px 4px;
          color: #ee0a24;
          font-size: .22rem;
        }
      }
    }
    .op-btn {
      padding: 0;
      height: 0.6rem;
      border-radius: 0.08rem;
      padding: 0 .1rem;
      font-size: 0.28rem;
      color: #2DA3F6;
      background-color: transparent;
      border: none;
    }
  }
}
.status {
  width: 1.2rem;
  text-align: right;
}
.added {
  font-size: 0.28rem;
  color: #94A5BE;
}
.introduce{
  font-size: .24rem;
  font-weight: 400;
  color: #3F4663;
  padding-top: .1rem;
  line-height: .36rem;
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
<style scoped>
#app .brand-box >>> .van-button__text {
  font-weight: normal;
}
</style>
