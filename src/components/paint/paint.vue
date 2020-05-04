<template>
  <div class="keyboard-paint" style="margin-top:5px;">
    <div class="canvas-box">
      <canvas
        :width="p_width"
        :height="p_height-4"
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
        <td @click="Select(text)" v-for="(text, index) in item" :key="index">{{text}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getHandWrite, HandWrite } from "./handWrite";

let handWrite: HandWrite;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

interface DataOps {
  handWrite: string;
  write_result_temp: [string[], string[], string[], string[]];
  isClick: boolean;
  //轨迹X
  clickX: number[];
  //轨迹Y
  clickY: number[];
  //轨迹标志位，为1则是终点
  clickC: number[];
  X: number;
  Y: number;
  old_X: number;
  old_Y: number;
  timer: number;
  tStyle: any;
}

export default Vue.extend({
  name: "Paint",
  mounted() {
    handWrite = getHandWrite(this.handWriteApi || this.dllPath);
    // console.log(this.handWriteApi);
    handWrite.createLib(this.lib).catch(err => {
      console.error(err);
    });
    this.$nextTick(() => {
      canvas = this.$refs.canvas as HTMLCanvasElement;
      ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      this.Reload();
      this.UpdateBound();
      window.addEventListener("scroll", this.UpdateBound.bind(this));
      this.$on("UpdateBound", this.UpdateBound.bind(this));
    });
    this.write_result = [];
  },
  beforeDestroy() {
    //清除监听
    window.removeEventListener("scroll", this.UpdateBound.bind(this));
  },
  props: {
    show_result: { type: Boolean, default: () => true },
    p_width: { type: Number, default: () => 600 },
    p_height: { type: Number, default: () => 400 },
    lib: { type: String, default: () => "CN" },
    handWriteApi: String,
    dllPath: String
  },
  data(): DataOps {
    let t_height = this.p_height;
    let t_width = t_height * (3 / 4);
    return {
      handWrite: "",
      write_result_temp: [[], [], [], []],
      isClick: false,
      //轨迹X
      clickX: [],
      //轨迹Y
      clickY: [],
      //轨迹标志位，为1则是终点
      clickC: [],
      X: 0,
      Y: 0,
      old_X: 0,
      old_Y: 0,
      timer: 0,
      tStyle: {
        height: t_height + "px",
        width: t_width + "px"
      }
    };
  },
  computed: {
    write_result: {
      get(): [string[], string[], string[], string[]] {
        return this.write_result_temp;
      },
      set(val: string[]) {
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
        this.write_result_temp = [
          val.slice(0, 3),
          val.slice(3, 6),
          val.slice(6, 9),
          val.slice(9, 12)
        ];
      }
    }
  },
  watch: {
    lib(val) {
      handWrite.createLib(val);
    }
  },
  methods: {
    nextTick() {},
    /**更新canvas位置*/
    UpdateBound() {
      let bound = canvas.getBoundingClientRect();
      this.X = bound.x;
      this.Y = bound.y;
    },
    Down(ev: TouchEvent | MouseEvent) {
      let cx = Math.floor(
        ((ev as MouseEvent).clientX ||
          (ev as TouchEvent).targetTouches[0].clientX) - this.X
      );
      let cy = Math.floor(
        ((ev as MouseEvent).clientY ||
          (ev as TouchEvent).targetTouches[0].clientY) - this.Y
      );

      clearTimeout(this.timer);
      this.old_X = cx;
      this.old_Y = cy;
      ctx.beginPath();
      this.isClick = true;
    },
    Move(ev: TouchEvent | MouseEvent) {
      ev.preventDefault();
      if (this.isClick) {
        let cx = Math.floor(
          ((ev as MouseEvent).clientX ||
            (ev as TouchEvent).targetTouches[0].clientX) - this.X
        );
        let cy = Math.floor(
          ((ev as MouseEvent).clientY ||
            (ev as TouchEvent).targetTouches[0].clientY) - this.Y
        );

        this.clickX.push(cx);
        this.clickY.push(cy);
        this.clickC.push(0);
        //画图
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.moveTo(this.old_X, this.old_Y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        this.old_X = cx;
        this.old_Y = cy;
      }
    },
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
    },
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
    },
    //初始化
    Reload() {
      if (!canvas) return;
      this.clickX = [];
      this.clickY = [];
      this.clickC = [];
      ctx.clearRect(0, 0, this.p_width, this.p_height);
      ctx.fillStyle = "rgba(238,111,111,0.2)";
      ctx.font = "bold 100px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("手写区域", canvas.width / 2, canvas.height / 2, 1000);
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([0, 0]);
    },
    //获取文字
    GetText() {
      handWrite
        .GetWords(this.clickX, this.clickY, this.clickC)
        .then(res => {
          this.write_result = res;
          this.$emit("result", res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    //选择文字
    Select(text: string) {
      this.$emit("SelectText", text);
      this.write_result = [];
      this.Reload();
      clearTimeout(this.timer);
    }
  }
});
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
