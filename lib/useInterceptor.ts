import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import iAxios from "axios"
import { innerGetKey, paramsExcludeKey } from "./getKey";
import { cloneDeep } from "lodash-es";
import { innerIsSuccess } from "./isSuccess";
import { innerIsRetry } from "./isRetry";

interface UseInterceptorArg {
  axios: AxiosInstance,
  getKey?: typeof innerGetKey,
  useCache?: {
    isSuccess: typeof innerIsSuccess
  } | true,
  useDebounce?: boolean,
  useTimestamp?: {
    timestampKey?: string
  } | true,
  useRetry?: {
    isRetry?: typeof innerIsRetry
  } | true,
  useChange?: {
    requestListChange: (configs: AxiosRequestConfig[]) => void
  }
}
type CacheMap = Map<string, AxiosResponse>
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 当前接口是否在请求成功时缓存响应数据
     */
    _cache?: boolean,
    /**
     * 删除缓存的方法，比如更新了当前用户信息，应该删除当前用户信息缓存
     * @param cacheMap 
     * @returns 
     */
    _delCache?: (cacheMap: CacheMap) => void,
    /**
     * 当前接口是否不去抖动，用于获取获取唯一id这样的接口
     */
    _noDebounce?: boolean,
    /**
     * 真正向后端发起了请求的唯一id
     */
    _requestId?: number,
  }
  export interface AxiosResponse<T = any, D = any> {
    /**
     * 请求的额外返回，用于用户在生命周期结束后手动删除缓存
     * @returns 
     */
    _delCache?: () => void
  }
}
export function useInterceptor(arg: UseInterceptorArg) {
  const newAxios = iAxios.create()
  const { axios, useCache, useDebounce, useTimestamp, useRetry, useChange } = arg
  const getKey = arg.getKey || innerGetKey
  const isSuccess = useCache !== true && useCache?.isSuccess || innerIsSuccess
  const isRetry = useRetry !== true && useRetry?.isRetry || innerIsRetry
  const timestampKey = (useTimestamp && useTimestamp !== true && useTimestamp.timestampKey) ? useTimestamp.timestampKey : 'timestamp'
  paramsExcludeKey.push(timestampKey)

  const cacheMap: CacheMap = new Map()

  const debounceMap = new Map<string, {
    promise: Promise<AxiosResponse<unknown, unknown>>,
    resolve: (value: unknown) => void,
    reject: (reason?: unknown) => void
  }>()

  let requestId = 1
  const realMap = new Map<number, {
    promise: Promise<AxiosResponse<unknown, unknown>>,
    resolve: (value: unknown) => void,
    reject: (reason?: unknown) => void,
    config: InternalAxiosRequestConfig
  }>()

  function callRequestListChange() {
    if (useChange) {
      let configs: AxiosRequestConfig[] = []
      realMap.forEach(r => configs.push(r.config))
      useChange.requestListChange(configs)
    }
  }

  const retryConfigs = new Set<AxiosRequestConfig>()

  axios.interceptors.request.use(config => {
    const key = getKey(config)
    if (useCache && config._cache) {
      const response = cacheMap.get(key)
      if (response) {
        config.adapter = () => Promise.resolve(response)
        return config
      }
    }

    if (config._requestId) return config

    if (useDebounce && !config._noDebounce) {
      const debounceValue = debounceMap.get(key)
      if (debounceValue) {
        config.adapter = () => debounceValue.promise
        return config
      } else {
        let resolve
        let reject
        const promise = new Promise<AxiosResponse<unknown, unknown>>((res, rej) => {
          resolve = res
          reject = rej
        })
        if (resolve && reject)
          debounceMap.set(key, { promise, reject, resolve })
      }
    }

    const realConfig = cloneDeep(config)
    realConfig._requestId = requestId
    if (useTimestamp && realConfig.method?.toUpperCase() === 'GET') {
      realConfig.params ? (realConfig.params[timestampKey] = new Date().getTime()) : (realConfig.params = { [timestampKey]: new Date().getTime() })
    }
    newAxios.request(realConfig)

    let resolve
    let reject
    const promise = new Promise<AxiosResponse<unknown, unknown>>((res, rej) => {
      resolve = res
      reject = rej
    })
    if (resolve && reject)
      realMap.set(requestId, { promise, reject, resolve, config: realConfig })
    callRequestListChange()
    requestId++

    config.adapter = () => promise
    return config
  })

  newAxios.interceptors.response.use(response => {
    const key = getKey(response.config)
    if (response.config._requestId) {
      if (useDebounce && !response.config._noDebounce) {
        const debounceParams = debounceMap.get(key)
        if (debounceParams) {
          debounceParams.resolve(response)
          debounceMap.delete(key)
        }
      }
      if (useCache && isSuccess(response)) {
        if (response.config._cache) {
          response._delCache = () => cacheMap.delete(key)
          cacheMap.set(key, response)
        }
        if (response.config._delCache) {
          response.config._delCache(cacheMap)
        }
      }
      const real = realMap.get(response.config._requestId)
      if (real) {
        real.resolve(response)
        realMap.delete(response.config._requestId)
        callRequestListChange()
      }
    }
    return response
  }, (err: AxiosError) => {
    if (err.config?._requestId) {
      const key = getKey(err.config)
      if (useRetry && isRetry(err)) {
        retryConfigs.add(err.config)
        return err
      }
      const real = realMap.get(err.config._requestId)
      if (real) {
        real.reject(err)
        realMap.delete(err.config._requestId)
        callRequestListChange()
      }
      const debounceParams = debounceMap.get(key)
      if (debounceParams) {
        debounceParams.reject(err)
        debounceMap.delete(key)
      }
    }

    return err
  })

  function doRetry() {
    retryConfigs.forEach(config => {
      newAxios.request(config)
    })
    retryConfigs.clear()
  }
  return {
    doRetry
  }
}