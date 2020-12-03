export let globalConfig: GlobalConfig = {}

export interface GlobalConfig {
    /**接口地址 */
    handWriteApi?: string
    /**dll目录 */
    dllPath?: string
}

export function setKeyboardGlobalConfig(_globalConfig:GlobalConfig) {
    globalConfig = _globalConfig
}

let signUpKeyboardGlobalCb: any = null;
export function signUpKeyboard() {
  signUpKeyboardGlobalCb && signUpKeyboardGlobalCb();
}

export function setGlobalCb(cb:any){
    signUpKeyboardGlobalCb = cb
}