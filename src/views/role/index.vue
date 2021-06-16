<template>
  <div class="role">
    <van-nav-bar
      :title="$t('addlist.title')"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
      @click-right="addRole()">
      <template #left>
        <van-icon name="arrow-left" color="#3F4663"/>
      </template>
      <template v-if="permissions.add_role" #right>
        <van-icon name="plus" color="#3F4663" class="fw-b"/>
      </template>
    </van-nav-bar>
    <!--loading模块-->
    <Loading v-if="loading"></Loading>
    <template v-else>
    <div v-if="hasRole" class="role-list">
      <div
        v-for="role in roleList"
        :key="role.id"
        @click="addRole(role)"
        class="role-item clearfix">
        <span class="role-item--name one-line">{{ role.name }}</span>
        <van-icon name="arrow" class="role-item--icon"/>
      </div>
    </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'role',
  data() {
    return {
      roleList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    hasRole() {
      return this.roleList.length
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    addRole(role = {}) {
      if (role.id && (role.is_manager || !this.permissions.update_role)) {
        return
      }
      this.$router.push({
        name: 'roleAdd',
        query: role
      })
    },
    // 初始成员列表
    initList() {
      this.loading = true
      this.http.getRoleList().then((res) => {
        this.loading = false
        if (res.status !== 0) {
          return
        }
        const { roles } = res.data
        this.roleList = roles || []
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.initList()
  }
}
</script>
<style lang="scss" scoped>
.fw-b {
  font-weight: bold;
}
.role {
  min-height: 100vh;
  background: $bgColor;
}
.role-list {
  margin-top: 1PX;
}
.role-item {
  line-height: 1.1;
  padding: 0.34rem 0.3rem;
  background: #fff;
  border-bottom: 0.01rem solid #eee;
}
.role-item--name {
  display: inline-block;
  max-width: 6.5rem;
  font-size: 0.28rem;
  font-weight: bold;
  color: #3F4663;
}
.role-item--icon {
  font-size: 0.28rem;
  color: #ccc;
  float: right;
}
</style>
