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
      path: '/h5',
      name: 'configuration',
      component: load('h5/configuration/index.vue'),
    },
    {
      path: '/h5/wlan-connect',
      name: 'wlanConnect',
      component: load('h5/wlan-connect/index.vue'),
    },
    {
      path: '/h5/wlan-list',
      name: 'wlanList',
      component: load('h5/wlan-list/index.vue'),
    },
    {
      path: '/h5/wlan-system',
      name: 'wlanSystem',
      component: load('h5/wlan-list/system.vue'),
    },
    {
      path: '/h5/device-connect',
      name: 'deviceConnect',
      component: load('h5/device-connect/index.vue'),
    },
    {
      path: '/switch',
      name: 'switch',
      component: load('switch/Home.vue')
    },
    {
      path: '/socket',
      name: 'socket',
      component: load('socket/Home.vue'),
    },
    {
      path: '/socket/timing',
      name: 'socketTiming',
      component: load('socket/Timing.vue'),
    },
    {
      path: '/socket/task-manage',
      name: 'socketTaskManage',
      component: load('socket/TaskManage.vue'),
    },
    {
      path: '/socket/statistics',
      name: 'socketStatistics',
      component: load('socket/Statistics.vue'),
    },
    {
      path: '/curtain',
      name: 'curtain',
      component: load('curtain/Home.vue'),
    }
  ],
})
