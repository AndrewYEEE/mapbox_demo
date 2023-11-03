import axios from "axios"
import api from "./apis"
import qs from "qs"
import store from '@/store/index.js';
// store.state
// axios.defaults.headers.Authorization = "Bearer " + getCookie("access_token")
const request = {
  // 用法如下，调用时需要传入topic（api名），参数随api不同以对应
  post(topic, data) {
    store.dispatch('loadingStart', {
      text: "加载中",
      opacity: 0.5
    })
    return new Promise((resolve, reject) => {
      axios.post(api(topic), data).then(response => {
        store.dispatch('loadingDone')
        resolve(response.data)
      }, err => {
        store.dispatch('loadingDone')
        reject(err)
      })
    })
  },
  get(topic, data) {
    store.dispatch('loadingStart', {
      text: "加载中",
      opacity: 0.5
    })
    return new Promise((resolve, reject) => {
      axios.get(api(topic), {
        params: data
      })
        .then(response => {
          store.dispatch('loadingDone')
          resolve(response.data)
        }, err => {
          store.dispatch('loadingDone')
          reject(err)
        })
    })
  },
  put(topic, data) {
    store.dispatch('loadingStart', {
      text: "加载中",
      opacity: 0.5
    })
    return new Promise((resolve, reject) => {
      axios.put(api(topic), qs.stringify(data))
        .then(response => {
          store.dispatch('loadingDone')
          resolve(response.data)
        }, err => {
          store.dispatch('loadingDone')
          reject(err)
        })
    })
  },
  delete(topic, data) {
    store.dispatch('loadingStart', {
      text: "加载中",
      opacity: 0.5
    })
    return new Promise((resolve, reject) => {
      axios.delete(api(topic), {
        params: data
      })
        .then(response => {
          store.dispatch('loadingDone')
          resolve(response.data)
        }, err => {
          store.dispatch('loadingDone')
          reject(err)
        })
    })
  }
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}
export default request