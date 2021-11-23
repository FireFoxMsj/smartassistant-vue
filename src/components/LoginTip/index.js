import Vue from 'vue'
import LoginTipVue from './index.vue'

const LoginTipConstructor = Vue.extend(LoginTipVue)
const instance = new LoginTipConstructor()
const LoginTip = {
  show: (name, status = 5012) => {
    instance.status = status
    instance.isShow = true
    instance.areaName = name
    instance.$mount()
    document.body.appendChild(instance.$el)
  },
  hide: () => {
    instance.isShow = false
  }
}

export default LoginTip
export {
  LoginTip
}
