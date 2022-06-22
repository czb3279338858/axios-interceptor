import { syncGetDict } from "./getDict";

/**
 * 同步转义字典
 * @param code 
 * @param dictName 
 * @returns 
 */
export function transDict(code: string | undefined, dictName: string) {
  const dict = syncGetDict(dictName)
  const find = dict.value?.find(d => d.value === code)
  if (find) {
    return find.label
  } else {
    if (dict.value?.length && code) {
      return '该code不存在于字典中'
    } else {
      return ''
    }
  }
}