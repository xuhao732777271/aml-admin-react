import { service as request } from '@/utils/axios';
import type { PageResult } from '@/types';

const ImportModelAPI = {
  /**
   * 获取检测报告结果
   */
  getModelTreelist() {
    return request<any, PageResult<UserPageVO[]>>({
      url: `/ruledef/modelTreelist`,
      method: 'get'
    });
  },

  /**
   * 重新检测
   */
  resetCheck(data: any) {
    return request({
      url: `/ruledef/resetCheck`,
      method: 'post',
      data
    });
  }
};

/** 用户分页对象 */
export interface UserPageVO {
  /** 用户ID */
  id: number;
  /** 用户头像URL */
  avatar?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 部门名称 */
  deptName?: string;
  /** 用户邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 用户昵称 */
  nickname?: string;
  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;
  /** 用户状态(1:启用;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
}

export default ImportModelAPI;
