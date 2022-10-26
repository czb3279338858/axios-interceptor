import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRequestKey } from '../getRequestKey';
import { isDefaultAdapter } from '../isOriginalAdapter';

const requestingAdapter = new Map<string, () => Promise<any>>()
const requestingResolve = new Map<string, (value?: AxiosResponse<any, any>) => void>()

/**
 * 防抖拦截器，当同一个请求未返回时，不再发起新的请求
 * @param config 
 * @returns 
 */
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

/**
 * 响应时，对所有被防抖的接口进行响应
 * @param response 
 * @returns 
 */
export function responseDebounce(response: AxiosResponse<any, any>) {
  if (response.status >= 200 && response.status < 300) {
    const key = getRequestKey(response.config)
    const resolve = requestingResolve.get(key)
    if (resolve) {
      resolve(response)
      requestingAdapter.delete(key)
      requestingResolve.delete(key)
    }
    return response
  } else {
    responseDebounceErr({
      config: response.config,
      status: `${response.status}`
    })
  }
}
/**
 * 请求错误时，删除对应resolve，被防抖接口允许再次发起
 * @param error 
 */
export function responseDebounceErr(error: { config: AxiosRequestConfig, status?: string }) {
  const key = getRequestKey(error.config)
  const resolve = requestingResolve.get(key)
  if (resolve) {
    requestingAdapter.delete(key)
    requestingResolve.delete(key)
  }
  if (error.status) {
    throw new Error(`Request failed with status code ${error.status}`)
  } else {
    throw new Error('Network Error')
  }
}