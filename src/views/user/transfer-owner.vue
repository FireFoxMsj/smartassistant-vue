<template>
  <div class="member-wrap">
    <div class="main-box">
      <van-nav-bar
        :title="$t('transferOwner.title')"
        left-arrow
        :fixed="true"
        :placeholder="true"
        @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" color="#3F4663"/>
        </template>
      </van-nav-bar>
      <!--loading模块-->
      <Loading v-if="loading"></Loading>
      <template v-else>
        <div class="tips">{{$t('transferOwner.tips')}}</div>
        <div class="target-box">
          <div class="target-header">{{$t('transferOwner.headerText')}}</div>
          <div class="target-body">
            <van-radio-group v-model="userId">
              <van-cell-group v-for="(member,index) in memberList" :key="index">
                <div class="face" @click="userId = member.user_id">
                  <img src="../../assets/default-header.png">
                </div>
                <van-cell title="" @click="userId = member.user_id">
                  <template #title>
                    <div class="name">
                      <p class="face-name">{{member.nickname}}</p>
                      <p class="role-name">{{getMemberRole(member)}}</p>
                    </div>
                  </template>
                  <template #right-icon>
                    <van-radio :name="member.user_id" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </div>
        <div class="transfer-btn-box">
          <van-button type="danger" color="#2da3f6" block @click="transferOwner()" :disabled="!userId">{{ $t('global.tra') }}</van-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultHeader = require('../../assets/default-header.png')
const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')

export default {
  name: 'transferOwner',
  data() {
    return {
      defaultHeader,
      activeIcon,
      inactiveIcon,
      loading: false,
      userId: '', // 用户id
      memberList: []
    }
  },
  computed: {
    ...mapGetters(['area', 'userInfo', 'permissions']),
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取成员列表
    getMemberList() {
      this.loading = true
      this.http.getUser().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { users } = res.data
        this.memberList = users.filter(item => this.getMemberOwner(item) < 0) || []
      })
    },
    // 获取用户角色
    getMemberRole(member) {
      let role = ''
      if (member.role_infos) {
        member.role_infos.forEach((item) => {
          role += `${item.name}、`
        })
        return role.replace(/、$/, '')
      }
      return ''
    },
    // 获取用户是否为有拥有者
    getMemberOwner(member) {
      let result = ''
      if (member.role_infos) {
        result = member.role_infos.findIndex(v => v.id === -1)
      }
      return result
    },
    // 转移拥有者权限
    transferOwner() {
      this.http.transferOwner(this.userId).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.$toast(this.$t('global.traSuccess'))
        this.onClickLeft()
      })
    }
  },
  created() {
    this.getMemberList()
  }
}
</script>
<style lang="scss" scoped>
  .member-wrap {
    min-height: calc(100vh);
    background: $bgColor;
  }
  .main-box{
    height: calc(100vh);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  .tips{
    padding: .25rem .3rem;
    font-weight: bold;
    color: #94A5BE;
    font-size: .24rem;
    line-height: .36rem;
  }
  .target-box{
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    position: relative;
    background-color: #ffffff;
  }
  .target-header{
    padding: 0.2rem 0.32rem;
    color: #94A5BE;
    font-size: .24rem;
  }
  .target-body{
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    -o-overflow-scrolling: touch;
    -moz-overflow-scrolling: touch;
    overflow-scrolling: touch;
    position: relative;
    .van-cell-group{
      padding-left: 1.3rem;
    }
    .van-cell-group:last-of-type{
      .van-cell{
        border-bottom: none 0;
      }
    }
    .van-radio-group{
      border-bottom: 1px solid #eeeeee;
    }
    .van-cell{
      padding: 0.2rem 0.3rem 0.2rem 0;
      border-bottom: 1px solid #eeeeee;
    }
    .face{
      position: absolute;
      width: .8rem;
      height: .8rem;
      left: .3rem;
      top: .2rem;
    }
    .face img{
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      overflow: hidden;
    }
    .face-name{
      color: #3F4663;
    }
    .role-name{
      color: #94A5BE;
      font-size: .24rem;
    }
  }
  .transfer-btn-box {
    padding: .2rem .3rem;
    .van-button{
      height: 1rem;
      border-radius: 0.2rem;
    }
  }
</style>
<style scoped>
  .target-body >>> .van-hairline--top-bottom::after{
    border-width: 0;
  }
</style>
