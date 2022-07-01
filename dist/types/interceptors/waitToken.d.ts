import { AxiosRequestConfig, Axios } from 'axios';
export declare function buildRequestWaitToken(arg: {
    /** 检查 token */
    checkToken: (config: AxiosRequestConfig<any>) => boolean;
    /** 初始化 token */
    initToken: () => Promise<unknown>;
    /** 初始化 token 后，更新旧请求的 config，拦截器会用更新后的 config 重新发起请求 */
    updateConfig: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any>;
    /** 使用该拦截的 axios 对象，内部无法获得需要外部传入 */
    currentAxios: Axios;
}): (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any>;
declare module 'axios' {
    interface AxiosRequestConfig<D = any> {
        /** 该接口是否不需要检查 token */
        _needToken?: boolean;
    }
}
