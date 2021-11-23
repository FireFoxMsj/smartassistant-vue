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
      <template #title>
        <div class="support-title">
          <a v-for="(item,index) in tab" :key="index" :class="{'active': active===item.value}" @click="tabs(item)" href="javascript:;">{{item.name}}</a>
        </div>
      </template>
      <template #right>
        <van-icon @click="searchShow = true" style="font-weight: 700" name="search" size=".34rem" color="#3F4663" />
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
      <!-- 没有家庭 -->
      <van-empty
        v-if="brandList.length===0"
        class="empty-box"
        :image="empty"
        :description="$t('global.empty')"
      />
      <div v-else class="brand-part">
        <p class="tip-word" v-if="active=== 'system'">{{ $t('brandsupport.searchTip') }}</p>
        <div class="brand-list">
          <BrandItem
            v-for="brand in brandList"
            :key="brand.id"
            :brand="brand"
            :type="active"
            @update="creatInitList"
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
              @input="search"
              @cancel="onCancel"/>
            <div class="search-brand-list">
              <BrandItem
                v-for="brand in brandList"
                :key="brand.id"
                :brand="brand"
                :type="active"></BrandItem>
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
      <!-- 添加插件-->
      <div class="add-plugin">
        <van-button v-if="active=== 'creat'" type="info" block @click="uploadShow = true">{{ $t('brandsupport.addPlugin') }}</van-button>
      </div>
    </template>
  </div>
</template>
<script>
import BrandItem from './components/BrandItem.vue'

const empty = require('../../assets/empty.png')

export default {
  name: 'brandSupport',
  components: {
    BrandItem
  },
  data() {
    return {
      empty,
      active: 'system',
      tab: [
        { name: '系统', value: 'system' },
        { name: '创作', value: 'creat' }
      ],
      currentBrand: {},
      historyBrandList: [],
      brandList: [],
      keyword: '',
      searchShow: false,
      uploadShow: false,
      loading: false,
    }
  },
  methods: {
    // 初始系统化品牌列表
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
        this.historyBrandList = brands.map((item) => {
          item.isInstall = false
          return item
        })
      })
    },
    // 创作化品牌列表
    creatInitList() {
      this.loading = true
      const params = {
        list_type: 1,
      }
      this.http.creatPlugins(params).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        if (res.data.plugins) {
          const { plugins } = res.data || []
          plugins.forEach((item) => {
            item.isInstall = false
          })
          this.brandList = plugins
          this.historyBrandList = plugins
        } else {
          this.brandList = []
          this.historyBrandList = []
        }
      })
    },
    onClickLeft() {
      // this.$router.go(-1)
      this.$router.push({ name: 'owner' })
    },
    search(val) {
      if (val) {
        const arr = []
        this.historyBrandList.forEach((item) => {
          if (item.name.indexOf(val.replace(/^\s*|\s*$/g, '').toString().toLowerCase()) > -1 || item.name.indexOf(val.replace(/^\s*|\s*$/g, '').toString().toUpperCase()) > -1) {
            arr.push(item)
          }
        })
        this.brandList = arr
      } else {
        this.brandList = this.historyBrandList
      }
    },
    onCancel() {
      this.searchShow = false
    },
    tabs(params) {
      this.$router.replace({ name: 'brandSupport', query: { type: params.value } })
      this.historyBrandList = []
      this.brandList = []
      this.active = params.value
      if (this.active === 'system') {
        this.initList()
      } else {
        this.creatInitList()
      }
    },
    // 处理列表点击
    handelClick(brand) {
      this.currentBrand = brand
    },
    // 返回布尔值
    beforeRead(file) {
      console.log(file)
      if (file.type !== 'application/x-zip-compressed' && file.type !== 'application/zip') {
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
        this.creatInitList()
      })
    }
  },
  mounted() {
    if (this.$route.query) {
      const { type } = this.$route.query
      this.active = type || 'system'
    }
    if (this.active === 'creat') {
      this.creatInitList()
    } else {
      this.initList()
    }
  }
}
</script>
<style lang="scss" scoped>
.support-title a{
  display: inline-block;
  margin: 0 .2rem;
  padding: .2rem .1rem;
  color: #94A5BE;
  position: relative;
}
.support-title a.active{
  color: #3F4663;
}
.support-title a.active:after{
  content: "";
  width: .4rem;
  height: .06rem;
  border-radius: .06rem;
  background-color: #2DA3F6;
  position: absolute;
  left: 50%;
  margin-left: -.2rem;
  bottom: .1rem;
}
.add-plugin {
  position: fixed;
  width: 100%;
  max-width: 750px;
  transform: translateX(-50%);
  bottom: .2rem;
  left: 50%;
  padding: 0 .3rem;
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
  border-top: 1px solid #eeeeee;
  padding-top: .2rem;
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
.empty-box{
  height: 7rem;
}
.empty-box >>> .van-empty__image img,.empty-box >>> .van-empty__image{
  width: 2rem;
  height: auto;
}
</style>
