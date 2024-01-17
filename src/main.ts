import axios, { AxiosRequestConfig } from "axios";
import { useCacheInterceptor } from "../lib/cache";
import { useDebounceInterceptor } from "../lib/debounce";
import { useTimestampInterceptor } from "../lib/timestamp";
import { merge } from 'lodash-es'

const selfAxios = axios.create()
useCacheInterceptor({ axios: selfAxios })
useTimestampInterceptor({ axios: selfAxios })
useDebounceInterceptor({ axios: selfAxios })

merge(selfAxios.defaults, {
  baseURL: "https://apigatewayuat.oppein.com",
  headers: {
    common: {
      'Oauth2-AccessToken': 'beaca69341df8952dbbb1f3ed6d02a2eu',
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
  reqGetCurrentUser()
  await reqGetCurrentUser()
  const ret = await reqGetCurrentUser()
  debugger
})()
