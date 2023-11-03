import jsonpath from 'jsonpath'
const apis = {
  sinosaas: {
    baseUrl: "https://sinosaas.sino-eco.com/",
    uri: {

    },
  },
  youcha: {
    baseUrl: "https://youcha.sino-eco.com/",
    uri: {
      soitPoint: {
        topic: "soitPoint",
        uri: "you-cha/changshan/youchaRemote/selectYouchaSoilPoint",
        pramas: {
          appCode: "changshan"
        }
      },
      youchaRemote: {
        topic: "youchaRemote",
        uri: "you-cha/changshan/youchaRemote/queryRemotes",
        pramas: {
          appCode: "changshan",
          type: Number
        }
      }
    },
  },
  wulianwang: {
    baseUrl: "https://wulianwang.sino-eco.com/",
    uri: {
      weather: {
        topic: "weather",
        uri: "gao-ming2/xinZhiWeather/api/area-to-weather",
        pramas: {
          area: String
        }
      },
    }
  }
}
const getUrl = (topic) => {
  let path = jsonpath.paths(apis, `$..[?(@.topic=='${topic}')]`)
  let { baseUrl } = jsonpath.query(apis, `$.${path[0][1]}`)[0]
  let { uri } = jsonpath.query(apis, `$..[?(@.topic=='${topic}')]`)[0]
  return baseUrl + uri
}
export default getUrl