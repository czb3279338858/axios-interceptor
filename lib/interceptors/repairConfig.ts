import { AxiosRequestConfig,HeadersDefaults } from 'axios';


/**
 * "axios": "~0.27.2" 请求拦截器中的 config 和它提供的类型不一致。该拦截器修正 config
 * 主要表现为 method 的 header 没有合并
 * @param config 
 */
export function requestRepairConfig(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  const selfHeaders: HeadersDefaults = config.headers as unknown as HeadersDefaults

  const method: keyof HeadersDefaults = config.method as keyof HeadersDefaults
  const methodHeaders = selfHeaders[method]
  
  const commonHeaders = selfHeaders.common

  const delHeaderKeys: (keyof HeadersDefaults)[] = ['common', 'delete', 'get', 'head', 'post', 'put', 'patch']

  delHeaderKeys.forEach(key => {
    delete selfHeaders[key]
  })
  const newHeaders = Object.assign(commonHeaders, methodHeaders, selfHeaders)
  return {
    ...config,
    headers: newHeaders
  }
}