import { HandWrite } from "./index";

export default class WebHandWrite implements HandWrite {
  private api: string
  private lib: string = ''
  constructor(api: string) {
    this.api = api;
  }
  async createLib(lib: string) {
    this.lib = lib
    return true
  }

  GetWords(lpXis: number[], lpYis: number[], lpCis: number[]) {
    return new Promise<string[]>((resolve, reject) => {
      let lib = this.lib
      let data = { lib, lpXis, lpYis, lpCis }
      const request = new XMLHttpRequest();
      request.open('POST', this.api);
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(data));
      request.onload = function (e) {
        if (request.status === 200) {
          resolve(JSON.parse(request.response))
        } else {
          reject('网络出错')
        }
      }
      request.onerror = function (e) {
        reject('请求失败')
      }
    })
  }
}