import { AxiosRequestConfig, AxiosResponse, Axios } from 'axios'

const waitingConfig = new Map<number, AxiosRequestConfig<any>>()
const waitingResolve = new Map<number, (value?: AxiosResponse<any, any>) => void>()

/**
 * 页面请求发起前先进行 headers 中的 token 判定，如果没有，等待 setToken 函数执行完毕，才发起请求
 * 适用于企微、个微 需要异步获取 token 的 h5 页面
 * @param arg
 */
export function buildRequestWaitToken(arg: {
  headerTokenKey: string,
  setToken: () => Promise<void>,
  /** 使用该拦截的axios对象，内部无法获得需要外部传入 */
  currentAxios: Axios
}) {
  return function (config: AxiosRequestConfig<any>) {
    const { headerTokenKey, setToken, currentAxios } = arg
    const token = config.headers?.[headerTokenKey]
    if (token || config._needToken) return config

    // 终端请求发起，暂存请求 config 和 resolve 回调函数
    const firstRequestTime = new Date().getTime()

    // setToken只发起一次，当还没有等待的请求时发起，当已经有等待的请求时不再发起
    !waitingConfig.size && setToken().then(() => {
      // 成功获取token，使用原请求对象，发起请求
      waitingConfig.forEach((config, requestTime) => {
        // 不使用 adapter 直接发起请求是因为要使用 currentAxios 的后续拦截器
        currentAxios.request(config).then(response => {
          waitingResolve.get(requestTime)?.(response)
        }).finally(() => {
          waitingResolve.delete(requestTime)
        })
      })
    }).catch((error) => {
      // 未能成功获取token，响应所有等待的接口并清空列表
      waitingResolve.forEach(resolve => {
        resolve({
          status: 401,
          data: null,
          statusText: 'axios拦截器中，获取token失败',
          headers: {},
          config: {}
        })
      })
    }).finally(() => {
      waitingConfig.clear()
    })

    waitingConfig.set(firstRequestTime, config)
    const promise = new Promise((resolve, reject) => {
      waitingResolve.set(firstRequestTime, resolve)
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
    _needToken?: boolean
  }
}