const _lodashSet = (obj: Record<string | number, any>, path: string[], value: any): void => {
  const firstPath = path[0]
  if (path.length > 1) {
    const firstObj = obj[firstPath]
    if (typeof firstObj !== 'object' || firstObj === null) return
    return _lodashSet(firstObj, path.slice(1), value)
  } else {
    obj[firstPath] = value
  }
}
export const lodashSet = (obj: Record<string | number, any>, path: string, value: any): void => {
  return _lodashSet(obj, path.split('.'), value)
}