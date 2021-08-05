import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Timing from './views/Timing.vue'
import TaskManage from './views/TaskManage.vue'
import Statistics from './views/Statistics.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/timing',
      name: 'timing',
      component: Timing,
    },
    {
      path: '/task-manage',
      name: 'taskManage',
      component: TaskManage,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
    }
  ],
})
