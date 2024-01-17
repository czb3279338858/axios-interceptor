import axios from "axios";
import { useCacheInterceptor } from "../lib/cache";
import { useDebounceInterceptor } from "../lib/debounce";
import { useTimestampInterceptor } from "../lib/timestamp";
import { merge } from 'lodash-es'

const selfAxios = axios.create()
let i = 0
selfAxios.defaults.validateStatus = (status) => {
  return i++ ? status >= 200 && status < 300 : false
}
useCacheInterceptor({ axios: selfAxios })
useTimestampInterceptor({ axios: selfAxios })

useDebounceInterceptor({
  axios: selfAxios, requestListChange(configList, err) {
    if (configList.length && err) {
      configList.forEach(config => selfAxios.request(config))
      debugger
    }
  },
})

merge(selfAxios.defaults, {
  baseURL: "https://apigatewayuat.oppein.com",
  headers: {
    common: {
      'Oauth2-AccessToken': 'd7e50504972d709a0d62037c1cb38e97u',
      AppCode: 'CAXA',
      SubAppCode: "CAXAPC001"
    }
  }
})
async function reqGetCurrentUser() {
  const axiosParams = { platformType: 'MTDS' }
  const {
    data: { data }
  } = await selfAxios.get<any>('/ucenterapi/uc/internal/common/getCurrentUser', { params: axiosParams, _cache: true })
  return data
}
(async function init() {
  reqGetCurrentUser().then(r => {
    console.log(r)
  })
  const a = await reqGetCurrentUser()
  console.log(a)
  const ret = await reqGetCurrentUser()
  console.log(ret)
})()
