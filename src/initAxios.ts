import axios from "axios";
import { useAwaitInterceptor, useCacheInterceptor, useDebounceInterceptor, useTimestampInterceptor } from '../lib/index'
const selfAxios = axios.create()
useAwaitInterceptor({
  axios: selfAxios, awaitFun(config) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('')
      }, 5000)
    })
  }
})
useTimestampInterceptor({ axios: selfAxios })
useCacheInterceptor({
  axios: selfAxios,
  isSuccessResponse: (value) => {
    return value.status >= 200 && value.status < 300 && value.data && value.data.status
  }
})
useDebounceInterceptor({ axios: selfAxios })

async function getCurrentUser() {
  const res = await selfAxios.get('https://apigatewayuat.oppein.com/ucenterapi/uc/internal/common/getCurrentUser', {
    params: {
      platformType: 'MTDS'
    },
    headers: {
      'Oauth2-Accesstoken': '3e8d077362086dc664c6c4b0929a5bebu',
      Appcode: 'MTDS',
      Subappcode: 'MTDSPC001'
    },
    _cache: true,
    _awaitSign: true
  })
  console.log(res)
}
async function request() {
  getCurrentUser()
  getCurrentUser()
  await getCurrentUser()
  getCurrentUser()
  getCurrentUser()
}

request()