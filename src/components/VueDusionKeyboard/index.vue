<template>
  <transition
    :enter-active-class="'animated faster ' + EnterActiveClass"
    :leave-active-class="'animated faster ' + LeaveActiveClass"
  >
    <div
      v-show="show"
      :style="keyboardStyle"
      :class="'my-keyboard my-keyboard__' + size"
      @mousedown.prevent
      ref="my_keyboard"
    >
      <div v-if="mode === 'cn'" class="pinyin">
        <div>
          <span>{{ cn_input }}</span>
        </div>
      </div>
      <div v-if="mode === 'cn'" class="select-list">
        <div>
          <span
            class="select-text"
            v-for="(text, index) in cut_cn_list"
            :key="index"
            @click="(e) => clickCN(e, text)"
          >{{ index + 1 + "." + text }}</span>
          <div class="page">
            <p class="previous" @click="previous_page">v</p>
            <p class="next" @click="next_page">v</p>
          </div>
        </div>
      </div>
      <!-- 数字键盘 -->
      <div v-if="mode === 'num' || mode === 'biaodian'" class="main-keyboard">
        <div class="pun-box" v-if="mode === 'num'">
          <span
            class="key number"
            style="margin-left: 0px"
            :key="index"
            v-for="(key, index) in num_pun_keys"
            @click="(e) => clickNumber(e, key)"
          >{{ key }}</span>
        </div>
        <div class="all-pun-box" v-if="mode === 'biaodian'">
          <span
            class="key number"
            :key="index"
            v-for="(key, index) in number_keys2"
            @click="(e) => clickNumber(e, key)"
          >{{ key }}</span>
        </div>
        <div class="number-box" v-if="mode === 'num'">
          <span
            class="key number"
            :key="index"
            v-for="(key, index) in number_keys2"
            @click="(e) => clickNumber(e, key)"
          >{{ key }}</span>
        </div>
        <div class="del-box">
          <span class="key number num-del" @click="del">
            <svg-del class="del"></svg-del>
          </span>
          <!-- <span v-if="mode==='biaodian'" class="key number blue"></span>
          <span v-else class="key number" @click="mode='biaodian'">标点</span>-->
          <span class="key number blue" @click="mode = 'en_cap'">中/英</span>
          <span class="key key_hide number" style="margin-left: 0px" @click="HideKey">
            <svg-keyboard class="jp"></svg-keyboard>
            <span>
              隐藏
              <br />
              <i style="display: block; transform: scaleX(2)">v</i>
            </span>
          </span>
          <span class="key number blue" @click="Fanhui">返回</span>
        </div>
      </div>
      <!-- 手写键盘 -->
      <div v-else-if="mode === 'hand' && main_width" class="main-keyboard">
        <div class="hand-left-box">
          <span class="key" @click="(e) => clickKey(e, '，', true)">，</span>
          <!-- <span class="key" @click="e=>clickKey(e, ';',true)">;</span>
          <span class="key" @click="e=>clickKey(e, '@',true)">@</span>-->
          <span class="key" @click="(e) => clickKey(e, '。', true)">。</span>
          <span class="key" @click="(e) => clickKey(e, '.', true)">.</span>
          <span v-if="handLib === 'CN'" class="key blue" style="background: #728fa8">已选择中文</span>
          <span v-else @click="handLib = 'CN'" class="key blue">中</span>
          <span v-if="handLib === 'EN'" class="key blue" style="background: #728fa8">已选择英文</span>
          <span v-else @click="handLib = 'EN'" class="key blue">英</span>
        </div>
        <paint
          ref="paintCom"
          :size="size"
          :p_width="main_width * 0.4"
          :p_height="main_height - 10"
          @SelectText="HandText"
          :lib="handLib"
          :handWriteApi="handWriteApi"
          :dllPath="dllPath"
        ></paint>
        <div class="hand-left-box">
          <span class="key hand-del" @click="del">
            <svg-del class="del"></svg-del>
          </span>
          <span class="key key_hide" @click="HideKey">
            <svg-keyboard class="jp"></svg-keyboard>
            <span>
              隐藏
              <br />
              <i style="display: block; transform: scaleX(2)">v</i>
            </span>
          </span>
          <span class="key blue" @click="mode = 'biaodian'">标点</span>
          <span class="key blue" @click="mode = 'num'">数字</span>
          <span class="key blue" @click="mode = 'en_cap'">键盘</span>
        </div>
      </div>
      <!-- 普通键盘 -->
      <div v-else class="main-keyboard">
        <span
          class="key"
          v-for="(key, index) in number_keys"
          :key="index + 50"
          @click="(e) => clickNumber(e, key)"
        >{{ key }}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(0, 10)"
          :key="index + 11"
          @click="(e) => clickKey(e, key)"
        >{{ key }}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(10, 19)"
          :key="index + 21"
          @click="(e) => clickKey(e, key)"
        >{{ key }}</span>
        <br />
        <span
          v-if="mode === 'cn' || mode === 'en_cap'"
          class="key cap_change"
          style="background: #728fa8"
          @click="cap_change"
        >{{ mode === "cn" ? "" : "已锁定大写" }}</span>
        <span v-else class="key cap_change" @click="cap_change">切换大写</span>
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(19, 26)"
          :key="index + 31"
          @click="(e) => clickKey(e, key)"
        >{{ key }}</span>
        <span class="key key_hide" @click="HideKey">
          <svg-keyboard class="jp"></svg-keyboard>
          <span>
            隐藏
            <br />
            <i style="display: block; transform: scaleX(2)">v</i>
          </span>
        </span>
        <br />
        <span v-if="mode === 'cn'" @click="cn_change" class="key blue">
          中 /
          <i style="font-size: 16px; font-weight: 500">英</i>
        </span>
        <span v-else @click="cn_change" class="key blue">
          英 /
          <i style="font-size: 16px; font-weight: 500">中</i>
        </span>
        <span @click="mode = 'hand'" class="key red">手写</span>
        <span @click="num_change" class="key blue">数字</span>
        <span @click="bd_change" class="key blue">标点</span>
        <!-- <span class="key" @click="e=>clickKey(e, '@',true)">@</span> -->
        <span class="key" @click="(e) => clickKey(e, '.', true)">.</span>
        <span class="key space" @click="(e) => clickKey(e, ' ', true)">空格</span>
        <span class="key def-del" style="width: 140px" @click="del()">
          <svg-del class="del"></svg-del>
        </span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import AllKey from "./key";
import dict from "./dist/pinyin_dict_notone";
import SvgDel from "./svg/svg-del.vue";
import SvgKeyboard from "./svg/svg-keybord.vue";
import Paint from "../paint/paint.vue";

let inputElement: HTMLInputElement;

@Component({ components: { Paint, SvgDel, SvgKeyboard } })
export default class VueDusionKeyboard extends Vue {
  mounted() {
    // window.sign_up_keyboard = this.sign_up_keyboard.bind(this);
    this.$nextTick(() => {
      if (this.observer) {
        this.initMutationObserver();
      }
      this.sign_up_keyboard();
      if (inputElement && this.float) {
        window.addEventListener("animationend", this.SetKeyboardPosition);
        window.addEventListener("scroll", this.SetKeyboardPosition);
      }
    });
  }
  beforeDestroy() {
    this.clean_sign_up();
    if (inputElement && this.float) {
      window.removeEventListener("animationend", this.SetKeyboardPosition);
      window.removeEventListener("scroll", this.SetKeyboardPosition);
    }
  }

  @Prop({ default: "primary" }) size!: string;
  @Prop({ type: Boolean, default: true }) float!: boolean;
  @Prop({ type: Boolean, default: false }) all!: boolean;
  @Prop({ type: Boolean, default: true }) observer!: boolean;
  @Prop({ type: Boolean, default: true }) blurHide!: boolean;
  @Prop({ default: "fadeInUp" }) EnterActiveClass!: string;
  @Prop({ default: "fadeOutDown" }) LeaveActiveClass!: string;
  @Prop({ default: () => AllKey.punctuation }) pun_keys!: string[];
  @Prop({ default: () => AllKey.num_pun }) num_pun_keys!: string[];
  @Prop(String) handWriteApi!: string;
  @Prop(String) dllPath!: string;

  keyboardStyle: any = {};
  show = false;
  input_top = 0;
  mode = "cn";
  old_mode = "en_cap";
  main_width = 0;
  main_height = 0;
  number_keys = AllKey.number;
  cn_input = "";
  cn_list_str = "";
  l_min = 0;
  l_max = 10;
  handLib = "CN";

  get number_keys2(): string[] {
    return this.mode === "num" ? AllKey.number2 : this.pun_keys;
  }
  get letter_keys(): string[] {
    return this.mode === "en_cap" ? AllKey.cap_letter : AllKey.letter;
  }
  get cn_list(): string[] {
    return this.cn_list_str ? this.cn_list_str.split("") : [];
  }
  get cut_cn_list(): string[] {
    return this.cn_list.slice(this.l_min, this.l_max);
  }

  @Ref("my_keyboard") myKeyboard!: HTMLLIElement;
  @Ref("paintCom") paintCom!: Paint;

  @Watch("mode")
  watchMode(val: string, oldVal: string) {
    this.old_mode = oldVal;
    if (val == "hand") {
      this.$nextTick(() => {
        this.main_width = this.myKeyboard.offsetWidth;
        this.main_height = this.myKeyboard.offsetHeight;
      });
    }
  }

  /**监控dom变化，注册键盘弹出事件 */
  initMutationObserver() {
    let mutationObserver = new MutationObserver((mutations, observer) => {
      mutations.forEach((mutation) => {
        this.cbAddedNode(mutation.addedNodes);
      });
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
      attributeOldValue: false,
      characterDataOldValue: false,
    });
  }

  cbAddedNode(addedNodes: NodeList) {
    for (const addedNode of addedNodes) {
      // console.log(addedNode.nodeName);
      if (addedNode.nodeName == "INPUT")
        this.addInputEventListener(addedNode as HTMLInputElement);
      if (addedNode.childNodes.length) this.cbAddedNode(addedNode.childNodes);
    }
  }

  /**重新注册所有input标签 */
  sign_up_keyboard() {
    //每个input添加事件
    let inputAll = document.querySelectorAll("input,textarea") as NodeListOf<
      HTMLInputElement
    >;
    inputAll.forEach((input) => {
      this.addInputEventListener(input);
    });
  }
  /**清理注册事件 */
  clean_sign_up() {
    let inputAll = document.querySelectorAll("input,textarea") as NodeListOf<
      HTMLInputElement
    >;
    inputAll.forEach((input) => {
      input.removeEventListener("focus", this.show_keyboard);
      input.removeEventListener("blur", this.hide_keyboard);
    });
  }
  addInputEventListener(input: HTMLInputElement) {
    if (this.all || input.dataset.mode) {
      input.addEventListener("focus", this.show_keyboard);
      if (this.blurHide) {
        input.addEventListener("blur", this.hide_keyboard);
      }
    }
  }
  /**
   * 往上查找计算父元素的zoom
   * dom：父级document
   * zoom：计算的放大倍数
   * isThisParent：是否已经到达本控件所在的层级的父级
   */
  getZoom(dom: HTMLElement, zoom: number = 1): number {
    //当前dom的zoom
    let m_zoom =
      dom.style.zoom || window.getComputedStyle(dom, null).zoom || "1";
    zoom = zoom * parseFloat(m_zoom);

    let isThisParent = false;
    let children = dom.children;
    for (let i = 0; i < children.length; i++) {
      if (this.$el == children[i]) {
        isThisParent = true;
        continue;
      }
    }
    //到达最上级
    if (dom.parentNode == document) {
      return zoom;
    }
    //到达插件的父级，并且position=relative，停止往上计算
    if (isThisParent) {
      let position =
        dom.style.position || window.getComputedStyle(dom, null).position;
      if (position == "relative") return zoom;
    }

    return this.getZoom(dom.parentNode as HTMLElement, zoom);
  }

  /**设置键盘位置 */
  SetKeyboardPosition() {
    if (!inputElement) return;
    let bound = inputElement.getBoundingClientRect();
    let toptop = document.documentElement.scrollTop;
    //当css设置了zoom时
    let zoom = this.getZoom(inputElement);
    // console.log(zoom);

    let st_top = (bound.y + bound.height + 10 + toptop) * zoom;
    // console.log(bound);
    this.keyboardStyle = {
      position: "absolute",
      left: "0",
      "z-index": "99999",
      top: st_top + "px",
    };
  }
  /**显示键盘 */
  show_keyboard(event: FocusEvent) {
    // console.log("show");
    if (!event.target) return;
    inputElement = event.target as HTMLInputElement;
    this.show = true;
    if (inputElement.dataset.mode) {
      this.mode = inputElement.dataset.mode;
    }
    if (inputElement && this.float) {
      this.SetKeyboardPosition();
    }
  }
  /**隐藏键盘 */
  hide_keyboard(event: FocusEvent) {
    // console.log("hide");
    let element = event.relatedTarget as HTMLElement;
    if (
      !element ||
      element.tagName != "INPUT" ||
      (!this.all && !element.dataset.mode)
    ) {
      this.show = false;
    }
  }

  HideKey() {
    this.show = false;
    inputElement.blur();
  }
  // mousedown(event: MouseEvent) {
  //   // console.log(inputElement);
  //   event.preventDefault();
  // }
  /**手写选择文字*/
  HandText(text: string) {
    if (inputElement !== document.activeElement) return;
    let index = inputElement.selectionStart || 0;
    inputElement.value = this.insertString(inputElement.value, text, index);
    this.TheEnd(index + 1);
    //触发input事件
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
  //点击按钮
  clickKey(event: Event, key: string, pass?: boolean) {
    if (inputElement !== document.activeElement) return;
    let index = inputElement.selectionStart || 0;
    event.preventDefault();
    this.$emit("keyvalue", key);
    if (this.mode === "cn" && !pass) {
      this.cn_input += key;
      this.l_min = 0;
      this.l_max = 10;

      let re = new RegExp(`^${this.cn_input}\\w*`);
      let keys = Object.keys(dict)
        .filter((key) => re.test(key))
        .sort();
      // console.log(keys);
      this.cn_list_str =
        keys.length > 1
          ? keys.reduce((a, b) => a + dict[b], "")
          : dict[keys[0]]; //dict[this.cn_input];
    } else {
      // inputElement.value += key;
      inputElement.value = this.insertString(inputElement.value, key, index);
      this.TheEnd(index + 1);
    }
    //触发input事件
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
  clickNumber(event: Event, key: string) {
    if (inputElement !== document.activeElement) return;
    let index = inputElement.selectionStart || 0;
    event.preventDefault();
    if (this.mode === "cn" && this.cn_input !== "") {
      inputElement.value += this.cut_cn_list[parseInt(key) - 1];
      this.cn_input = "";
      this.cn_list_str = "";
    } else {
      // inputElement.value += key;
      inputElement.value = this.insertString(inputElement.value, key, index);
      this.TheEnd(index + 1);
    }
    //触发input事件
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
  clickCN(event: Event, text: string) {
    let index = inputElement.selectionStart || 0;
    event.preventDefault();
    // inputElement.value += text;
    inputElement.value = this.insertString(inputElement.value, text, index);
    this.cn_input = "";
    this.cn_list_str = "";
    //触发input事件
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    this.TheEnd(index + 1);
  }
  del() {
    if (inputElement !== document.activeElement) return;
    let index = inputElement.selectionStart || 0;
    if (this.mode === "cn" && this.cn_input !== "") {
      this.cn_input = this.delStringLast(
        this.cn_input,
        this.cn_input.length - 1
      );
      this.l_min = 0;
      this.l_max = 10;
      this.cn_list_str = dict[this.cn_input];
    } else {
      inputElement.value = this.delStringLast(inputElement.value, index - 1);
      this.TheEnd(index - 1);
    }
    //触发input事件
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
  /**字符串插入文字 */
  insertString(text: string, input: string, index: number) {
    let arrText = text.split("");
    arrText.splice(index, 0, input);
    return arrText.join("");
  }
  /**删除字符串的某个字符*/
  delStringLast(text: string, index: number) {
    let arrText = text.split("");
    arrText[index] = "";
    // arrText.pop();
    return arrText.join("");
  }
  /**光标归位*/
  TheEnd(index: number) {
    inputElement.selectionStart = index;
    inputElement.selectionEnd = index;
  }
  cap_change() {
    if (this.mode !== "cn") {
      this.mode = this.mode === "en_cap" ? "en_let" : "en_cap";
    }
  }
  cn_change() {
    this.mode = this.mode === "cn" ? "en_cap" : "cn";
    this.cn_input = "";
    this.cn_list_str = "";
  }
  num_change() {
    this.mode = "num";
  }
  bd_change() {
    this.mode = "biaodian";
  }
  Fanhui() {
    this.mode = this.old_mode;
  }
  previous_page() {
    if (this.l_min > 0) {
      this.l_min = this.l_min - 10;
      this.l_max = this.l_max - 10;
    }
  }
  next_page() {
    if (this.cn_list.length > this.l_max) {
      this.l_min += 10;
      this.l_max += 10;
    }
  }
}
</script>


<style lang="scss" scoped>
@import "./style/animate.part.css";
@import "./style/primary.scss";
@import "./style/mini.scss";
i {
  font-style: normal;
}
.num-del > svg {
  margin-top: 10px;
}
.def-del > svg {
  margin-top: 0px;
}
.hand-del > svg {
  margin-top: 0px;
}
.my-keyboard {
  width: 100%;
  // min-width: $min-width;
  height: 400px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .pinyin,
  .select-list {
    > div {
      // width: $min-width;
      margin: 0 auto;
    }
  }
  .pinyin {
    height: 30px;
    background: #fff;
    border: 1px solid rgba(209, 209, 209, 1);
    padding: 0 20px;
    text-align: left;
    > div span {
      font-size: 20px;
      line-height: 30px;
      font-weight: bold;
    }
  }
  .select-list {
    height: 50px;
    background: #fff;
    border: 1px solid rgba(209, 209, 209, 1);
    border-top: none;
    padding: 0;
    text-align: left;
    > div {
      position: relative;
    }
    .select-text {
      cursor: pointer;
      line-height: 50px;
      font-size: 24px;
      font-weight: bold;
      & + .select-text {
        margin-left: 48px;
      }
    }
    .page {
      position: absolute;
      top: 0;
      right: 30px;
      width: 120px;
      height: 50px;
      .previous {
        transform: scaleX(2) rotate(180deg);
      }
      > p {
        margin-top: 0px;
        margin-bottom: 0px;
        display: inline-block;
        text-align: center;
        transform: scaleX(2);
        width: 30px;
        height: 48px;
        line-height: 48px;
        background: #344a5d;
        color: #fff;
        border: 1px solid hsl(0, 0%, 84%);
        border-radius: 5px;
        cursor: pointer;
        &:active {
          background: #fff;
          color: #344a5d;
        }
        & + p {
          margin-left: 30px;
        }
      }
    }
  }
  .main-keyboard {
    padding: 0 14px;
    background: #e6e6e6;
    height: 400px;
    .key {
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      font-weight: 700;
      // width: $key-width;
      background: #fff;
      display: inline-block;
      vertical-align: middle;
      border-radius: 8px;
      margin-top: 14px;
      box-shadow: 1px 1px 2px rgba(20, 20, 20, 0.3);
      cursor: pointer;
      &:active {
        background: #d0d0d0;
      }
      // & + .key {
      //   margin-left: 28px;
      // }
    }
    .all-pun-box,
    .pun-box,
    .number-box,
    .del-box {
      display: inline-block;
      vertical-align: middle;
    }

    .del-box,
    .pun-box {
      .key {
        margin-left: 0px;
      }
    }
    .hand-left-box {
      width: 150px;
      display: inline-block;
      vertical-align: middle;
      .key {
        width: 140px;
        margin-left: 0px;
        margin-top: 20px;
        &:nth-of-type(1) {
          margin-top: 0px;
        }
      }
    }
    .number {
      // width: $number-width;
      height: 80px;
      font-size: 54px;
      line-height: 80px;
    }
    .cap_change {
      width: 140px;
      color: #fff;
      background: #344a5d;
      &:active {
        background: #728fa8;
      }
    }
    .key_hide {
      background: #d6d1d0;
      width: 140px;
      > .jp {
        height: 55px;
        display: inline-block;
        vertical-align: middle;
      }
      > span {
        padding-left: 5px;
        font-size: 16px;
        line-height: 18px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .blue {
      color: #fff;
      background: #344a5d;
      &:active {
        background: #728fa8;
      }
    }
    .red {
      color: #fff;
      background: #f56c6c;
      &:active {
        background: #f89e9e;
      }
    }
    // .space {
    //   width: 338px;
    // }
  }
}
</style>
