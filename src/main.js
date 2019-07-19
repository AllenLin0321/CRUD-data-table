import Vuelidate from 'vuelidate'
import './plugins/vuetify'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.use(Vuelidate);
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
