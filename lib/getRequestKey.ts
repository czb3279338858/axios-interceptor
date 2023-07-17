import { AxiosRequestConfig } from "axios";
import { lodashSet } from "./lodashSet";
/**
 * 供其他拦截器设定 config 中哪些 path 需要设置为 null，以保证 getRequestKey 的唯一性
 */
export let clearKeys: string[] = []

export function getRequestKey(config: AxiosRequestConfig<any>) {
  const url = new URL(config.url || '', config.baseURL)
  const copyConfig = {
    ...config,
  }
  copyConfig.url = url.toJSON()
  const keyConfig: AxiosRequestConfig<any> = JSON.parse(JSON.stringify(copyConfig))
  clearKeys.forEach(path => {
    lodashSet(keyConfig, path, null)
  })
  return JSON.stringify(keyConfig)
}