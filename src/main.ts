import axios from "axios";
import { useCacheInterceptor } from "../lib/cache";
import { useDebounceInterceptor } from "../lib/debounce";
import { useTimestampInterceptor } from "../lib/timestamp";
import { merge } from 'lodash-es'

const selfAxios = axios.create()
useCacheInterceptor({ axios: selfAxios })
useDebounceInterceptor({ axios: selfAxios })
useTimestampInterceptor({ axios: selfAxios })
selfAxios.defaults.baseURL = 'https://apigatewayuat.oppein.com'
selfAxios.interceptors.request.use((config) => {
  return merge({}, config, {
    headers: {
      'Oauth2-AccessToken': 'bc1694aa751aeb9ba091573adbe4b1a7u',
      AppCode: 'CAXA',
      SubAppCode: "CAXAPC001"
    }
  })
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
  reqGetCurrentUser()
  await reqGetCurrentUser()
})()
