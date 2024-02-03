import { AxiosError } from "axios";

export function innerIsRetry(err: AxiosError): boolean {
  return !!err.response?.status && err.response.status >= 500 && err.response.status < 600
}