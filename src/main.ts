import axios from "axios";
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
      'Oauth2-AccessToken': '853140873a38f6a70fe8754c90e828c4u',
      AppCode: 'CAXA',
      SubAppCode: "CAXAPC001"
    }
  }
})
async function reqGetCurrentUser() {
  const axiosParams = { platformType: 'MTDS' }
  try {
    const { data: { data } } = await selfAxios.get<any>('/ucenterapi/uc/internal/common/getCurrentUser2', { params: axiosParams, _cache: true })
    return data
  } catch (error) {
    console.log(error)
  }
}
(async function init() {
  reqGetCurrentUser().then(a => {
    console.log(a)
  })
  const b = await reqGetCurrentUser()
  console.log(b)
  const c = await reqGetCurrentUser()
  console.log(c)
})()
