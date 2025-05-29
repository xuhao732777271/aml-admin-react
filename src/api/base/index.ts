import { service as request } from '@/utils/axios';
import type { FileInfo } from '../file';
import type { PageResult } from '@/types';

const PageBaseAPI = {
  /**
   * 获取模型列表（树形结构）
   *
   * @param data 查询参数
   */
  getList() {
    return request<any, PageResult<any>>({
      url: '/ruledef/modellist',
      method: 'post'
    });
  },

  /**
   * 获取模型列表（树形结构）
   */
  getTableMetadata(params: any) {
    return request<any, PageResult<any>>({
      url: '/tableMetadata/page',
      method: 'get',
      params
    });
  },

  /**
   * 法律法规文件上传列表
   */
  getLegalPageList(params: any) {
    return request<any, PageResult<any>>({
      url: '/legalDocument/page',
      method: 'get',
      params
    });
  },

  /**
   * 上传法律法规文件
   *
   * @param formData
   */
  postLegalDocument(formData: FormData) {
    return request<any, FileInfo>({
      url: '/legalDocument/upload',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * 新增系统参数
   */
  addParams(data: ParamsForm) {
    return request<any, PageResult<any>>({
      url: '/tbsProgPara/add',
      method: 'post',
      data
    });
  },

  /**
   * 修改系统参数
   */
  editParams(data: ParamsForm) {
    return request<any, PageResult<any>>({
      url: '/tbsProgPara/upd',
      method: 'post',
      data
    });
  },

  /**
   * 删除系统参数
   */
  deleteParams(data: any) {
    return request<any, PageResult<any>>({
      url: '/tbsProgPara/delete',
      method: 'post',
      data
    });
  },

  /**
   * 字典ID主键检查
   */
  dictIdCheck(data: DictForm) {
    return request<any, PageResult<any>>({
      url: '/tbsdict/checkdictprimary',
      method: 'post',
      data
    });
  },

  /**
   * 新增字典管理
   */
  addDict(data: DictForm) {
    return request<any, PageResult<any>>({
      url: '/tbsdict/insertdict',
      method: 'post',
      data
    });
  },

  /**
   * 修改字典管理
   */
  editDict(data: DictForm) {
    return request<any, PageResult<any>>({
      url: '/tbsdict/updatedict',
      method: 'post',
      data
    });
  },

  /**
   * 删除字典管理
   */
  deleteDict(params: any) {
    return request<any, PageResult<any>>({
      url: '/tbsdict/deldict',
      method: 'post',
      params
    });
  },

  /**
   * 新增字典项
   */
  addDictItem(data: DictDetailForm) {
    return request<any, PageResult<any>>({
      url: '/tbsdict/insertdictvalue',
      method: 'post',
      data
    });
  },

  /**
   * 删除字典项
   */
  deleteDictItem(data: any) {
    return request<any, PageResult<any>>({
      url: '/tbsdict/deldictvalue',
      method: 'post',
      data
    });
  }
};

export default PageBaseAPI;

export interface ParamsForm {
  vProgId?: number | string;
  vParaId?: number | string;
  vParaValue?: number | string;
  vParaDesc?: string;
}

export interface DictForm {
  vChangeFlag?: number | string;
  vItemId?: number | string;
  vItemName?: string;
  vItemEname?: string;
  vChangeFlagName?: string;
}

export interface DictDetailForm {
  vItemId?: number | string;
  vItemValId?: string;
  vValName?: string;
  cDelFlagName?: string;
}
