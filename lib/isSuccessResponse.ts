import { AxiosResponse } from "axios";
export function isSuccessResponse(value: AxiosResponse) {
  if (value.status >= 200 && value.status < 300) return true
  return false
}