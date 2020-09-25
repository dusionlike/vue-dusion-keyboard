<template>
  <div class="keyboard-paint" style="margin-top: 5px">
    <div class="canvas-box">
      <canvas
        :width="p_width"
        :height="p_height - 4"
        ref="canvas"
        @touchstart="Down"
        @touchmove="Move"
        @touchend="Mouseup"
        @mousedown="Down"
        @mousemove="Move"
        @mouseup="Mouseup"
        @mouseleave="Leave"
      ></canvas>
    </div>
    <table v-if="show_result" :style="tStyle" class="result-table">
      <tr v-for="(item, index) in write_result" :key="index">
        <td @click="Select(text)" v-for="(text, index) in item" :key="index">
          {{ text }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import { getHandWrite, HandWrite } from "./handWrite";

let handWrite: HandWrite;

type FStrL = [string[], string[], string[], string[]];

@Component
export default class Paint extends Vue {
  mounted() {
    // console.log(this.handWriteApi);
    handWrite = getHandWrite(
      (this.handWriteApi || this.dllPath)
        ? { handWriteApi: this.handWriteApi, dllPath: this.dllPath }
        : undefined
    );
    handWrite.createLib(this.lib).catch((err) => {
      console.error(err);
    });
    this.$nextTick(() => {
      this.ctx = this.canvas.getContext("2d");
      this.Reload();
      this.UpdateBound();
      window.addEventListener("animationend", this.bindUpdateBound);
      window.addEventListener("scroll", this.bindUpdateBound);
    });
    this.write_result_temp = [];
  }
  beforeDestroy() {
    //清除监听
    window.removeEventListener("animationend", this.bindUpdateBound);
    window.removeEventListener("scroll", this.bindUpdateBound);
  }

  @Ref("canvas") canvas!: HTMLCanvasElement;

  @Prop({ default: true }) show_result!: boolean;
  @Prop({ default: 600 }) p_width!: number;
  @Prop({ default: 400 }) p_height!: number;
  @Prop({ default: "CN" }) lib = "CN";
  @Prop(String) handWriteApi!: string;
  @Prop(String) dllPath!: string;

  ctx: CanvasRenderingContext2D | null = null;

  handWrite = "";
  write_result_temp: string[] = [];
  isClick = false;
  //轨迹X
  clickX: number[] = [];
  //轨迹Y
  clickY: number[] = [];
  //轨迹标志位，为1则是终点
  clickC: number[] = [];
  X = 0;
  Y = 0;
  old_X = 0;
  old_Y = 0;
  timer = 0;
  tStyle = {
    height: this.p_height + "px",
    width: this.p_height * (3 / 4) + "px",
  };

  get write_result(): FStrL {
    let val = this.write_result_temp;
    let ll = val.length;
    if (ll < 12) {
      for (let i = 0; i < 12 - ll; i++) {
        val.push("");
      }
    } else if (ll > 12) {
      for (let i = 0; i < ll - 12; i++) {
        val.pop();
      }
    }
    return [
      val.slice(0, 3),
      val.slice(3, 6),
      val.slice(6, 9),
      val.slice(9, 12),
    ];
  }

  @Watch("lib")
  WatchLib(val: string) {
    handWrite.createLib(val);
  }

  bindUpdateBound = this.UpdateBound.bind(this);

  /**更新canvas位置*/
  UpdateBound() {
    let bound = this.canvas.getBoundingClientRect();
    this.X = bound.x;
    this.Y = bound.y;
  }

  GetCx(ev: TouchEvent | MouseEvent) {
    return Math.floor(
      ((ev as MouseEvent).clientX ||
        (ev as TouchEvent).targetTouches[0].clientX) - this.X
    );
  }

  GetCy(ev: TouchEvent | MouseEvent) {
    return Math.floor(
      ((ev as MouseEvent).clientY ||
        (ev as TouchEvent).targetTouches[0].clientY) - this.Y
    );
  }

  Down(ev: TouchEvent | MouseEvent) {
    if (!this.ctx) return;
    let cx = this.GetCx(ev);
    let cy = this.GetCy(ev);

    clearTimeout(this.timer);
    this.old_X = cx;
    this.old_Y = cy;
    this.ctx.beginPath();
    this.isClick = true;
  }
  Move(ev: TouchEvent | MouseEvent) {
    if (!this.ctx) return;
    ev.preventDefault();
    if (this.isClick) {
      let cx = this.GetCx(ev);
      let cy = this.GetCy(ev);

      this.clickX.push(cx);
      this.clickY.push(cy);
      this.clickC.push(0);
      //画图
      this.ctx.strokeStyle = "#000";
      this.ctx.fillStyle = "#000";
      this.ctx.lineWidth = 8;
      this.ctx.lineCap = "round";
      this.ctx.moveTo(this.old_X, this.old_Y);
      this.ctx.lineTo(cx, cy);
      this.ctx.stroke();
      this.old_X = cx;
      this.old_Y = cy;
    }
  }
  Mouseup() {
    // console.log("滑动结束");
    if (this.isClick) {
      this.isClick = false;
      this.timer = window.setTimeout(() => {
        this.Reload();
      }, 1500);
      //标记最后一点为终点
      this.clickC.pop();
      this.clickC.push(1);
      this.GetText();
    }
  }
  Leave() {
    if (this.isClick) {
      this.isClick = false;
      this.timer = window.setTimeout(() => {
        this.Reload();
      }, 1000);
      //标记最后一点为终点
      this.clickC.pop();
      this.clickC.push(1);
      this.GetText();
    }
  }
  //初始化
  Reload() {
    if (!this.ctx) return;
    this.clickX = [];
    this.clickY = [];
    this.clickC = [];
    this.ctx.clearRect(0, 0, this.p_width, this.p_height);
    this.ctx.fillStyle = "rgba(238,111,111,0.2)";
    this.ctx.font = "bold 100px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "手写区域",
      this.canvas.width / 2,
      this.canvas.height / 2,
      1000
    );
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#aaa";
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([0, 0]);
  }
  //获取文字
  GetText() {
    handWrite
      .GetWords(this.clickX, this.clickY, this.clickC)
      .then((res) => {
        this.write_result_temp = res;
        this.$emit("result", res);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //选择文字
  Select(text: string) {
    this.$emit("SelectText", text);
    this.write_result_temp = [];
    this.Reload();
    clearTimeout(this.timer);
  }
}
</script>

<style lang="scss" scoped>
.keyboard-paint__primary {
  $p-td-width: 110px;
  .result-table {
    td {
      width: $p-td-width;
    }
  }
}
.keyboard-paint__mini {
  $p-td-width: 90px;
  .result-table {
    td {
      width: $p-td-width;
    }
  }
}
.keyboard-paint {
  display: inline-block;
  vertical-align: middle;
  .canvas-box {
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    font-size: 0px;
    > canvas {
      border-radius: 3px;
      border: 1px solid #aaa;
    }
  }
  .result-table {
    display: inline-table;
    vertical-align: middle;
    margin-left: 8px;
    border-spacing: 2px;
    td {
      border-radius: 3px;
      border: 1px solid #aaa;
      // width: 90px;
      // height: 90px;
      font-size: 40px;
      font-weight: bold;
      background: #fff;
      font-family: simsun;
      &:active {
        background: #aaa;
      }
    }
  }
}
</style>
