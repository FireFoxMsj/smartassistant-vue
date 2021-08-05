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
        <div
          v-for="item in typeList"
          :key="item.value"
          class="tab-item"
          :class="{ 'tab-item--active': type === item.value }"
          @click="handleType(item)">
          <p>{{ item.name }}</p>
        </div>
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
            <template v-if="isRepeat" #right-icon>
              <van-checkbox :name="item.value" ref="checkboxes">
                <template #icon="props">
                  <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                </template>
              </van-checkbox>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <van-button class="sure-btn" @click="handleSure">确定</van-button>
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
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: this.value,
      activeIcon,
      inactiveIcon,
      result: [],
      type: 'repeat', // repeat 重复 one 仅一次
      typeList: [
        {
          value: 'repeat',
          name: '重复'
        },
        {
          value: 'one',
          name: '仅一次'
        }
      ],
      weekList: [
        {
          value: 1,
          name: '周一'
        },
        {
          value: 2,
          name: '周二'
        },
        {
          value: 3,
          name: '周三'
        },
        {
          value: 4,
          name: '周四'
        },
        {
          value: 5,
          name: '周五'
        },
        {
          value: 6,
          name: '周六'
        },
        {
          value: 0,
          name: '周日'
        }
      ]
    }
  },
  computed: {
    isRepeat() {
      return this.type === 'repeat'
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
        this.result = this.week.split('').map(val => val - 0)
      })
    },
    // 处理类型
    handleType(type) {
      this.type = type.value
    },
    toggle(index) {
      if (!this.isRepeat) {
        return
      }
      this.$refs.checkboxes[index].toggle()
    },
    handleSure() {
      if (this.type === 'repeat') {
        let name = ''
        const res = this.result.sort((a, b) => a - b)
        const resStr = res.join('')
        if (res.length === 7) {
          name = '每天'
        } else if (resStr === '06') {
          name = '周末'
        } else if (resStr === '12345') {
          name = '周一至周五'
        } else {
          res.forEach((val) => {
            const day = this.weekList.find(week => week.value === val)
            name += `${day.name}，`
          })
        }
        name = name.replace(/，$/, '')
        this.$emit('onSure', resStr, name)
      } else {
        this.$emit('onSure', '', '仅一次')
      }
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
.tab-item {
  position: relative;
  display: inline-block;
  font-size: 0.32rem;
  font-weight: bold;
  color: #94a5be;
  margin-right: 0.55rem;
}
.tab-item--active {
  color: #3f4663;
}
.tab-item--active:after {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.18rem;
  content: "";
  width: 0.4rem;
  height: 0.06rem;
  background: #2da3f6;
  border-radius: 0.03rem;
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
