import Vue from 'vue'
import App from './App.vue'

import VueDusionKeyboard from './components/VueDusionKeyboard/index.vue'

// Vue.use(VueDusionKeyboard)
Vue.component('VueDusionKeyboard', VueDusionKeyboard)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
