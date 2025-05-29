/**
 * 响应码枚举
 */
export enum ResultEnum {
  /**
   * 成功
   */
  SUCCESS = 0,
  SUCCESS_CODE = 200,
  /**
   * 错误
   */
  ERROR = 'B0001',

  /**
   * 访问令牌无效或过期
   */
  ACCESS_TOKEN_INVALID = 'A0230',

  /**
   * 刷新令牌无效或过期
   */
  REFRESH_TOKEN_INVALID = 'A0231'
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

/**
 * 请求header
 * @description:  contentTyp
 */
export enum ConfigEnum {
  // TOKEN
  TOKEN = 'X-Access-Token',
  // TIMESTAMP
  TIMESTAMP = 'X-TIMESTAMP',
  // Sign
  Sign = 'X-Sign',
  // 租户id
  TENANT_ID = 'X-Tenant-Id',
  // 版本
  VERSION = 'X-Version',
  // 低代码应用ID
  X_LOW_APP_ID = 'X-Low-App-ID'
}
