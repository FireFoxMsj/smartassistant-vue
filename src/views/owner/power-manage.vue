<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('owner.powerTitle')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="op-list">
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
</template>
<script>
export default {
  name: 'powerManage',
  data() {
    return {
      opList: [
        {
          value: 'certificateManage',
          name: this.$t('owner.certificate')
        },
        {
          value: 'log',
          name: this.$t('owner.log')
        },
        {
          value: 'backup',
          name: this.$t('owner.backup')
        }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    handleOp(item) {
      if (item.value === 'certificateManage') {
        this.$router.push({
          name: 'certificateManage'
        })
      } else if (item.value === 'log') {
        this.$router.push({
          name: 'log'
        })
      } else if (item.value === 'backup') {
        this.$router.push({
          name: 'backup'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.op-list {
  margin-top: 1PX;
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
    color: #3f4663;
  }
}
</style>
