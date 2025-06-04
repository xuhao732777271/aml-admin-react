import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Form, Input, Table, Button, message, Select, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import ImportWorkAPI from '@/api/work-center';
import PageResultAPI from '@/api/result';
import type { PageState } from '@/types';
import { convertDataJsonForTable } from '@/utils/index';
import './index.less';

interface DataType {
  id: number;
  name: string;
  role: string;
  sex: string;
  batchId: number;
  instCode: string;
}
interface QueryParams {
  instCode: string;
  batchId: string;
}
interface TypeOpts {
  label: string;
  value: string;
}
const defaultParams = {
  currentPage: 1,
  totalCount: 1,
  totalPage: 1,
  isNext: true,
  isLast: true,
  indexCount: 0,
  everyCount: 10,
  serviceName: 'modelResultSumarryServiceImpl',
  conditionList: [],
  paramJson: '{}'
};
const defaultTableQuery = { current: 1, pageSize: 10 };
const OrgClassifyStatistics: React.FC = () => {
  const [form] = Form.useForm();
  const [Height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableTotal, setTableTotal] = useState<number>(0);
  const [queryParams, setQueryParams] = useState(defaultParams);
  const [tableQuery, setTableQuery] = useState<PageState>(defaultTableQuery);
  const [whereStr, setWhereStr] = useState<QueryParams>();
  const [tableData, setTableData] = useState([]);
  const [allBatchNoList, setAllBatchNoList] = useState<TypeOpts[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const columns: ColumnsType<DataType> = [
    {
      title: '批次号',
      dataIndex: 'batchId',
      ellipsis: true,
      minWidth: 80,
      align: 'center',
      fixed: 'left' as const
    },
    {
      title: '模型名称',
      dataIndex: 'ruleName',
      minWidth: 200,
      align: 'center',
      ellipsis: true
    },
    {
      title: '机构编号',
      dataIndex: 'instCode',
      minWidth: 120,
      align: 'center',
      ellipsis: true
    },
    {
      title: '机构名称',
      dataIndex: 'instName',
      minWidth: 200,
      align: 'center',
      ellipsis: true
    },
    {
      title: '预警记录数',
      dataIndex: 'allCount',
      minWidth: 120,
      align: 'center',
      ellipsis: true
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right' as const,
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Button type='link' onClick={() => openModal(record)}>
            详细
          </Button>
        </Space>
      )
    }
  ];
  const setTableHeight = () => {
    if (containerRef.current && searchBarRef.current) {
      const searchBarHeight = searchBarRef.current.clientHeight;
      const parentHeight = containerRef.current.clientHeight;
      setHeight(parentHeight - searchBarHeight - 160);
    }
  };
  useEffect(() => {
    setTableHeight();
    window.addEventListener('resize', setTableHeight);
    return () => {
      window.removeEventListener('resize', setTableHeight);
    };
  }, []);

  const getAllBatchNoOpts = useCallback(async () => {
    try {
      const res: any = await PageResultAPI.getBatchIds();
      if (res && res?.data) {
        setAllBatchNoList(
          res.data.map((batch: any) => ({
            value: batch,
            label: batch
          })) || []
        );
      } else {
        setAllBatchNoList([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllBatchNoOpts();
  }, []);

  // 监听whereStr、tableQuery
  useEffect(() => {
    console.log('【 useEffect 】', whereStr, tableQuery);
    fetchData();
  }, [whereStr, tableQuery]);

  const handlePageChange = (page: number, pageSize: number) => {
    setTableQuery({ ...tableQuery, current: page, pageSize });
  };
  // 开始查询
  const handleQuery = async () => {
    const formValues = await form.validateFields();
    console.log(formValues, '【 handleQuery 】');
    setWhereStr(() => formValues);
  };

  // 获取数据列表
  const fetchData = async () => {
    setLoading(true);
    const param = {
      ...queryParams,
      currentPage: tableQuery.current,
      everyCount: tableQuery.pageSize,
      indexCount: tableQuery.pageSize * (tableQuery.current - 1),
      whereStr: whereStr?.batchId || whereStr?.instCode ? JSON.stringify(whereStr) : '{}'
    };
    console.log('【 fetchData 】', param);

    ImportWorkAPI.getPage(param)
      .then((res: any) => {
        if (res && res.state && res?.resObj) {
          const { totalCount, totalPage, everyCount, dataJson } = res.resObj;
          setTableData(convertDataJsonForTable(dataJson));
          setTableTotal(totalCount);
          setQueryParams(prev => ({
            ...prev,
            totalCount: totalCount,
            totalPage: totalPage,
            everyCount: everyCount
          }));
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
    setTableQuery(cloneDeep(defaultTableQuery));
    setWhereStr(undefined);
  };
  const openModal = (record: any) => {
    console.log(record);
  };

  return (
    <div className='app-container' ref={containerRef}>
      <div ref={searchBarRef} className='search-bar'>
        <Form form={form} layout='inline'>
          <Form.Item name='batchId' label='批次号'>
            <Select options={allBatchNoList} placeholder='请选择批次号' allowClear style={{ width: 250 }} />
          </Form.Item>
          <Form.Item name='instCode' label='机构编号'>
            <Input placeholder='请输入机构编号' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' icon={<SearchOutlined />} onClick={handleQuery}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='content-body'>
        <Table<DataType>
          rowKey={(row, idx) => `${idx}${row.batchId}_${row.instCode}`}
          columns={columns}
          dataSource={tableData}
          scroll={{ y: Height }}
          loading={loading}
          pagination={{
            current: tableQuery.current,
            pageSize: tableQuery.pageSize,
            total: tableTotal,
            showTotal: () => `共 ${tableTotal} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handlePageChange
          }}
        />
      </div>
    </div>
  );
};

export default OrgClassifyStatistics;
