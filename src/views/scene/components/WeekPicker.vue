<template>
  <van-popup
    v-model="show"
    round
    position="bottom"
    @open="initData">
    <div class="wrap">
      <van-icon
        name="cross"
        size="0.18rem"
        color="#3F4663"
        class="close-btn"
        @click="show = false"/>
      <div class="title">
        {{ $t('effectiveTime.customize') }}
      </div>
      <van-checkbox-group v-model="result">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in weekList"
            clickable
            :key="item.value"
            @click="toggle(index)">
            <template #title>
              <span class="name one-line">{{ item.name }}</span>
            </template>
            <template #right-icon>
              <van-checkbox :name="item.value" ref="checkboxes">
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-checkbox>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <van-button class="sure-btn" @click="handleSure">{{ $t('global.confirm') }}</van-button>
    </div>
  </van-popup>
</template>
<script>
const activeIcon = require('@/assets/check-box-icon.png')
const inactiveIcon = require('@/assets/uncheck-box-icon.png')

export default {
  name: 'weekPicker',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    week: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      show: this.value,
      activeIcon,
      inactiveIcon,
      result: this.week,
      weekList: [
        {
          value: 1,
          name: this.$t('effectiveTime.monday')
        },
        {
          value: 2,
          name: this.$t('effectiveTime.tuesday')
        },
        {
          value: 3,
          name: this.$t('effectiveTime.wednesday')
        },
        {
          value: 4,
          name: this.$t('effectiveTime.thursday')
        },
        {
          value: 5,
          name: this.$t('effectiveTime.friday')
        },
        {
          value: 6,
          name: this.$t('effectiveTime.saturday')
        },
        {
          value: 7,
          name: this.$t('effectiveTime.sunday')
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.show = val
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    initData() {
      setTimeout(() => {
        this.result = this.week
      })
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    handleSure() {
      let name = ''
      const res = this.result.sort((a, b) => a - b)
      res.forEach((val) => {
        const day = this.weekList.find(week => week.value === val)
        name += `${day.name}，`
      })
      name = name.replace(/，$/, '')
      this.$emit('on-sure', res, name)
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  padding: 0 0.3rem;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.32rem;
  font-weight: bold;
  color: #3F4663;
}
.close-btn {
  position: absolute;
  z-index: 9;
  top: 0.3rem;
  right: 0.3rem;
  font-weight: bold;
}
.name {
  float: left;
  max-width: 6rem;
  font-size: 0.28rem;
  color: #3F4663;
}
.img-icon {
  height: 0.37rem;
}
.sure-btn {
  width: 6.9rem;
  height: 1rem;
  background: #F6F8FD;
  border: 0;
  border-radius: 0.2rem;
  margin: 0.2rem 0.3rem;
  color: #3F4663;
}
</style>
