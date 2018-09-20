import Vue from 'vue'
import router from '@/router/router'
import store from '@/store/index'
import './registerServiceWorker'
//第三方库的配置
import '@/utils/plugins/index'

import "./assets/css/app-theme/index.css";
import App from './App.vue'


Vue.config.productionTip = false
//设置默认语言是英文
Vue.config.lang = 'en';


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')