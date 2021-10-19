import Vue from 'vue'
import {
  NoticeBar,
  Slider,
  Button,
  Icon,
} from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss' // 导入全局初始化样式

Vue.use(NoticeBar).use(Slider).use(Button).use(Icon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
