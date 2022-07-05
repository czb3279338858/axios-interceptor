import { debounce } from 'lodash'
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
/** 正在请求的字典的 resolve */
const resolveMap = new Map<string, (value: UCDictCacheCO[]) => void>()
/** 正在请求的字典的 promise */
const resultPromiseMap = new Map<string, Promise<UCDictCacheCO[]>>()

const reqDict = async () => {
  const codes = [...requestParams]
  requestParams.clear()
  const res = await axiosDict({ dictTypeList: codes })
  Object.keys(res).forEach(code => {
    const dict = res[code]
    // 响应后 resolve 正在请求中
    const resolve = resolveMap.get(code)
    if (resolve) {
      resolve(dict)
      resolveMap.delete(code)
    }
    // 响应后，删除请求中的 promise
    resultPromiseMap.delete(code)

    // 响应后，缓存响应数据
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
const debounceAxiosDict = debounce(reqDict, 600)

/**
 * 同步获取字典
 */
export function syncGetDict(code: string): Ref<UCDictCacheCO[] | null> {
  // 有缓存返回可响应的缓存数据
  const result = resultMap.get(code)
  if (result) return result

  // 没有缓存，发起请求
  // 往缓存中写入空数据
  const resolve = ref(null)
  resultMap.set(code, resolve)
  // 往请求参数中塞值
  requestParams.add(code)
  // 发起节流请求
  debounceAxiosDict()
  // 返回写入缓存的响应数据
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

  // 如果有请求中的 promise，返回 promise 的结果
  const resultPromise = resultPromiseMap.get(code)
  if (resultPromise) return await resultPromise

  // 如果都没有，发起请求
  requestParams.add(code)
  const promise = new Promise<UCDictCacheCO[]>((resolve, reject) => {
    resolveMap.set(code, resolve)
  })
  resultPromiseMap.set(code, promise)
  // 发起节流请求
  debounceAxiosDict()
  return await promise
}