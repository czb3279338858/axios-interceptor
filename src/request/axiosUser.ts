import { selfAxios } from "../selfAxios"
/**
 * 获取当前用户
 * @returns 
 */
export const axiosUser = async () => {
  const res = await selfAxios.get('/ucenterapi/uc/internal/common/getCurrentUser', {
    params: { platformType: 'MTDS' },
    _cache: true, // 只需要添加这个，该接口的数据就会被缓存
    headers: { // 测试接口要求的数据，非必须
      AppCode: 'MTDS',
      SubAppCode: 'MTDSAP009'
    }
  })
  return res
}