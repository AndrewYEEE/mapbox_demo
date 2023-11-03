<template>
  <div ref="basicMapbox" id="basicMapbox" style="position: relative" class="basicMapbox"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { ref } from 'vue';
import request from '@/utils/request';
export default {
  components: {},
  data() {
    return {
      map: null,
      start: {
        // 起始位置
        // center: [109, 19],
        center: [118, 28],
        zoom: 3,
        pitch: 0,
        bearing: 0,
      },
      mapboxOptions: {
        container: "basicMapbox",
        style: 'mapbox://styles/zbben/ckus1uok22m4117pif4pg9qa6/draft',
        ...this.start,
        projection: 'globe', // 为 3D 地球
        antialias: false, //抗锯齿，通过false关闭提升性能
        essential: true,
        renderWorldCopies: false,
        skipOnboarding: true
      },
      end: {
        // 目标位置
        center: [118.508031, 28.901686], //目标中心点 常山县
        // center: [109.906999, 19.147333], //目标中心点 海南省琼中县湾岭镇
        zoom: 12, //目标缩放级别
        bearing: 0, //目标方位角
        pitch: 70, //目标倾斜角
      },
      basicMapbox: ref(null),
      pointExists: false,
      firstLoad: false,
    }
  },
  computed: {
    normalStyleIndex() {
      return this.$parent.$refs.normalStyleIndex
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      this.$store.dispatch('loadingStart', {
        text: "正在加载地图"
      })
      mapboxgl.accessToken = 'pk.eyJ1IjoiemJiZW4iLCJhIjoiY2tpemtnOXRoMDRhcDMwbG43aGYxbXhqYyJ9.YOJzSXzubWJBJeK7SXg60w';
      this.map = new mapboxgl.Map(this.mapboxOptions);
      this.map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }));
      // ### 添加导航控制条
      // this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      this.map.on('load', async () => {
        console.log('mapbox', "loaded");
        this.firstLoad = true
        this.map.setFog({});
        this.normalStyleIndex.mapLoadingDown = true
        this.setShape()
        await this.preFlyto()
        this.$store.dispatch('loadingDone')
        await this.flyToEnd()
        await this.getRemote(1)
        await this.getSoilPoint()
        this.firstLoad = false
        // this.map.on('moveend', async () => {
        //   this.setDeveloperData()
        // })
      })
      this.$store.state.layerList = []
    },
    setDeveloperData() {
      // 开发者小窗数据
      this.$store.dispatch('refreshCurrMapData', {
        center: this.map.getCenter(),
        zoom: parseInt(this.map.getZoom()),
        bearing: this.map.getBearing(),
        pitch: this.map.getPitch(),
      })
    },
    async getSoilPoint() {
      if (this.pointExists) {
        return
      }
      this.pointExists = true
      let soilPoint = await request.get("soitPoint", {
        appCode: "changshan"
      })
      for (let item of soilPoint.result) {
        let marker = new mapboxgl.Marker()
          .setLngLat([item.lon, item.lat])
          .addTo(this.map);
        // 添加标记的弹窗事件
        var popup = new mapboxgl.Popup()
          .setHTML(`<h3>${item.name}</h3>`)
        marker.setPopup(popup);
        // 点击标记时显示弹窗
        marker.on('click', function () {
          marker.togglePopup();
        });
      }
      this.$store.dispatch('addLayer')
    },
    setShape() {
      let shape = require('@/assets/geojson/常山县.shp.json')
      this.map.addSource('changshan', {
        "type": "geojson",
        "data": shape
      });
      this.map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'changshan',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#00FFF4',
          'line-width': 2.5,
          'line-opacity': 1,
          'line-gap-width': 0
        },
      });
      this.$store.dispatch('addLayer')
    },
    async flyToEnd() {
      await new Promise((resolve, reject) => {
        this.map.flyTo({
          ...this.end,
          duration: 8000,
        })
        setTimeout(() => {
          resolve()
        }, 8000);
      })
    },
    async preFlyto() {
      this.$store.dispatch('loadingStart', {
        text: '正在寻找基地'
      })
      // 预飞，防止第一次飞行时卡顿
      await new Promise((resolve, reject) => {
        this.map.flyTo({
          ...this.end,
          duration: 4000,
        })
        setTimeout(() => {
          resolve()
        }, 4000);
      })
      this.$store.dispatch('loadingDone')
      this.$store.dispatch('loadingStart', {
        text: '即将呈现...'
      })
      await new Promise((resolve, reject) => {
        this.map.flyTo({
          ...this.start,
          duration: 4000,
        })
        setTimeout(() => {
          resolve()
        }, 4000);
      })
      this.$store.dispatch('loadingDone')
    },
    async getRemote(type = 1) {
      const remoteData = await request.get(`youchaRemote`, {
        appCode: "changshan",
        type: type
      })
      let resData = remoteData.result[0]
      this.$parent.$refs.normalStyleIndex.remoteData = resData
      if (this.map.getLayer('wms-test-layer')) {
        this.map.removeLayer('wms-test-layer')
      }
      this.map.getSource('wms-test-source') && this.map.removeSource('wms-test-source')
      this.map.addSource('wms-test-source', {
        'type': 'raster',
        'tiles': [
          `https://youcha.sino-eco.com/geoserver/you_cha/wms?service=WMS&request=GetMap&version=1.1.1&layers=${resData.wmsLayer}&styles=&format=image/png&transparent=true&INFO_FORMAT=application/json&width=1920&height=929&srs=EPSG:3857&bbox={bbox-epsg-3857}`
        ],
      })
      await this.setRemoteLayer()
    },
    async setRemoteLayer() {
      if (this.map.getLayer('wms-test-layer')) {
        this.map.removeLayer('wms-test-layer')
      }
      await this.map.addLayer(
        {
          'id': 'wms-test-layer',
          'type': 'raster',
          'source': 'wms-test-source',
        }
      );
      this.$store.dispatch('addLayer')
    },
    lonLatToMeters(lon, lat) {
      // 经纬度转墨卡托
      var x = lon * 20037508.34 / 180;
      var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
      y = y * 20037508.34 / 180;
      return [x, y];
    },
    async fakeLoading() {
      this.$store.dispatch('loadingStart')
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$store.dispatch('loadingDone');
          resolve()
        }, 3000);
      })
    }
  }
}

</script>
<style lang='less' scoped>
.basicMapbox {
  width: 100%;
  height: 100%;
}
</style>
<style>
.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}

.mapboxgl-ctrl-icon {
  box-sizing: border-box;
}
</style>