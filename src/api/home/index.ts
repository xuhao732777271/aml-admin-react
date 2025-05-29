import { service as request } from '@/utils/axios';
import type { PageResult } from '@/types';

export interface HomeForm {
  /** 批次号 */
  batchId?: string;
  /** 银行 */
  bankCode?: string;
  /** 规则ID */
  ruleId?: string;
}

const HomeAPI = {
  /**
   * 首页数据查询
   */
  getData(params: HomeForm) {
    return request<any, PageResult<any>>({
      url: '/index/getData',
      method: 'get',
      params
    });
  },
  /**
   * 首页折线图数据查询
   */
  getLineData(params: HomeForm) {
    return request<any, PageResult<any>>({
      url: '/index/getLineData',
      method: 'get',
      params
    });
  },
  /**
   * 获取银行分支下拉数据
   */
  getBankList() {
    return request<any, PageResult<any>>({
      url: '/index/getBankList',
      method: 'get'
    });
  }
};

export default HomeAPI;
