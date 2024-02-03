import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useInterceptor } from '../lib/main'
const selfAxios = axios.create()
selfAxios.defaults.headers.common = {
  Appcode: 'MTDS',
  Subappcode: 'MTDSPC001',
  "Oauth2-Accesstoken": 'c18fd83e3d116cf418c2a1c46707b0dfu'
}

const requestListChange = (configs: AxiosRequestConfig[]) => {
  console.log(configs)
}
const isRetry = (err: AxiosError) => {
  return !!err.response?.status && err.response.status >= 500 && err.response.status < 600
}
const { doRetry } = useInterceptor({
  axios: selfAxios,
  useCache: {
    isSuccess: (value) => {
      return value.data.status
    }
  },
  useDebounce: true,
  useTimestamp: true,
  useRetry: {
    isRetry
  },
  useChange: {
    requestListChange
  }
})
function getCurrentUser() {
  return selfAxios.get('https://apigatewayuat.oppein.com/ucenterapi/uc/internal/common/getCurrentUser', {
    params: {
      platformType: 'MTDS'
    },
    _cache: true,
    _delCache: (cacheMap) => {
    }
  })
}
async function init() {
  getCurrentUser().then(r => console.log(1, r))
  const r = await getCurrentUser()
  console.log(2, r)
  getCurrentUser().then(r => console.log(3, r))
  const r1 = await getCurrentUser()
  console.log(4, r1)
}
init()