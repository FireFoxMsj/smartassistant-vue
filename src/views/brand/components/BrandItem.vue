<template>
  <div class="brand-item" @click="toDetail">
    <CommonImage
      width="0.8rem"
      height="0.8rem"
      radius="0.2rem"
      :src="brand.logo_url"/>
    <div class="mgs-part">
      <p class="name">{{ brand.name }}</p>
      <p class="num">{{ $t('brandsupport.total') }}{{ brand.plugin_amount }}{{ $t('brandsupport.plugin') }}</p>
    </div>
    <div class="status clearfix">
      <van-loading
        v-if="brand.isInstall"
        color="#1989fa"
        size="0.4rem"
        class="float-r"/>
      <div v-else>
        <button v-if="!brand.is_added" @click.stop="installAll" class="op-btn">{{ $t('global.add') }}</button>
        <button v-else-if="!brand.is_newest" @click.stop="updateAll" class="op-btn">{{ $t('global.update') }}</button>
        <span v-else class="added">{{ $t('brandsupport.added') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'brandItem',
  props: {
    brand: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['websocket'])
  },
  methods: {
    toDetail() {
      this.$router.push({
        name: 'brandDetail',
        query: {
          id: this.brand.name
        }
      })
    },
    // 全部添加
    installAll() {
      this.brand.isInstall = true
      this.brand.plugins.forEach((plugin) => {
        if (!plugin.is_added) {
          this.install(plugin)
        }
      })
      this.$emit('onClick', this.brand)
    },
    // 更新全部
    updateAll() {
      this.brand.isInstall = true
      this.brand.plugins.forEach((plugin) => {
        if (!plugin.is_newest && plugin.is_added) {
          this.update(plugin)
        }
      })
      this.$emit('onClick', this.brand)
    },
    // 添加插件
    install(plugin) {
      plugin.installId = this.$methods.getId() - 0
      this.sendCommand(plugin.installId, 'install', plugin.id)
    },
    // 更新插件
    update(plugin) {
      plugin.updateId = this.$methods.getId() - 0
      this.sendCommand(plugin.updateId, 'update', plugin.id)
    },
    // 发送操作指令
    sendCommand(id, service, pluginId) {
      this.websocket.send({
        id,
        domain: 'plugin',
        service,
        service_data: {
          plugin_id: pluginId
        }
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
}
.mgs-part {
  width: 4.78rem;
  margin-left: 0.32rem;
  .name {
    padding-bottom: 0.14rem;
    font-size: 0.28rem;
    color: #3F4663;
  }
  .num {
    font-size: 0.24rem;
    color: #94A5BE;
  }
}
.status {
  width: 1.2rem;
  text-align: center;
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
.added {
  font-size: 0.28rem;
  color: #94A5BE;
}
</style>
