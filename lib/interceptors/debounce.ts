import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestKey } from '../getRequestKey';
import { isDefaultAdapter } from '../isOriginalAdapter';

const requestingAdapter = new Map<string, () => Promise<any>>()
const requestingResolve = new Map<string, (value?: AxiosResponse<any, any>) => void>()


export function requestDebounce(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  if (!isDefaultAdapter(config.adapter)) return config
  const key = getRequestKey(config)
  const adapter = requestingAdapter.get(key)
  if (adapter) {
    // 当前接口正在请求中，直接返回 promise
    return {
      ...config,
      adapter
    }
  } else {
    // 设置当前接口为正在请求中并发起请求
    const promise = new Promise<any>((resolve, reject) => {
      requestingResolve.set(key, resolve)
    })
    const adapter = () => promise
    requestingAdapter.set(key, adapter)
    return config
  }
}


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