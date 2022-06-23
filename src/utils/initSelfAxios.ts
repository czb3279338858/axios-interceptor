import { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { buildResponseCache, requestCache, requestDebounce, requestFormUrlencoded, requestGetAddTimeStamp, requestRepairConfig, responseDebounce } from "../../lib";
import { buildRequestWaitToken } from "../../lib/interceptors/waitToken";
import { ResponseStatus } from "../type/ResponseStatus";

/**
 * 例子
 */
export function initSelfAxios(selfAxios: AxiosInstance) {
  /**
   * 请求头中的 token 名
   * 请求携带 token 有多种方式，这里仅仅是举例
   */
  const headerTokenKey = 'Oauth2-AccessToken'
  /**
   * 获取 token 的方法
   * @returns 
   */
  const getToken = () => {
    return Cookies.get(headerTokenKey) || ''
  }
  const baseURL = 'https://apigatewayver.oppein.com/'

  selfAxios.defaults.baseURL = baseURL

  /**
  * "axios": "~0.27.2"会根据 Content-Type 类型转换参数的格式，这导致响应中 config.data 和请求中不一致
  * transformRequest 会在请求拦截执行结束后转换数据
  * 缓存拦截器和防抖拦截器需要根据 json 化的 config 获取请求唯一值，所以需要手动在这两个拦截器执行前进行数据转换，相对的 transformRequest 就不再使用默认的转换函数，而是不进行处理直接 return
  */
  selfAxios.defaults.transformRequest = [(data) => { return data }]

  selfAxios.defaults.headers.common = {
    ...selfAxios.defaults.headers.common,
    [headerTokenKey]: getToken(),
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  selfAxios.defaults.headers.post = {
    ...selfAxios.defaults.headers.post,
    "Content-Type": "application/json"
  }
  selfAxios.defaults.headers.patch = {
    ...selfAxios.defaults.headers.patch,
    "Content-Type": "application/json"
  }
  selfAxios.defaults.headers.put = {
    ...selfAxios.defaults.headers.put,
    "Content-Type": "application/json"
  }

  // 以下为请求拦截器，越晚 use 的越早被调用
  /**
   * 为 get 请求添加时间戳，这个拦截器会修改 config
   * 常用
   */
  selfAxios.interceptors.request.use(requestGetAddTimeStamp)

  /**
   * 防抖拦截器，当同一个请求未返回时，不再发起新的请求
   * 核心，需配合响应拦截器使用
   */
  selfAxios.interceptors.request.use(requestDebounce)

  /**
   * 缓存拦截器，请求前查看是否有缓存
   * axios.config 中新增参数 _cache:boolean，用于控制当前接口数据是否缓存
   * 核心，需配合响应拦截器使用
   */
  selfAxios.interceptors.request.use(requestCache)

  /**
   * 自行转化 data
   * 当请求头 Content-Type 是 application/x-www-form-urlencoded 时，数据转换为 form-urlencoded，否则转换为json
   * 必须：影响缓存、防抖拦截器中获取请求唯一标志
   */
  selfAxios.interceptors.request.use(requestFormUrlencoded)

  /**
   * 请求前检查请求头中 token 是否存在，如果不存在等待异步方法 setToken 执行结束后才发起请求
   * 适用于企微、个微 需要异步获取 token 的 h5 页面
   * 可选
   * axios.config 中新增参数 _needToken:boolean，用于控制当前接口是否不需要校验 token
   */
  selfAxios.interceptors.request.use(buildRequestWaitToken({
    checkToken: (config) => {
      return !!config.headers?.[headerTokenKey]
    },
    initToken: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Cookies.set(headerTokenKey, '6854f65a3f835a5db3472d96cc517c33v')
          resolve('')
        }, 3000);
      })
    },
    updateConfig: (config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          [headerTokenKey]: getToken()
        }
      }
    },
    currentAxios: selfAxios
  }))

  /**
   * "axios": "~0.27.2" 请求拦截器中的 config 和它提供的类型不一致。该拦截器修正 config
   * 不一致主要表现为 config.header 没有合并
   * 必须：影响缓存、防抖拦截器中获取请求唯一标志
   */
  selfAxios.interceptors.request.use(requestRepairConfig)




  // 以下为响应拦截器，越早 use 的越早被调用
  /**
   * 响应时，当参数中 _cache === true 时，缓存接口的响应数据
   * 核心，需配合请求拦截器使用
   */
  selfAxios.interceptors.response.use(buildResponseCache({ statusKey: 'code', successCode: ResponseStatus.success }))

  /**
   * 响应时，对所有被防抖的接口进行响应
   * 核心，需配合请求拦截器使用
   */
  selfAxios.interceptors.response.use(responseDebounce)
}