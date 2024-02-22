import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useInterceptor } from '../lib/main'
const selfAxios = axios.create()
selfAxios.defaults.headers.common = {
  Appcode: 'MTDS',
  Subappcode: 'MTDSPC001',
  "Oauth2-Accesstoken": '58c32fc00a3bdd28e4011237d34c0fe8u'
}

const requestListChange = (configs: AxiosRequestConfig[]) => {
  console.log(configs)
}
const isRetry = (err: AxiosError) => {
  return !!err.response?.status && err.response.status >= 500 && err.response.status < 600
}
const {
  // A method for re-initiating failed requests.
  doRetry
} = useInterceptor({
  axios: selfAxios,
  // Using the data caching feature, data is only cached when isSuccess returns true.
  useCache: {
    isSuccess: (value: AxiosResponse) => value.status >= 200 && value.status < 300
  },
  // Using the request deduplication feature, when a request has not returned, but is initiated again elsewhere, they will be merged into one.
  // But be aware that some interfaces cannot be deduplicated, such as the interface for obtaining the unique id of the uploaded file.
  useDebounce: true,
  // Add a timestamp parameter to the get request.
  useTimestamp: true,
  // When a request fails, it is allowed to re-initiate the request through the doRetry method. The return of isRetry determines whether the request needs to be added to the re-initiation queue.
  useRetry: {
    isRetry: (err: AxiosError) => !!err.response?.status && err.response.status >= 500 && err.response.status < 600
  },
  // The requestListChange method is called when the queue of pending requests changes, and the queue is passed as a parameter. For example, after a request is responded, the number of requests in the queue decreases by 1, and the requestListChange method is triggered.
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