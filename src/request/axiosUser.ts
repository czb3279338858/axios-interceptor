import { selfAxios } from "../selfAxios"
import { Response } from "../type/Response"

export const axiosUser = async () => {
  const { data: { data } } = await selfAxios.get<Response<{ name: string, id: string, weixin: string }>>('/ucenterapi/uc/internal/common/getCurrentUser', {
    _cache: true,
  })
  return data
}