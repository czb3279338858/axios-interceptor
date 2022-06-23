import axios, { AxiosRequestConfig, AxiosResponse, Axios } from 'axios'
import { isDefaultAdapter } from '../isOriginalAdapter'

const waitingConfig: Map<number, AxiosRequestConfig<any>> = new Map()
const waitingResolve: Map<number, ((value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void)> = new Map()
let currentIndex = 0


export function buildRequestWaitToken(arg: {
  /** 检查 token */
  checkToken: (config: AxiosRequestConfig<any>) => boolean,
  /** 初始化 token */
  initToken: () => Promise<unknown>,
  /** 初始化 token 后，更新旧请求的 config，拦截器会用更新后的 config 重新发起请求 */
  updateConfig: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any>,
  /** 使用该拦截的 axios 对象，内部无法获得需要外部传入 */
  currentAxios: Axios
}) {
  return function (config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
    if (!isDefaultAdapter(config.adapter)) return config
    const { checkToken, initToken, currentAxios, updateConfig } = arg
    const check = checkToken(config)
    if (check || config._needToken) return config

    // 没有等待中的请求，代表是第一次，从而保证 initToken 只触发一次
    if (!waitingConfig.size) {
      initToken().then(() => {
        // 成功获取token，使用更新后的 config 发起请求
        waitingConfig.forEach((config, key) => {
          currentAxios.request(updateConfig(config)).then(response => {
            waitingResolve.get(key)?.(response)
            waitingResolve.delete(key)
          })
        })
      }).finally(() => {
        waitingConfig.clear()
      })
    }

    // 没有 token
    waitingConfig.set(++currentIndex, config)
    const promise = new Promise<AxiosResponse<any, any>>((resolve, reject) => {
      waitingResolve.set(currentIndex, resolve)
    })
    return {
      ...config,
      adapter: () => promise
    }
  }
}


declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    /** 该接口是否不需要检查 token */
    _needToken?: boolean,
  }
}