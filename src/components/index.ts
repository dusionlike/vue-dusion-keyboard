import VueDusionKeyboard from "./VueDusionKeyboard/index.vue";
import Paint from "./paint/paint.vue";
import { VueConstructor } from 'vue/types/umd';

function install(Vue: VueConstructor) {
    Vue.component('VueDusionKeyboard', VueDusionKeyboard)
    Vue.component('Paint', Paint)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default { install, VueDusionKeyboard, Paint }