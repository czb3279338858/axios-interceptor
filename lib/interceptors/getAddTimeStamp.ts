import { AxiosRequestConfig } from "axios";
import { clearKeys } from "../getRequestKey";

clearKeys.push('params._timeStamp')
/**
 * 为 get 请求添加时间戳
 */
export function requestGetAddTimeStamp(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _timeStamp: new Date().getTime()
    }
  }
  return config
}