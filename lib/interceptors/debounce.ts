import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestKey } from '../getRequestKey';

const requestingAdapter = new Map<string, () => Promise<any>>()
const requestingResolve = new Map<string, (value?: AxiosResponse<any, any>) => void>()

/**
 * 检查当前接口是否正在请求中，如果是则不再发起请求
 * 需要 getRequestKey 获取请求唯一值
 * @param config 
 */
export function requestDebounce(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  const key = getRequestKey(config)
  const adapter = requestingAdapter.get(key)
  if (adapter) {
    return {
      ...config,
      adapter
    }
  } else {
    const promise = new Promise<any>((resolve, reject) => {
      requestingResolve.set(key, resolve)
    })
    const adapter = () => promise
    requestingAdapter.set(key, adapter)
    return config
  }

}

/**
 * 响应时对所有被去重的接口进行响应
 * 需要 getRequestKey 获取请求唯一值
 */
export function responseDebounce(response: AxiosResponse<any, any>) {
  const key = getRequestKey(response.config)
  const resolve = requestingResolve.get(key)
  if (resolve) {
    resolve(response)
    requestingAdapter.delete(key)
    requestingResolve.delete(key)
  }
  return response
}