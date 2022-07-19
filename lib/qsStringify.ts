type Obj = Record<string | number, any>
export const qsStringify = (obj: Obj, prefix = ''): string => {
  let strList: string[] = []
  for (const key in obj) {
    if (typeof key === 'symbol') continue;
    const value = obj[key]
    if (['symbol', 'function', 'undefined'].includes(typeof value)) continue;
    const k = prefix ? `${prefix}[${key}]` : `${key}`
    if (typeof value === 'object' && value !== null) {
      strList.push(qsStringify(value, k))
    } else {
      strList.push(`${encodeURIComponent(k)}=${encodeURIComponent(value === null ? '' : value)}`)
    }
  }
  return strList.join('&')
}