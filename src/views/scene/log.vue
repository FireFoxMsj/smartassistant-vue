<template>
  <div class="execution-log">
    <van-nav-bar
      :title="$t('sceneLog.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="intLoading"></Loading>
    <div v-else-if="isEmpty" class="empty-box">
      <div class="empty-wrap">
        <van-image :src="emptyImg" class="empty-img"/>
        <p class="empty-word">{{ $t('sceneLog.empty') }}</p>
      </div>
    </div>
    <template v-else>
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="10"
        :immediate-check="false"
        :finished-text="finishedText"
        @load="onLoad">
        <div :ref="index" class="detail-box" v-for="(item,index) in logsList" :key="index">
          <van-sticky :container="$refs.index">
            <div class="month"><span class="number">{{item.month}}</span><span class="unit">{{$t('global.month')}}</span></div>
          </van-sticky>
          <ul class="log-timeline">
            <li class="timeline-item">
              <div class="timeline-item-tail"></div>
              <div class="timeline-item-node"></div>
              <div class="timeline-item-wrapper"></div>
            </li>
            <li class="timeline-item" v-for="(item1,index1) in item.items" :key="index1">
              <div class="timeline-item-tail"></div>
              <div class="timeline-item-node"></div>
              <div class="timeline-item-wrapper">
                <van-collapse v-model="item.activeNames" :border="false">
                  <van-collapse-item :border="false" :name="index1" :disabled="item1.result===1 || item1.items.length===0">
                    <template #title>
                      <div class="timeline-item-title">{{item1.name}}</div>
                      <div class="timeline-item-timestamp" :class="[item1.result===2?'warning':item1.result===3?'danger':'']">
                        {{$methods.getTime(item1.finished_at, 'MMDD hh:mm')}}
                        <span class="operation-status">
                      {{item1.result===1?$t('sceneLog.executeSuccess'):
                      item1.result===3?$t('sceneLog.executeFail'):
                      item1.result===2?$t('sceneLog.executePartialSuccess'):
                      item1.result===6?$t('sceneLog.deviceBroken'):
                      item1.result===5?$t('sceneLog.deviceDelete'):
                      item1.result===4?$t('sceneLog.executeTimeout'):
                      item1.result===7?$t('sceneLog.sceneDelete'):''}}
                      </span>
                      </div>
                    </template>
                    <div class="collapse-content" v-for="(item2,index2) in item1.items" :key="index2">
                      <div class="collapse-content-title">
                        <div class="title">{{item2.name}}</div>
                        <p class="content">{{item2.location_name}}</p>
                      </div>
                      <div class="collapse-content-status" :class="[item2.result===2?'warning':(item2.result===3 || item2.result===2 || item2.result===6 || item2.result===5 || item2.result===4 || item2.result===7)?'danger':'']">
                        {{item2.result===1?$t('sceneLog.executeSuccess'):
                        item2.result===3?$t('sceneLog.executeFail'):
                        item2.result===2?$t('sceneLog.executePartialSuccess'):
                        item2.result===6?$t('sceneLog.deviceBroken'):
                        item2.result===5?$t('sceneLog.deviceDelete'):
                        item2.result===4?$t('sceneLog.executeTimeout'):
                        item2.result===7?$t('sceneLog.sceneDelete'):''}}</div>
                    </div>
                  </van-collapse-item>
                </van-collapse>
              </div>
            </li>
            <li class="timeline-item">
              <div class="timeline-item-node"></div>
            </li>
          </ul>
        </div>
      </van-list>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const emptyImg = require('../../assets/empty-log.png')

export default {
  components: {},
  name: 'sceneLog',
  data() {
    return {
      intLoading: false,
      logsList: [],
      emptyImg,
      finished: false,
      finishedText: '没有更多了',
      size: 40,
      start: 0,
      total: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    isEmpty() {
      return this.logsList.length === 0
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onLoadInitList(params) {
      this.http.logsList(params).then((res) => {
        if (res.status !== 0) {
          return
        }
        if (res.data.length === 0 || !res.data) {
          this.finished = true
          this.finishedText = '触摸到底线了'
          return
        }
        const logsList = res.data
        logsList.forEach((item) => {
          const itemType = item
          itemType.month = this.getMonth(itemType.date)
          itemType.activeNames = []
        })
        if (logsList[0].date === this.logsList[this.logsList.length - 1].date) {
          const tempList = logsList[0].items
          this.logsList[this.logsList.length - 1].items = this.logsList[this.logsList.length - 1].items.concat(tempList)
          const list = logsList.slice(1)
          this.logsList = this.logsList.concat(list)
        } else {
          this.logsList = this.logsList.concat(logsList)
        }
        this.loading = false
      })
    },
    // 下拉异步更新数据
    onLoad() {
      this.start = this.start + 1
      this.onLoadInitList({ size: this.size, start: this.start * this.size })
    },
    // 初始化列表
    initList(params) {
      this.intLoading = true
      this.http.logsList(params).then((res) => {
        this.intLoading = false
        if (res.status !== 0) {
          return
        }
        const logsList = res.data
        logsList.forEach((item) => {
          const itemType = item
          itemType.month = this.getMonth(itemType.date)
          itemType.activeNames = []
        })
        this.logsList = logsList || []
      }).catch(() => {
        this.intLoading = false
      })
    },
    // 获取月份
    getMonth(date) {
      const arr = date.split('-')
      return arr[1]
    }
  },
  created() {
    this.initList({ size: this.size, start: this.start * this.size })
  }
}
</script>
<style lang="scss" scoped>
.execution-log {
  min-height: 100vh;
  background: #ffffff;
}
.detail-box {
  margin-top: 1px;
  overflow: hidden;
}
.nav-edit {
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.month{
  font-weight: bold;
  color: #3F4663;
  padding: .2rem .3rem;
  background: #f6f8fd;
  margin-bottom: .3rem;
}
.month .number{
  font-size: .48rem;
}
.month .unit{
  font-size: .28rem;
}
.log-timeline{
  padding: 0 .3rem;
}
.timeline-item{
  position: relative;
  padding-bottom: .4rem;
}
.timeline-item-tail{
  position: absolute;
  left: .05rem;
  height: 100%;
  border-left: .02rem solid #e4e7ed;
}
.timeline-item-node{
  position: absolute;
  background-color: #e4e7ed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  left: -.06rem;
  width: .24rem;
  height: .24rem;
}
.log-timeline .timeline-item:nth-last-child(2){
  padding-bottom: 0;
}
.log-timeline .timeline-item:first-of-type .timeline-item-node,.log-timeline .timeline-item:last-of-type .timeline-item-node{
  width: .1rem;
  height: .1rem;
  left: 0.01rem;
}
.timeline-item-wrapper {
  position: relative;
  padding-left: .2rem;
  top: -.1rem;
}
.timeline-item-title{
  font-weight: bold;
  color: #3F4663;
}
.timeline-item-timestamp{
  font-size: .24rem;
  font-weight: 500;
  color: #3F4663;
}
.timeline-item-timestamp.warning{
  color: #F3A934;
}
.timeline-item-timestamp.danger{
  color: #FF0000;
}
.timeline-item-timestamp .operation-status{
  margin-left: .3rem;
}
.collapse-content{
  position: relative;
  display: flex;
  width: 100%;
  overflow: hidden;
  padding-bottom: .3rem;
  background-color: #fff;
  margin-bottom: .2rem;
}
.collapse-content:last-of-type{
  margin-bottom: 0;
  border-bottom: 1px solid #ebedf0;
}
.collapse-content-title{
  flex: 1;
  .title{
    font-weight: bold;
    color: #3F4663;
  }
  .content{
    color: #94A5BE;
    font-size: .24rem;
  }
}
.collapse-content-status{
  color: #3F4663;
  font-size: .24rem;
}
.collapse-content-status.danger{
  color: #FF0000;
}
.collapse-content-status.warning{
  color: #F3A934;
}

.empty-box {
  display: flex;
  height: calc(100vh - 0.92rem);
  justify-content: center;
  align-items: center;
}
.empty-wrap {
  text-align: center;
}
.empty-img {
  width: 2rem;
  height: 0.77rem;
}
.empty-word {
  padding: 0.15rem 0 0.73rem 0;
  color: #94A5BE;
}
.empty-btn {
  width: 3rem;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.08rem;
  color: #fff;
}
</style>
<style scoped>
  .timeline-item >>> .van-collapse-item__content{
    padding-bottom: 0;
  }
  .timeline-item:nth-last-child(2) .collapse-content:last-of-type{
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .log-timeline >>> .van-collapse-item .van-cell{
    padding: 0;
    padding-left: .3rem;
  }
  .log-timeline >>> .van-collapse-item__title--disabled .van-cell__right-icon{
    display: none;
  }
</style>
