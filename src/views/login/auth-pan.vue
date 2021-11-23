<template>
  <div class="wrap">
    <div class="info clearfix">
      <van-image
        :src="headImg"
        class="head-img float-l"/>
      <div class="name-box float-l">
        <p class="name">{{ userInfo.nickname | addMosaic }}</p>
        <p class="word">{{ $t('login.welcome') }}</p>
      </div>
    </div>
    <p class="tip-word">{{ $t('login.agree1_1') }}{{ userInfo.nickname | addMosaic }}{{ $t('login.agree1_2') }}</p>
    <div class="auth-list">
      <p
        v-for="item in authItem"
        :key="item.name"
        class="auth-item">{{ item.description }}</p>
    </div>
    <van-button
      class="auth-btn"
      :loading="loading"
      :disabled="loading"
      loading-type="spinner"
      :loading-text="loadingText"
      @click="toAuthLogin">{{ $t('login.panAuth') }}</van-button>
    <van-button
      class="cancel-btn"
      @click="cancelLogin">
      {{ $t('global.cancel') }}
    </van-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

const headImg = require('@/assets/default-head.png')

export default {
  name: 'authLogin',
  data() {
    return {
      headImg,
      authItem: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'area']),
    loadingText() {
      return `${this.$t('login.panAuth')}...`
    }
  },
  filters: {
    addMosaic(value) {
      if (!value) {
        return ''
      }
      const name = value.toString()
      if (name.length <= 2) {
        return name
      }
      const firt = name.slice(0, 1)
      const last = name.slice(name.length - 1, name.length)
      return `${firt}***${last}`
    }
  },
  methods: {
    getScopes() {
      this.http.getScopes().then((res) => {
        if (res.status !== 0) {
          return
        }
        this.authItem = res.data.scopes || []
      })
    },
    // 浏览器地址转化
    getUrlParams() {
      // 获取device_id参数
      const { search, href } = window.location
      const url = search || href
      const str = url.substr(url.indexOf('?') + 1)
      const obj = {}
      const arr = str.split('&')
      arr.forEach((item) => {
        const param = item.split('=')
        const [key, value] = param
        obj[key] = decodeURIComponent(value)
      })
      return obj
    },
    toAuthLogin() {
      this.loading = true
      const scopes = []
      this.authItem.forEach((item) => {
        scopes.push(item.name)
      })
      this.http.getScopesToken({
        scopes
      }).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          if (res.status === 2021) {
            // 用户自动退出家庭/公司或被管理员移出家庭/公司，授权失效
            this.$toast.fail('用户自动退出家庭/公司或被管理员移出家庭/公司，授权失效')
            this.$router.replace({
              name: 'professionLogin'
            })
          }
          return
        }
        const { scope_token: scopeToken } = res.data
        const params = this.getUrlParams()
        let { callbackUrl } = params
        if (callbackUrl) {
          const connect = callbackUrl.indexOf('?') === -1 ? '?' : '&'
          const userInfo = JSON.parse(JSON.stringify(this.userInfo))
          userInfo.area_name = this.area.name
          callbackUrl = `${callbackUrl}${connect}scopeToken=${JSON.stringify(scopeToken)}&userInfo=${JSON.stringify(userInfo)}`
          window.location.href = callbackUrl
        }
      }).catch(() => {
        this.loading = false
      })
    },
    cancelLogin() {
      const params = this.getUrlParams()
      const { callbackUrl } = params
      if (callbackUrl) {
        window.location.href = callbackUrl
      }
    }
  },
  mounted() {
    this.getScopes()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 1.95rem 1rem 0.2rem 1rem;
  background: #fff;
}
.head-img {
  width: 1.2rem;
  height: 1.2rem;
}
.name-box {
  padding-left: 0.3rem;
}
.name {
  padding-top: 0.14rem;
  font-size: 0.4rem;
  font-weight: bold;
  color: #1A2734;
}
.word {
  padding-top: 0.14rem;
  font-size: 0.4rem;
  color: #1A2734;
}
.tip-word {
  padding-top: 1.18rem;
  font-size: 0.28rem;
  color: #1A2734;
  line-height: 0.48rem;
}
.auth-list{
  padding-top: .2rem;
}
.auth-item::before {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  background-image: url(../../assets/check-icon.png);
  background-size: 100% 100%;
  margin-right: 0.21rem;
  content: "";
  vertical-align: bottom;
  opacity: 0.7;
}
.auth-item {
  padding-top: 0.42rem;
  font-size: 0.28rem;
  color: #1A2734;
}
.auth-btn,.cancel-btn{
  width: 5.5rem;
  height: 1rem;
  border-radius: 0.08rem;
  font-size: 0.28rem;
}
.auth-btn{
  background: #427AED;
  color: #fff;
  margin-top: 2.6rem;
  margin-bottom: .4rem;
}
.cancel-btn{
  background: #ffffff;
  color: #111;
}
</style>
