import { AxiosRequestConfig, HeadersDefaults } from 'axios';


export function requestRepairConfig(config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
  const selfHeaders: HeadersDefaults = config.headers as unknown as HeadersDefaults

  const method: keyof HeadersDefaults = config.method as keyof HeadersDefaults
  const methodHeaders = selfHeaders[method]

  const commonHeaders = selfHeaders.common
  const delHeaderKeys: (keyof HeadersDefaults)[] = ['common', 'delete', 'get', 'head', 'post', 'put', 'patch']
  delHeaderKeys.forEach(key => {
    delete selfHeaders[key]
  })
  const newHeaders = Object.assign({}, commonHeaders, methodHeaders, selfHeaders)
  return {
    ...config,
    headers: newHeaders
  }
}