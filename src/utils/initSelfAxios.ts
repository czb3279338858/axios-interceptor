import { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { buildRequestWaitToken, buildResponseCache, requestCache, requestDebounce, requestFormUrlencoded, requestGetAddTimeStamp, requestRepairConfig, responseDebounce } from "../../lib";
import { ResponseStatus } from "../type/ResponseStatus";

export function initSelfAxios(selfAxios: AxiosInstance) {
  /**
   * 请求头中的 token 名
   * 请求携带 token 有多种方式，这里仅仅是举例
   */
  const headerTokenKey = 'Oauth2-AccessToken'

  /**
   * 获取 token 的方法，根据自身项目设定
   */
  const getToken = () => {
    return Cookies.get(headerTokenKey) || ''
  }

  /**
   * 请求的 baseURL，根据自身项目设定
   */
  selfAxios.defaults.baseURL = 'https://apigatewayver.oppein.com/'

  /**
  * "axios": "~0.27.2"会根据 Content-Type 类型转换参数的格式，这导致 config.data 在响应和请求中不一致
  * 部分拦截器通过 JSON 化 config 来判断一个请求的唯一性，所以需要重定义 transformRequest 来禁止这种转换
  * 备注：transformRequest 会在请求拦截全部执行后转换数据
  */
  selfAxios.defaults.transformRequest = [(data) => { return data }]

  selfAxios.defaults.headers.common = {
    ...selfAxios.defaults.headers.common,
    [headerTokenKey]: getToken(),
    'Content-Type': 'application/x-www-form-urlencoded',
    AppCode: 'MTDS',
    SubAppCode: 'MTDSAP009'
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
   * 为 get 请求添加时间戳
   */
  selfAxios.interceptors.request.use(requestGetAddTimeStamp)

  /**
   * 防抖拦截器，当同一个请求未返回时，不再发起新的请求
   * 注意：
   *   拦截器内通过内置方法 getRequestKey 获取请求唯一值，所以需要保证在 requestRepairConfig 和 requestFormUrlencoded 后被调用
   *   需要配合响应拦截 responseDebounce 使用
   */
  selfAxios.interceptors.request.use(requestDebounce)

  /**
   * 缓存拦截器，请求前查看是否有缓存，有缓存直接返回缓存，没有才发起请求
   * config 中新增参数 _cache:boolean，用于控制当前接口数据是否缓存
   * 注意：
   *   拦截器内通过内置方法 getRequestKey 获取请求唯一值，所以需要保证在 requestRepairConfig 和 requestFormUrlencoded 后被调用
   *   需要配合响应拦截 buildResponseCache 使用
   */
  selfAxios.interceptors.request.use(requestCache)

  /**
   * 根据 Content-Type 转化 data 格式
   * 当请求头 Content-Type 是 application/x-www-form-urlencoded 时，数据转换为 form-urlencoded，否则转换为 JSON
   * 注意：需要配合设置 transformRequest 方法
   */
  selfAxios.interceptors.request.use(requestFormUrlencoded)

  /**
   * 请求前通过 checkToken 检查 token 是否存在，如果不存在等待异步方法 initToken 结束后，使用 updateConfig 更新的 config 重新发起请求
   * 适用于 企业微信、个人微信 需要异步获取 token 的 h5 页面
   * config 中新增参数 _needToken:boolean，用于控制当前接口是否不需要校验 token
   */
  selfAxios.interceptors.request.use(buildRequestWaitToken({
    checkToken: (config) => {
      return !!config.headers?.[headerTokenKey]
    },
    initToken: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Cookies.set(headerTokenKey, 'a7732491a31f944ef8ee988df75f920bv')
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
   * "axios": "~0.27.2" 请求拦截器参数 config 和它提供的类型不一致。该拦截器修正 config
   * 不一致主要表现为 config.header 没有合并
   */
  selfAxios.interceptors.request.use(requestRepairConfig)




  // 以下为响应拦截器，越早 use 的越早被调用
  /**
   * 响应时，当参数中 _cache === true 时，缓存接口的响应数据
   * 注意：需要配合请求拦截 requestCache 使用
   */
  selfAxios.interceptors.response.use(buildResponseCache({ statusKey: 'code', successCode: ResponseStatus.success }))

  /**
   * 响应时，对所有被防抖的接口进行响应
   * 注意：需要配合请求拦截 requestDebounce 使用
   */
  selfAxios.interceptors.response.use(responseDebounce)
}