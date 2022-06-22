import axios, { AxiosAdapter } from "axios";

export const isOriginalAdapter = (adapter: AxiosAdapter | undefined) => {
  return adapter === axios.defaults.adapter
}