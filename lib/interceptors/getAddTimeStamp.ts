import { AxiosRequestConfig } from "axios";
import { clearKeys } from "../getRequestKey";

clearKeys.push('params._timeStamp')
/**
 * get 请求时添加 _timeStamp 时间戳参数，避免浏览器缓存
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