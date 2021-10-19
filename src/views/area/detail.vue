<template>
  <div class="wrapper">
    <van-nav-bar
      :title="$t('areadetail.title')"
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
      <div class="detail-box">
        <div class="item clearfix" @click="permissions.update_area_name ? show = true : noPermissionTip()">
          <span class="item__label one-line float-l">{{ $t('areadetail.name') }}</span>
          <p class="item__name float-r">
            <span class="one-line">{{ areaInfo.name }}</span>
            <van-icon name="arrow" class="item__icon"/>
          </p>
        </div>
        <div @click="toAreaManage" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areadetail.area') }}</span>
          <span class="item__name float-r">
            {{ areaInfo.location_count }}
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div v-if="permissions.get_area_invite_code" @click="sceneShow = true" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areadetail.code') }}</span>
          <span class="item__name float-r">
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div @click="permissions.get_role ? toRoleList() : noPermissionTip()" class="item clearfix">
          <span class="item__label one-line float-l">{{ $t('areadetail.role') }}</span>
          <span class="item__name float-r">
            {{ areaInfo.role_count }}
            <van-icon name="arrow" class="item__icon"/>
          </span>
        </div>
        <div class="item clearfix" v-if="false">
          <span class="item__label one-line float-l">{{ $t('areadetail.verify') }}</span>
          <span class="item__name float-r">
            <van-button type="info" size="small" @click="getVerify()">{{ $t('areadetail.creat') }}</van-button>
          </span>
        </div>
      </div>
      <div v-if="MemberList.length" class="role-list">
        <div class="role-title">{{ $t('areadetail.member') }}（{{ MemberList.length }}{{ $t('areadetail.man') }}）</div>
        <div
          v-for="member in MemberList"
          :key="member.user_id" class="role-item"
          @click="toMemberManage(member.user_id)">
          <div class="role-left">
            <img src="../../assets/default-header.png">
          </div>
          <div class="role-right">
            <p class="user-name">{{ member.nickname }}</p>
            <p class="role-name">{{ getMemberRole(member) }}</p>
            <van-icon name="arrow" class="role-item__icon"/>
          </div>
        </div>
      </div>
      <!--demo嵌入隐藏-->
      <template v-if="!isInsert">
        <div class="op-btn-placeholder" v-if="!userInfo.is_owner">
          <div class="op-btn-box">
            <button @click="handleQuit" class="op-btn">{{ $t('areadetail.quit') }}</button>
          </div>
        </div>
        <div class="op-btn-placeholder" v-else>
          <div class="op-btn-box">
            <button @click="handleDelete" class="op-btn">{{ $t('global.del') }}</button>
          </div>
        </div>
      </template>
    </template>
    <!--修改名称弹窗-->
    <NameSheet
      v-model="show"
      :title="$t('areadetail.sheetTitle')"
      :init="areaInfo.name"
      :loading="nameLoading"
      @on-confirm="editAreaName"/>
    <!--删除确认弹窗-->
    <van-dialog
      v-model="dialogShow"
      show-cancel-button
      :before-close="handleConfirm"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE">
      <h3 class="delete-title">{{ dialogInfo.title }}</h3>
      <div class="delete-tip">
        <p>{{ dialogInfo.content }}</p>
        <van-checkbox v-if="userInfo.is_owner" v-model="deleteChecked" icon-size=".35rem" checked-color="#FF0000"><span  class="checked-text">{{$t('global.isDelChecked')}}</span></van-checkbox>
      </div>
    </van-dialog>
    <!-- 选择角色 -->
    <div class="sheet-part">
      <van-action-sheet
        v-model="sceneShow"
        :title="$t('areadetail.roleTitle')">
        <div class="sheet-role-wrap">
          <div class="sheet-title-placeholder">
            <div class="sheet-title">
              <h3>{{ $t('areadetail.roleTip1') }}</h3>
              <p>{{ $t('areadetail.roleTip2') }}</p>
            </div>
          </div>
          <div class="role-scroll-box">
            <van-checkbox-group v-model="result">
              <van-cell-group>
                <van-cell
                  v-for="(role, index) in roleList"
                  :key="role.value"
                  clickable
                  @click="toggle(index)">
                  <template #title>
                    <p class="sheet-role-title" :class="{ 'sheet-role-active': result.includes(role.id) }">
                      <span class="sheet-role-name one-line float-l">
                        {{ role.name }}
                      </span>
                    </p>
                  </template>
                  <template #right-icon>
                    <van-checkbox :name="role.id" ref="checkboxes">
                      <template #icon="props">
                        <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                      </template>
                    </van-checkbox>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </div>
          <div class="invite-btn-placeholder">
            <div class="invite-btn-box">
              <van-button
                class="invite-btn"
                :loading="makeLoading"
                :loading-text="$t('areadetail.invite')"
                :disabled="makeLoading"
                :class="{ 'disabled': !result.length }"
                @click="makeInviteCode">{{ $t('areadetail.invite') }}</van-button>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
    <!--邀请码弹窗组件-->
    <InviteCode
      v-model="inviteShow"
      :src="qrCode"
      :code="codeInfo"/>
    <!--获取验证码弹窗-->
    <van-dialog
      v-model="verifyShow"
      show-cancel-button
      :before-close="handleVerify"
      confirm-button-color="#2DA3F6"
      cancel-button-color="#94A5BE"
      :cancelButtonText="$t('global.copy')"
      :confirmButtonText="$t('global.confirm')">
      <h3 class="verify-title">{{ $t('areadetail.verify') }}</h3>
      <p class="verify-tips">{{ $t('areadetail.effective') }}</p>
      <div class="verify-code">
        <p>{{verifyCode}}</p>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import NameSheet from '@/components/NameSheet.vue'
import clip from '@/utils/clipboard'
import InviteCode from './components/InviteCode.vue'

const activeIcon = require('../../assets/check-box-icon.png')
const inactiveIcon = require('../../assets/uncheck-box-icon.png')

export default {
  name: 'areaDetail',
  components: {
    NameSheet,
    InviteCode
  },
  data() {
    return {
      areaInfo: {},
      show: false,
      dialogShow: false,
      deleteChecked: false,
      dialogType: 'quit', // quit 退出 delete 删除
      loading: false,
      nameLoading: false,
      makeLoading: false,
      sceneShow: false, // 生成邀请码弹窗
      result: [], // 选择生成的角色
      activeIcon,
      inactiveIcon,
      inviteShow: false, // 邀请弹窗控制
      roleList: [], // 角色列表
      MemberList: [], // 成员列表
      qrCode: '',
      userName: '', // 用户名称
      position: 0,
      verifyShow: false,
      verifyCode: '345fos'
    }
  },
  computed: {
    ...mapGetters(['area', 'userInfo', 'permissions', 'isInsert']),
    id() {
      return this.area.id
    },
    dialogInfo() {
      if (this.dialogType === 'quit') {
        return {
          title: this.$t('areadetail.quitTitle'),
          content: this.$t('areadetail.quitContent')
        }
      }
      return {
        title: this.$t('areadetail.delTitle'),
        content: this.$t('areadetail.delContent'),
      }
    },
    codeInfo() {
      return {
        name: this.userName,
        areaName: this.areaInfo.name
      }
    }
  },
  watch: {},
  methods: {
    ...mapActions(['setToken', 'setArea']),
    onClickLeft() {
      this.$router.go(-1)
    },
    toAreaManage() {
      this.$router.push({
        name: 'locationManage',
        query: {
          id: this.id
        }
      })
    },
    toRoleList() {
      this.$router.push({
        name: 'roleList'
      })
    },
    // 没有权限提示
    noPermissionTip() {
      this.$toast(this.$t('global.noPermission'))
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
    // 初始化列表
    initList() {
      this.loading = true
      this.http.getAreaDetail(this.id).then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        this.areaInfo = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取用户信息
    getUserInfo() {
      this.http.getUserDetail(this.userInfo.user_id).then((res) => {
        if (res.status !== 0) {
          return
        }
        this.userName = res.data.nickname
      })
    },
    // 获取角色列表
    getRoleList() {
      if (!this.permissions.get_role) {
        return
      }
      this.http.getRoleList().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { roles } = res.data
        this.roleList = roles.filter(item => item.id !== -1) || []
      })
    },
    // 获取成员列表
    getMemberList() {
      this.http.getUser().then((res) => {
        if (res.status !== 0) {
          return
        }
        const { users } = res.data
        this.MemberList = users || []
      })
    },
    // 选择角色
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    // 生成邀请码
    makeInviteCode() {
      const userId = this.userInfo.user_id
      const params = {
        role_ids: this.result
      }
      if (!this.result.length) {
        this.$toast('请选择成员角色')
        return
      }
      this.makeLoading = true
      this.http.getInvitationCode(userId, params).then((res) => {
        console.log(params, 888)
        this.makeLoading = false
        if (res.status !== 0) {
          return
        }
        const { qr_code: qrCode } = res.data
        this.qrCode = qrCode
        this.inviteShow = true
      }).catch(() => {
        console.log(params, 999)
        this.makeLoading = false
      })
    },
    // 修改家庭名称
    editAreaName(name) {
      const area = name.trim()
      if (area === '') {
        this.$toast(this.$t('areadetail.empty'))
        return
      }
      const params = {
        name: area
      }
      this.nameLoading = true
      this.http.editAreaName(this.id, params).then((res) => {
        this.nameLoading = false
        if (res.status !== 0) {
          return
        }
        this.areaInfo.name = area
        this.show = false
        this.$toast(this.$t('global.saveSuccess'))
        this.area.name = area
        this.setArea(this.area)
      }).catch(() => {
        this.nameLoading = false
      })
    },
    // 处理弹窗确定按钮
    handleConfirm(action, done) {
      if (action === 'confirm') {
        if (this.dialogType === 'quit') {
          this.quit()
        } else {
          this.deleteArea()
        }
      } else {
        done()
      }
    },
    deleteArea() {
      // 删除家庭
      this.http.deleteArea(this.id, { is_del_cloud_disk: this.deleteChecked }).then((res) => {
        this.dialogShow = false
        if (res.status !== 0) {
          return
        }
        if (this.deleteChecked) {
          this.$toast(this.$t('global.delSuccessChecked'))
        } else {
          this.$toast(this.$t('global.delSuccess'))
        }
        this.onClickLeft()
      })
    },
    // handleQuit
    handleQuit() {
      this.dialogType = 'quit'
      this.dialogShow = true
    },
    handleDelete() {
      this.dialogType = 'delete'
      this.dialogShow = true
    },
    // 退出家庭
    quit() {
      this.http.quitArea(this.area.id, this.userInfo.user_id).then((res) => {
        this.dialogShow = false
        if (res.status !== 0) {
          return
        }
        this.setToken('')
        this.$methods.setStore('token', '')
        this.$router.push({
          name: 'professionLogin'
        })
      })
    },
    // 去成员管理页面
    toMemberManage(userId) {
      const params = {
        position: this.position
      }
      this.changeQuery(params)
      setTimeout(() => {
        this.$router.push({
          name: 'memberManage',
          query: {
            userId
          }
        })
      }, 300)
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
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.position = scrollTop
    },
    // 获取验证码
    getVerify() {
      this.$toast.loading({
        message: this.$t('global.loadingVerify'),
        forbidClick: true,
      })
      this.http.verification().then((res) => {
        this.$toast.clear()
        if (res.status !== 0) {
          return
        }
        this.verifyCode = res.data.code
        this.verifyShow = true
      })
    },
    handleVerify(action, done) {
      if (action === 'confirm') {
        setTimeout(done, 100)
      } else {
        this.handleCopy(this.verifyCode, window.event)
        done()
      }
    },
    // 复制
    handleCopy(text, event) {
      clip(text, event)
    }
  },
  created() {
    this.initList()
    this.getUserInfo()
    this.getRoleList()
    this.getMemberList()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$nextTick(() => {
      // 实现滚动效果
      setTimeout(() => {
        const { query, path } = this.$route
        if (query.position || Number(query.position) >= 60) {
          document.documentElement.scrollTop = Number(query.position)
          document.body.scrollTop = Number(query.position)
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
  .wrapper{
    height: 100vh;
  }
.detail-box {
  margin-top: 1PX;
}
.item {
  line-height: 1.1;
  padding: 0.2rem 0.3rem;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  height: 1rem;
}
.item__label {
  display: inline-block;
  font-size: 0.28rem;
  color: #3F4663;
  flex: 1;
}
.item__name {
  font-size: 0.28rem;
  color: #94A5BE;
  span {
    display: inline-block;
    max-width: 4.8rem;
  }
  .van-button{
    background-color: #EAF6FE;
    color: #2DA3F6;
    border-color: #2DA3F6;
    width: 1.2rem;
    border-radius: .08rem;
    font-weight: 500;
  }
}
.item__icon {
  margin-left: 0.25rem;
  vertical-align: top;
  color: #ccc;
}
.op-btn-placeholder {
  height: 1.6rem;
}
.op-btn-box {
  position: fixed;
  width: 100%;
  max-width: 7.5rem;
  left: 50%;
  bottom: 0;
  padding: 0.3rem 0;
  background: $bgColor;
  transform: translateX(-50%);
  text-align: center;
}
.op-btn {
  width: 6.9rem;
  height: 1rem;
  background: #fff;
  border-radius: 0.2rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.delete-title {
  padding-top: 0.53rem;
  text-align: center;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.delete-tip {
  padding: 0.23rem 0.4rem 0.3rem 0.4rem;
  p{
    font-size: .28rem;
    font-weight: bold;
    line-height: 1.5;
    color: #3F4663;
    margin-bottom: .15rem;
  }
  .checked-text{
    font-size: .28rem;
    color: #FF0000;
    font-weight: bold;
  }
}
.role-list {
  background: #fff;
  margin-top: 0.2rem;
}
.role-title {
  padding: 0.27rem 0.3rem 0.12rem 0.3rem;
  font-size: 0.24rem;
  color: #94A5BE;
}
.role-item {
  display: flex;
  padding: 0.2rem 0.3rem;
  border-bottom: 0.01rem solid #eee;
}
.role-left {
  img {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.3rem;
  }
}
.role-right {
  position: relative;
  flex: 1;
}
.user-name {
  padding-top: 0.08rem;
  font-size: 0.28rem;
  color: #3F4663;
}
.role-name {
  padding-top: 0.1rem;
  padding-right: 0.4rem;
  font-size: 0.24rem;
  color: #94A5BE;
  text-align: justify;
}
.role-item__icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: #ccc;
}
.sheet-role-wrap {
  position: relative;
  height: 60vh;
}
.role-scroll-box {
  padding-top: 1.6rem;
  height: calc(60vh - 1.6rem);
  overflow-y: scroll;
}
.sheet-title-placeholder {
  height: 0;
}
.sheet-title {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  padding: 0.3rem 0.4rem;
  background: #fff;
  h3 {
    font-size: 0.32rem;
    font-weight: bold;
    color: #3F4663;
  }
  p {
    padding-top: 0.16rem;
    font-size: 0.22rem;
    color: #3F4663;
  }
}
.sheet-role-title {
  font-size: 0.28rem;
  color: #94A5BE;
}
.sheet-role-active {
  color: #2DA3F6;
}
.sheet-role-name {
  max-width: 6rem;
}
.img-icon {
  height: 0.37rem;
}
.invite-btn-placeholder {
  height: 1.6rem;
}
.invite-btn-box {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0.3rem 0;
  width: 100%;
  background: #fff;
  text-align: center;
}
.invite-btn {
  width: 6.9rem;
  height: 1rem;
  background: #F1F4FD;
  border-radius: 0.2rem;
  color: #3F4663;
}
  .verify-title {
    padding-top: 0.4rem;
    text-align: center;
    font-size: .32rem;
    font-weight: bold;
    color: #3F4663;
    margin-bottom: .25rem;
  }
  .verify-tips {
    font-size: .28rem;
    font-weight: bold;
    color: #94A5BE;
    text-align: center;
  }
  .verify-code{
    font-size: 1.2rem;
    font-weight: bold;
    color: #3F4663;
    text-align: center;
    padding: .25rem .2rem;
  }
</style>
<style scoped>
.sheet-part >>> .van-action-sheet__header {
  height: 0;
  overflow: hidden;
}
.sheet-role-wrap >>> .van-cell {
  padding: 0.4rem 0.35rem;
}
.sheet-role-wrap >>> .van-cell::after {
  left: 0;
  right: 0;
}
.sheet-part >>> .van-action-sheet__close {
  font-size: 0.26rem;
  font-weight: bold;
  color: #3F4663;
  z-index: 10;
}
</style>
