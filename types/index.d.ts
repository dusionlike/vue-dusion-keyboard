import Vue from "vue";
export interface HWOption {
    /**接口地址 */
    handWriteApi?: string;
    /**dll目录 */
    dllPath?: string;
}
declare function install(vue: typeof Vue, option?: HWOption): void;
declare const _default: {
    install: typeof install;
    VueDusionKeyboard: any;
    Paint: any;
};
export default _default;
