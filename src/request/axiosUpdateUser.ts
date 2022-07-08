import { selfAxios } from "../selfAxios"
import { Response } from "../type/Response"
/**
 * 更新当前用户信息
 * @param params 
 * @returns 
 */
export const axiosUpdateUser = async (params: {
  id: string
  weixin?: string
}) => {
  return await selfAxios.post<Response<null>>('/ucenterapi/internalMtdsWeb/user/updateOrganizationalUserBasic', params, {
    /** 
     * 当前接口返回成功时，url==='/ucenterapi/uc/internal/common/getCurrentUser'接口的缓存将会被清空
     * 说明：config 只包含 axios 原生定义的，且能够被 json 序列化的键值对
     */
    _cleanMatchFun: (config) => {
      return config.url === '/ucenterapi/uc/internal/common/getCurrentUser'
    }
  })
}