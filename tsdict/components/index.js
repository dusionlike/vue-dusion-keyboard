import VueDusionKeyboard from "./VueDusionKeyboard/index.vue";
import Paint from "./paint/paint.vue";
// import { VueConstructor } from 'vue/types/umd';
import { SET_API_PATH } from "./paint/handWrite/index";
function install(vue, option) {
    option && SET_API_PATH(option);
    vue.component('VueDusionKeyboard', VueDusionKeyboard);
    vue.component('Paint', Paint);
}
// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue)
// }
export default { install, VueDusionKeyboard, Paint };
