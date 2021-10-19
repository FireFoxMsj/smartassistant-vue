<template>
  <div class="device" @scroll="scroll">
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
    <div class="header clearfix">
      <p>
        <span class="one-line float-l">{{ area.name }}</span>
        <!-- 注释：暂时单个家庭无需切换 -->
        <!-- <van-icon class="mgl25" name="arrow" size="0.4rem"/> -->
      </p>
      <van-icon
        v-if="permissions.add_device"
        @click="discover"
        class="add-icon float-r"
        name="add-o"
        size="0.48rem"
        color="#3F4663"/>
    </div>
    <!-- 弱网提示 -->
    <WeakNetwork v-if="isWeak" @on-retry="initList()"/>
    <!-- 没有家庭 -->
    <div v-if="!area.id && !isWeak" class="empty-area">
      <div class="empty-box">
        <img src="../../assets/empty.png"/>
        <p>{{ $t('global.empty') }}</p>
      </div>
    </div>
    <!-- 区域导航 -->
    <van-tabs
      v-show="locationList.length"
      v-model="activeLocation"
      sticky
      :background="tabBgColor"
      line-width="0.4rem"
      line-height="0.06rem"
      color="#2DA3F6"
      title-inactive-color="#94A5BE"
      title-active-color="#3F4663"
      @scroll="handleScroll"
      @change="handleTabChange"
      class="position">
      <van-tab
        v-for="location in locationList"
        :key="location.id"
        :name="location.id"
        :title="location.name">
        <!-- 请求loaing -->
        <div v-if="loading" class="loading-box">
          <van-loading
            vertical
            color="#2DA3F6"
            size="0.6rem"
            type="spinner">
            {{ $t('global.loading') }}...
          </van-loading>
        </div>
        <!--设备列表-->
        <div v-else-if="hasDevice" class="device-list">
          <div
            v-for="device in deviceList"
            :key="device.id"
            class="device-item"
            @click="toDeviceDetail(device)">
            <div class="clearfix" :class="{ 'outline': !device.isOnline }">
              <span class="device-item--name one-line float-l">
                {{ device.name }}
              </span>
              <span v-if="!device.isOnline" class="device-item--outline float-l">{{ $t('home.offline') }}</span>
            </div>
            <div class="device-row">
              <CommonImage
                class="device-item--img"
                fit="contain"
                :src="device.logo_url"/>
              <button
                v-if="!device.is_sa && device.hasPermission"
                class="device-btn"
                :class="[device.power ? 'device-btn--on' : 'device-btn--off']"
                @click.stop="operateDevice(device)"></button>
              </div>
          </div>
          <div
            v-if="permissions.add_device"
            class="device-item"
            @click="discover">
            <div class="add-btn">
              <van-icon
                name="plus"
                size="0.4rem"
                color="#ffffff"/>
            </div>
          </div>
        </div>
        <!--没有设备提示-->
        <div v-else class="device-empty">
          <div class="empty-box">
            <img src="../../assets/device-not-found.png"/>
            <p>{{ $t('home.empty') }}</p>
            <button v-if="permissions.add_device" @click="discover">{{ $t('home.btn') }}</button>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'device',
  data() {
    return {
      activeLocation: -1, // 当前选中房间
      activeArea: '', // 当前选中家庭
      tabBgColor: 'transparent',
      areaList: [],
      locationList: [],
      allDeviceList: [],
      deviceList: [],
      loading: false,
      isWeak: false,
      position: 0
    }
  },
  computed: {
    ...mapGetters(['websocket', 'area', 'permissions']),
    hasDevice() {
      return this.deviceList.length
    }
  },
  methods: {
    // 处理吸顶
    handleScroll({ isFixed }) {
      if (isFixed) {
        this.tabBgColor = '#fff'
      } else {
        this.tabBgColor = 'transparent'
      }
    },
    // 初始化房间列表
    initLocationList() {
      if (!this.area.id) {
        return
      }
      this.loading = true
      this.http.getLocations().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const all = {
          id: -1,
          name: this.$t('global.all')
        }
        const { locations } = res.data
        this.locationList = locations || []
        this.locationList.unshift(all)
      }).catch(() => {
        this.loading = false
      })
    },
    // 初始设备列表
    initList() {
      this.loading = true
      this.isWeak = false
      this.http.getDeviceList().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const devices = res.data.devices || []
        devices.forEach((item) => {
          item.isOnline = true
          item.power = false
          item.hasPermission = false
        })
        this.allDeviceList = devices
        this.initLocationDevice(this.activeLocation)
      }).catch(() => {
        this.loading = false
        this.isWeak = true
      })
    },
    // 获取当前房间设备
    initLocationDevice(locaionId) {
      // areaId '-1' 全部
      const list = []
      this.allDeviceList.forEach((device) => {
        if (locaionId === -1) {
          list.push(device)
        } else if (device.location_id === locaionId) {
          list.push(device)
        }
      })
      // 获取设备初始状态
      list.forEach((item) => {
        const device = item
        device.power = false
        // 发送初始化指令
        this.getDeviceState(device)
      })
      this.deviceList = list
    },
    // 处理tab点击
    handleTabChange(locationId) {
      const params = {
        locationId
      }
      this.changeQuery(params)
      this.initLocationDevice(locationId)
    },
    // 获取设备初始值
    getDeviceState(device) {
      if (device.is_sa) {
        // sa设备不需要获取初始设备
        return
      }
      // 获取初始值
      device.stateId = this.$methods.getId() - 0
      this.websocket.send({
        id: device.stateId,
        domain: device.plugin_id,
        service: 'get_attributes',
        identity: device.identity
      })
    },
    // 发送操作指令
    sendCommand(device, val) {
      this.websocket.send({
        id: 1,
        domain: device.plugin_id,
        service: 'set_attributes',
        identity: device.identity,
        service_data: {
          attributes: [
            {
              attribute: 'power',
              instance_id: device.instance_id,
              val
            }
          ]
        }
      })
    },
    // 操作设备
    operateDevice(device) {
      if (!device.isOnline) {
        this.$toast(this.$t('global.opFail'))
        return
      }
      if (!device.power) {
        this.sendCommand(device, 'on')
      } else {
        this.sendCommand(device, 'off')
      }
    },
    discover() {
      this.$router.push({
        name: 'deviceDiscover',
        query: {
          areaId: this.area.id
        }
      })
    },
    toDeviceDetail(device) {
      const params = {
        position: this.position
      }
      this.changeQuery(params)
      setTimeout(() => {
        if (device.is_sa) {
          this.$methods.setSession('sa', JSON.stringify(device))
        }
        this.$router.push({
          name: 'deviceDetail',
          query: {
            pluginId: device.plugin_id,
            deviceId: device.id,
            isSa: device.is_sa,
            pluginUrl: device.plugin_url
          }
        })
      }, 500)
    },
    handleMessage(data) {
      const msgJson = JSON.parse(data)
      this.deviceList.forEach((device) => {
        // 初始化设备信息
        if (msgJson.id && msgJson.id === device.stateId) {
          if (!msgJson.success) {
            device.isOnline = false
          } else {
            const { instances } = msgJson.result.device
            const types = ['light_bulb', 'outlet']
            const operation = instances.find(instance => types.includes(instance.type))
            const { attributes } = operation
            device.instance_id = operation.instance_id
            device.isOnline = true
            attributes.forEach((attr) => {
              if (attr.attribute === 'power') {
                device.power = attr.val === 'on'
                // 权限控制
                device.hasPermission = attr.can_control
              }
            })
          }
        }
      })
      // 设备状态变化
      if (msgJson.event_type && msgJson.event_type === 'attribute_change') {
        const { data: changeData } = msgJson
        // 更新设备状态
        this.deviceList.forEach((device) => {
          if (changeData.identity === device.identity) {
            const { attr } = changeData
            if (attr.attribute === 'power') {
              device.power = attr.val === 'on'
            }
          }
        })
      }
    },
    // 切换家庭
    areaChange(area) {
      this.activeArea = area.id
      if (this.area.id === area.id) {
        return
      }
      this.area = area
      // 初始化当前家庭设备
      this.initList()
      // 获取对应的房间列表
      this.initLocationList()
      this.changeQuery(area)
    },
    // 修改浏览地址参数， 保证返回能定位
    changeQuery(params) {
      // 修改浏览器参数值
      const { query, path } = this.$router.history.current
      // 对象的拷贝
      const newQuery = JSON.parse(JSON.stringify(query))
      // 地址栏的参数值赋值
      Object.assign(newQuery, params)
      this.$router.replace({ path, query: newQuery })
    },
    // 获取滚动条与顶端距离
    scroll(event) {
      this.position = event.target.scrollTop
    }
  },
  created() {
    const { query } = this.$route
    if (query.locationId) {
      this.activeLocation = Number(query.locationId)
    }
    // 初始化当前家庭设备
    this.initList()
    // 获取对应的房间列表
    this.initLocationList()
    // this.websocket.onmessage((data) => {
    // })
  },
  mounted() {
    this.websocket.onmessage(this.handleMessage)
    this.$nextTick(() => {
      // 实现滚动效果
      setTimeout(() => {
        const { query, path } = this.$route
        if (query.position || Number(query.position) >= 60) {
          document.querySelector('.device').scrollTop = Number(query.position)
          // 对象的拷贝
          const newQuery = JSON.parse(JSON.stringify(query))
          delete newQuery.position
          // 地址栏的参数值赋值
          this.$router.replace({ path, query: newQuery })
        }
      }, 500)
    })
  }
}
</script>
<style lang="scss" scoped>
.mgl25 {
  margin-left: 0.25rem;
  vertical-align: middle;
}
.device {
  height: calc(100vh - 1rem);
  background: $bgColor;
  background-image: url(../../assets/home-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.device::-webkit-scrollbar{
  display: none;
}
.header {
  position: relative;
  padding: 0 0.3rem;
  height: 1.38rem;
  line-height: 1.38rem;
  background: transparent;
  p {
    font-size: 0.48rem;
    font-weight: bold;
    color: #3F4663;
  }
  span {
    max-width: 5.5rem;
    font-weight: bold;
  }
  .add-icon {
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
  }
}
.device-list {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 0.4rem;
}
.device-item {
  position: relative;
  padding: 0.33rem;
  width: 3.3rem;
  height: 2.4rem;
  background: #fff;
  border-radius: 0.2rem;
  margin-top: 0.3rem;
  margin-left: 0.3rem;
  text-align: center;
}
.device-row {
  position: relative;
  height: 1rem;
}
.device-item--img {
  position: absolute;
  left: 0;
  bottom: 0;
  min-width: 0.5rem;
  max-width: 1rem;
  height: 1rem;
}
.outline {
  opacity: 0.5;
  .device-item--name {
    max-width: 1.9rem;
  }
}
.device-item--name {
  max-width: 100%;
  line-height: 1.1;
  font-size: 0.28rem;
  color: #3F4663;
  margin-bottom: 0.38rem;
}
.device-item--outline {
  width: 0.58rem;
  height: 0.32rem;
  border: 0.01rem solid #94A5BE;
  border-radius: 0.04rem;
  margin-left: 0.16rem;
  font-size: 0.2rem;
  color: #94A5BE;
  text-align: center;
  line-height: 0.32rem;
}
.device-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0.6rem;
  height: 0.6rem;
  background-color: transparent;
  background-size: 100% 100%;
  border: 0;
}
.device-btn--on {
  background-image: url(../../assets/device-btn-on.png);
}
.device-btn--off {
  background-image: url(../../assets/device-btn-off.png);
}
.add-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -0.5rem;
  margin-top: -0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  background: #DDE5EB;
  border-radius: 50%;
}
.device-empty,
.empty-area {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.9rem;
  height: calc(100vh - 4rem);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.2rem;
  margin: 0.22rem auto;
}
.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 2rem);
}
.empty-area {
  .empty-box {
    img {
      width: 2rem;
    }
  }
}
.empty-box {
  text-align: center;
  img {
    width: 0.79rem;
  }
  p {
    padding: 0.22rem 0 0.73rem;
    font-size: 0.28rem;
    color: #94A5BE;
  }
  button {
    width: 3rem;
    height: 1rem;
    background: #2DA3F6;
    border-radius: 0.08rem;
    border: 0;
    font-size: 0.28rem;
    color: #fff;
  }
}
.wrap {
  height: 50vh;
}
.home-icon {
  font-size: 0.36rem;
  margin-right: 0.25rem;
  vertical-align: sub;
}
.title {
  font-size: 0.28rem;
  color: #94A5BE;
}
.active {
  color: #2DA3F6;
}
.name {
  max-width: 6rem;
}
</style>
<style scoped>
.device >>> .van-tab__text {
  font-size: 0.32rem;
  font-weight: bold;
}
.device >>> .van-tab {
  padding: 0 0.32rem;
  flex: 0 0 auto;
}
.device >>> .van-tab__text--ellipsis {
  overflow: initial;
}
.device >>> .van-tabs__nav--line {
  padding-bottom: 0.16rem;
}
.wrap >>> .van-cell {
  padding: 0.43rem 0.3rem;
}
</style>
