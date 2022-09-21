import axios, { AxiosAdapter } from "axios";
/**
 * 请求处理方法是否被修改，拦截器会通过修改该方法来暂缓请求
 * @param adapter 
 * @returns 
 */
export const isDefaultAdapter = (adapter: AxiosAdapter | undefined) => {
  return adapter === axios.defaults.adapter
}