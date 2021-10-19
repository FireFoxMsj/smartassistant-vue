import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    wifiInfo: {},
    deviceInfo: {}, // 设备信息
    args: {} // 页面参数信息
  },
  getters: {
    wifiInfo: state => state.wifiInfo,
    deviceInfo: state => state.deviceInfo,
    args: state => state.args
  },
  mutations: {
    setWifiInfo(state, wifiInfo) {
      state.wifiInfo = wifiInfo
    },
    setDeviceInfo(state, deviceInfo) {
      state.deviceInfo = deviceInfo
    },
    setArgs(state, args) {
      state.args = args
    }
  },
  actions: {
    setWifiInfo({ commit }, payload) {
      commit('setWifiInfo', payload)
    },
    setDeviceInfo({ commit }, payload) {
      commit('deviceInfo', payload)
    },
    setArgs({ commit }, payload) {
      commit('setArgs', payload)
    }
  },
})
