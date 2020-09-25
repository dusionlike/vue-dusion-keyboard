import Vue from 'vue';
import App from './App.vue';
import VueDusionKeyboard from './components/index';
import './plugins/element.js';
Vue.use(VueDusionKeyboard, { handWriteApi: 'http://120.25.124.32/HandWriteApi/words' });
// VueDusionKeyboard.install(Vue) //{ handWriteApi: 'http://120.25.124.32/HandWriteApi/words'}
Vue.config.productionTip = false;
new Vue({
    render: h => h(App),
}).$mount('#app');
