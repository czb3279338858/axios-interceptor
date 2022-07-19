/**
 * 响应中 status 字段的值
 */
export enum ResponseStatus {
  success = '100000',
  /** 身份未认证 */
  authenticationTimeout = '110001',
  /** 账号被踢出 */
  accountRemoved = '110013'
}