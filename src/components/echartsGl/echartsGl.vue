<template>
  <div class='echartsGlBox'>
    <div id="chart-panel"></div>
  </div>
</template>

<script>
import { getPie3D, getParametricEquation } from '@/utils/getPie3D.js'
import * as echarts from 'echarts';
import "echarts-gl";
let selectedIndex = '';
export default {
  components: {
  },
  data() {
    return {

    }
  },
  props: {
    charData: null,
  },
  mounted() {
    this.draw3d();
    this.$nextTick(() => {
      let parent = document.getElementById("chart-panel"); // 获取父元素
    });
  },
  methods: {
    fontSize(res) {
      let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = clientWidth / 1920;
      return res * fontSize;
    },
    draw3d() {
      if (!this.charData) {
        return
      }
      for (let i = 0; i < this.charData.xData.length; i++) {
        delete this.charData.xData[i].itemStyle.opacity;
      }
      // 基于准备好的dom，初始化echarts实例
      let chartPanel = echarts.init(document.getElementById("chart-panel"));
      // 传入数据生成 option
      let series = getPie3D(this.charData.xData, 1.7);
      let legendData = []
      for (let item of this.charData.xData) {
        legendData.push(item.name)
      }
      let option = {
        tooltip: {
          formatter: (params) => {
            let seriesName = params.seriesName;
            if (seriesName == "pie2d" || seriesName == "mouseoutSeries") return
            let proportion = option.series[params.seriesIndex].pieData.proportion * 100
            return `<div style="padding:0 10px;border:none">
                <span style='background:${option.series[params.seriesIndex].pieData.itemStyle.color}'></span>
                ${seriesName}:${(proportion).toFixed(2)}%
                </div>`;
          },
        },

        xAxis3D: {
          min: -1,
          max: 1,
        },
        yAxis3D: {
          min: -1,
          max: 1,
        },
        zAxis3D: {
          min: -1,
          max: 1,
        },
        grid3D: {
          show: false, //是否显示三维笛卡尔坐标系。
          boxHeight: 5, //三维笛卡尔坐标系在三维场景中的高度
          top: "-20%",
          left: "-24%",
          // bottom: "80%",
          // environment: "#021041", //背景
          viewControl: {
            //用于鼠标的旋转，缩放等视角控制
            alpha: 100, //角度
            distance: 250, //调整视角到主体的距离，类似调整zoom 重要
            rotateSensitivity: 5, //设置为0无法旋转
            zoomSensitivity: 0, //设置为0无法缩放
            panSensitivity: 0, //设置为0无法平移
            autoRotate: false, //自动旋转
          },
        },
        series: series,
      };
      option.series.push({
        name: "pie2d",
        type: "pie",
        label: {
          color: "#fff",
          fontSize: 16,
          show: false,
        },
        labelLine: {
          length: 20,
          length2: 20,
          lineStyle: {
            color: "#ffffff",
            width: 1.5,
          },
          show: false
        },
        startAngle: 321, //起始角度，支持范围[0, 360]。 //重要
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ["28%", "48%"],
        center: ["40%", "40%"],
        data: this.charData.xData,
        itemStyle: {
          opacity: 1,
        },
        top: "-16%",
        left: "-23%",
        avoidLabelOverlap: false, //防止标签重叠
      });
      chartPanel.setOption(option);
      setTimeout(() => {
        option.grid3D.viewControl.alpha = 30
        chartPanel.setOption(option);
      }, 1300);
      setTimeout(() => {
        option.series[option.series.length - 1].itemStyle.opacity = 0
        option.legend = {
          show: true,
          data: legendData,
          textStyle: {
            color: "#fff",
            fontSize: this.fontSize(14),
          },
          top: "10%",
          right: "right",
          right: "10%",
          orient: 'vertical',
        },
          chartPanel.setOption(option);
      }, 1300);
      chartPanel.on('click', function (params) {
        let currSeries = option.series[params.seriesIndex];
        if (!currSeries || !currSeries.pieStatus || !currSeries.pieData) return
        let isSelected = !currSeries.pieStatus.selected;
        let isHovered = currSeries.pieStatus.hovered;
        let k = currSeries.pieStatus.k;
        let startRatio = currSeries.pieData.startRatio;
        let endRatio = currSeries.pieData.endRatio;

        // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
        if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
          option.series[selectedIndex].parametricEquation = getParametricEquation(
            option.series[selectedIndex].pieData.startRatio,
            option.series[selectedIndex].pieData.endRatio,
            false,
            false,
            k
          );
          option.series[selectedIndex].pieStatus.selected = false;
        }

        // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
        option.series[params.seriesIndex].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          isHovered,
          k,
          3
        );
        option.series[params.seriesIndex].pieStatus.selected = isSelected;

        // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
        isSelected ? (selectedIndex = params.seriesIndex) : null;

        // 使用更新后的 option，渲染图表
        chartPanel.setOption(option);
      });
    }
  }
}

</script>
<style lang='less'>
.echartsGlBox {
  width: 100%;
  height: 100%;

  #chart-panel {
    width: 100%;
    height: 100%;

    >div:last-child {
      background: #0000008f !important;
      color: #fff !important;
      border-radius: 5px !important;
      border: none !important;

      span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }

    >div {
      transform-style: preserve-3d;
      perspective: 800px;
      perspective-origin: 50% 0%;

      >canvas:first-child {
        opacity: 0;
        animation: fadeIn 1s forwards step-end;

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      }

      >canvas:not(:first-child) {
        opacity: 1;
        // animation: fadeOut 1.5s forwards step-end;
        pointer-events: none;

        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>