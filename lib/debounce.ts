import { AxiosInstance, InternalAxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
import { getKey } from "./getKey";

interface DebounceInterceptorArg {
  getKey?: typeof getKey,
  axios: AxiosInstance
}
declare module 'axios' {
  export interface AxiosRequestConfig {
    // 当前接口是否不去抖动，用于获取获取唯一id这样的接口
    _noDebounce?: boolean,
  }
}
export function useDebounceInterceptor(arg: DebounceInterceptorArg) {
  const { axios } = arg;
  const promiseMap = new Map<string, AxiosPromise>()
  const resolveMap = new Map<string, (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void>()
  axios.interceptors.request.use(function (config): InternalAxiosRequestConfig {
    if (config._noDebounce) return config
    const key = getKey(config)
    const adapterPromise = promiseMap.get(key)
    if (adapterPromise) {
      return {
        ...config,
        adapter(config) {
          return adapterPromise
        }
      }
    } else {
      const adapterPromise: AxiosPromise = new Promise((resolve, reject) => {
        resolveMap.set(key, resolve)
      })
      promiseMap.set(key, adapterPromise)
      return config
    }
  })
  axios.interceptors.response.use(function (value): AxiosResponse {
    const key = getKey(value.config)
    const resolve = resolveMap.get(key)
    if (resolve) resolve(value)
    promiseMap.delete(key)
    resolveMap.delete(key)
    return value
  })
}