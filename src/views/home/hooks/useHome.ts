import { useState, useCallback } from 'react';
import PageResultAPI from '@/api/result';
import HomeAPI from '@/api/home';
import PageBaseAPI from '@/api/base';

// 通用下拉选项类型
type OptionType = { label: string; value: string };

// 图表数据项类型
export interface BankDataItem {
  RULE_NAME?: string;
  bankName?: string;
  AUTO_CHECK_ID?: string;
  successCount: number;
  errCount: number;
  totalCount: number;
}

/**
 * 获取银行分支下拉选项
 */
export function useBankOptions() {
  const [options, setOptions] = useState<OptionType[]>([]);
  const fetch = useCallback(async () => {
    const res = await HomeAPI.getBankList();
    setOptions(
      (res.resObj || []).map((item: any) => ({
        value: item.BANK_CODE1,
        label: item.BANK_NAME.replace(/^[\d-]+/, '')
      }))
    );
  }, []);
  return { options, fetch };
}

/**
 * 获取批次号下拉选项
 */
export function useBatchNoOptions() {
  const [options, setOptions] = useState<OptionType[]>([]);
  const fetch = useCallback(async () => {
    const res = await PageResultAPI.getAllBatchNo();
    setOptions(
      (res.resObj || []).map((item: any) => ({
        value: item.AUTO_CHECK_ID,
        label: item.AUTO_CHECK_ID
      }))
    );
  }, []);
  return { options, fetch };
}

/**
 * 获取模型下拉选项
 */
export function useModelOptions() {
  const [options, setOptions] = useState<OptionType[]>([]);
  const fetch = useCallback(async () => {
    const res = await PageBaseAPI.getList();
    setOptions(
      (res.resList || []).map((item: any) => ({
        value: item.ruleId,
        label: item.ruleName
      }))
    );
  }, []);
  return { options, fetch };
}

/**
 * 图表数据格式化
 */
export function formatChartData(data: BankDataItem[] = []) {
  const formatBankName = (str: string = '') => str.replace(/^[\d-]+/, '');
  return {
    xAxisDatas: data.map(item => item?.RULE_NAME || item?.AUTO_CHECK_ID || formatBankName(item?.bankName) || ''),
    successDatas: data.map(item => item.successCount),
    errDatas: data.map(item => item.errCount),
    proportionDatas: data.map(item => (item.totalCount ? item.errCount / item.totalCount : 0))
  };
}
