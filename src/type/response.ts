import { ResponseStatus } from "./ResponseStatus";
/**
 * 响应的公共数据结构
 */
export interface Response<Data> {
  code: ResponseStatus,
  data: Data,
  message: string;
  status: boolean
}