import { AxiosRequestConfig } from "axios";
/**
 * 供其他拦截器设定 config 中哪些 path 需要设置为 null，以保证 getRequestKey 的唯一性
 */
export declare let clearKeys: string[];
export declare function getRequestKey(config: AxiosRequestConfig<any>): string;
