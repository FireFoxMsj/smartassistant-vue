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
      path: '/switch',
      name: 'switch',
      component: load('switch/Home.vue'),
    },
    {
      path: '/light',
      name: 'light',
      component: load('light/Home.vue'),
    }
  ],
})
