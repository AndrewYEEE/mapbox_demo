<template>
  <div class='developerToolBox' v-if="$store.state">
    <div class="developerNeedsItem" v-for="item, index in developerNeed">
      <span :title="index">{{ index }}</span>
      <span :title="item">
        {{ item }}
      </span>
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
  computed: {
    developerNeed() {
      let center
      try {
        center = this.$store.state.currMapData.center.toArray().flat()
      } catch {
        center = this.$store.state.currMapData.center
      }
      return {
        "loadingState": this.$store.state.isShowLoading.value,
        "loadingItemsWaiting": this.$store.state.loadingList.length,
        // "fps": this.$store.state.fps,
        "layerCount": this.$store.state.layerList.length,
        "zoom": this.$store.state.currMapData.zoom,
        "bearing": this.$store.state.currMapData.bearing,
        "pitch": this.$store.state.currMapData.pitch,
        "center": center
      }
    }
  },

  mounted() { },

  methods: {}
}

</script>
<style lang='less' scoped>
.developerToolBox {
  display: flex;
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: #343541b9;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  z-index: 9999999;
  display: flex;
  flex-direction: column;

  .developerNeedsItem {
    display: flex;
    gap: 15px;
    align-items: center;
    justify-content: center;

    span {
      cursor: pointer;
    }

    span:first-child {
      flex: 1;
      text-align: left;
    }

    span:last-child {
      text-align: left;
      overflow: hidden;
    }
  }
}
</style>