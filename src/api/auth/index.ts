import { service as request } from '@/utils/axios';

const AUTH_BASE_URL = '';

const AuthAPI = {
  /** 登录接口*/
  login(data: LoginFormData) {
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/sys/login`,
      method: 'post',
      data
    });
  },

  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: 'post',
      params: { refreshToken },
      headers: {
        Authorization: 'no-auth'
      }
    });
  },

  /** 注销登录接口 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/sys/logout`,
      method: 'get'
    });
  },

  /** 获取验证码接口*/
  getCaptcha(current: string | number) {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/sys/randomImage/${current}`,
      method: 'get'
    });
  }
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  username: string;
  password: string;
  checkKey?: number;
  captcha: string;
}

/** 登录响应 */
export interface LoginResult {
  token: string;
  tenantList: Tenant[];
  userInfo: UserInfo;
  departs: any[];
  multi_depart: number;
  sysAllDictItems: object;
}

/** 验证码信息 */
export interface CaptchaInfo {
  captchaKey: string;
  captchaBase64: string;
}

/** 租户信息 */
export interface Tenant {
  id: number;
  name: string;
  createBy: string | null;
  createTime: string | null;
  beginDate: string | null;
  endDate: string | null;
  status: number | null;
  trade: string | null;
  companySize: string | null;
  companyAddress: string | null;
  companyLogo: string | null;
  houseNumber: string | null;
  workPlace: string | null;
  secondaryDomain: string | null;
  loginBkgdImg: string | null;
  position: string | null;
  department: string | null;
  delFlag: number | null;
  updateBy: string | null;
  updateTime: string | null;
  applyStatus: number | null;
}

/** 用户信息 */
export interface UserInfo {
  id: string;
  username: string;
  realname: string;
  avatar: string;
  birthday: string;
  sex: number;
  email: string;
  phone: string;
  orgCode: string;
  loginTenantId: number;
  orgCodeTxt: string | null;
  status: number;
  delFlag: number;
  workNo: string;
  post: string | null;
  telephone: string | null;
  createBy: string | null;
  createTime: string;
  updateBy: string;
  updateTime: string;
  activitiSync: number;
  userIdentity: number;
  departIds: string;
  relTenantIds: any | null;
  clientId: any | null;
  homePath: string | null;
  postText: string | null;
  bpmStatus: number | null;
  izBindThird: boolean;
}
