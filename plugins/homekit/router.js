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
      path: '/light',
      name: 'light',
      component: load('light/Home.vue')
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
      path: '/tem-hum-sensor',
      name: 'tem-hum-sensor',
      component: load('tem-hum-sensor/Home.vue'),
    },
    {
      path: '/body-sensor',
      name: 'body-sensor',
      component: load('body-sensor/Home.vue'),
    },
    {
      path: '/door-window-sensor',
      name: 'door-window-sensor',
      component: load('door-window-sensor/Home.vue'),
    },
    {
      path: '/flood-sensor',
      name: 'flood-sensor',
      component: load('flood-sensor/Home.vue'),
    },
    {
      path: '/air',
      name: 'air',
      component: load('air/Home.vue'),
    },
    {
      path: '/gateway',
      name: 'gateway',
      component: load('gateway/Home.vue'),
    },
  ],
})
