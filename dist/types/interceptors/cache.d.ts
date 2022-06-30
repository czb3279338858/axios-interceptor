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
    }
}
