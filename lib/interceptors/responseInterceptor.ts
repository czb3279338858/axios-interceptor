import { AxiosResponse } from "axios";
/**
 * 提供一个可扩展的拦截器，比如判断是否登录未登录跳转登录页等
 * @param actions 拦截方法，当拦截方法不返回时，表示没有通过这个拦截的检查。例如判断是否登录，当未登录时跳转登录页，该 action 不 return
 * @returns 
 */
export function buildResponseInterceptor(actions: ((response: AxiosResponse<any, any>) => AxiosResponse<any, any> | void)[]) {
  return (response: AxiosResponse<any, any>) => {
    let newResponse: AxiosResponse<any, any> | void = response
    actions.forEach(a => {
      if (newResponse) {
        newResponse = a(newResponse)
      } else {
        throw new Error("响应数据被拦截：" + response);
      }
    })
    return newResponse
  }
}