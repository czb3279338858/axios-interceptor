import { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { buildResponseCache, requestCache, requestDebounce, requestFormUrlencoded, requestGetAddTimeStamp, requestRepairConfig, responseDebounce, responseDebounceErr } from "../../lib";
import { ResponseStatus } from "../type/ResponseStatus";

export function initSelfAxios(selfAxios: AxiosInstance) {

  const headerTokenKey = 'Oauth2-AccessToken'
  const getToken = () => Cookies.get(headerTokenKey) || ''
  selfAxios.defaults.baseURL = 'https://apigatewayver.oppein.com/'

  /**
  * "axios": "~0.27.2" 会根据 Content-Type 转换参数的格式 
  * "axios": "~0.27.2" will convert the format of parameters according to Content-Type
  * 
  * 这导致 config.data 在响应和请求中不一致 
  * This causes the config.data to be inconsistent in the response and request
  * 
  * 该包提供的拦截器通过 JSON 化 config 来判断一个请求的唯一性
  * The interceptor provided by the package judges the uniqueness of a request through JSONized config
  * 
  * 所以需要重定义 defaults.transformRequest 来禁止这种转换
  * So you need to redefine defaults.transformRequest to disable this transformation
  * 
  * transformation 在所有请求拦截器被执行后执行
  * Transformation is executed after all request interceptors are executed
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

  /**
   * 请求拦截器，越晚 use 的越早被调用
   * Request interceptor, the later the use is called, the earlier
   */

  /**
   * 为 get 请求添加时间戳
   * Add timestamp for get request
   */
  selfAxios.interceptors.request.use(requestGetAddTimeStamp)

  /**
   * 当同一个请求未返回时，不再发起新的请求
   * When the same request does not return, no new request will be launched
   * 
   * 应当早于 requestRepairConfig 和 requestFormUrlencoded 被 use
   * It should be used before requestRepairConfig and requestFormUrlencoded
   * 
   * 需要配合响应拦截 responseDebounce 和 responseDebounceErr 使用
   * It needs to be used together with responseDebounce and responseDebounceErr for response interception
   */
  selfAxios.interceptors.request.use(requestDebounce)

  /**
   * 请求前查看是否有缓存，有缓存直接返回缓存，没有才发起请求
   * Check whether there is a cache before making a request. If there is a cache, it will return to the cache directly. If not, the request will be made
   * 
   * 应当早于 requestRepairConfig 和 requestFormUrlencoded 被 use
   * It should be used before requestRepairConfig and requestFormUrlencoded
   * 
   * 需要配合响应拦截 buildResponseCache 使用
   * It needs to be used together with buildResponseCache for response interception
   * 
   * config 中新增参数
   * New parameter in config
   * 
   * _cache:boolean:用于控制当前接口是否缓存响应
   * _cache:boolean:Used to control whether the current interface caches responses
   * 
   * _cleanMatchFun:用于在当前接口响应后清空其他接口的缓存数据
   * _cleanMatchFun:Used to clear cached data of other interfaces after the current interface responds
   */
  selfAxios.interceptors.request.use(requestCache)

  /**
   * 根据 Content-Type 转化请求参数格式
   * Convert request parameter format according to Content-Type
   * 
   * 当请求头 Content-Type 是 application/x-www-form-urlencoded 时，数据转换为 form-urlencoded，否则转换为 JSON
   * When the request header Content-Type is application/x-www-form-urlencoded, the data is converted to form urlencoded, otherwise it is converted to JSON
   * 
   * 需要配合设置 defaults.transformRequest 来使用
   * It needs to be used together with setting defaults.transformRequest
   * */
  selfAxios.interceptors.request.use(requestFormUrlencoded)


  /**
   * "axios": "~0.27.2" 请求拦截器和响应拦截器中 config 不一致
   * "axios": "~0.27.2" The configs in the request interceptor and the response interceptor are inconsistent
   * 
   * 不一致主要表现为请求拦截器中 config.header 没有被合并
   * Inconsistency is mainly manifested in config.header not merged
   */
  selfAxios.interceptors.request.use(requestRepairConfig)




  /**
   * 响应拦截器，越早 use 的越早被调用
   * The earlier the response interceptor is used, the earlier it is called
   */

  /**
   * 响应时，当参数中 _cache === true 时，缓存数据
   * When responding, cache data when _cache === true exists in the parameter
   * 
   * 需要配合请求拦截 requestCache 使用
   * It needs to be used with requestCache for request interception
   */
  selfAxios.interceptors.response.use(buildResponseCache({ statusKey: 'code', successCode: ResponseStatus.success }))

  /**
   * 请求成功时，响应所有未被发起的请求
   * Respond to all unsolicited requests when the request succeeds
   * 
   * 请求失败时，允许该接口被再次发起
   * When the request fails, the interface is allowed to be initiated again
   * 
   * 需要配合请求拦截 requestDebounce 使用
   * It needs to be used in conjunction with request interception requestDebounce
   */
  selfAxios.interceptors.response.use(responseDebounce, responseDebounceErr)
}