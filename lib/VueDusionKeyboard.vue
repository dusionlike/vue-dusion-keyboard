<template>
  <transition
    :enter-active-class="'animated faster '+EnterActiveClass"
    :leave-active-class="'animated faster '+LeaveActiveClass"
    @after-enter="UpdateBound"
  >
    <div
      v-show="show"
      :style="st"
      :class="'my-keyboard my-keyboard__'+size"
      @mousedown="mousedown"
      ref="my_keyboard"
    >
      <div v-if="mode==='cn'" class="pinyin">
        <div>
          <span>{{cn_input}}</span>
        </div>
      </div>
      <div v-if="mode==='cn'" class="select-list">
        <div>
          <span
            class="select-text"
            v-for="(text, index) in cut_cn_list"
            :key="index"
            @click="e=>clickCN(e, text)"
          >{{(index+1)+'.'+text}}</span>
          <div class="page">
            <p class="previous" @click="previous_page()">v</p>
            <p class="next" @click="next_page()">v</p>
          </div>
        </div>
      </div>
      <!-- 数字键盘 -->
      <div v-if="mode==='num'||mode==='biaodian'" class="main-keyboard">
        <div class="number-box">
          <span
            class="key number"
            :key="index"
            v-for="(key, index) in number_keys2"
            @click="e=>clickNumber(e, key)"
          >{{key}}</span>
        </div>
        <div class="del-box">
          <span class="key number num-del" @click="del()">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
              <path
                d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
              />
            </svg>
          </span>
          <!-- <span v-if="mode==='biaodian'" class="key number blue"></span>
          <span v-else class="key number" @click="mode='biaodian'">标点</span>-->
          <span class="key number blue" @click="mode='en_cap'">中/英</span>
          <span class="key key_hide number" style="margin-left: 0px;" @click="HideKey">
            <svg class="jp" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
              />
            </svg>
            <span>
              隐藏
              <br />
              <i style="display:block;transform: scaleX(2);">v</i>
            </span>
          </span>
          <span class="key number blue" @click="Fanhui()">返回</span>
        </div>
      </div>
      <!-- 手写键盘 -->
      <div v-else-if="mode==='hand'&&main_width" class="main-keyboard">
        <div class="hand-left-box">
          <span class="key" @click="e=>clickKey(e, '，',true)">，</span>
          <!-- <span class="key" @click="e=>clickKey(e, ';',true)">;</span>
          <span class="key" @click="e=>clickKey(e, '@',true)">@</span>-->
          <span class="key" @click="e=>clickKey(e, '。',true)">。</span>
          <span class="key" @click="e=>clickKey(e, '.',true)">.</span>
          <span v-if="handLib==='CN'" class="key blue" style="background: #728fa8;">已选择中文</span>
          <span v-else @click="handLib='CN'" class="key blue">中</span>
          <span v-if="handLib==='EN'" class="key blue" style="background: #728fa8;">已选择英文</span>
          <span v-else @click="handLib='EN'" class="key blue">英</span>
        </div>
        <paint
          ref="paint"
          :size="size"
          :p_width="main_width"
          :p_height="main_height"
          @SelectText="HandText"
          :lib="handLib"
          :HandWriteApi="HandWriteApi"
        ></paint>
        <div class="hand-left-box">
          <span class="key hand-del" @click="del()">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
              <path
                d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
              />
            </svg>
          </span>
          <span class="key key_hide" @click="HideKey">
            <svg class="jp" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
              />
            </svg>
            <span>
              隐藏
              <br />
              <i style="display:block;transform: scaleX(2);">v</i>
            </span>
          </span>
          <span class="key blue" @click="mode='biaodian'">标点</span>
          <span class="key blue" @click="mode='num'">数字</span>
          <span class="key blue" @click="mode='en_cap'">键盘</span>
        </div>
      </div>
      <!-- 普通键盘 -->
      <div v-else class="main-keyboard">
        <span
          class="key"
          v-for="(key, index) in number_keys"
          :key="index+50"
          @click="e=>clickNumber(e, key)"
        >{{key}}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(0,10)"
          :key="index+11"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(10,19)"
          :key="index+21"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <br />
        <span
          v-if="mode==='cn'||mode==='en_cap'"
          class="key cap_change"
          style="background: #728fa8;"
          @click="cap_change()"
        >{{mode==='cn'?'':'已锁定大写'}}</span>
        <span v-else class="key cap_change" @click="cap_change()">切换大写</span>
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(19,26)"
          :key="index+31"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <span class="key key_hide" @click="HideKey">
          <svg class="jp" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M390.94044445 560.84859262h97.39377777V463.45481485H390.94044445v97.39377777zM560.24177778 317.81925929H463.75822222v97.39377778h97.39377778V317.81925929z m-145.63555556 0H318.12266667v97.39377778h97.39377778V317.81925929z m291.27111111 0H609.39377778v97.39377778h97.39377777V317.81925929zM536.576 560.84859262h97.39377778V463.45481485H536.576v97.39377777zM268.97066667 317.81925929H172.48711111v97.39377778h97.39377778V317.81925929z m486.05866666 97.39377778h97.39377778V317.81925929H755.02933333v97.39377778z m145.63555556-243.02933334H123.33511111c-53.70311111 0-97.39377778 43.69066667-97.39377778 97.39377778V754.72592595c0 53.70311111 43.69066667 97.39377778 97.39377778 97.39377778h776.41955556c53.70311111 0 97.39377778-43.69066667 97.39377778-97.39377778V269.57748151c0-53.70311111-43.69066667-97.39377778-96.48355556-97.39377778z m48.24177778 582.54222222c0 26.39644445-21.84533333 48.24177778-48.24177778 48.24177778H123.33511111c-26.39644445 0-48.24177778-21.84533333-48.24177778-48.24177778V269.57748151c0-26.39644445 21.84533333-48.24177778 48.24177778-48.24177778h776.41955556c26.39644445 0 48.24177778 21.84533333 48.24177778 48.24177778l0.91022222 485.14844444zM682.21155555 560.84859262h97.39377778V463.45481485H682.21155555v97.39377777z m-388.66488888 145.63555556h436.90666666V609.0903704H293.54666667v97.39377778zM341.78844445 463.45481485H245.30488889v97.39377777h97.39377778V463.45481485z"
            />
          </svg>
          <span>
            隐藏
            <br />
            <i style="display:block;transform: scaleX(2);">v</i>
          </span>
        </span>
        <br />
        <span v-if="mode==='cn'" @click="cn_change()" class="key blue">
          中 /
          <i style="font-size:16px;font-weight:500;">英</i>
        </span>
        <span v-else @click="cn_change()" class="key blue">
          英 /
          <i style="font-size:16px;font-weight:500;">中</i>
        </span>
        <span @click="mode='hand'" class="key red">手写</span>
        <span @click="num_change()" class="key blue">数字</span>
        <span @click="bd_change()" class="key blue">标点</span>
        <!-- <span class="key" @click="e=>clickKey(e, '@',true)">@</span> -->
        <span class="key" @click="e=>clickKey(e, '.',true)">.</span>
        <span class="key space" @click="e=>clickKey(e, ' ',true)">空格</span>
        <span class="key def-del" style="width:140px;" @click="del()">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
            <path
              d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
            />
          </svg>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import AllKey from "./key";
import dict from "./dist/pinyin_dict_notone";
import paint from "./paint.vue";

export default {
  name: "vue-dusion-keyboard",
  mounted() {
    //注册全局方法
    if (this.window) {
      window.$show_keyboard = this.show_keyboard;
      window.$hide_keyboard = this.hide_keyboard;
    }
    window.sign_up_keyboard = this.sign_up_keyboard;
    this.$nextTick(() => {
      this.sign_up_keyboard();
    });
  },
  components: { paint },
  props: {
    size: { type: String, default: "primary" },
    window: { type: Boolean, default: false },
    hand: { type: Boolean, default: false },
    float: { type: Boolean, default: false },
    all: { type: Boolean, default: false },
    blurHide: { type: Boolean, default: true },
    EnterActiveClass: { type: String, default: "fadeInUp" },
    LeaveActiveClass: { type: String, default: "fadeOutDown" },
    HandWriteApi: [String]
  },
  data() {
    return {
      st: "",
      show: false,
      input_top: 0,
      input: "",
      def_mode: "cn",
      old_mode: "en_cap",
      main_width: 0,
      main_height: 0,
      number_keys: AllKey.number,
      cn_input: "",
      cn_list_str: "",
      l_min: 0,
      l_max: 10,
      handLib: "CN"
    };
  },
  computed: {
    number_keys2() {
      return this.mode === "num" ? AllKey.number2 : AllKey.biaodian;
    },
    letter_keys() {
      return this.mode === "en_cap" ? AllKey.cap_letter : AllKey.letter;
    },
    cn_list() {
      return this.cn_list_str ? this.cn_list_str.split("") : [];
    },
    cut_cn_list() {
      return this.cn_list.slice(this.l_min, this.l_max);
    },
    mode: {
      get() {
        return this.def_mode;
      },
      set(val) {
        this.old_mode = this.mode;
        // console.log(this.hand);
        if (val == "hand" && !this.hand) return;
        this.def_mode = val;
        // console.log(this.def_mode);
        if (val == "hand") {
          this.$nextTick(() => {
            this.main_width = this.$refs["my_keyboard"].offsetWidth;
            this.main_height = this.$refs["my_keyboard"].offsetHeight;
          });
        }
        // this.$emit("set_mode", val);
      }
    }
  },
  methods: {
    /**重新注册所有input标签 */
    sign_up_keyboard() {
      const _this = this;
      //每个input添加事件
      let inputAll = document.querySelectorAll("input");
      inputAll.forEach(input => {
        if (_this.all || input.dataset.mode) {
          input.addEventListener("focus", _this.show_keyboard);
          if (_this.blurHide) {
            input.addEventListener("blur", _this.hide_keyboard);
          }
        }
      });
    },
    /**
     * 往上查找计算父元素的zoom
     * dom：父级document
     * zoom：计算的放大倍数
     * isThisParent：是否已经到达本控件所在的层级的父级
     */
    getZoom(dom, zoom = 1, isThisParent = false) {
      //当前dom的zoom
      let m_zoom =
        dom.style.zoom || window.getComputedStyle(dom, null).zoom || 1;
      zoom = zoom * m_zoom;

      if (!isThisParent) {
        let children = dom.children;
        for (let i = 0; i < children.length; i++) {
          if (this.$el == children[i]) {
            isThisParent = true;
            continue;
          }
        }
      }
      // console.log(dom);
      if (dom.parentNode == document) {
        return zoom;
      }
      //到达插件的父级，并且position=relative，停止往上计算
      if (isThisParent) {
        let position =
          dom.style.position || window.getComputedStyle(dom, null).position;
        if (position == "relative") return zoom;
      }
      return this.getZoom(dom.parentNode, zoom);
    },
    /**注册显示键盘事件 */
    show_keyboard(e) {
      this.input = e.target;
      this.show = true;
      this.mode = e.target.dataset.mode;
      if (this.input && this.float) {
        let bound = this.input.getBoundingClientRect();
        let toptop = document.documentElement.scrollTop;
        //当css设置了zoom时
        let zoom = this.getZoom(this.input);

        let st_top = (bound.y + bound.height + 10 + toptop) * zoom;
        // console.log(bound);
        this.st = {
          position: "absolute",
          left: "0",
          "z-index": "10",
          top: st_top + "px"
        };
      }
    },
    /**注册隐藏键盘事件 */
    hide_keyboard(e) {
      if (
        (this.all && e.relatedTarget && e.relatedTarget.tagName == "INPUT") ||
        (e.relatedTarget && e.relatedTarget.dataset.mode)
      )
        return;
      this.show = false;
    },
    /**重新初始化一下canvas的位置信息 */
    UpdateBound() {
      this.$refs.paint && this.$refs.paint.UpdateBound();
    },
    HideKey(e) {
      this.show = false;
      this.input.blur();
    },
    mousedown(e) {
      // console.log(this.input);
      e.preventDefault();
    },
    /**手写选择文字*/
    HandText(text) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      this.input.value = this.insertString(this.input.value, text, index);
      this.TheEnd(index + 1);
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    //点击按钮
    clickKey(e, key, pass) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      e.preventDefault();
      if (this.mode === "cn" && !pass) {
        this.cn_input += key;
        this.l_min = 0;
        this.l_max = 10;

        let re = new RegExp(`^${this.cn_input}\\w*`);
        let keys = Object.keys(dict)
          .filter(key => re.test(key))
          .sort();
        // console.log(keys);
        this.cn_list_str =
          keys.length > 1
            ? keys.reduce((a, b) => a + dict[b], "")
            : dict[keys[0]]; //dict[this.cn_input];
      } else {
        // this.input.value += key;
        this.input.value = this.insertString(this.input.value, key, index);
        this.TheEnd(index + 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    clickNumber(e, key) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      e.preventDefault();
      if (this.mode === "cn" && this.cn_input !== "") {
        this.input.value += this.cut_cn_list[parseInt(key) - 1];
        this.cn_input = "";
        this.cn_list_str = "";
      } else {
        // this.input.value += key;
        this.input.value = this.insertString(this.input.value, key, index);
        this.TheEnd(index + 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    clickCN(e, text) {
      let index = this.input.selectionStart;
      e.preventDefault();
      // this.input.value += text;
      this.input.value = this.insertString(this.input.value, text, index);
      this.cn_input = "";
      this.cn_list_str = "";
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
      this.TheEnd(index + 1);
    },
    del() {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      if (this.mode === "cn" && this.cn_input !== "") {
        this.cn_input = this.delStringLast(
          this.cn_input,
          this.cn_input.length - 1
        );
        this.l_min = 0;
        this.l_max = 10;
        this.cn_list_str = dict[this.cn_input];
      } else {
        this.input.value = this.delStringLast(this.input.value, index - 1);
        this.TheEnd(index - 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    /**字符串插入文字 */
    insertString(text, input, index) {
      let arrText = text.split("");
      arrText.splice(index, 0, input);
      return arrText.join("");
    },
    /**删除字符串的某个字符*/
    delStringLast(text, index) {
      let arrText = text.split("");
      arrText[index] = "";
      // arrText.pop();
      return arrText.join("");
    },
    /**光标归位*/
    TheEnd(index) {
      this.input.selectionStart = index;
      this.input.selectionEnd = index;
    },
    cap_change() {
      if (this.mode !== "cn") {
        this.mode = this.mode === "en_cap" ? "en_let" : "en_cap";
      }
    },
    cn_change() {
      this.mode = this.mode === "cn" ? "en_cap" : "cn";
      this.cn_input = "";
      this.cn_list_str = "";
    },
    num_change() {
      this.mode = "num";
    },
    bd_change() {
      this.mode = "biaodian";
    },
    Fanhui() {
      this.mode = this.old_mode;
    },
    previous_page() {
      if (this.l_min > 0) {
        this.l_min = this.l_min - 10;
        this.l_max = this.l_max - 10;
      }
    },
    next_page() {
      if (this.cn_list.length > this.l_max) {
        this.l_min += 10;
        this.l_max += 10;
      }
    }
  }
};
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
    .number-box {
      // width: $number-width * 3 + $key-left * 2;
      display: inline-block;
      vertical-align: middle;
    }
    .del-box {
      // width: $number-width + $key-left * 2;
      display: inline-block;
      vertical-align: middle;
      .key {
        margin-left: 0px;
      }
      // .key_hide{
      //   width: $number-width;
      // }
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
      font-size: 60px;
      line-height: 80px;
      &:nth-last-of-type(3n) {
        margin-left: 0px;
      }
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
        height: 60px;
        display: inline-block;
        vertical-align: middle;
      }
      > span {
        padding-left: 10px;
        font-size: 20px;
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
