import Vue from "vue";
import _VueDusionKeyboard from "./VueDusionKeyboard/VueDusionKeyboard.vue";
import _Paint from "./paint/paint.vue";
import { default as notone_dict } from "./VueDusionKeyboard/dict/pinyin_dict_notone.json";
import { default as all_dict } from "./VueDusionKeyboard/dict/pinyin_dict_all.json";
import { setDict } from "./dictSearch";

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

setDict(all_dict)

export default { install, VueDusionKeyboard, Paint }