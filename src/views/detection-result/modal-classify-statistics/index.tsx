import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Progress, Tree, Modal, Select, message } from 'antd';
import {
  FolderOpenOutlined,
  SearchOutlined,
  WarningFilled,
  CheckCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import IMG from '@/assets/images/rock.png';
import ImportModelAPI from '@/api/model';
import { findNodesByType, saveFile } from '@/utils';
import PageResultAPI from '@/api/result';
import './index.less';

const ModalClassifyStatistics: React.FC = () => {
  const [process, setProcess] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [checkInfo, setCheckInfo] = useState<any>({});
  const [batchNo, setBatchNo] = useState('');
  const [batchNoDialogVisible, setBatchNoDialogVisible] = useState(false);
  const [allBatchNoList, setAllBatchNoList] = useState([]);
  // const [modalCheckInfo, setModalCheckInfo] = useState({});
  const [treeData, setTreeData] = useState([]);
  // const [showModal, setShowModal] = useState(false); // 详情弹框
  const procRef = useRef<NodeJS.Timeout>();

  const customColor = '#3b6cde';

  const props = {
    value: 'treeId',
    label: 'ruleName',
    children: 'children'
  };

  useEffect(() => {
    const p = Math.round((checkInfo?.checked / checkInfo?.total) * 100);
    if (p === 100) {
      setDisabled(false);
    }
    setProcess(checkInfo ? p : 0);
  }, [checkInfo]);

  const showDialog = () => {
    PageResultAPI.getAllBatchNo().then((res: any) => {
      setAllBatchNoList(
        (res?.resObj || []).map((batch: any) => ({
          value: batch.AUTO_CHECK_ID,
          label: batch.AUTO_CHECK_ID
        }))
      );
      setBatchNoDialogVisible(true);
    });
  };

  const downloadReport = () => {
    const fileName = `${batchNo}检测报告_${dayjs().format('YYYY-MM-DD')}.pdf`;
    PageResultAPI.downloadReport({ batchNo }).then((response: any) => {
      const fileData = response.data;
      const fileType = 'application/pdf';
      saveFile(fileData, fileName, fileType);
      setBatchNoDialogVisible(false);
      message.success('检测报告下载成功');
    });
  };

  const init = () => {
    ImportModelAPI.getModelTreelist().then((res: any) => {
      if (res.state && res.resMap) {
        setCheckInfo(prev => ({
          ...prev,
          total: Number(res.resMap.total),
          checked: Number(res.resMap.checked)
        }));
      }
      if (res.state && res.resList && res.resList.length) {
        setCheckInfo(prev => ({
          ...prev,
          checkDate: res.resList[0].submitTime
        }));
        setBatchNo(res.resList[0].autoCheckId);
        setTreeData(res.resList);
      }
    });
  };

  const setModalDetail = (row: any) => {
    console.log(row);
    // setModalCheckInfo(row);
    // setShowModal(true);
  };

  const resetCheckPost = () => {
    Modal.confirm({
      title: '提示',
      content: '您确定要重新检测吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const ruleRunIdList = findNodesByType(treeData, 'treeType', '1');
        const modelIds = ruleRunIdList.map((e: any) => e.ruleRunId);
        ImportModelAPI.resetCheck(modelIds).then((res: any) => {
          if (res.state) {
            setCheckInfo(prev => ({
              ...prev,
              checked: 0,
              date: new Date()
            }));
            init();
            getProcState();
          } else {
            message.error(res.resMsg);
          }
        });
      }
    });
  };

  const getProcState = () => {
    procRef.current = setInterval(() => {
      if (checkInfo.checked < checkInfo.total) {
        init();
      } else {
        clearInterval(procRef.current!);
      }
    }, 1000);
  };

  const isLoopStatus = (status: string) => {
    return !['8', '9'].includes(status);
  };

  useEffect(() => {
    if (procRef.current) {
      clearInterval(procRef.current);
    }
    init();
    getProcState();

    return () => {
      if (procRef.current) {
        clearInterval(procRef.current);
      }
    };
  }, []);

  const renderTreeTitle = (node: any, data: any) => {
    if (data.treeType === '1') {
      return (
        <div style={{ width: '100%', paddingRight: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {data.rerultCount > 0 ? (
              <WarningFilled style={{ color: '#ff9900' }} />
            ) : data.status === '8' ? (
              <CheckCircleFilled style={{ color: '#28c18d' }} />
            ) : data.status === '9' ? (
              <CloseCircleFilled style={{ color: '#db2828' }} />
            ) : (
              <img src='../../assets/imgs/ic_reset.png' alt='ic_reset' />
            )}
            <span style={{ marginLeft: 8 }}>{node.title}</span>
          </div>
          {data.status === '8' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <p>
                检查条数：
                <span style={{ marginLeft: 10, marginRight: 15 }}>{data.checkCount > 0 ? data.checkCount : 0}</span>
              </p>
              <p>
                违规条数：
                <span style={{ color: 'red', marginLeft: 10, marginRight: 15 }}>
                  {data.rerultCount > 0 ? data.rerultCount : 0}
                </span>
              </p>
              <p>
                违规比例：
                <span style={{ color: 'red', marginLeft: 10, marginRight: 15 }}>{data.percentString}</span>
              </p>
              <Button size='small' onClick={() => setModalDetail(data)}>
                详情
              </Button>
            </div>
          )}
        </div>
      );
    }
    return <span>{node.title}</span>;
  };

  return (
    <div className='crud-container'>
      <Card
        className='left-card'
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FolderOpenOutlined style={{ fontSize: 16 }} />
            <span style={{ marginLeft: 8 }}>检测进度</span>
          </div>
        }
      >
        <div className='image-container'>
          <img src={IMG} height={200} />
          {process < 100 && <SearchOutlined style={{ fontSize: 60 }} />}
        </div>
        <p>
          扫描进度
          <span style={{ fontSize: 24 }}>{process}%</span>
        </p>
        <Progress
          style={{ width: '60%', margin: '0 auto' }}
          showInfo={false}
          strokeColor={customColor}
          strokeWidth={15}
          percent={process}
        />
        <p>
          共检测
          <span style={{ fontSize: 20 }}>{checkInfo?.total ?? 0}</span>项 , 已检查
          <span style={{ fontSize: 20 }}>{checkInfo?.checked ?? 0}</span>项
        </p>
        <Button
          style={{ width: 130, marginTop: 30 }}
          size='large'
          type={disabled ? 'default' : 'primary'}
          disabled={disabled}
          onClick={resetCheckPost}
        >
          重新检测
        </Button>
        <br />
        <Button
          style={{ width: 130, marginTop: 30 }}
          size='large'
          color={disabled ? 'default' : 'orange'}
          variant='solid'
          disabled={disabled}
          onClick={downloadReport}
        >
          下载报告
        </Button>
        <p>提交检测时间：{checkInfo?.checkDate ?? ''}</p>
        <Button style={{ width: 130, marginTop: 30 }} size='large' type='primary' onClick={showDialog}>
          下载历史报告
        </Button>

        <Modal
          title='选择批次号进行下载'
          open={batchNoDialogVisible}
          onCancel={() => setBatchNoDialogVisible(false)}
          onOk={downloadReport}
          width={300}
        >
          <Select
            style={{ width: '100%' }}
            value={batchNo}
            onChange={setBatchNo}
            placeholder='批次号'
            options={allBatchNoList}
          />
        </Modal>
      </Card>

      <Card className='right-card' title='检测结果'>
        <Tree
          treeData={treeData}
          fieldNames={props}
          defaultExpandAll
          titleRender={node => renderTreeTitle(node, treeData)}
        />
      </Card>
    </div>
  );
};

export default ModalClassifyStatistics;
