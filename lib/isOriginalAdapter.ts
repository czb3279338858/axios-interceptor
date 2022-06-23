import axios, { AxiosAdapter } from "axios";

export const isDefaultAdapter = (adapter: AxiosAdapter | undefined) => {
  return adapter === axios.defaults.adapter
}