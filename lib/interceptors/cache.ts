import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestKey } from '../getRequestKey';
import { isDefaultAdapter } from '../isOriginalAdapter';

const cache = new Map<string, any>()

export function requestCache(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  if (!isDefaultAdapter(config.adapter)) return config
  if (config._cache) {
    const key = getRequestKey(config)
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
  return config
}

export function buildResponseCache(arg?: {
  statusKey: string,
  successCode: string | number
}) {
  return (response: AxiosResponse<any, any>) => {
    const { config, data } = response
    if (config._cache && response.status === 200 && (!arg || data[arg.statusKey] === arg.successCode)) {
      const key = getRequestKey(config)
      if (!cache.get(key)) {
        cache.set(key, response)
      }
    }
    return response
  }
}

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    /** 是否缓存数据 */
    _cache?: boolean
  }
}