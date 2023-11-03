<template>
  <div class='loadingBox' :style="`background:rgba(52, 53, 65,${$store.state.isShowLoading.opacity})`">
    <div class="loading">
      <div class="loadingIcon">
        <span class="iconfont icon-loading"></span>
      </div>
      <span class="text">{{ $store.state.isShowLoading.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  computed: {},

  mounted() { },
  watch: {
  },
  methods: {}
}

</script>
<style lang='less' scoped>
.loadingBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgb(52, 53, 65);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    position: relative;

    .loadingIcon {
      .iconfont {
        font-size: 38px;
        animation: rotateA 2s linear infinite;
        display: inline-block;

        @keyframes rotateA {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }
      }
    }


    .text {
      position: absolute;
      top: 120%;
      white-space: nowrap;
    }
  }
}
</style>