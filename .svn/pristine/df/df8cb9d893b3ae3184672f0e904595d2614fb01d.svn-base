// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import 'normalize.css/normalize.css' // 重置样式

import elementUI from 'element-ui'
// import './styles/element-theme/index.css'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/icon/iconfont.css'

import * as filters from './filters' // 全局过滤器

import './permission.js'

Vue.use(elementUI, { size: 'medium' })

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
