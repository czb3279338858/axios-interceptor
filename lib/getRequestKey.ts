import { AxiosRequestConfig } from "axios";
import _ from "lodash";
/**
 * 供其他拦截器设定 config 中哪些 path 需要设置为 null，以保证 getRequestKey 的唯一性
 */
export let clearKeys: string[] = []

export function getRequestKey(config: AxiosRequestConfig<any>) {
  const keyConfig: AxiosRequestConfig<any> = JSON.parse(JSON.stringify(config))
  clearKeys.forEach(path => {
    _.set(keyConfig, path, null)
  })
  return JSON.stringify(keyConfig)
}