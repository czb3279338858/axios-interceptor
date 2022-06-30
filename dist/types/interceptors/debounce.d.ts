import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare function requestDebounce(config: AxiosRequestConfig<any>): AxiosRequestConfig<any>;
export declare function responseDebounce(response: AxiosResponse<any, any>): AxiosResponse<any, any>;
