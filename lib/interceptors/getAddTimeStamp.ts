import { AxiosRequestConfig } from "axios";
import { clearKeys } from "../getRequestKey";

clearKeys.push('params._timeStamp')

export function requestGetAddTimeStamp(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _timeStamp: new Date().getTime()
    }
  }
  return config
}