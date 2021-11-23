import Vue from 'vue'
import {
  NoticeBar,
  Slider,
  Button,
  NavBar,
  Icon,
  Popup,
  Dialog,
  Loading,
  Toast,
} from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss'
import * as utils from '../zhiting/utils' // 导入全局初始化样式

Vue.use(NoticeBar)
  .use(Slider)
  .use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Popup)
  .use(Dialog)
  .use(Loading)
  .use(Toast)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
