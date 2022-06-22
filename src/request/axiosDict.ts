import { selfAxios } from "../selfAxios";
import { Response } from "../type/Response";

export interface UCDictCacheCO {
  /**
   * 数据值
   */
  value: string;

  /**
   * 标签名
   */
  label: string;
}
/**
 * 获取字典
 * @param params 
 */
export async function axiosDict(params: { dictTypeList: string[] }) {
  const { data: { data } } = await selfAxios.post<Response<Record<string, UCDictCacheCO[]>>>('/mtdsbase/internal/dict/getDictCacheMapByTypeToPost', params, {
    headers: { // 测试接口要求的数据，非必须
      AppCode: 'MTDS',
      SubAppCode: 'MTDSAP009'
    }
  })
  return data
}