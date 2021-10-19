<template>
  <div class="location-setting">
    <van-nav-bar
      :title="$t('locationsetting.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="!isSetting" #right>
        <span class="add-btn float-r" @click="show = true">{{ $t('locationsetting.add') }}</span>
      </template>
    </van-nav-bar>
    <template v-if="isSetting">
      <div class="device-name">
        <p>{{ $t('locationsetting.tip1') }}</p>
        <input v-model="deviceName" :placeholder="$t('locationsetting.placeholder')"/>
      </div>
      <div class="clearfix">
        <span class="add-tip">{{ $t('locationsetting.tip2') }}</span>
        <span class="add-btn float-r" @click="show = true">{{ $t('locationsetting.add') }}</span>
      </div>
    </template>
    <div class="location-list">
      <div
        v-for="location in locationList"
        :key="location.id"
        class="location-item"
        :class="{ 'checked': location.id === locationId }"
        @click="choseRoom(location)">
        {{ location.name }}
      </div>
    </div>
    <van-button
      @click="editDevice"
      :loading="finishLoading"
      :loading-text="$t('global.saving')"
      :disabled="finishLoading"
      class="finish-btn">
      {{ $t('locationsetting.finish') }}</van-button>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('locationsetting.sheetTitle')"
      :loading="nameLoading"
      @on-confirm="addLocation"/>
  </div>
</template>
<script>
import NameSheet from '@/components/NameSheet.vue'

export default {
  name: 'locationSetting',
  components: {
    NameSheet
  },
  data() {
    return {
      locationId: '',
      deviceId: '',
      deviceName: '', // 设备名称
      isSetting: false,
      show: false,
      locationList: [],
      nameLoading: false,
      finishLoading: false
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 初始化区域列表
    initList() {
      this.http.getLocations().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { locations } = res.data
        this.locationList = locations || []
      })
    },
    // 选择房间
    choseRoom(location) {
      if (this.locationId === location.id) {
        this.locationId = ''
      } else {
        this.locationId = location.id
      }
    },
    // 增加房间
    addLocation(name) {
      const room = name.trim()
      if (room === '') {
        this.$toast(this.$t('locationsetting.emptyTip'))
        return
      }
      const isExit = this.locationList.find(item => item.name === room)
      if (isExit) {
        this.$toast(this.$t('locationsetting.repeatTip'))
        return
      }
      const params = {
        name: room
      }
      this.nameLoading = true
      this.http.addLocation(params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.show = false
        this.initList()
        this.$toast(this.$t('global.saveSuccess'))
      }).catch(() => {
        this.nameLoading = false
      })
    },
    // 修改设备信息
    editDevice() {
      let params = {}
      const locationId = this.locationId || 0
      if (this.isSetting) {
        if (this.deviceName.trim() === '') {
          this.$toast(this.$t('locationsetting.deviceEmpty'))
          return
        }
        params = {
          name: this.deviceName.trim(),
          location_id: locationId
        }
      } else {
        params = {
          location_id: locationId
        }
      }
      this.finishLoading = true
      this.http.editDevice(this.deviceId, params).then((res) => {
        this.finishLoading = false
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('locationsetting.success'))
        // 初始化成功修改跳转至首页 修改位置跳回上一页
        if (this.isSetting) {
          this.$router.replace({
            name: 'device'
          })
        } else {
          this.onClickLeft()
        }
      })
    }
  },
  created() {
    const {
      from,
      locationId,
      deviceId
    } = this.$route.query
    this.initList()
    this.locationId = locationId ? Number(locationId) : ''
    this.deviceId = deviceId ? Number(deviceId) : 0
    this.deviceName = from
    this.isSetting = Boolean(from)
  }
}
</script>
<style lang="scss" scoped>
.location-setting {
  padding: 0 0.3rem;
}
.device-name {
  padding-top: 0.6rem;
  padding-bottom: 1rem;
  p {
    padding-bottom: 0.3rem;
    font-size: 0.28rem;
    color: #94A5BE;
  }
  input {
    padding: 0 0.25rem;
    width: 100%;
    height: 1rem;
    background: #F1F4FD;
    border-radius: 0.2rem;
    font-weight: bold;
    color: #555B73;
  }
}
.add-tip {
  color: #94A5BE;
}
.add-btn {
  color: #2DA3F6;
}
.location-list {
  display: flex;
  flex-wrap: wrap;
}
.location-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.1rem;
  height: 1.2rem;
  padding: 0 0.1rem;
  background: #fff;
  border: 0.01rem solid #DDE5EB;
  border-radius: 0.08rem;
  margin-top: 0.3rem;
  margin-right: 0.28rem;
  font-weight: bold;
  color: #555B73;
}
.location-item:nth-child(3n) {
  margin-right: 0;
}
.checked {
  border-color: #2DA3F6;
  color: #2DA3F6;
}
.finish-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.3rem;
  width: 6.9rem;
  height: 1rem;
  background: #2DA3F6;
  border-radius: 0.2rem;
  font-weight: bold;
  color: #fff;
}
</style>
