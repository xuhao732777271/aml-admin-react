import { service as request } from '@/utils/axios';
import type { PageResult } from '@/types';

const PageResultAPI = {
  /**
   * 下载报告
   */
  downloadReport(params: any) {
    return request<any, PageResult<any>>({
      url: '/api/report',
      method: 'get',
      responseType: 'blob',
      params
    });
  },

  /**
   * 获取全部的批次号
   */
  getAllBatchNo() {
    return request<any, PageResult<any>>({
      url: '/api/getAllBatchNo',
      method: 'get'
    });
  },

  /**
   * 获取批次号列表
   */
  getBatchIds() {
    return request<any, PageResult<any>>({
      url: '/modelResult/batchIds',
      method: 'get'
    });
  },

  /**
   * SQL查询分析器
   */
  sqlClientQuery(data: any) {
    return request<any, PageResult<any>>({
      url: '/sqlclient/query',
      method: 'post',
      data
    });
  }
};

export default PageResultAPI;

export interface UserProfileForm {
  /** 用户ID */
  id?: number;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickname?: string;
  /** 头像URL */
  avatar?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 邮箱 */
  email?: string;
}
