import { AxiosInstance, InternalAxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosError } from "axios";
import { getKey } from "./getKey";
import { cloneDeep } from "lodash-es";

interface DebounceInterceptorArg {
  getKey?: typeof getKey,
  axios: AxiosInstance,
  requestListChange?: (configList: InternalAxiosRequestConfig[], err?: AxiosError) => void
}
declare module 'axios' {
  export interface AxiosRequestConfig {
    // 当前接口是否不去抖动，用于获取获取唯一id这样的接口
    _noDebounce?: boolean,
    _noHandle?: boolean
  }
}
export function useDebounceInterceptor(arg: DebounceInterceptorArg) {
  const { axios, requestListChange } = arg;
  const promiseMap = new Map<string, AxiosPromise>()
  const resolveMap = new Map<string, (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void>()
  const axiosConfigMap = new Map<string, InternalAxiosRequestConfig>()

  axios.interceptors.request.use(function (config): InternalAxiosRequestConfig {
    if (config._noHandle || config._noDebounce) return config
    const key = getKey(config)
    let promise = promiseMap.get(key)
    if (!promise) {
      promise = new Promise((resolve) => {
        resolveMap.set(key, resolve)
      })
      promiseMap.set(key, promise)

      const axiosConfig = cloneDeep(config)
      axiosConfig._noDebounce = true
      axiosConfigMap.set(key, axiosConfig)
      requestListChange?.(Array.from(axiosConfigMap.values()))
      axios.request(axiosConfig)
    }

    config._noHandle = true
    config.adapter = () => promise as AxiosPromise
    return config
  })
  axios.interceptors.response.use(function (value): AxiosResponse {
    const key = getKey(value.config)
    const resolve = resolveMap.get(key)
    if (resolve) resolve(value)
    promiseMap.delete(key)
    resolveMap.delete(key)
    axiosConfigMap.delete(key)
    requestListChange?.(Array.from(axiosConfigMap.values()))
    return value
  }, err => {
    requestListChange?.(Array.from(axiosConfigMap.values()), err)
  })
}