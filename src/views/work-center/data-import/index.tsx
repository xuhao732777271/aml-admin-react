import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Table, Button, message, type MenuProps, Dropdown, Space, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import ImportWorkAPI from '@/api/work-center';
import type { PageState } from '@/types';
import { convertDataJsonForTable } from '@/utils/index';
import './index.less';

interface DataType {
  tableName: string;
  status: string;
  lineSucc: string;
  DInsert: string;
  oriPath: string;
}

interface QueryParams {
  tableName: string;
}

const defaultParams = {
  currentPage: 1,
  totalCount: 0,
  totalPage: 0,
  isNext: false,
  isLast: false,
  indexCount: 0,
  everyCount: 10,
  indexList: [],
  serviceName: 'importFileServiceTwoImpl',
  conditionList: [],
  paramJson: '{}'
};
const defaultTableQuery = { current: 1, pageSize: 10 };
const DataImport: React.FC = () => {
  const [form] = Form.useForm();
  const [Height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableTotal, setTableTotal] = useState<number>(0);
  const [queryParams, setQueryParams] = useState(defaultParams);
  const [tableQuery, setTableQuery] = useState<PageState>(defaultTableQuery);
  const [whereStr, setWhereStr] = useState<QueryParams>();
  const [tableData, setTableData] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const columns: ColumnsType<DataType> = [
    {
      title: '目标表名',
      dataIndex: 'tableName',
      ellipsis: true,
      width: 200,
      align: 'center',
      render: (text: string, record: any) => `${text}@${record.tableDesc}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 150,
      align: 'center',
      ellipsis: true
    },
    {
      title: '成功行数',
      dataIndex: 'lineSucc',
      width: 120,
      align: 'center',
      ellipsis: true
    },
    {
      title: '失败行数',
      dataIndex: 'lineError',
      width: 120,
      align: 'center',
      ellipsis: true
    },
    {
      title: '写入时间',
      dataIndex: 'DInsert',
      width: 180,
      align: 'center',
      ellipsis: true
    },
    {
      title: '原始路径',
      dataIndex: 'oriPath',
      width: 200,
      align: 'center',
      ellipsis: true
    },
    {
      title: '错误信息',
      width: 130,
      align: 'center',
      render: (_: any, record: any) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: '错误信息汇总',
            disabled: Number(record.lineError) <= 0,
            onClick: () => openErrInfo(record)
          },
          {
            key: '2',
            label: '下载错误文件',
            disabled: Number(record.lineError) <= 0,
            onClick: () => downloadFileByFileId(record)
          }
        ];

        return (
          <Dropdown menu={{ items }} placement='bottom'>
            <Button type='link'>操作</Button>
          </Dropdown>
        );
      }
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right' as const,
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Button type='link' onClick={() => openModal(record)}>
            预览
          </Button>
          <Button type='link' danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ];
  const setTableHeight = () => {
    if (containerRef.current && searchBarRef.current) {
      const searchBarHeight = searchBarRef.current.clientHeight;
      const parentHeight = containerRef.current.clientHeight;
      setHeight(parentHeight - searchBarHeight - 200);
    }
  };
  useEffect(() => {
    setTableHeight();
    window.addEventListener('resize', setTableHeight);
    return () => {
      window.removeEventListener('resize', setTableHeight);
    };
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
      whereStr: whereStr?.tableName ? JSON.stringify(whereStr) : '{}'
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
  const openErrInfo = (record: any) => {
    console.log(record);
  };
  const downloadFileByFileId = async (record: any) => {
    console.log(record);
  };
  const openModal = (record: any) => {
    console.log(record);
  };
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        console.log('【 handleDelete 】', record);
        message.success('删除成功');
      }
    });
  };
  const showImport = () => {
    console.log('showImport');
    // setShowImportModal(true);
  };

  return (
    <div className='app-container' ref={containerRef}>
      <div ref={searchBarRef} className='search-bar'>
        <Form form={form} layout='inline'>
          <Form.Item name='tableName' label='目标表名'>
            <Input placeholder='请输入目标表名' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' icon={<SearchOutlined />} onClick={handleQuery}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='content-body'>
        <div className='mb10'>
          <Button color='green' variant='solid' icon={<PlusOutlined />} onClick={showImport}>
            本地导入
          </Button>
        </div>
        <Table<DataType>
          rowKey={record => `${record.tableName}_${record.DInsert}`}
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
export default DataImport;
