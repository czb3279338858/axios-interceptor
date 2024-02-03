import { AxiosResponse } from "axios";
export function innerIsSuccess(value: AxiosResponse) {
  return value.status >= 200 && value.status < 300
}