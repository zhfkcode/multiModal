import Vue from 'vue'
import App from './App.vue'
import Dialogs from './lib/multiModal/index'

Vue.config.productionTip = false
Vue.use(Dialogs)
new Vue({
  render: h => h(App)
}).$mount('#app')
