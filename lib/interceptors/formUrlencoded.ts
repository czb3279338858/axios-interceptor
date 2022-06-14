import { AxiosRequestConfig } from 'axios'
import qs from 'qs'
/**
 * 当请求头 Content-Type 是 application/x-www-form-urlencoded 时，数据转换为 form-urlencoded，否则转换为 json
 */
export function requestFormUrlencoded(config: AxiosRequestConfig<any>) {
  const headers = config.headers
  const contentType = headers?.['Content-Type']
  const data = config.data
  if (contentType === 'application/x-www-form-urlencoded' && data) {
    return {
      ...config,
      data: qs.stringify(data)
    }
  } else {
    return {
      ...config,
      data: JSON.stringify(data)
    }
  }
}