import { service as request } from '@/utils/axios';
import type { PageResult } from '@/types';

/**
 * 查询对象参数
 */
export interface GetListParams {
  relation?: string;
  tableName?: string;
  columnList?: any[];
  conditionList?: any[];
}

const PageModuleAPI = {
  /**
   * 添加模型
   *
   * @param data 模型参数
   */
  addModel(data: any) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/addmodel`,
      method: 'post',
      data
    });
  },

  /**
   * 获取模型参数
   */
  getParmlist(params: any) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/ruleparmlist`,
      method: 'post',
      params
    });
  },

  /**
   * 获取模型信息
   */
  getModelInfo(params: any) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/modelinfo`,
      method: 'get',
      params
    });
  },

  /**
   * 更新模型信息参数
   */
  updateParmRow(data: any) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/updateruleparm`,
      method: 'post',
      data
    });
  },

  /**
   * 更新模型信息
   */
  updateRuleDef(data: any) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/updateruledef`,
      method: 'post',
      data
    });
  },

  /**
   * 新增模型
   */
  addNode(data: any) {
    return request<any, PageResult<[]>>({
      url: `/rule/addnode`,
      method: 'post',
      data
    });
  },

  /**
   * 批量删除模型
   */
  delNode(params: any) {
    return request<any, PageResult<[]>>({
      url: `/rule/delnode`,
      method: 'post',
      params
    });
  },

  /**
   * 通过表名获取字段列表
   */
  getTableColList(params: GetListParams) {
    return request<any, PageResult<[]>>({
      url: `/targettab/gettablecollist`,
      method: 'post',
      params
    });
  },

  /**
   * 通过步骤二查询条件获取列表
   */
  getListBySql(data: GetListParams) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/getListBySql`,
      method: 'post',
      data
    });
  },

  /**
   * 步骤三-保存为模型
   */
  saveAsModel(data: any) {
    return request<any, PageResult<[]>>({
      url: `/ruledef/saveAnalysisAsModel`,
      method: 'post',
      data
    });
  }
};

export default PageModuleAPI;
