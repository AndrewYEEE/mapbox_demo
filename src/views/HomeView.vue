<template>
  <div class="home">
    <mapboxView ref="mapView" />
    <loadingView v-if="$store.state.isShowLoading.value" />
    <developerToolView v-if="$store.state.isShowDeveloperTool.value" />
    <normalStyleIndex ref="normalStyleIndex" />
  </div>
</template>

<script>
// @ is an alias to /src
import mapboxView from '@/components/mapboxView/mapboxView.vue';
import loadingView from '@/components/loadingView/loadingView.vue';
import developerToolView from '@/components/developerToolView/developerToolView.vue';
import normalStyleIndex from '@/components/normalStyleIndex/normalStyleIndex.vue';
export default {
  name: 'HomeView',
  components: {
    mapboxView,
    loadingView,
    developerToolView,
    normalStyleIndex,
  },
  methods: {
  }
}
</script>
<style>
.home {
  width: 100vw;
  height: 100vh;
}
</style>
