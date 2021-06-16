import Vue from 'vue'
import Router from 'vue-router'
import Device from './views/device/index.vue'
import DeviceDetail from './views/device/detail.vue'
import DeviceManage from './views/device/manage.vue'
import DeviceDiscover from './views/device/discover.vue'
import DeviceConnect from './views/device/connect.vue'
import Owner from './views/owner/index.vue'
import BrandSupport from './views/brand/index.vue'
import BrandDetail from './views/brand/detail.vue'
import PluginDetail from './views/plugin/detail.vue'
import AreaDetail from './views/area/detail.vue'
import LocationManage from './views/location/manage.vue'
import LocationDevice from './views/location/device.vue'
import LocationSetting from './views/location/setting.vue'
import Login from './views/login/index.vue'
import Register from './views/register/index.vue'
import AuthLogin from './views/login/auth.vue'
import User from './views/user/index.vue'
import MemberManage from './views/user/manage.vue'
import ThirdPlatform from './views/third-platform/index.vue'
import ExplainGuide from './views/guide/explain.vue'
import SceneGuide from './views/guide/scene.vue'
import RoleList from './views/role/index.vue'
import RoleAdd from './views/role/add.vue'
import ProfessionLogin from './views/login/profession.vue'
import Scene from './views/scene/index.vue'
import SetScene from './views/scene/set-scene.vue'
import SceneLog from './views/scene/log.vue'
import EffectiveTime from './views/scene/effective-time.vue'
import ConditionsList from './views/scene/condition-list.vue'
import ConditionsDevice from './views/scene/condition-device.vue'
import ConditionsScene from './views/scene/condition-scene.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'device',
      component: Device
    },
    {
      path: '/device/detail',
      name: 'deviceDetail',
      component: DeviceDetail
    },
    {
      path: '/device/manage',
      name: 'deviceManage',
      component: DeviceManage
    },
    {
      path: '/device/discover',
      name: 'deviceDiscover',
      component: DeviceDiscover
    },
    {
      path: '/device/connect',
      name: 'deviceConnect',
      component: DeviceConnect
    },
    {
      path: '/owner',
      name: 'owner',
      component: Owner
    },
    {
      path: '/brand/support',
      name: 'brandSupport',
      component: BrandSupport
    },
    {
      path: '/brand/detail',
      name: 'brandDetail',
      component: BrandDetail
    },
    {
      path: '/plugin/detail',
      name: 'pluginDetail',
      component: PluginDetail
    },
    {
      path: '/area/detail',
      name: 'areaDetail',
      component: AreaDetail
    },
    {
      path: '/member/manage',
      name: 'memberManage',
      component: MemberManage
    },
    {
      path: '/location/manage',
      name: 'locationManage',
      component: LocationManage
    },
    {
      path: '/location/device',
      name: 'locationDevice',
      component: LocationDevice
    },
    {
      path: '/location/setting',
      name: 'locationSetting',
      component: LocationSetting
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profession-login',
      name: 'professionLogin',
      component: ProfessionLogin
    },
    {
      path: '/auth-login',
      name: 'authLogin',
      component: AuthLogin
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/third-platform',
      name: 'thirdPlatform',
      component: ThirdPlatform
    },
    {
      path: '/guide/explain',
      name: 'explainGuide',
      component: ExplainGuide
    },
    {
      path: '/role-list',
      name: 'roleList',
      component: RoleList
    },
    {
      path: '/role-add',
      name: 'roleAdd',
      component: RoleAdd
    },
    {
      path: '/scene',
      name: 'scene',
      component: Scene
    },
    {
      path: '/set-scene',
      name: 'setScene',
      component: SetScene
    },
    {
      path: '/scene/log',
      name: 'sceneLog',
      component: SceneLog
    },
    {
      path: '/guide/scene',
      name: 'sceneGuide',
      component: SceneGuide
    },
    {
      path: '/scene/effective-time',
      name: 'effectiveTime',
      component: EffectiveTime
    },
    {
      path: '/scene/condition/list',
      name: 'conditionsList',
      component: ConditionsList
    },
    {
      path: '/scene/condition/device',
      name: 'conditionsDevice',
      component: ConditionsDevice
    },
    {
      path: '/scene/condition/scene',
      name: 'conditionsScene',
      component: ConditionsScene
    }
  ]
})
