import { InternalAxiosRequestConfig } from "axios";
import { cloneDeep } from "lodash-es";

export const paramsExcludeKey: string[] = []

export function innerGetKey(config: InternalAxiosRequestConfig) {
  const url = new URL(config.url!, config.baseURL);
  const fullURL = url.protocol + '//' + url.hostname + url.pathname;
  const data = config.data ? typeof config.data === 'string' ? config.data : JSON.stringify(config.data) : '';
  const params = cloneDeep(config.params || {})
  url.searchParams.forEach((value, key) => params[key] = value)
  if (paramsExcludeKey.length) {
    paramsExcludeKey.forEach(key => {
      delete params[key]
    })
  }
  const method = config.method;
  return JSON.stringify({ fullURL, data, params, method })
}