import { selfAxios } from "../selfAxios"
import { Response } from "../type/Response"

export const axiosUpdateUser = async (params: {
  id: string
  weixin?: string
}) => {
  return await selfAxios.post<Response<null>>('/ucenterapi/internalMtdsWeb/user/updateOrganizationalUserBasic', params, {
    /** 
     * 当接口响应时，url==='/ucenterapi/uc/internal/common/getCurrentUser' 的接口的缓存将会被清空
     * When the interface responds, the cache of the interface with url==='/ucenterapi/uc/international/common/getCurrentUser' will be cleared
     */
    _cleanMatchFun: (config) => {
      return config.url === '/ucenterapi/uc/internal/common/getCurrentUser'
    }
  })
}