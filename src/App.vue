<template>
  <div id="app">
    拼音：
    <input type="text" data-mode="cn" />
    手写：
    <input type="text" data-mode="hand" />
    英文：
    <input type="text" data-mode="en" />
    数字：
    <input type="text" data-mode="num" />
    标点：
    <input type="text" data-mode="biaodian" />
    空：
    <input type="text" />
    <br>
    <br>
    zoom：
    <span style="zoom:1.6;">
      <input type="text" data-mode="num" class="zzz" />
    </span>

    <!-- <input v-if="show" @focus="$refs.keyboard.show_keyboard" @blur="$refs.keyboard.hide_keyboard" type="text" /> -->
    <vue-dusion-keyboard v-if="isElectron" :blurHide="false" size="mini" hand></vue-dusion-keyboard>
    <vue-dusion-keyboard
      v-else
      :blurHide="false"
      size="mini"
      hand
      HandWriteApi="http://jsrtj.fotoit.cn/iis/HandWriteApi/words"
    ></vue-dusion-keyboard>
    <!-- HandWriteApi="http://localhost/HandWriteApi/words" -->
    <button>测试</button>
    <!-- <div style="width:400px;height:400px;background:#000;"></div> -->
    <!-- <vue-dusion-keyboard hand float :blurHide="false"></vue-dusion-keyboard> -->
    <!-- :blurHide="false" -->
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    this.show = true;
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      show: false,
      isElectron: Boolean(window.require)
    };
  }
};
</script>

<style lang="scss">
#app {
  // height: 1500px;
  // width: 1080px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.zzz {
  zoom: 1.5;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
