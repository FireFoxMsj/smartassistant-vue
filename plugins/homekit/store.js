import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    websocket: null,
    identity: '', // 设备的identity
    deviceId: '', // 设备id
    pluginId: 'homekit', // 插件id
    sensorData: {
      identity: '',
      instances: [
        {
          instance_id: 7,
          type: 'water_leak_sensor',
          attributes: [
            {
              attribute: 'leak_detected',
              can_control: true,
              id: 1,
              max: 1,
              min: 0,
              val: 0,
              val_type: 'int',
            },
            {
              attribute: 'battery',
              can_control: true,
              id: 2,
              max: 100,
              min: 0,
              val: 69,
              val_type: 'int',
            }
          ]
        }
      ]
    } // 传感器数据
  },
  getters: {
    websocket: state => state.websocket,
    identity: state => state.identity,
    deviceId: state => state.deviceId,
    pluginId: state => state.pluginId,
    sensorData: state => state.sensorData,
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
    setPluginId(state, pluginId) {
      state.pluginId = pluginId
    },
    setSensorData(state, sensorData) {
      state.sensorData = sensorData
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
    setPluginId({ commit }, payload) {
      commit('setPluginId', payload)
    },
    setSensorData({ commit }, payload) {
      commit('setSensorData', payload)
    }
  },
})
