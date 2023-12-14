import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface AwaitFun {
  (config: InternalAxiosRequestConfig): Promise<unknown> | unknown
}
interface AwaitInterceptorArg {
  axios: AxiosInstance,
  awaitFun: AwaitFun
}
declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 当前请求是否等待异步函数执行后才发起
     */
    _awaitSign?: boolean | string,
  }
}
export function useAwaitInterceptor(arg: AwaitInterceptorArg) {
  const { axios, awaitFun } = arg;
  axios.interceptors.request.use(async (config) => {
    if (config._awaitSign && awaitFun) {
      await awaitFun(config)
    }
    return config
  })
}