import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Form, Select, Button } from 'antd';
import StackedBarChart from './components/StackedBarChart';
import LineChart from './components/lineChart';
import HomeAPI from '@/api/home';
import type { BankDataItem } from './hooks/useHome';
import { useBankOptions, useBatchNoOptions, useModelOptions, formatChartData } from './hooks/useHome';
import './index.less';

const HomePage: React.FC = () => {
  const [form] = Form.useForm();
  const [Height, setHeight] = useState(0);
  const [barBankData, setBarBankData] = useState<BankDataItem[]>([]);
  const [barModelData, setBarModelData] = useState<BankDataItem[]>([]);
  const [lineData, setLineData] = useState<BankDataItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | undefined>();

  const { options: bankOptions, fetch: fetchBankOptions } = useBankOptions();
  const { options: batchNoOptions, fetch: fetchBatchNoOptions } = useBatchNoOptions();
  const { options: modelOptions, fetch: fetchModelOptions } = useModelOptions();

  const fetchData = useCallback(async (params: any = {}) => {
    try {
      const res: any = await HomeAPI.getData(params);
      if (res && res.resMap) {
        setBarBankData(res.resMap.bankData || []);
        setBarModelData(res.resMap.modelResultData || []);
      } else {
        setBarBankData([]);
        setBarModelData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchLineData = useCallback(async (ruleId?: string) => {
    try {
      const res: any = await HomeAPI.getLineData({ ruleId });
      if (res && res.resMap) {
        setLineData(res.resMap.lineData || []);
      } else {
        setLineData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchBankOptions();
    fetchBatchNoOptions();
    fetchModelOptions();
    fetchData({});
    fetchLineData();
  }, [fetchBankOptions, fetchBatchNoOptions, fetchModelOptions, fetchData, fetchLineData]);

  const onFinish = (values: any) => {
    fetchData(values);
  };

  const onReset = () => {
    form.resetFields();
    fetchData({});
  };

  const onModelChange = (value: string) => {
    setSelectedModel(value);
    fetchLineData(value);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const setTableHeight = () => {
    if (containerRef.current && searchBarRef.current) {
      const searchBarHeight = searchBarRef.current.clientHeight;
      const parentHeight = containerRef.current.clientHeight;
      setHeight(parentHeight - searchBarHeight - 18);
    }
  };

  useEffect(() => {
    setTableHeight();
    window.addEventListener('resize', setTableHeight);
    return () => {
      window.removeEventListener('resize', setTableHeight);
    };
  }, []);

  return (
    <div className='app-container' ref={containerRef}>
      <div ref={searchBarRef} className='search-bar'>
        <Form form={form} layout='inline' onFinish={onFinish} style={{ marginBottom: 16 }}>
          <Form.Item name='bankCode' label='机构'>
            <Select options={bankOptions} placeholder='请选择机构' allowClear style={{ width: 250 }} />
          </Form.Item>
          <Form.Item name='batchId' label='批次号'>
            <Select options={batchNoOptions} placeholder='请选择批次号' allowClear style={{ width: 250 }} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='content-body' style={{ height: `${Height}px` }}>
        <div className='charts-container'>
          <div className='chart-item'>
            <StackedBarChart
              options={{
                title: '检测结果分析（按机构维度）',
                ...formatChartData(barBankData),
                xRotate: 45
              }}
            />
          </div>
          <div className='chart-item'>
            <StackedBarChart
              options={{
                title: '检测结果分析（按模型维度）',
                ...formatChartData(barModelData),
                xRotate: 45
              }}
            />
          </div>
        </div>
        <div className='trend-container'>
          <Select
            className='line-select'
            style={{ width: 250, marginBottom: 16 }}
            placeholder='请选择模型'
            allowClear
            options={modelOptions}
            value={selectedModel}
            onChange={onModelChange}
          />
          <LineChart
            options={{
              title: '检测结果趋势（不合规数据占比）',
              ...formatChartData(lineData),
              xRotate: 0
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
