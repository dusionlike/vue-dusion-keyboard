import Vue from 'vue'
import App from './App.vue'
import VueDusionKeyboard, { setKeyboardGlobalConfig, setDict } from './components/index'
// import VueDusionKeyboard, { setKeyboardGlobalConfig } from '..'
import './plugins/element.js'

Vue.use(VueDusionKeyboard)
// setDict(all_dict)
//http://192.168.8.82/HandWriteApi/words
setKeyboardGlobalConfig({ handWriteApi: 'http://192.168.8.82/HandWriteApi/words' })

// VueDusionKeyboard.install(Vue) //{ handWriteApi: 'http://120.25.124.32/HandWriteApi/words'}

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
