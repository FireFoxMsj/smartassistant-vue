import Vue from 'vue'
import {
  NoticeBar,
  NavBar,
  Button,
  Icon,
  Popup,
  Toast,
  Dialog,
  Loading
} from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import './styles/index.scss' // 导入全局初始化样式

Vue.use(NoticeBar)
  .use(NavBar)
  .use(Button)
  .use(Icon)
  .use(Popup)
  .use(Toast)
  .use(Dialog)
  .use(Loading)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
