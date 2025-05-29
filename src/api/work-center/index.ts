import { service as request } from '@/utils/axios';
import type { PageResult } from '@/types';

const ImportWorkAPI = {
  /**
   * 获取分页列表
   *
   * @param data 查询参数
   */
  getPage(data: UserPageQuery) {
    return request<any, PageResult<UserPageVO[]>>({
      url: `/common/findPage`,
      method: 'post',
      data
    });
  },

  /**
   * 错误信息汇总列表
   */
  getFileErrList(data: UserPageQuery) {
    return request<any, PageResult<UserPageVO[]>>({
      url: `/importfile/fileErrInfo`,
      method: 'post',
      data
    });
  },

  /**
   * 下载错误文件
   *
   * @param path 文件路径
   * @param fileId 文件ID
   */
  downloadFile(params: downloadFile) {
    return request<any, UserForm>({
      url: `/file/download`,
      method: 'post',
      responseType: 'blob',
      params
    });
  },

  /**
   * 删除导入文件
   */
  delFromDataImportFile(id: any) {
    return request<any, PageResult<UserPageVO[]>>({
      url: `/importfile/delete?id=${id}`,
      method: 'get'
    });
  },

  /**
   * 本地导入上传文件
   *
   * @param formData
   */
  upload(formData: FormData) {
    return request<any, FileInfo>({
      url: '/mult_importfile/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * 删除上传文件
   */
  removeImportFile({ filePath }: { filePath: string }) {
    return request<any, FileInfo>({
      url: '/mult_importfile/remove',
      method: 'post',
      data: { filePath }
    });
  },

  /**
   * 保存上传的导入文件
   */
  saveImportFile(data: any[]) {
    return request<any, FileInfo>({
      url: '/mult_importfile/save',
      method: 'post',
      data
    });
  },
  /**
   * 获取目标表名
   */
  getTargetTab() {
    return request({
      url: `/targettab/selectlist`,
      method: 'post'
    });
  },

  /**
   * 根据表名获取列数据
   */
  getTableInfo(params: tableInfo) {
    return request({
      url: `/result/tableInfo`,
      method: 'get',
      params
    });
  },

  /**
   * 获取模型目录
   */
  getRuleTree() {
    return request({
      url: `/rule/tree`,
      method: 'post',
      data: {}
    });
  },

  /**
   * 查询是否在跑检测
   */
  ifRunning() {
    return request({
      url: `/result/ifRunning`,
      method: 'get'
    });
  },

  /**
   *检测执行所选模型
   */
  execRuleRunTree(data: any) {
    return request({
      url: `/ruledef/execrunmodel/tree`,
      method: 'post',
      data
    });
  }
};

export default ImportWorkAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId?: number;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 角色 */
  roles: string[];

  /** 权限 */
  perms: string[];
}

/**
 * 用户分页查询对象
 */
export interface UserPageQuery {
  currentPage: number;
  totalCount: number;
  totalPage: number;
  isNext: boolean;
  isLast: boolean;
  indexCount: number;
  everyCount: number;
  whereStr: string;
  indexList?: any[];
  serviceName: string;
  resultTableName?: string;
  conditionList?: any[];
  paramJson: string;
}

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

/** 用户表单类型 */
export interface UserForm {
  /** 用户头像 */
  avatar?: string;
  /** 部门ID */
  deptId?: number;
  /** 邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 用户ID */
  id?: number;
  /** 手机号 */
  mobile?: string;
  /** 昵称 */
  nickname?: string;
  /** 角色ID集合 */
  roleIds?: number[];
  /** 用户状态(1:正常;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
}

/** 个人中心用户信息 */
export interface UserProfileVO {
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

  /** 部门名称 */
  deptName?: string;

  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;

  /** 创建时间 */
  createTime?: Date;
}

/** 个人中心用户信息表单 */
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

/** 修改密码表单 */
export interface PasswordChangeForm {
  /** 原密码 */
  oldPassword?: string;
  /** 新密码 */
  newPassword?: string;
  /** 确认新密码 */
  confirmPassword?: string;
}

/** 修改手机表单 */
export interface MobileUpdateForm {
  /** 手机号 */
  mobile?: string;
  /** 验证码 */
  code?: string;
}

/** 修改邮箱表单 */
export interface EmailUpdateForm {
  /** 邮箱 */
  email?: string;
  /** 验证码 */
  code?: string;
}

// 以下是留的类型
/**
 * 文件API类型声明
 */
export interface FileInfo {
  /** 文件名 */
  name: string;
  /** 文件路径 */
  url: string;
}
export interface tableInfo {
  tableName?: string;
}
export interface downloadFile {
  path?: string;
  fileId?: string;
}
