import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import ImportWorkAPI from '@/api/work-center';
import './index.less';

const defaultParams = {
  currentPage: 1,
  totalCount: 0,
  totalPage: 0,
  isNext: false,
  isLast: false,
  indexCount: 0,
  everyCount: 10,
  whereStr: '{}',
  indexList: [],
  serviceName: 'importFileServiceTwoImpl',
  conditionList: [],
  paramJson: '{}'
};
const DataImport: React.FC = () => {
  const [form] = Form.useForm();
  const [Height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState(defaultParams);
  const [tableData, setTableData] = useState([]);
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
  }, [queryParams]);

  const fetchData = async () => {
    setLoading(true);
    const formValues = await form.validateFields();
    console.log('【 formValues 】', formValues.tableName);
    setQueryParams(prev => ({
      ...prev,
      whereStr: formValues?.tableName ? JSON.stringify(formValues) : '{}'
    }));
    console.log('【 fetchData 】', queryParams);

    ImportWorkAPI.getPage(queryParams)
      .then((res: any) => {
        if (res && res.state) {
          // const { list, totalCount, totalPage, indexCount, everyCount } = res.resMap;
          console.log(res, '【 获取数据列表 】');
        }
      })
      .catch((err: any) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    form.resetFields();
    setQueryParams(cloneDeep(defaultParams));
    fetchData();
  };

  return (
    <div className='app-container' ref={containerRef}>
      <div ref={searchBarRef} className='search-bar'>
        <Form form={form} layout='inline'>
          <Form.Item name='tableName' label='目标表名'>
            <Input placeholder='请输入目标表名' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' icon={<SearchOutlined />} onClick={fetchData}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='content-body' style={{ height: `${Height}px` }}>
        <div className='charts-container'></div>
      </div>
    </div>
  );
};

export default DataImport;
