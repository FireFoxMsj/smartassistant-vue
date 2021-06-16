import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    websocket: null,
    userInfo: {}, // 登录的info
    area: {}, // 家庭信息
    token: '', // 登录的token
    isApp: false, // 判断是否在app内
    permissions: {} // 用户权限
  },
  getters: {
    websocket: state => state.websocket,
    userInfo: state => state.userInfo,
    area: state => state.area,
    token: state => state.token,
    permissions: state => state.permissions,
    isApp: state => state.isApp
  },
  mutations: {
    setWebsocket(state, ws) {
      state.websocket = ws
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setArea(state, area) {
      state.area = area
    },
    setToken(state, token) {
      state.token = token
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
    },
    setIsApp(state, isApp) {
      state.isApp = isApp
    }
  },
  actions: {
    setWebsocket({ commit }, payload) {
      commit('setWebsocket', payload)
    },
    setUserInfo({ commit }, payload) {
      commit('setUserInfo', payload)
    },
    setArea({ commit }, payload) {
      commit('setArea', payload)
    },
    setToken({ commit }, payload) {
      commit('setToken', payload)
    },
    setPermissions({ commit }, payload) {
      commit('setPermissions', payload)
    },
    setIsApp({ commit }, payload) {
      commit('setIsApp', payload)
    }
  },
})
