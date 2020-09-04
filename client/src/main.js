import Vue from 'vue'
import App from './App.vue'
import Carbon from '@carbon/vue'

Vue.config.productionTip = false

Vue.use(Carbon)

new Vue({
  render: h => h(App)
}).$mount('#app')
