export interface FileInfo {
  name: string;
  url: string;
}

import { service as request } from '@/utils/axios';

const FileAPI = {
  /**
   * 上传文件
   *
   * @param formData
   */
  upload(formData: FormData) {
    return request<any, FileInfo>({
      url: '/api/v1/files',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * 上传文件
   */
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return request<any, FileInfo>({
      url: '/api/v1/files',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * 删除文件
   *
   * @param filePath 文件完整路径
   */
  delete(filePath?: string) {
    return request({
      url: '/api/v1/files',
      method: 'delete',
      params: { filePath }
    });
  },

  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  download(url: string, fileName?: string) {
    return request({
      url,
      method: 'get',
      responseType: 'blob'
    }).then((res: any) => {
      const blob = new Blob([res.data]);
      const a = document.createElement('a');
      const downloadUrl = window.URL.createObjectURL(blob);
      a.href = downloadUrl;
      a.download = fileName || '下载文件';
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    });
  }
};

export default FileAPI;
