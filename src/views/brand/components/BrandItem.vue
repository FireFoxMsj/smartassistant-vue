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
    <div class="status">
      <span v-if="brand.is_added" class="added">{{ $t('brandsupport.added') }}</span>
      <button v-else class="op-btn">{{ $t('global.add') }}</button>
      <button v-if="brand.is_added && !brand.is_newest" class="op-btn">{{ $t('global.update') }}</button>
      <van-circle
        v-if="false"
        v-model="currentRate"
        layer-color="#DDE5EB"
        color="#2DA3F6"
        size="0.6rem"
        stroke-width="100"
        :rate="30"
        :speed="100"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'brandItem',
  props: {
    brand: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentRate: 0
    }
  },
  methods: {
    toDetail() {
      this.$router.push({
        name: 'brandDetail',
        query: {
          id: this.brand.name
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
