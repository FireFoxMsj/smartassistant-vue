import Vue from 'vue'
import {
  NoticeBar,
  Slider,
  Button,
  Icon,
  Checkbox,
  CheckboxGroup,
  Image as VanImage,
  Popup,
  Circle
} from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import store from './store'
import * as utils from './utils'
import './styles/index.scss' // 导入全局初始化样式

Vue.use(NoticeBar).use(Slider).use(Button).use(Icon)
  .use(VanImage)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Popup)
  .use(Circle)

Vue.config.productionTip = false
Vue.prototype.$methods = utils.default

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
