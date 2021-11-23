import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    websocket: null,
    identity: '', // 设备的identity
    deviceId: '', // 设备id
    pluginId: 'zhiting', // 插件id
    wifiInfo: {},
    deviceInfo: {}, // 设备信息
    args: {} // 页面参数信息
  },
  getters: {
    websocket: state => state.websocket,
    identity: state => state.identity,
    deviceId: state => state.deviceId,
    pluginId: state => state.pluginId,
    wifiInfo: state => state.wifiInfo,
    deviceInfo: state => state.deviceInfo,
    args: state => state.args
  },
  mutations: {
    setWebsocket(state, ws) {
      state.websocket = ws
    },
    setIdentity(state, identity) {
      state.identity = identity
    },
    setDeviceId(state, deviceId) {
      state.deviceId = deviceId
    },
    setpluginId(state, pluginId) {
      state.pluginId = pluginId
    },
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
    setWebsocket({ commit }, payload) {
      commit('setWebsocket', payload)
    },
    setIdentity({ commit }, payload) {
      commit('setIdentity', payload)
    },
    setDeviceId({ commit }, payload) {
      commit('setDeviceId', payload)
    },
    setpluginId({ commit }, payload) {
      commit('setpluginId', payload)
    },
    setWifiInfo({ commit }, payload) {
      commit('setWifiInfo', payload)
    },
    setDeviceInfo({ commit }, payload) {
      commit('setDeviceInfo', payload)
    },
    setArgs({ commit }, payload) {
      commit('setArgs', payload)
    }
  },
})
