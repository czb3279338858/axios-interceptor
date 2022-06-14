import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { buildResponseCache, buildResponseInterceptor, requestCache, requestDebounce, requestFormUrlencoded, requestGetAddTimeStamp, requestRepairConfig, responseDebounce } from "../lib";
import { buildRequestWaitToken } from "../lib/interceptors/waitToken";

const selfAxios = axios.create();
const headerTokenKey = 'Oauth2-Token'
const getToken = () => {
    return Cookies.get(headerTokenKey) || ''
}
const setToken = async () => {
    setTimeout(() => {
        Cookies.set(headerTokenKey, 'token')
    }, 1000);
}
const baseURL = ''
const timeout = 12000
/**
 * 未登录跳转登录页面
 * @param response 
 * @returns 
 */
const authentication = (response: AxiosResponse<any, any>) => {
    // doSome
    return response
}
/**
 * 服务器错误时取消全局 loading，并弹出提示
 * @param response 
 * @returns 
 */
const failedInterceptor = (response: AxiosResponse<any, any>) => {
    // doSome
    return response
}

/**
 * 例子
 */
function initSelfAxios() {
    selfAxios.defaults.baseURL = baseURL

    /**
    * "axios": "~0.27.2"会根据 Content-Type 类型转换参数的格式，这导致响应中 config.data 和请求中不一致
    * transformRequest 会在请求拦截执行结束后转换数据
    * 缓存拦截器和防抖拦截器需要根据 json 化的 config 获取请求唯一值，所以需要手动在这两个拦截器执行前进行数据转换
    */
    selfAxios.defaults.transformRequest = [(data) => { return data }]

    selfAxios.defaults.headers.common = {
        ...selfAxios.defaults.headers.common,
        [headerTokenKey]: getToken(),
    }
    selfAxios.defaults.timeout = timeout

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
     * 为 get 请求添加时间戳，这个拦截器会修改 config，为了保证正确获取请求唯一值，内部方法 getRequestKey  在获取唯一值时会置空 params._timeStamp
     */
    selfAxios.interceptors.request.use(requestGetAddTimeStamp)
    /**
     * 防抖拦截器，当同一个请求未返回时，不再发起新的请求
     */
    selfAxios.interceptors.request.use(requestDebounce)
    /**
     * 缓存拦截器，请求前查看是否有缓存
     */
    selfAxios.interceptors.request.use(requestCache)
    /**
     * 请求前检查请求头中 token 是否存在，如果不存在等待异步方法 setToken 执行结束后才发起请求
     * 适用于企微、个微 需要异步获取 token 的 h5 页面
     */
    selfAxios.interceptors.request.use(buildRequestWaitToken({
        headerTokenKey: headerTokenKey,
        setToken: setToken,
        currentAxios: selfAxios
    }))
    /**
     * 当请求头 Content-Type 是 application/x-www-form-urlencoded 时，数据转换为 form-urlencoded，否则转换为json
     */
    selfAxios.interceptors.request.use(requestFormUrlencoded)
    /**
     * "axios": "~0.27.2" 请求拦截器中的 config 和它提供的类型不一致。该拦截器修正 config
     * 主要表现为 method 的 header 没有合并
     */
    selfAxios.interceptors.request.use(requestRepairConfig)



    // 以下为响应拦截器，越早 use 的越早被调用
    /**
     * 拦截响应数据，一般用于以下场景
     * 1、未登录跳转登录页面
     * 2、服务器错误时取消全局 loading，并弹出提示
     */
    selfAxios.interceptors.response.use(buildResponseInterceptor([authentication, failedInterceptor]))
    /**
     * 响应时，缓存 _cache === true 的接口的响应数据
     */
    selfAxios.interceptors.response.use(buildResponseCache({ statusKey: 'code', successCode: '10000' }))
    /**
     * 响应时对所有被防抖的接口进行响应
     */
    selfAxios.interceptors.response.use(responseDebounce)
}

initSelfAxios()

