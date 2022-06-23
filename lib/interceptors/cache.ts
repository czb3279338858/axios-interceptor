import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestKey } from '../getRequestKey';
import { isOriginalAdapter } from '../isOriginalAdapter';
/**
 * 缓存
 */
const cache = new Map<string, any>()
/**
 * 如果有缓存，直接返回缓存，不发起请求
 * 需要 getRequestKey 获取请求唯一值
 * @param config 
 */
export function requestCache(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  if (!isOriginalAdapter(config.adapter)) return config
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
/**
 * 需要缓存的请求，响应状态为成功时，把响应写入缓存中
 * 现在的接口常对返回进行一层包裹，已自定响应状态。build的方式，可以自定义响应状态的key和成功时的对应值
 * 需要 getRequestKey 获取请求唯一值
 * @param response 
 */
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
/**
 * 为axios请求添加参数的ts支持
 */
declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    /** 是否缓存数据 */
    _cache?: boolean
  }
}