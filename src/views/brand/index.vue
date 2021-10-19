<template>
  <div class="support">
    <van-nav-bar
      :title="$t('brandsupport.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template #right>
        <span class="add-plugin" @click="uploadShow = true">{{ $t('brandsupport.addPlugin') }}</span>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
      <div class="brand-part">
        <div class="search-btn" @click="searchShow = true">
          <van-icon name="search" size="0.34rem" color="#94A5BE"/>
          <span>{{ $t('brandsupport.searchPlaceholder') }}</span>
        </div>
        <p class="tip-word">{{ $t('brandsupport.searchTip') }}</p>
        <div class="brand-list">
          <BrandItem
            v-for="brand in brandList"
            :key="brand.id"
            :brand="brand"
            @onClick="handelClick"></BrandItem>
        </div>
      </div>
      <!--搜索面板-->
      <div class="search-part">
        <van-action-sheet
          v-model="searchShow"
          :round="false"
          :closeable="false"
          :title="$t('brandsupport.sheetName')">
          <div class="search-content">
            <van-search
              v-model="keyword"
              show-action
              shape="round"
              :placeholder="$t('brandsupport.searchPlaceholder')"
              @cancel="onCancel"/>
            <div class="search-brand-list">
              <BrandItem
                v-for="brand in brandList"
                :key="brand.id"
                :brand="brand"></BrandItem>
            </div>
          </div>
        </van-action-sheet>
      </div>
      <!--上传插件弹窗-->
      <div class="upload-box">
        <van-action-sheet v-model="uploadShow">
          <div class="upload-content">
            <div class="feedback">
              <div>
                <van-uploader accept="file/zip" :before-read="beforeRead">
                  <button class="upload-btn">{{ $t('brandsupport.uploadTitle') }}</button>
                </van-uploader>
                <p class="upload-word">{{ $t('brandsupport.uploadContent') }}</p>
              </div>
            </div>
            <button class="sure-btn" @click="uploadShow = false">{{ $t('brandsupport.sure') }}</button>
          </div>
        </van-action-sheet>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BrandItem from './components/BrandItem.vue'

export default {
  name: 'brandSupport',
  components: {
    BrandItem
  },
  data() {
    return {
      currentBrand: {},
      brandList: [],
      keyword: '',
      searchShow: false,
      uploadShow: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['websocket'])
  },
  methods: {
    // 初始化品牌列表
    initList() {
      this.loading = true
      const params = {
        name: '',
        type: ''
      }
      this.http.getBrandList(params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { brands } = res.data
        this.brandList = brands.map((item) => {
          item.isInstall = false
          return item
        })
      })
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onCancel() {
      this.searchShow = false
    },
    // 处理列表点击
    handelClick(brand) {
      this.currentBrand = brand
    },
    // 返回布尔值
    beforeRead(file) {
      if (file.type !== 'application/x-zip-compressed') {
        this.$toast(this.$t('brandsupport.acceptZip'))
        return
      }
      const params = new FormData()
      params.append('file', file)
      this.uploader(params)
    },
    uploader(params) {
      this.http.uploaderPlugins(params).then((res) => {
        if (res.status !== 0) {
          this.$toast(res.reason)
          return
        }
        this.$toast.success(this.$t('global.uploaderSuccess'))
        this.uploadShow = false
        this.initList()
      })
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    this.websocket.onmessage((data) => {
      // 回调是否成功
      const msgJson = JSON.parse(data)
      const { success } = msgJson
      if (!success) {
        return
      }
      let isFinish = true
      this.currentBrand.plugins.forEach((plugin) => {
        // 如果是添加
        if (msgJson.id === plugin.installId) {
          plugin.is_added = true
          plugin.is_newest = true
        }
        // 如果是更新
        if (msgJson.id === plugin.updateId) {
          plugin.is_newest = true
        }
        // 全部操作是否完成
        if (!plugin.is_added || !plugin.is_newest) {
          isFinish = false
        }
      })
      if (isFinish) {
        this.currentBrand.isInstall = false
        this.currentBrand.is_added = true
        this.currentBrand.is_newest = true
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.add-plugin {
  font-size: 0.28rem;
  color: #3F4663;
}
.brand-part {
  padding: 0 0.27rem;
}
.search-btn {
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  height: 0.64rem;
  background: #F1F4FD;
  border-radius: 0.32rem;
  margin: 0.18rem 0;
  span {
    font-size: 0.28rem;
    color: #94A5BE;
    margin-left: 0.2rem;
  }
}
.tip-word {
  font-size: 0.24rem;
  line-height: 0.36rem;
  color: #94A5BE;
  text-align: justify;
}
.brand-list {
  border-top: 0.01rem solid #eeeeee;
  margin-top: 0.18rem;
}
.search-content {
  padding: 0.2rem 0.3rem;
}
.search-brand-list {
  max-height: calc(100vh - 1.08rem);
  overflow-y: scroll;
}
.uplad-part {
  border-radius: 0.2rem;
}
.upload-content {
  padding: 0.4rem 0.6rem;
  width: 6.9rem;
  background: #fff;
  margin: 0.35rem auto;
  border-radius: 0.2rem;
}
.feedback {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5.7rem;
  height: 2rem;
  background-image: url(../../assets/upload-bg.png);
  background-size: 100% 100%;
  text-align: center;
}
.upload-btn {
  width: 3.2rem;
  height: 0.64rem;
  background: transparent;
  border: 1PX solid #ffffff;
  border-radius: 0.32rem;
  font-size: 0.32rem;
  color: #ffffff;
}
.sure-btn {
  width: 5.7rem;
  height: 1rem;
  background: #F1F4FD;
  border-radius: 0.2rem;
  margin-top: 0.4rem;
  font-size: 0.32rem;
  color: #94A5BE;
}
.upload-word {
  padding-top: 0.3rem;
  font-size: 0.24rem;
  color: #ffffff;
}
</style>
<style scoped>
.search-part >>> .van-action-sheet {
  height: 100%;
  max-height: 100%;
}
.search-part >>> .van-action-sheet__header {
  height: 0;
  overflow: hidden;
}
.search-part >>> .van-search__content {
  background-color: #F1F4FD;
}
.search-part >>> .van-icon-search {
  color: #94A5BE;
}
.search-part >>> .van-search__action {
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.search-part >>> .van-search {
  padding: 0;
}
.upload-box >>> .van-popup {
  background-color: transparent;
}
</style>
