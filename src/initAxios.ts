import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAwaitInterceptor, useCacheInterceptor, useDebounceInterceptor, useTimestampInterceptor } from '../lib/index'
import { selfAxios } from "./selfAxios";

useAwaitInterceptor({
  axios: selfAxios,
  awaitFun(config: InternalAxiosRequestConfig) {
    if (config._awaitSign === 'await') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('')
        }, 1000)
      })
    }
  }
})
useTimestampInterceptor({
  axios: selfAxios,
  timestampKey: 'timestamp'
})
useCacheInterceptor({
  axios: selfAxios,
  isSuccessResponse: (value: AxiosResponse): boolean => {
    return value.status >= 200 && value.status < 300 && value.data && value.data.status
  }
})
useDebounceInterceptor({ axios: selfAxios })


