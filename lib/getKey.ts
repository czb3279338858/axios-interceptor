import { InternalAxiosRequestConfig } from "axios";

export const paramsExcludeKey: string[] = []

export function getKey(config: InternalAxiosRequestConfig) {
  const urlObj = new URL(config.url!, config.baseURL);
  const url = urlObj.protocol + '//' + urlObj.hostname + urlObj.pathname;
  const data = config.data ? typeof config.data === 'string' ? config.data : JSON.stringify(config.data) : '';
  const paramsObj = JSON.parse(JSON.stringify(config.params || {}))
  urlObj.searchParams.forEach((value, key) => paramsObj[key] = value)
  if (paramsExcludeKey.length) {
    paramsExcludeKey.forEach(key => {
      delete paramsObj[key]
    })
  }
  const method = config.method;
  return JSON.stringify({ url, data, paramsObj, method })
}