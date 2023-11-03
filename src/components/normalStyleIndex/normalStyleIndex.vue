<template>
  <div class='normalStyleIndexBox' v-if="mapLoadingDown">
    <div class="header">
      <div class="liuguang">
        <img src="@/assets/img/1.webp" alt="">
      </div>
    </div>
    <div class="body">
      <div class="left">
        <div class="btns">
          <span class="btnItem" v-for="item in leftBtns" @click="handleEvents(item.method)">
            {{ item.name }}
          </span>
        </div>
      </div>
      <div class="right">
        <div class="echartsGl">
          <echartsGl v-if="isShowEchartsGl" :charData="charData" />
        </div>
        <div class="lottieView" id="lottieView"></div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import lottie from 'lottie-web'
import animationData from "@/assets/lottie/34.json";
import echartsGl from '../echartsGl/echartsGl.vue';
export default {
  components: {
    echartsGl
  },
  data() {
    return {
      leftBtns: [
        {
          name: "changeRemote",
          method: "changeRemote"
        },
        {
          name: "randomPitch",
          method: "randomPitch"
        },
        {
          name: "randomBearing",
          method: "randomBearing"
        },
        {
          name: "randomZoom",
          method: "randomZoom"
        },
        {
          name: "randomView",
          method: "randomView"
        },
        {
          name: "placeHoder",
          method: "placeHoder"
        },
        {
          name: "placeHoder",
          method: "placeHoder"
        },
        {
          name: "placeHoder",
          method: "placeHoder"
        },
        {
          name: "placeHoder",
          method: "placeHoder"
        }
      ],
      pitch: [0, 20, 40, 60, 80],
      bearing: [0, 45, 90, 120, 180],
      zoom: [4, 5, 6, 7, 8, 9, 10, 11, 12],
      remoteType: [1, 2, 3, 4, 5, 6, 61, 7, 8, 9, 10],
      lastPitch: 0,
      lastBearing: 0,
      lastZoom: 0,
      remoteData: null,
      charData: null,
      isShowEchartsGl: false,
      circleProgressTest: {
        overall: 30,
        padding: 0,
      },
      mapLoadingDown:false
    };
  },
  computed: {
    map(){
      return this.$parent.$refs.mapView.map
    }
  },
  watch: {
    remoteData(val) {
      this.isShowEchartsGl = false
      let levelSizes = val.levelSizes.split(',')
      let colors = val.levelColors.split(',')
      let levels = val.levels.split(',')
      let xData = []
      for (let item of levelSizes) {
        xData.push({
          name: levels.shift(),
          value: ~~item,
          itemStyle: {
            color: colors.shift(),
            opacity: 1
          }
        })
      }
      this.charData = {
        title: val.typeName,
        xData: xData,
        colors: colors,
      }
      setTimeout(() => {
        this.isShowEchartsGl = true
      }, 10);
    }
  },
  mounted() {
    // this.initLottie()
  },

  methods: {
    initLottie() {
      const animation = lottie.loadAnimation({
        container: document.getElementById('lottieView'), // 绑定dom节点
        renderer: 'svg', // 渲染方式:svg、canvas
        loop: true, // 是否循环播放，默认：false
        autoplay: true, // 是否自动播放, 默认true
        animationData: animationData
        // path: "https://assets7.lottiefiles.com/packages/lf20_Lpuvp7YT5K.json" // AE动画使用bodymovie导出为json数据
        // path: "@/assets/lottie/test.json" //
      })
      animation.play();
    },
    handleEvents(methodName) {
      try {
        this[methodName]({
          jump: true,
        })
      } catch (err) {
        console.error('err::: ', err);
        console.log(methodName, "is not a function")
      }
    },
    async changeRemote() {
      this.$store.dispatch("loadingStart", { opacity: 0.7, text: "正在切换遥感数据" });
      await this.$parent.$refs.mapView.getRemote(this.remoteType[Math.floor(Math.random() * this.remoteType.length)], true)
      this.$store.dispatch("loadingDone");
    },
    randomPitch(parma) {
      // 从pitch中随机取一个值
      const randomIndex = Math.floor(Math.random() * this.pitch.length)
      const randomPitch = this.pitch[randomIndex]
      if (parma?.jump) {
        this.setView({
          pitch: randomPitch,
          jump: true
        })
        return
      }
      return randomPitch == this.lastPitch ? this.randomPitch() : randomPitch
    },
    randomBearing(parma) {
      // 从bearing中随机取一个值
      const randomIndex = Math.floor(Math.random() * this.bearing.length)
      const randomBearing = this.bearing[randomIndex]
      if (parma?.jump) {
        this.setView({
          bearing: randomBearing,
          jump: true
        })
        return
      }
      return randomBearing == this.lastBearing ? this.randomBearing() : randomBearing
    },
    randomZoom(parma) {
      // 从zoom中随机取一个值
      const randomIndex = Math.floor(Math.random() * this.zoom.length)
      const randomZoom = this.zoom[randomIndex]
      if (parma?.jump) {
        this.setView({
          zoom: randomZoom,
          jump: true
        })
        return
      }
      return randomZoom == this.lastZoom ? this.randomZoom() : randomZoom
    },
    randomView() {
      // 从三个数组中各随机取一个值
      const randomPitch = this.randomPitch()
      const randomBearing = this.randomBearing()
      const randomZoom = this.randomZoom()
      this.setView({
        pitch: randomPitch,
        bearing: randomBearing,
        zoom: randomZoom,
        jump: true
      })
    },
    setView(parma) {
      // 设置视角
      const { pitch, bearing, zoom } = parma
      this.map.flyTo({
        pitch: pitch ? pitch : this.map.getPitch(),
        bearing: bearing ? bearing : this.map.getBearing(),
        zoom: zoom ? zoom : this.map.getZoom(),
        duration: 1000
      })
      // pitch && this.$parent.$refs.mapView.map.setPitch(pitch)
      // bearing && this.$parent.$refs.mapView.map.setBearing(bearing)
      // zoom && this.$parent.$refs.mapView.map.setZoom(zoom)
    },
  }
}

</script>
<style lang='less' scoped>
.normalStyleIndexBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  display: flex;
  flex-direction: column;

  >.header {
    width: 100%;
    pointer-events: all;
    display: flex;
    transform: translateY(-100%);
    animation: fadeIn 2s ease-in-out forwards;
    animation-delay: 14s;

    .liuguang {
      position: relative;

      img {
        width: 100%;
      }
    }
  }

  .body {
    flex: 1;
    display: flex;
    justify-content: space-between;

    >div {
      width: 25%;
      pointer-events: all;
      background: #83cea815;
      border-radius: 20px;
      color: #fff;
      padding: 20px;
    }

    .left {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 20px;
      transform: translateX(-100%);
      animation: fadeIn 2s ease-in-out forwards;
      animation-delay: 14s;

      .btns {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        gap: 20px;

        .btnItem {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #31db85;
          padding: 4px 20px;
          color: #31db85;
          cursor: pointer;
          transform: translateX(-100%);
          animation: fadeIn 2s ease-in-out forwards;
          opacity: 0;

          &:hover {
            background: #31db85;
            color: #fff;
          }
        }

        .looping(@index, @total) when (@index > 0) {
          @delay: (@index * 0.2)+14.5s; // 根据索引计算延迟

          .btnItem:nth-of-type(@{index}) {
            animation-delay: @delay;
          }

          .looping(@index - 1, @total);
        }

        // 开始循环
        .looping(9, 9);


      }
    }

    .right {
      background: #0000002f;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      animation: fadeIn 2s ease-in-out forwards;
      animation-delay: 14s;

      >div {
        flex: 1;
      }


    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      transform: translateX(0) translateY(0);
      opacity: 1;
    }
  }
}
</style>