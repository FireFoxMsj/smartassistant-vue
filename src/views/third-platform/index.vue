<template>
  <div class="third">
    <van-nav-bar
      :title="$t('third.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <div class="third-list">
      <div
        v-for="item in thirdList"
        :key="item.id"
        class="third-item clearfix"
        @click="toThirdExplain(item.id)">
        <span class="third-item--left-icon">
          <img :src="item.icon">
        </span>
        <span class="third-item--name one-line">{{ item.name }}</span>
        <van-icon name="arrow" class="third-item--icon"/>
      </div>
    </div>
  </div>
</template>
<script>
const duIcon = require('../../assets/xiaodu-icon.png')
const maoIcon = require('../../assets/tianmao-icon.png')

export default {
  name: 'third',
  data() {
    return {
      thirdList: [
        {
          id: 1,
          name: this.$t('third.du'),
          icon: duIcon
        },
        {
          id: 2,
          name: this.$t('third.tm'),
          icon: maoIcon
        }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    toThirdExplain(id) {
      this.$router.push({
        name: 'explainGuide',
        query: {
          id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.third {
  min-height: 100vh;
  background: $bgColor;
}
.third-list {
  margin-top: 1PX;
}
.third-item {
  display: flex;
  align-items: center;
  line-height: 1.1;
  padding: 0.34rem 0.3rem;
  height: 1rem;
  background: #fff;
  border-bottom: 0.01rem solid #eee;
}
.third-item--left-icon {
  width: 0.68rem;
  img {
    width: 0.38rem;
  }
}
.third-item--name {
  flex: 1;
  max-width: 6.5rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.third-item--right {
  color: #94A5BE;
}
.third-item--icon {
  font-size: 0.28rem;
  color: #ccc;
}
</style>
