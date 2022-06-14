import { AxiosRequestConfig } from "axios";
import _ from "lodash";

/**
 * 通过json化请求配置，获取一个请求的唯一标识，需要repairConfig拦截器先提供config修正
 * @param config 
 */
export function getRequestKey(config: AxiosRequestConfig<any>, clearKeys: string[] = ["params._timeStamp"]) {
  const keyConfig: AxiosRequestConfig<any> = JSON.parse(JSON.stringify(config))
  clearKeys.forEach(path => {
    _.set(keyConfig, path, null)
  })
  return JSON.stringify(keyConfig)
}