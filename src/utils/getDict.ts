import _ from 'lodash'
import { ref, Ref } from 'vue'
import { axiosDict, UCDictCacheCO } from '../request/axiosDict'


/**
 * 已经发起过请求的字典
 * 包括接口已经响应和未响应的
 */
const resultMap = new Map<string, Ref<UCDictCacheCO[] | null>>()
/**
 * 准备发起请求的字典code
 * 字典接口允许一次请求多个字典列表
 */
const requestParams: Set<string> = new Set()
/** resolve map */
const resolveMap = new Map<string, (value: UCDictCacheCO[]) => void>()
/** promise map */
const resultPromiseMap = new Map<string, Promise<UCDictCacheCO[]>>()

const reqDict = async () => {
  const codes = [...requestParams]
  requestParams.clear()
  const res = await axiosDict({ dictTypeList: codes })
  Object.keys(res).forEach(code => {
    const dict = res[code]
    // 有需要resolve的异步获取字典时，响应它们
    const resolve = resolveMap.get(code)
    if (resolve) {
      resolve(dict)
      resolveMap.delete(code)
    }
    // 接口已经响应，删除对应的promise
    resultPromiseMap.delete(code)

    // 往已返回数据中添加至
    const result = resultMap.get(code)
    if (result) {
      if (!result.value) {
        result.value = dict
      }
    } else {
      resultMap.set(code, ref(dict))
    }
  })
}
/**
 * 节流后的请求
 */
const debounceAxiosDict = _.debounce(reqDict, 600)

/**
 * 同步获取字典，做了去抖动和缓存
 */
export function syncGetDict(code: string): Ref<UCDictCacheCO[] | null> {
  // 有缓存返回缓存
  const result = resultMap.get(code)
  if (result) return result

  // 往缓存中写入空数据
  const resolve = ref(null)
  resultMap.set(code, resolve)
  // 往节流参数中塞值
  requestParams.add(code)
  // 发起节流请求
  debounceAxiosDict()
  return resultMap.get(code) as Ref<UCDictCacheCO[] | null>
}

/**
 * 异步获取字典
 * @param code 
 */
export async function getDict(code: string): Promise<UCDictCacheCO[]> {
  // 如果有缓存，返回缓存
  const result = resultMap.get(code)
  if (result?.value) return result.value
  // 如果有请求中的，返回请求中的
  const resultPromise = resultPromiseMap.get(code)
  if (resultPromise) return await resultPromise
  // 如果都没有
  requestParams.add(code)
  const promise = new Promise<UCDictCacheCO[]>((resolve, reject) => {
    resolveMap.set(code, resolve)
  })
  resultPromiseMap.set(code, promise)
  // 发起节流请求
  debounceAxiosDict()
  return await promise
}