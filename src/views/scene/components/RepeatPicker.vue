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
      </div>
      <van-radio-group
        v-model="active">
        <van-cell-group>
          <van-cell
            v-for="pick in pickList"
            :key="pick.value"
            clickable
            @click="pickChange(pick)">
            <template #title>
              <p class="radio-title" :class="{ 'radio-active': active === pick.value }">
                <span class="radio-name one-line float-l">
                  {{ pick.name }}
                </span>
              </p>
            </template>
            <template #right-icon>
              <van-radio :name="pick.value">
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-radio>
              <!-- <van-radio :name="role.id" checked-color="#2DA3F6"/> -->
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-popup>
</template>
<script>
const activeIcon = require('@/assets/check-icon.png')
const inactiveIcon = require('@/assets/uncheck-icon.png')

export default {
  name: 'RepeatPicker',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      show: this.value,
      active: this.type,
      activeIcon,
      inactiveIcon,
      pickList: [
        {
          value: 1,
          name: this.$t('effectiveTime.everyDay')
        },
        {
          value: 2,
          name: this.$t('effectiveTime.week')
        },
        {
          value: 3,
          name: this.$t('effectiveTime.customize')
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
      this.active = this.type
    },
    pickChange(pick) {
      this.active = pick.value
      this.$emit('on-change', pick)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  position: relative;
}
.close-btn {
  position: absolute;
  z-index: 9;
  top: 0.3rem;
  right: 0.3rem;
  font-weight: bold;
}
.title {
  height: 1rem;
}
.radio-title {
  font-size: 0.28rem;
  color: #94A5BE;
}
.radio-active {
  color: #2DA3F6;
}
.radio-name {
  max-width: 6rem;
}
.img-icon {
  height: 0.37rem;
}
</style>
