import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由懒加载
const load = component => () => import(/* webpackChunkName: "[request]" */ `./views/${component}`)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'configuration',
      component: load('configuration/index.vue'),
    },
    {
      path: '/wlan-connect',
      name: 'wlanConnect',
      component: load('wlan-connect/index.vue'),
    },
    {
      path: '/wlan-list',
      name: 'wlanList',
      component: load('wlan-list/index.vue'),
    },
    {
      path: '/wlan-system',
      name: 'wlanSystem',
      component: load('wlan-list/system.vue'),
    },
    {
      path: '/device-connect',
      name: 'deviceConnect',
      component: load('device-connect/index.vue'),
    }
  ],
})
