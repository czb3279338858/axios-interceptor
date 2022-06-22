import { ResponseStatus } from "./ResponseStatus";

export interface Response<Data> {
  code: ResponseStatus,
  data: Data,
  message: string;
  status: boolean
}