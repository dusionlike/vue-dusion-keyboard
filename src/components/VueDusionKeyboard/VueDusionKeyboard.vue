<template>
    <transition
        :enter-active-class="'animated faster ' + EnterActiveClass"
        :leave-active-class="'animated faster ' + LeaveActiveClass"
    >
        <div
            v-show="show"
            :style="keyboardStyle"
            class="my-keyboard my-keyboard__mini"
            @mousedown.prevent
            ref="my_keyboard"
        >
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
            <div
                v-else-if="mode === 'hand'"
                class="main-keyboard"
                style="padding-top:8px;width:1080px;"
            >
                <div class="hand-left-box" style="margin-right:6px;">
                    <span class="key" @click="(e) => clickKey(e, '!', true)">:</span>
                    <span class="key" @click="(e) => clickKey(e, ',', true)">,</span>
                    <span class="key" @click="(e) => clickKey(e, '.', true)">.</span>
                    <span class="key" @click="(e) => clickKey(e, '?', true)">;</span>
                    <span class="key" @click="(e) => clickKey(e, '@', true)">@</span>
                </div>
                <paint
                    ref="paintEl"
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
                    <span class="key blue" @click="mode = 'cn'">键盘</span>
                </div>
            </div>
            <!-- 普通键盘 -->
            <div v-else class="main-keyboard" style="width:1080px;">
                <div v-if="mode === 'cn'" class="pinyin">
                    <div>
                        <span>{{ show_cn_input }}</span>
                    </div>
                </div>

                <div v-if="mode === 'cn'" class="select-list">
                    <div ref="selectRow" class="row" :style="{'margin-top':-42*(page-1)+'px'}">
                        <span
                            class="select-text"
                            v-for="(text, index) in cut_cn_list"
                            :key="index"
                            @click="(e) => clickCN(e, text)"
                        >{{ text }}</span>
                    </div>
                    <div class="page">
                        <p class="previous" @click="toPage(page-1)">v</p>
                        <p class="next" @click="toPage(page+1)">v</p>
                    </div>
                </div>
                <template v-if="mode !== 'cn'">
                    <span
                        class="key"
                        v-for="(key, index) in number_keys"
                        :key="index + 50"
                        @click="(e) => clickNumber(e, key)"
                    >{{ key }}</span>
                    <br />
                </template>

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
import AllKey from "./key";
import SvgDel from "./svg/svg-del.vue";
import SvgKeyboard from "./svg/svg-keybord.vue";
import Paint from "../paint/paint.vue";
import Vue from "vue";
import { setGlobalCb } from "../globalConfig";
import { searchWords } from "../dictSearch";

export default Vue.extend({
    name: "VueDusionKeyboard",
    components: { Paint, SvgDel, SvgKeyboard },
    mounted() {
        this.$nextTick(() => {
            if (this.observer) {
                this.initMutationObserver();
            }
            setGlobalCb(this.sign_up_keyboard());
            if (this.float) {
                // document.addEventListener("animationend", this.SetKeyboardPosition);
                document.addEventListener("scroll", this.SetKeyboardPosition);
            }
        });
    },
    beforeDestroy() {
        this.clean_sign_up();
        if (this.float) {
            // document.removeEventListener("animationend", this.SetKeyboardPosition);
            document.removeEventListener("scroll", this.SetKeyboardPosition);
        }
    },
    props: {
        float: { type: Boolean, default: true },
        all: { type: Boolean, default: false },
        observer: { type: Boolean, default: false },
        blurHide: { type: Boolean, default: true },
        LeaveActiveClass: { default: "fadeOutDown" },
        EnterActiveClass: { default: "fadeInUp" },
        pun_keys: { default: () => AllKey.punctuation },
        num_pun_keys: { default: () => AllKey.num_pun },
        handWriteApi: String,
        dllPath: String,
        scope: String,
        /**顶级容器，默认'body' */
        body: String,
        bottom: String,
    },
    data() {
        return {
            inputElement: null as HTMLInputElement | null,
            keyboardStyle: {} as any,
            show: false,
            input_top: 0,
            mode: "cn",
            old_mode: "en_cap",
            number_keys: AllKey.number,
            cn_input: "",
            show_cn_input: "",
            cn_list_str: [] as string[],
            handLib: "CN",
            page: 1,
        };
    },
    watch: {
        mode(val: string, oldVal: string) {
            this.old_mode = oldVal;
            this.$nextTick(() => {
                this.SetKeyboardPosition();
            });
        },
        cn_input(val: string) {
            let res = searchWords(this.cn_input);
            // console.log(res);
            this.show_cn_input = res.key;
            this.cn_list_str = res.hs;
        },
    },
    computed: {
        number_keys2(): string[] {
            return this.mode === "num" ? AllKey.number2 : this.pun_keys;
        },
        letter_keys(): string[] {
            return this.mode === "en_cap" ? AllKey.cap_letter : AllKey.letter;
        },
        cn_list(): string[] {
            return this.cn_list_str;
        },
        cut_cn_list(): string[] {
            return this.cn_list; //.slice(0, 10);
        },
    },
    methods: {
        /**监控dom变化，注册键盘弹出事件 */
        initMutationObserver() {
            let mutationObserver = new MutationObserver(
                (mutations, observer) => {
                    mutations.forEach((mutation) => {
                        this.cbAddedNode(mutation.addedNodes);
                    });
                }
            );
            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false,
                attributeOldValue: false,
                characterDataOldValue: false,
            });
        },

        cbAddedNode(addedNodes: NodeList) {
            for (const addedNode of addedNodes) {
                // console.log(addedNode.nodeName);
                if (addedNode.nodeName == "INPUT")
                    this.addInputEventListener(addedNode as HTMLInputElement);
                if (addedNode.childNodes.length)
                    this.cbAddedNode(addedNode.childNodes);
            }
        },

        /**重新注册所有input标签 */
        sign_up_keyboard() {
            let element = this.scope
                ? document.querySelector(this.scope)
                : null;
            // console.log(element);

            //每个input添加事件
            let inputAll = (element || document).querySelectorAll(
                "input,textarea"
            ) as NodeListOf<HTMLInputElement>;
            inputAll.forEach((input) => {
                this.addInputEventListener(input);
            });
        },
        /**清理注册事件 */
        clean_sign_up() {
            let element = this.scope
                ? document.querySelector(this.scope)
                : null;
            let inputAll = (element || document).querySelectorAll(
                "input,textarea"
            ) as NodeListOf<HTMLInputElement>;
            inputAll.forEach((input) => {
                input.removeEventListener("focus", this.show_keyboard);
                input.removeEventListener("blur", this.hide_keyboard);
            });
        },
        addInputEventListener(input: HTMLInputElement) {
            if (this.all || input.dataset.mode) {
                input.addEventListener("focus", this.show_keyboard);
                if (this.blurHide) {
                    input.addEventListener("blur", this.hide_keyboard);
                }
            }
        },
        /**
         * 往上查找计算父元素的zoom
         * dom：父级document
         * zoom：计算的放大倍数
         * isThisParent：是否已经到达本控件所在的层级的父级
         */
        getZoom(dom: HTMLElement, zoom: number = 1): number {
            //当前dom的zoom
            let m_zoom =
                dom.style.zoom ||
                window.getComputedStyle(dom, null).zoom ||
                "1";
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
                    dom.style.position ||
                    window.getComputedStyle(dom, null).position;
                if (position == "relative") return zoom;
            }

            return this.getZoom(dom.parentNode as HTMLElement, zoom);
        },

        /**设置键盘位置 */
        SetKeyboardPosition() {
            if (!this.inputElement) return;

            //当css设置了zoom时
            let zoom = this.getZoom(this.inputElement);
            // console.log(zoom);
            let $el = this.$el.children[0];
            let bodyEl =
                (this.body && document.querySelector(this.body)) ||
                document.body;
            let bodyBound = bodyEl.getBoundingClientRect();

            if (this.bottom !== undefined) {
                let bottom = Number(this.bottom.replace("px", ""));
                this.keyboardStyle = {
                    position: "fixed",
                    left:
                        bodyBound.left +
                        bodyBound.width / 2 -
                        $el.clientWidth / 2 +
                        "px",
                    "z-index": "99999",
                    bottom:
                        window.innerHeight -
                        bodyBound.height -
                        bodyBound.y +
                        bottom +
                        "px",
                };
            } else {
                let bound = this.inputElement.getBoundingClientRect();
                let st_top = (bound.y + bound.height + 10) * zoom;
                // console.log(bound);
                this.keyboardStyle = {
                    position: "fixed",
                    left:
                        bodyBound.left +
                        bodyBound.width / 2 -
                        $el.clientWidth / 2 +
                        "px",
                    "z-index": "99999",
                    top: st_top + "px",
                };
            }
            this.$nextTick(() => {
                let paintEl = this.$refs.paintEl as any;
                paintEl && paintEl.UpdateBound();
            });
        },
        /**显示键盘 */
        show_keyboard(event: FocusEvent) {
            // console.log("show");
            if (!event.target) return;
            this.inputElement = event.target as HTMLInputElement;
            this.show = true;
            if (this.inputElement.dataset.mode) {
                this.mode = this.inputElement.dataset.mode;
            }
            if (this.inputElement && this.float) {
                this.$nextTick(() => {
                    this.SetKeyboardPosition();
                });
            }
        },
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
        },

        HideKey() {
            this.show = false;
            this.inputElement && this.inputElement.blur();
        },
        // mousedown(event: MouseEvent) {
        //   // console.log(this.inputElement);
        //   event.preventDefault();
        // }
        /**手写选择文字*/
        HandText(text: string) {
            if (
                !this.inputElement ||
                this.inputElement !== document.activeElement
            )
                return;
            let index = this.inputElement.selectionStart || 0;
            this.inputElement.value = this.insertString(
                this.inputElement.value,
                text,
                index
            );
            this.TheEnd(index + 1);
            //触发input事件
            this.inputElement.dispatchEvent(
                new Event("input", { bubbles: true })
            );
        },
        //点击按钮
        clickKey(event: Event, key: string, pass?: boolean) {
            if (
                !this.inputElement ||
                this.inputElement !== document.activeElement
            )
                return;
            let index = this.inputElement.selectionStart || 0;
            event.preventDefault();
            this.$emit("keyvalue", key);
            if (this.mode === "cn" && !pass) {
                this.cn_input += key;
                this.page = 1;
            } else {
                // this.inputElement.value += key;
                this.inputElement.value = this.insertString(
                    this.inputElement.value,
                    key,
                    index
                );
                this.TheEnd(index + key.length);
            }
            //触发input事件
            this.inputElement.dispatchEvent(
                new Event("input", { bubbles: true })
            );
        },
        clickNumber(event: Event, key: string) {
            if (
                !this.inputElement ||
                this.inputElement !== document.activeElement
            )
                return;
            let index = this.inputElement.selectionStart || 0;
            event.preventDefault();
            if (this.mode === "cn" && this.cn_input !== "") {
                this.inputElement.value += this.cut_cn_list[parseInt(key) - 1];
                this.cn_input = "";
                this.cn_list_str = [];
            } else {
                // this.inputElement.value += key;
                this.inputElement.value = this.insertString(
                    this.inputElement.value,
                    key,
                    index
                );
                this.TheEnd(index + 1);
            }
            //触发input事件
            this.inputElement.dispatchEvent(
                new Event("input", { bubbles: true })
            );
        },
        clickCN(event: Event, text: string) {
            if (
                !this.inputElement ||
                this.inputElement !== document.activeElement
            )
                return;
            let index = this.inputElement.selectionStart || 0;
            event.preventDefault();
            // this.inputElement.value += text;
            this.inputElement.value = this.insertString(
                this.inputElement.value,
                text,
                index
            );
            this.cn_input = "";
            this.cn_list_str = [];
            //触发input事件
            this.inputElement.dispatchEvent(
                new Event("input", { bubbles: true })
            );
            this.TheEnd(index + text.length);
        },
        del() {
            if (
                !this.inputElement ||
                this.inputElement !== document.activeElement
            )
                return;
            let index = this.inputElement.selectionStart || 0;
            if (this.mode === "cn" && this.cn_input !== "") {
                this.cn_input = this.delStringLast(
                    this.cn_input,
                    this.cn_input.length - 1
                );
                this.page = 1;
                // let res = searchWords(this.cn_input);
                // console.log(res);
                // this.cn_list_str = res.hs;
            } else {
                this.inputElement.value = this.delStringLast(
                    this.inputElement.value,
                    index - 1
                );
                this.TheEnd(index - 1);
            }
            //触发input事件
            this.inputElement.dispatchEvent(
                new Event("input", { bubbles: true })
            );
        },
        /**字符串插入文字 */
        insertString(text: string, input: string, index: number) {
            let arrText = text.split("");
            arrText.splice(index, 0, input);
            return arrText.join("");
        },
        /**删除字符串的某个字符*/
        delStringLast(text: string, index: number) {
            let arrText = text.split("");
            this.$emit("del", arrText[index], index + 1);
            arrText[index] = "";
            // arrText.pop();
            return arrText.join("");
        },
        /**光标归位*/
        TheEnd(index: number) {
            if (
                !this.inputElement ||
                this.inputElement !== document.activeElement
            )
                return;
            this.inputElement.selectionStart = index;
            this.inputElement.selectionEnd = index;
        },
        cap_change() {
            if (this.mode !== "cn") {
                this.mode = this.mode === "en_cap" ? "en_let" : "en_cap";
            }
        },
        cn_change() {
            this.mode = this.mode === "cn" ? "en_cap" : "cn";
            this.cn_input = "";
            this.cn_list_str = [];
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
        toPage(i: number) {
            let selectRow = this.$refs.selectRow as HTMLDivElement;
            if (i > 0 && i <= selectRow.clientHeight / 42) {
                this.page = i;
            }
        },
    },
});

var a: (ii: string) => void;
</script>


<style lang="scss" scoped>
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
    height: 380px;
    overflow: hidden;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    .pinyin {
        // margin-top: 14px;
        box-sizing: border-box;
        height: 30px;
        background: #fff;
        border: 1px solid rgba(209, 209, 209, 1);
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        padding: 0 20px;
        text-align: left;
        > div span {
            font-size: 20px;
            line-height: 30px;
            font-weight: bold;
        }
    }
    .select-list {
        height: 42px;
        background: #fff;
        border: 1px solid rgba(209, 209, 209, 1);
        border-top: none;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        padding: 0;
        text-align: left;
        overflow: hidden;
        position: relative;

        .row {
            margin-right: 166px;
            padding: 0 10px;
            .select-text {
                display: inline-block;
                cursor: pointer;
                line-height: 42px;
                font-size: 24px;
                font-weight: bold;
                margin: 0 20px;
            }
        }

        .page {
            position: absolute;
            top: 0;
            right: 7px;
            width: 120px;
            height: 42px;
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
                height: 38px;
                line-height: 38px;
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
        height: 380px;
        box-sizing: border-box;
        // width: 1080px;
        display: inline-block;
        border-radius: 10px;
        padding: 0 14px 14px 14px;
        background: #e6e6e6;
        // height: 400px;
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
            margin-top: 13px;
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
                width: 135px;
                margin-left: 0px;
                margin-top: 13px;
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
        .key.number.key_hide {
            font-size: 0;
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

@-webkit-keyframes fadeInUp {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }
    to {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }
    to {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

.fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
}

@-webkit-keyframes fadeOutDown {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }
}

@keyframes fadeOutDown {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }
}

.fadeOutDown {
    -webkit-animation-name: fadeOutDown;
    animation-name: fadeOutDown;
}

.animated.faster {
    -webkit-animation-duration: 500ms;
    animation-duration: 500ms;
}
</style>
