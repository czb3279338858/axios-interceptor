import { getKey } from "./getKey";
import { isSuccessResponse } from './isSuccessResponse'
import { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";

interface CacheInterceptorArg {
  getKey?: typeof getKey,
  axios: AxiosInstance,
  isSuccessResponse?: typeof isSuccessResponse
}
type CacheMap = Map<string, AxiosResponse>

declare module 'axios' {
  export interface AxiosRequestConfig {
    // 当前接口是否在请求成功时缓存响应数据
    _cache?: boolean,
    // 删除缓存的方法
    // 比如更新了当前用户信息，应该删除当前用户信息缓存
    _delCache?: (cacheMap: CacheMap) => void,
  }
}


export function useCacheInterceptor(arg: CacheInterceptorArg) {
  const { axios } = arg;
  const getKeyFun = arg.getKey || getKey;
  const isSuccessResponseFun = arg.isSuccessResponse || isSuccessResponse
  const cacheMap: CacheMap = new Map();
  axios.interceptors.request.use(function (config): InternalAxiosRequestConfig {
    if (config._cache) {
      const key = getKeyFun(config);
      const response = cacheMap.get(key)
      if (response) {
        return {
          ...config,
          adapter(config) {
            return new Promise((resolve, reject) => {
              resolve(response)
            })
          }
        }
      }
    }
    return config
  });

  axios.interceptors.response.use(function (value): AxiosResponse {
    const config = value.config
    if (isSuccessResponseFun(value)) {
      if (config._cache) {
        const key = getKeyFun(config)
        const response = cacheMap.get(key)
        if (!response) {
          cacheMap.set(key, value)
        }
      }
      if (config._delCache) config._delCache(cacheMap)
    }
    return value
  })
}
