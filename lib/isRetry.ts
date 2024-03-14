import { AxiosResponse } from "axios";

export function innerIsRetry(response: AxiosResponse<unknown, any>): boolean {
  return !!response?.status && response.status >= 500 && response.status < 600
}