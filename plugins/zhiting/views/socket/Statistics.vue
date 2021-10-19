<template>
  <div class="wrapper">
    <div class="top">
      <div class="nav">
        <van-icon
          name="arrow-left"
          class="arrow-icon"
          @click="pageBack"/>
        <h3 class="nav-title">电量统计</h3>
      </div>
      <div class="tabs">
        <button
          v-for="item in typeList"
          :key="item.value"
          class="tab-item"
          :class="{ 'active': item.value === type }"
          @click="handleType(item)">{{ item.name }}</button>
      </div>
      <div class="big-view">
        <p class="val">
          <countTo :startVal="0" :endVal="currentData.value" :duration="1000"/>
          <span class="unit">度</span>
        </p>
        <p class="date">{{ currentData.bigDate }}用电</p>
      </div>
    </div>
    <div class="chart-box">
      <p class="unit">单位：度(kw/h)</p>
      <div ref="chartWrapper" class="chart-wrapper">
        <div
          v-for="item in staticList"
          :key="item.time"
          class="chart-item"
          :class="{ 'chart-active': item.time === currentData.time }"
          @click="showBig(item)">
          <div class="align-box">
            <p class="val">{{ item.value }}</p>
            <div
              class="pillar"
              :style="{ height: item.height }"></div>
            <p class="date">{{ item.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
import { formatDate } from '../../utils/index'

export default {
  name: 'statistics',
  components: {
    countTo
  },
  data() {
    return {
      type: 'day', // day 每日 month 每月
      typeList: [
        {
          value: 'day',
          name: '每日'
        },
        {
          value: 'month',
          name: '每月'
        }
      ],
      currentData: {},
      useData: {
        daily_electric_use: [],
        monthly_electric_use: []
      }, // 统计数据
      staticList: []
    }
  },
  methods: {
    // 回到上一页
    pageBack() {
      this.$router.go(-1)
    },
    handleType(type) {
      this.type = type.value
      this.initStaticData()
    },
    showBig(date) {
      this.currentData = date
    },
    // 获取统计数据
    getUseData() {
      const identity = window.socketIdentity
      this.http.getElectricUse(identity).then((res) => {
        this.useData = res
        this.initStaticData()
      })
    },
    // 获取日 月 统计数据
    initStaticData() {
      if (this.type === 'day') {
        this.staticList = this.formatData(this.useData.daily_electric_use)
      } else if (this.type === 'month') {
        this.staticList = this.formatData(this.useData.monthly_electric_use)
      }
      // 高度动画
      setTimeout(() => {
        this.staticList.forEach((item) => {
          item.height = item.pillarHeight
        })
        this.$forceUpdate()
      })
      // 滚动条滚动到末尾位置
      this.$nextTick(() => {
        const { scrollWidth } = this.$refs.chartWrapper
        this.$refs.chartWrapper.scrollTo(scrollWidth, 0)
      })
    },
    // 处理柱状图长度
    formatData(list) {
      let max = 0
      const len = list.length - 1
      list.forEach((item) => {
        if (item.electric_use > max) {
          max = item.electric_use
        }
      })
      const res = list.map((item, index) => {
        item.value = item.electric_use
        item.date = formatDate(item.time, this.type)
        // 显示大日期
        if (this.type === 'day') {
          item.bigDate = item.date
        } else {
          const arr = item.date.split('\n')
          const year = arr[1]
          const month = arr[0]
          item.bigDate = `${year}.${month}`
        }
        // 最大值长度为2.9rem 然后算比例
        item.height = '0rem'
        item.pillarHeight = `${item.value / max * 2.9}rem`
        if (index === len) {
          // 最后一项
          this.currentData = item
          if (this.type === 'day') {
            item.date = '今天'
          }
        } else if (index === len - 1 && this.type === 'day') {
          // 倒数第二项
          item.date = '昨天'
        }
        return item
      })
      return res
    }
  },
  created() {
    const { query } = this.$route
    if (query.type) {
      this.type = query.type
    }
    this.getUseData()
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding-bottom: 0.2rem;
  min-height: 100vh;
  background: #f6f8fd;
}
.top {
  height: 6.98rem;
  background-image: url(../../assets/socket/static-bg.png);
  background-size: 100% 100%;
}
.nav {
  display: flex;
  padding: 0.3rem;
  color: #fff;
}
.arrow-left {
  font-size: 0.28rem;
}
.nav-title {
  width: 100%;
  font-size: 0.36rem;
  text-align: center;
}
.tabs {
  display: flex;
  justify-content: space-between;
  padding: 0.24rem 1.65rem 1.02rem 1.65rem;
}
.tab-item {
  width: 1.4rem;
  height: 0.6rem;
  background: #fff;
  opacity: 0.2;
  border-radius: 0.3rem;
  border: 0;
  font-size: 0.28rem;
  font-weight: bold;
  color: #48a3f3;
  text-align: center;
  transition: all 0.5s;
}
.active {
  opacity: 1;
}
.big-view {
  text-align: center;
  color: #fff;
  .val {
    font-size: 1.4rem;
    font-weight: bold;
    span {
      display: inline-block;
      font-weight: bold;
    }
    .unit {
      font-size: 0.28rem;
    }
  }
  .date {
    padding-top: 0.32rem;
    font-size: 0.32rem;
  }
}
.chart-box {
  box-sizing: border-box;
  padding: 0 0.25rem;
  width: 6.9rem;
  height: 5.4rem;
  background: #fff;
  border-radius: 0.2rem;
  margin: -1.24rem auto 0 auto;
  .unit {
    padding: 0.2rem 0 0.12rem 0;
    font-size: 0.2rem;
    color: #94a5be;
    text-align: right;
  }
  .chart-wrapper {
    width: 6.4rem;
    white-space: nowrap;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /*Firefox*/
    -ms-overflow-style:none; /*IE10+*/
  }
  .chart-item {
    display: inline-block;
    width: 0.9rem;
    height: 4.6rem;
    text-align: center;
    position: relative;
    .align-box {
      position: absolute;
      bottom: 0.12rem;
      width: 100%;
    }
    .val {
      margin-bottom: 0.1rem;
      font-size: 0.24rem;
      font-weight: bold;
      color: #3f4663;
    }
    .pillar {
      width: 0.2rem;
      height: 0rem;
      background: linear-gradient(185deg, #ff6093, #5a57e5);
      border-radius: 0.1rem;
      margin: 0 auto;
      transition: height 1s;
    }
    .date {
      padding-top: 0.23rem;
      font-size: 0.16rem;
      color: #94A5BE;
      white-space: pre;
    }
  }
  .chart-active {
    background: #f6f8fd;
    box-shadow: 0 0 0.2rem 0 #cadaef;
    border-radius: 0.08rem;
    transition: all 0.2s;
    .val {
      position: relative;
      display: inline-block;
      padding: 0.04rem;
      background: linear-gradient(143deg, #2c2958, #67649b);
      border-radius: 0.08rem;
      color: #fff;
    }
    .val:after {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -0.06rem;
      content: "";
      width: 0;
      height: 0;
      border-left: 0.06rem solid transparent;
      border-right: 0.06rem solid transparent;
      border-top: 0.06rem solid #67649b;
    }
  }
}
.chart-wrapper::-webkit-scrollbar{
  display: none; /*ChromeSafari*/
}
</style>
