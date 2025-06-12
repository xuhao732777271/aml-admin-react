import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import { message } from 'antd';
import qs from 'qs';
import { ConfigEnum, ResultEnum } from '@/enums/ResultEnum';
import { joinTimestamp } from '@/utils';
import { isString } from './is';
import { getToken, clearAuthCache } from '@/utils/auth';

// Create axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  paramsSerializer: params => qs.stringify(params)
});

// Handle Error
const handleError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401 || error.response?.status === 504) {
    clearAuthCache();
    location.href = '/login';
  }
  message.error(error.message || 'error');
  return Promise.reject(error);
};

// 请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  // 如果 Authorization 设置为 no-auth，则不携带 Token，用于登录、刷新 Token 等接口
  if (config.headers.Authorization !== 'no-auth' && token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers[ConfigEnum.VERSION] = 'v3';
    config.headers[ConfigEnum.TOKEN] = token;
  } else {
    delete config.headers.Authorization;
  }

  if (config.method?.toUpperCase() === 'GET') {
    const params = config.params || {};
    const joinTime = true;
    if (!isString(params)) {
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
      config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
    } else {
      // 兼容restful风格
      config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
      config.params = undefined;
    }
  }

  return config;
}, handleError);

// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
  if (response.config.responseType === 'blob') {
    return response;
  }

  if (!response.data) return;

  // if (Reflect.has(response.data, 'code')) {
  //   // 配套 Java 后端aml-boot
  //   const { code, result, msg } = response.data
  //   if ([ResultEnum.SUCCESS, ResultEnum.SUCCESS_CODE].includes(code)) {
  //     return response.data
  //   } else {
  //     if (!response.config.showErrorMsg) return response.data
  //     return message.error(msg || '系统出错')
  //   }
  // } else if (Reflect.has(response.data, 'state')) {
  //   // 这里逻辑可以根据项目进行修改
  //   const { state, resMsg } = response.data
  //   const hasResObjSuccess = response.data && Reflect.has(response.data, 'state') && state
  //   if (hasResObjSuccess) {
  //     console.log(`post合规接口调用成功：${response.config.url}`)
  //     return response.data
  //   } else {
  //     console.log(`post合规接口报错：${response.config.url}`)
  //     if (!response.config?.showErrorMsg) return response.data
  //     return message.error(resMsg || '系统出错')
  //   }
  // }
  return response.data;
}, handleError);

export { service };
