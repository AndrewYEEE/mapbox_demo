import { toNumber } from '@vue/shared';
import { createStore } from 'vuex'
const defaultLoadingText = "正在加载...";
const longTimetLoadingText = "这次加载超过了预计时间，您可以刷新网页或耐心等待";
let timeout = null
export default createStore({
  state: {
    isShowLoading: {
      value: true,
      opacity: 1,
      text: defaultLoadingText
    },
    loadingList: [],
    isShowDeveloperTool: {
      value: true
    },
    fps: 0,
    layerList: [],
    currMapData: {
      center: [118.508031, 28.901686], //目标中心点 常山县
      zoom: 11, //目标缩放级别
      bearing: 0, //目标方位角
      pitch: 50, //目标倾斜角
    },
    currRemoteType: 1,
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    refreshCurrMapData(state, data) {
      this.state.currMapData.bearing = data.bearing.toFixed(2)
      this.state.currMapData.center = data.center.toArray().flat().map(item => toNumber(item.toFixed(6)));
      this.state.currMapData.pitch = data.pitch.toFixed(2)
      this.state.currMapData.zoom = data.zoom.toFixed(2)
    },
    loadingStart(state, data) {
      if (timeout) clearTimeout(timeout)
      timeout = null
      timeout = setTimeout(() => {
        this.state.isShowLoading.text = longTimetLoadingText;
        timeout = null
        clearTimeout(timeout)
      }, 60000);
      this.state.isShowLoading.value = false;
      let opacity = 1;
      let text = defaultLoadingText;
      if (data) {
        opacity = data.opacity ? data.opacity : 1;
        text = data.text ? data.text : defaultLoadingText;
      }
      this.state.loadingList.push(new Date().getTime());
      this.state.isShowLoading.opacity = opacity;
      this.state.isShowLoading.text = text;
      this.state.isShowLoading.value = true;
    },
    loadingDone() {
      this.state.loadingList.pop();
      if (this.state.loadingList.length == 0) {
        this.state.isShowLoading.value = false;
      } else {
        this.state.isShowLoading.value = true;
      }
      this.state.isShowLoading.opacity = 1;
      this.state.isShowLoading.text = defaultLoadingText;
    },
    addLayer() {
      this.state.layerList.push(new Date().getTime());
    },
    removeLayer() {
      this.state.layerList.pop();
    }
  },
  modules: {
  }
})
