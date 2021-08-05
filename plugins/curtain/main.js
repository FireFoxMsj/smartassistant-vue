import Vue from 'vue'
import {
  NoticeBar,
  NavBar,
  Slider,
  Button,
  Icon,
  Popup,
  Switch,
  Image as VanImage,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Toast,
  Dialog
} from 'vant' // 按需引入vant
import App from './App.vue'
import router from './router'
import './styles/index.scss' // 导入全局初始化样式

Vue.use(NoticeBar)
  .use(NavBar)
  .use(Slider)
  .use(Button)
  .use(Icon)
  .use(Popup)
  .use(Switch)
  .use(VanImage)
  .use(RadioGroup)
  .use(Radio)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)
  .use(Dialog)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
