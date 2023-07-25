import axios from "axios";
import { useAwaitInterceptor, useCacheInterceptor, useDebounceInterceptor, useTimestampInterceptor } from '../lib/index'
const selfAxios = axios.create()
useAwaitInterceptor({
  axios: selfAxios, awaitFun() {
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
      'Oauth2-Accesstoken': '332f61b4c7a2563aa205a6a8b8e9fae0u',
      Appcode: 'MTDS',
      Subappcode: 'MTDSPC001'
    },
    _cache: true,
    _await: true
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