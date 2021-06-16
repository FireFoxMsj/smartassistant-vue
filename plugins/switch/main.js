import Vue from 'vue'
import { NoticeBar } from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import './styles/index.scss' // 导入全局初始化样式

Vue.use(NoticeBar)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
