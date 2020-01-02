export default {
  api: '',
  lib: '',
  init(api) {
    this.api = api;
  },
  createLib(lib) {
    this.lib = lib
  },
  GetWords(lpXis, lpYis, lpCis) {
    return new Promise((resolve, reject) => {
      let data = {
        lib: this.lib,
        lpXis: lpXis,
        lpYis: lpYis,
        lpCis: lpCis
      }
      const request = new XMLHttpRequest();
      request.open('POST', this.api);
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(data));
      request.onload = function (e) {
        if (request.status === 200) {
          resolve({data:JSON.parse(request.response)})
        }
        else {
          reject('网络出错')
        }
      }
      request.onerror = function (e) {
        reject('请求失败')
      }
    })
  }
}