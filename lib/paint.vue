<template>
  <div :class="'keyboard-paint keyboard-paint__'+size" style="margin-top:5px;">
    <div class="canvas-box">
      <canvas
        :width="p_width*0.4"
        :height="p_height-10"
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
    <table class="result-table">
      <tr v-for="(item, index) in write_result" :key="index">
        <td @click="Select(text)" v-for="(text, index) in item" :key="index">{{text}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import getHandWrite from "./handWrite/index";

export default {
  mounted() {
    this.handWrite = getHandWrite(this.HandWriteApi);
    // console.log(this.HandWriteApi);
    this.handWrite.createLib(this.lib);
    let _this = this;
    this.$nextTick(() => {
      _this.ctx = _this.$refs.canvas.getContext("2d");
      // console.log(_this.ctx);

      _this.Reload();
      _this.UpdateBound();
      // window.onscroll = _this.UpdateBound
      window.addEventListener("scroll", _this.UpdateBound);
    });
    this.write_result = [];
    // console.log(this.write_result);
  },
  beforeDestroy() {
    //清除监听
    window.removeEventListener("scroll", this.UpdateBound);
  },
  props: {
    size:String,
    p_width: [String, Number],
    p_height: [String, Number],
    lib: {
      type: String,
      default: "CN"
    },
    HandWriteApi: [String]
  },
  data() {
    return {
      handWrite: "",
      write_result_temp: [],
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
      tiemr: 0,
      ctx: null
    };
  },
  computed: {
    write_result: {
      get() {
        return this.write_result_temp;
      },
      set(val) {
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
      this.handWrite.createLib(val);
    }
  },
  methods: {
    /**更新canvas位置*/
    UpdateBound() {
      let bound = this.$refs.canvas.getBoundingClientRect();
      this.X = bound.x;
      this.Y = bound.y;
    },
    Down(e) {
      let cx = parseInt((e.clientX || e.targetTouches[0].clientX) - this.X);
      let cy = parseInt((e.clientY || e.targetTouches[0].clientY) - this.Y);

      clearTimeout(this.timer);
      this.old_X = cx;
      this.old_Y = cy;
      let ctx = this.$refs.canvas.getContext("2d");
      ctx.beginPath();
      this.isClick = true;
    },
    Move(e) {
      e.preventDefault();
      if (this.isClick) {
        let cx = parseInt((e.clientX || e.targetTouches[0].clientX) - this.X);
        let cy = parseInt((e.clientY || e.targetTouches[0].clientY) - this.Y);

        this.clickX.push(cx);
        this.clickY.push(cy);
        this.clickC.push(0);
        //画图
        let ctx = this.$refs.canvas.getContext("2d");
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
    Mouseup(e) {
      // console.log("滑动结束");
      if (this.isClick) {
        this.isClick = false;
        let _this = this;
        this.timer = setTimeout(() => {
          _this.Reload();
        }, 1500);
        //标记最后一点为终点
        this.clickC.pop();
        this.clickC.push(1);
        this.GetText();
      }
    },
    Leave(e) {
      if (this.isClick) {
        this.isClick = false;
        let _this = this;
        this.timer = setTimeout(() => {
          _this.Reload();
        }, 1000);
        //标记最后一点为终点
        this.clickC.pop();
        this.clickC.push(1);
        this.GetText();
      }
    },
    //初始化
    Reload() {
      if (!this.$refs.canvas) return;
      this.clickX = [];
      this.clickY = [];
      this.clickC = [];
      let ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.p_width, this.p_height);
      ctx.fillStyle = "rgba(238,111,111,0.2)";
      ctx.font = "bold 100px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "手写区域",
        this.$refs.canvas.width / 2,
        this.$refs.canvas.height / 2,
        [1000]
      );
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(0, this.$refs.canvas.height / 2);
      ctx.lineTo(this.$refs.canvas.width, this.$refs.canvas.height / 2);
      ctx.stroke();
      ctx.moveTo(this.$refs.canvas.width / 2, 0);
      ctx.lineTo(this.$refs.canvas.width / 2, this.$refs.canvas.height);
      ctx.stroke();
      ctx.setLineDash([0, 0]);
    },
    //获取文字
    GetText() {
      this.handWrite
        .GetWords(this.clickX, this.clickY, this.clickC)
        .then(res => {
          this.write_result = res.data||res;
        })
        .catch(err => {
          console.error(err);
        });
    },
    //选择文字
    Select(text) {
      this.$emit("SelectText", text);
      this.write_result = [];
      this.Reload();
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './style/primary.scss';
@import './style/mini.scss';
.keyboard-paint {
  display: inline-block;
  vertical-align: middle;
  .canvas-box {
    display: inline-block;
    vertical-align: middle;
    background: #fff;
    font-size: 0px;
    #canvas {
      border: 1px solid #aaa;
    }
  }
  .result-table {
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
    td {
      border: 1px solid #aaa;
      // width: 90px;
      height: 90px;
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
