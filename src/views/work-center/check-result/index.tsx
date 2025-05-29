import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Table, Modal, Dropdown, message, Space, Pagination } from 'antd';
import type { MenuProps } from 'antd';
import type { AlignType } from 'rc-table/lib/interface';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import ImportModal from '@/views/work-center/check-result/components/ImportModal';
import ImportWorkAPI from '@/api/work-center';
import { convertDataJsonForTable, downloadFileByFileId } from '@/utils/index';
import styles from './index.module.less';

interface RowVO {
  id: number;
  name: string;
  role: string;
  sex: string;
  age: number;
  address: string;
}

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

const defaultModalParams = {
  currentPage: 1,
  totalCount: 0,
  totalPage: 0,
  isNext: false,
  isLast: false,
  indexCount: 0,
  everyCount: 50,
  whereStr: '{}',
  indexList: [],
  serviceName: 'multipleFileImportService',
  resultTableName: '',
  conditionList: [],
  paramJson: '{}'
};

const defaultErrModalParams = {
  currentPage: 1,
  totalCount: 0,
  totalPage: 0,
  isNext: false,
  isLast: false,
  indexCount: 0,
  everyCount: 10,
  whereStr: '{}',
  indexList: [],
  paramJson: ''
};

const columnsForErr = [
  {
    title: '表名',
    dataIndex: 'TABLE_NAME',
    ellipsis: true,
    align: 'center' as AlignType,
    width: 200
  },
  {
    title: '表描述',
    dataIndex: 'TABLE_DESC',
    align: 'center' as AlignType
  },
  {
    title: '字段名',
    dataIndex: 'COLUMN_NAME',
    align: 'center' as AlignType
  },
  {
    title: '字段描述',
    dataIndex: 'COLUMN_DESC',
    ellipsis: true,
    align: 'center' as AlignType,
    width: 100
  },
  {
    title: '错误数量',
    dataIndex: 'ERR_LINE_TOTAL',
    align: 'center' as AlignType,
    width: 200
  },
  {
    title: '错误原因',
    dataIndex: 'ERR_REASON',
    width: 300,
    ellipsis: true,
    align: 'center' as AlignType
  }
];

const CheckResult: React.FC = () => {
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [tableData, setTableData] = useState<RowVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const [queryParams, setQueryParams] = useState(cloneDeep(defaultParams));
  const [showImportModal, setShowImportModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [tableModalData, setTableModalData] = useState<RowVO[]>([]);
  const [modalColumns, setModalColumns] = useState<any[]>([]);
  const [queryModalParams, setQueryModalParams] = useState(cloneDeep(defaultModalParams));
  const [queryErrModalParams, setQueryErrModalParams] = useState(cloneDeep(defaultErrModalParams));

  const columns = [
    {
      title: '目标表名',
      dataIndex: 'tableName',
      ellipsis: true,
      width: 200,
      align: 'center' as AlignType,
      render: (text: string, record: any) => `${text}@${record.tableDesc}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 150,
      align: 'center' as AlignType,
      ellipsis: true
    },
    {
      title: '成功行数',
      dataIndex: 'lineSucc',
      width: 120,
      align: 'center' as AlignType,
      ellipsis: true
    },
    {
      title: '失败行数',
      dataIndex: 'lineError',
      width: 120,
      align: 'center' as AlignType,
      ellipsis: true
    },
    {
      title: '写入时间',
      dataIndex: 'DInsert',
      width: 180,
      align: 'center' as AlignType,
      ellipsis: true
    },
    {
      title: '原始路径',
      dataIndex: 'oriPath',
      width: 200,
      align: 'center' as AlignType,
      ellipsis: true
    },
    {
      title: '错误信息',
      width: 130,
      align: 'center' as AlignType,
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
      align: 'center' as AlignType,
      render: (_: any, record: any) => (
        <Space>
          <Button type='link' onClick={() => openModal(record)}>
            预览
          </Button>
          <Button type='link' danger onClick={() => openConfirm(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  const openModal = async (row: any) => {
    await initModalData(row);
    setModalTitle(`数据预览（${queryModalParams.resultTableName}）`);
    setShowModal(true);
  };

  const openErrInfo = async (row: any) => {
    await initErrModalData(row);
    setModalTitle('错误信息汇总');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setQueryModalParams(cloneDeep(defaultModalParams));
  };

  const openConfirm = (row: any) => {
    Modal.confirm({
      title: '操作确认',
      content: '确认要删除这个记录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        ImportWorkAPI.delFromDataImportFile(row.fileId).then((res: any) => {
          if (res.state) {
            handleQuery();
            message.success('删除成功');
          }
        });
      }
    });
  };

  const initModalData = async (row: any) => {
    if (row?.tableName) {
      setQueryModalParams(prev => ({ ...prev, resultTableName: row.tableName }));
    }

    setModalLoading(true);
    try {
      const resData = await ImportWorkAPI.getPage(queryModalParams);
      if (resData) {
        const { resObj, resMap } = resData;
        if (resMap?.tableCol) {
          const newColumns = resMap.tableCol.map((col: any) => ({
            title: col.columnDesc,
            dataIndex: col.columnName,
            align: 'center' as AlignType,
            width: 120
          }));
          setModalColumns(newColumns);
          setTableModalData(convertDataJsonForTable(resObj?.dataJson));
          setQueryModalParams(prev => ({
            ...prev,
            totalCount: resObj?.totalCount,
            totalPage: resObj?.totalPage,
            everyCount: resObj?.everyCount
          }));
        }
      }
    } finally {
      setModalLoading(false);
    }
  };

  const initErrModalData = async (row: any) => {
    if (row?.fileId) {
      setQueryErrModalParams(prev => ({
        ...prev,
        paramJson: JSON.stringify({ fileId: row.fileId })
      }));
    }

    setModalLoading(true);
    try {
      const resData = await ImportWorkAPI.getFileErrList(queryErrModalParams);
      if (resData.data) {
        const { dataList, totalCount, totalPage, everyCount } = resData.data;
        setModalColumns(columnsForErr);
        setTableModalData(dataList ?? []);
        setQueryErrModalParams(prev => ({
          ...prev,
          totalCount,
          totalPage,
          everyCount
        }));
      }
    } finally {
      setModalLoading(false);
    }
  };

  const paginationChange = (page: number, pageSize: number) => {
    setQueryModalParams(prev => ({
      ...prev,
      currentPage: page,
      everyCount: pageSize,
      indexCount: pageSize * page - pageSize
    }));
    initModalData({});
  };

  const showImport = () => {
    setShowImportModal(true);
  };

  const handleStepChange = (step: number) => {
    console.log(`当前步骤：${step}`);
  };

  const updateVisible = (value: boolean) => {
    setShowImportModal(value);
    if (!value) {
      handleQuery();
    }
  };

  const handleQuery = async () => {
    setLoading(true);
    const formValues = await form.validateFields();
    setQueryParams(prev => ({
      ...prev,
      whereStr: formValues.tableName ? JSON.stringify(formValues) : '{}'
    }));

    try {
      const resData = await ImportWorkAPI.getPage(queryParams);
      if (resData?.resObj) {
        const { totalCount, totalPage, everyCount, dataJson } = resData.resObj;
        setTableData(convertDataJsonForTable(dataJson));
        setQueryParams(prev => ({
          ...prev,
          totalCount,
          totalPage,
          everyCount
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetQuery = () => {
    form.resetFields();
    setQueryParams(cloneDeep(defaultParams));
    handleQuery();
  };

  const handlePagination = (page: number, pageSize: number) => {
    setQueryParams(prev => ({
      ...prev,
      currentPage: page,
      everyCount: pageSize,
      indexCount: pageSize * page - pageSize
    }));
    handleQuery();
  };

  const calculateTableHeight = () => {
    if (searchBarRef.current && containerRef.current) {
      const searchBarHeight = searchBarRef.current.clientHeight;
      const parentHeight = containerRef.current.clientHeight;
      setTableHeight(parentHeight - searchBarHeight - 168);
    }
  };

  useEffect(() => {
    handleQuery();
    calculateTableHeight();
    window.addEventListener('resize', calculateTableHeight);
    return () => {
      window.removeEventListener('resize', calculateTableHeight);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.appContainer}>
      <div ref={searchBarRef} className={styles.searchBar}>
        <Form form={form} layout='inline'>
          <Form.Item label='目标表名' name='tableName'>
            <Input placeholder='请输入目标表名' style={{ width: 250 }} allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type='primary' icon={<SearchOutlined />} onClick={handleQuery}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleResetQuery}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className={styles.contentBody}>
        <div className={styles.mb10}>
          <Button type='primary' icon={<PlusOutlined />} onClick={showImport}>
            本地导入
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          scroll={{ y: tableHeight }}
          rowKey='id'
          pagination={false}
        />

        {queryParams.totalCount > 0 && (
          <Pagination
            total={queryParams.totalCount}
            current={queryParams.currentPage}
            pageSize={queryParams.everyCount}
            onChange={handlePagination}
            showSizeChanger
            showQuickJumper
          />
        )}
      </div>

      <ImportModal visible={showImportModal} onStepChange={handleStepChange} onVisibleChange={updateVisible} />

      <Modal
        title={modalTitle}
        open={showModal}
        onCancel={handleClose}
        width='80%'
        style={{ top: '10vh' }}
        bodyStyle={{ height: '80vh', padding: '10px' }}
        footer={null}
        className={styles.commonDialog}
      >
        <Table
          columns={modalColumns}
          dataSource={tableModalData}
          loading={modalLoading}
          scroll={{ y: 'calc(80vh - 180px)' }}
          rowKey='columnSeq'
          pagination={false}
        />
        <Pagination
          total={queryModalParams.totalCount}
          current={queryModalParams.currentPage}
          pageSize={queryModalParams.everyCount}
          onChange={paginationChange}
          showSizeChanger
          showQuickJumper
        />
      </Modal>
    </div>
  );
};

export default CheckResult;
