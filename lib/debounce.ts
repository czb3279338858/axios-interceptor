import { AxiosInstance, InternalAxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from "axios";
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
  const promiseParamsMap = new Map<string, { resolve: (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void, reject: (reason?: any) => void }>()
  axios.interceptors.request.use(function (config): InternalAxiosRequestConfig {
    if (config._noDebounce) return config
    const key = getKey(config)
    const adapterPromise = promiseMap.get(key)
    if (adapterPromise) {
      config.adapter = () => adapterPromise
      return config
    } else {
      const adapterPromise: AxiosPromise = new Promise((resolve, reject) => {
        promiseParamsMap.set(key, { resolve, reject })
      })
      promiseMap.set(key, adapterPromise)
      return config
    }
  })
  axios.interceptors.response.use(function (value): AxiosResponse {
    const key = getKey(value.config)
    const promiseParams = promiseParamsMap.get(key)
    if (promiseParams?.resolve) promiseParams.resolve(value)
    promiseMap.delete(key)
    promiseParamsMap.delete(key)
    return value
  }, function (err: AxiosError) {
    if (err.config) {
      const key = getKey(err.config)
      const promiseParams = promiseParamsMap.get(key)
      if (promiseParams?.reject) promiseParams.reject(err)
      promiseMap.delete(key)
      promiseParamsMap.delete(key)
    }
    throw err
  })
}