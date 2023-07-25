import { AxiosInstance, InternalAxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
import { getKey } from "./getKey";

interface DebounceInterceptorArg {
  getKey?: typeof getKey,
  axios: AxiosInstance
}
export function useDebounceInterceptor(arg: DebounceInterceptorArg) {
  const { axios } = arg;
  const getKeyFun = arg.getKey || getKey;
  const promiseMap = new Map<string, AxiosPromise>()
  const resolveMap = new Map<string, (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void>()
  axios.interceptors.request.use(function (config): InternalAxiosRequestConfig {
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