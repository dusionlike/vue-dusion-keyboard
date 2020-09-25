import Vue from "vue";
import VueDusionKeyboard from "./VueDusionKeyboard/index.vue";
import Paint from "./paint/paint.vue";
// import { VueConstructor } from 'vue/types/umd';
import { SET_API_PATH } from "./paint/handWrite/index";

export interface HWOption {
    /**接口地址 */
    handWriteApi?: string
    /**dll目录 */
    dllPath?: string
}

function install(vue: typeof Vue, option?: HWOption) {
    option && SET_API_PATH(option)
    vue.component('VueDusionKeyboard', VueDusionKeyboard)
    vue.component('Paint', Paint)
}

// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue)
// }

export default { install, VueDusionKeyboard, Paint }