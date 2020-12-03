import Vue from "vue";
import _VueDusionKeyboard from "./VueDusionKeyboard/index.vue";
import _Paint from "./paint/paint.vue";

export { signUpKeyboard, setKeyboardGlobalConfig } from './globalConfig'

export const VueDusionKeyboard = _VueDusionKeyboard
export const Paint = _Paint

function install(vue: typeof Vue) {
    vue.component('VueDusionKeyboard', VueDusionKeyboard)
    vue.component('Paint', Paint)
}

// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue)
// }



export default { install, VueDusionKeyboard, Paint }