import { isObject } from './is';
import { message } from 'antd';

export function openWindow(
  url: string,
  opt?: {
    target?: TargetContext | string;
    noopener?: boolean;
    noreferrer?: boolean;
  }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

export function promiseTimeout(ms: number, throwOnTimeout = false, reason = 'Timeout'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout) setTimeout(() => reject(reason), ms);
    else setTimeout(resolve, ms);
  });
}

export const searchRoute: any = (path: string, routes: any = []) => {
  for (const item of routes) {
    if (item.path === path || item.fullPath === path) return item;
    if (item.children) {
      const result = searchRoute(path, item.children);
      if (result) return result;
    }
  }
  return null;
};

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

export const convertDataJsonForTable = (dataJson: string) => {
  try {
    return JSON.parse(dataJson);
  } catch (error) {
    console.error('Error parsing data JSON:', error);
    return [];
  }
};

export const downloadFileByFileId = async (record: any) => {
  try {
    const response = await fetch(`/api/work/file/${record.fileId}/download`);
    if (!response.ok) {
      throw new Error('Download failed');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.fileName || 'error-file.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    message.success('文件下载成功');
  } catch (error) {
    console.error('Error downloading file:', error);
    message.error('文件下载失败');
  }
};

/**
 * 从树中找出匹配节点
 *
 * @param {array} data 树
 * @param {string} key 键值
 * @param {string} value 值
 * @returns {array} 匹配结果
 */
export function findNodesByType<T extends Record<string, any>>(data: T[], key: keyof T, value: string) {
  const result: T[] = [];
  function traverse(node: T) {
    if (node[key] === value) {
      result.push(node);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: T) => traverse(child));
    }
  }
  data.forEach(node => traverse(node));
  return result;
}

/** 浏览器保存文件 */
export function saveFile(fileData: any, fileName: string, fileType: string) {
  const blob = new Blob([fileData], { type: fileType });
  const downloadUrl = window.URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(downloadUrl);
}
