import { selfAxios } from "../selfAxios"
import { Response } from "../type/Response"
/**
 * 获取当前用户
 * @returns 
 */
export const axiosUser = async () => {
  const { data: { data } } = await selfAxios.get<Response<{ name: string }>>('/ucenterapi/uc/internal/common/getCurrentUser', {
    params: { platformType: 'MTDS' }, // 测试接口要求的参数
    _cache: true, // 只需要添加这个，该接口的数据就会被缓存
    headers: { // 测试接口要求的参数
      AppCode: 'MTDS',
      SubAppCode: 'MTDSAP009'
    }
  })
  return data
}