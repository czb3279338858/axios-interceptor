import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare function requestCache(config: AxiosRequestConfig<any>): AxiosRequestConfig<any>;
export declare function buildResponseCache(arg?: {
    statusKey: string;
    successCode: string | number;
}): (response: AxiosResponse<any, any>) => AxiosResponse<any, any>;
declare module 'axios' {
    interface AxiosRequestConfig<D = any> {
        /** 是否缓存数据 */
        _cache?: boolean;
        /**
         * 请求成功后，使用该函数匹配缓存中的 key，如果匹配成功，清空该缓存
         * 用于清空已经缓存的数据，例如：更新用户信息成功后就会清空获取用户信息接口的缓存
         */
        _cleanMatchFun?: (config: AxiosRequestConfig<D>) => boolean;
    }
}
