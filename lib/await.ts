import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface AwaitFun {
  (config: InternalAxiosRequestConfig): Promise<unknown>
}
interface AwaitInterceptorArg {
  axios: AxiosInstance,
  awaitFun?: AwaitFun
}
declare module 'axios' {
  export interface AxiosRequestConfig {
    // 当前请求是否等待异步函数执行后才发起
    _await?: boolean,
    _awaitFun?: AwaitFun
  }
}
export function useAwaitInterceptor(arg: AwaitInterceptorArg) {
  const { axios, awaitFun } = arg;
  axios.interceptors.request.use(async (config) => {
    const awaitFunction = config._awaitFun || awaitFun
    if (config._await && awaitFunction) {
      await awaitFunction(config)
    }
    return config
  })
}