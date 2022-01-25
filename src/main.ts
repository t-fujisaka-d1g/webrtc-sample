import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueCompositionAPI from '@vue/composition-api'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.use(VueCompositionAPI)

const vmApp = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')

window.vmApp = vmApp
