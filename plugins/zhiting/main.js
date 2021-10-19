import Vue from 'vue'
import {
  NoticeBar,
  Button,
  NavBar,
  Icon,
  Popup,
  Dialog,
  Empty,
  Switch,
  SwipeCell,
  Popover,
  Checkbox,
  CheckboxGroup,
  Cell,
  CellGroup,
  Picker,
  Slider,
  Loading,
  Image as VanImage,
  Circle
} from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import * as http from './api/http'
import * as utils from './utils'
import store from './store'
import './styles/index.scss' // 导入全局初始化样式

Vue.use(NoticeBar)
  .use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Popup)
  .use(Dialog)
  .use(Empty)
  .use(Switch)
  .use(SwipeCell)
  .use(Popover)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Cell)
  .use(CellGroup)
  .use(Picker)
  .use(Slider)
  .use(VanImage)
  .use(Loading)
  .use(Circle)

Vue.config.productionTip = false
Vue.prototype.http = http
Vue.prototype.$bus = new Vue()
Vue.prototype.$methods = utils

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
