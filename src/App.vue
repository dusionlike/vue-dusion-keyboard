<template>
  <div>
    <!-- <button @click="download">获取图像</button> -->
    <div class="scope-test">
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
      textarea：
      <textarea data-mode="en" cols="30" rows="5"></textarea>
    </div>

    <br />
    <br />zoom：
    <span style="zoom: 1.6">
      <input type="text" data-mode="num" class="zzz" />
    </span>

    <!-- <vue-dusion-keyboard
      v-if="isElectron"
      :blurHide="false"
      size="mini"
    ></vue-dusion-keyboard>-->
    <!-- <VueDusionKeyboard ref="zzz" scope=".scope-test" :float="false" @keyvalue="kkk" @del="del"></VueDusionKeyboard> -->
    <VueDusionKeyboard @keyvalue="kkk" @del="del"></VueDusionKeyboard>
    <br />
    <br />

    <paint @result="result"></paint>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VueDusionKeyboard } from "../lib/VueDusionKeyboard.es.js";
// import { VueDusionKeyboard } from "./components";
export default defineComponent({
  name: "App",
  components: {
    VueDusionKeyboard,
  },
  methods: {
    result(res: any) {
      console.log(res);
    },
    kkk(kk: string) {
      console.log(kk);
    },
    del(text: string, index: number) {
      console.log(text);
      console.log(index);
    },
  },
});
</script>
<style scoped>
body {
  height: 100%;
  overflow: hidden;
}
</style>
