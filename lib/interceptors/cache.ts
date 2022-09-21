import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestKey } from '../getRequestKey';
import { isDefaultAdapter } from '../isOriginalAdapter';

const cache = new Map<string, any>()
const cleanMatchFunMap = new Map<string, Function>()

export function requestCache(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  if (!isDefaultAdapter(config.adapter)) return config
  const key = getRequestKey(config)
  if (config._cache) {
    const response = cache.get(key)
    if (response) {
      return {
        ...config,
        adapter: async () => {
          return response
        }
      }
    } else {
      return config
    }
  }
  if (config._cleanMatchFun) {
    cleanMatchFunMap.set(key, config._cleanMatchFun)
  }
  return config
}

export function buildResponseCache(arg?: {
  statusKey: string,
  successCode: string | number
}) {
  return (response: AxiosResponse<any, any>) => {
    const { config, data } = response
    const key = getRequestKey(config)
    if (response.status >= 200 && response.status < 300 && (!arg || data[arg.statusKey] === arg.successCode)) {
      if (config._cache) {
        if (!cache.get(key)) {
          cache.set(key, response)
        }
      }
      const cleanMatchFun = cleanMatchFunMap.get(key)
      if (cleanMatchFun) {
        cache.forEach((v, k) => {
          const configObj = JSON.parse(k)
          if (cleanMatchFun(configObj)) {
            cache.delete(k)
          }
        })
      }
    }
    cleanMatchFunMap.delete(key)
    return response
  }
}

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    /** 是否缓存数据 */
    _cache?: boolean,
    /** 
     * 请求成功后，使用该函数匹配缓存中的 key，如果匹配成功，清空该缓存
     * 用于清空已经缓存的数据，例如：更新用户信息成功后就会清空获取用户信息接口的缓存
     */
    _cleanMatchFun?: (config: AxiosRequestConfig<D>) => boolean
  }
}