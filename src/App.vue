<template>
  <div id="app">
    <!-- <button @click="download">获取图像</button> -->
    <div style="height:1440px;" class="scope-test">
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
    <VueDusionKeyboard :blurHide="false" ref="zzz" scope=".scope-test" @keyvalue="kkk" @del="del"></VueDusionKeyboard>
    <!-- <VueDusionKeyboard @keyvalue="kkk" @del="del"></VueDusionKeyboard> -->
    <br />
    <br />
    <el-form inlin>
      <el-form-item>
        <el-button type="primary" @click="OpenDialog">显示dialog</el-button>
      </el-form-item>
    </el-form>

    <paint @result="result"></paint>
    <el-dialog title="测试" :visible.sync="dialogShow" width="30%" @close="dialogShow = false">
      <el-input ref="dialogInput" v-model="inputVal" placeholder="动态生成的input"></el-input>
    </el-dialog>

    <!-- <img :src="imgSrc" alt=""> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";
import VueDusionKeyboard from "./components/VueDusionKeyboard/index.vue";

@Component
export default class App extends Vue {
  show = false;
  isElectron = Boolean(window.require);
  dialogShow = false;
  imgSrc = "";

  inputVal = "";

  @Ref("dialogInput") dialogInput!: ElInput;
  @Ref("zzz") keyboard!: typeof VueDusionKeyboard;

  OpenDialog() {
    this.dialogShow = true;
    this.$nextTick(() => {
      // console.log(this.dialogInput);
      setTimeout(() => {
        this.dialogInput.focus();
      }, 200);
    });
  }

  // download() {
  //   this.imgSrc = this.keyboard.paintCom.canvas.toDataURL();
  // }

  result(res: any) {
    console.log(res);
  }
  kkk(kk: string) {
    // console.log(kk);
  }
  del(text: string, index: number) {
    // console.log(text);
    // console.log(index);
  }
}
</script>

<style lang="scss">
body {
  height: 800px;
  width: 1440px;
}
#app {
  height: 100%;
  // height: 1500px;
  overflow: scroll;
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
