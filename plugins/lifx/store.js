import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    websocket: null,
    identity: '', // 设备的identity
    deviceId: '', // 设备id
    pluginId: 'lifx' // 插件id
  },
  getters: {
    websocket: state => state.websocket,
    identity: state => state.identity,
    deviceId: state => state.deviceId,
    pluginId: state => state.pluginId,
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
    }
  },
})
